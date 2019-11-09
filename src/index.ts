//Imports
import { INomadderEvent, EventTypes } from "./models/nomadder-event.model";
import { IServerData } from "./models/server-data.model";


//Global vars
let wsc: WebSocket;
const nomadder_key: string= "NOMADDER-DATA";

export function initializeSocket(serverURL?: string){
    if (serverURL){
        //Setup connection with the server
        var ws = new WebSocket( serverURL );
        return ws
    }
    else{
        var ws = new WebSocket("ws://localhost:8080");
        return ws
    }    
}

export function getLocalData(){ 
    var data= localStorage.getItem(nomadder_key);
    return data
}

export function connectToServer(serverURL?: string){

    wsc = initializeSocket(serverURL); 
  
    var data = getLocalData();
    if (data === null){
        console.log("No data initiated on client");
    } else{
        wsc.onopen = () => wsc.send(<string>data);
    }  
}  

export function listenBatch(){
    // Wait for batch protocol
    wsc.addEventListener("message", ( message) => {
        var msg: INomadderEvent = JSON.parse(message as unknown as string) ; 
        // Ensure right protocol
        if (msg.protocol !== "NOMADDER") {
            return;
        }
        // Verify correct event format
        if (!msg.protocolInformation.event) {
            return;
        }
        if (msg.protocolInformation.event == EventTypes.BATCH) {
            saveBatchData(msg.protocolInformation.payload.data)
        }
    }); 
}

export function saveBatchData(data: IServerData){
    var local_storage = getLocalData();
    var local_json = JSON.parse(<string>local_storage); //for now assuming there is data
    //var serverID = data.serverId; required when multi server is added
    var local_data = local_json.protocolInformation.payload.data;
    //console.log(local_data);
    local_data.data.push(data.data);
    data.schemaDefinition.forEach( (schema) =>{ //add unique schema values
        console.log(schema.name);
        if (local_data.schemaDefinition.findIndex(x => x.name==schema.name) === -1 ){
            local_data.schemaDefinition.push(schema);
        }
    });
    localStorage.removeItem(nomadder_key);                          // delete old data  
    localStorage.setItem(nomadder_key, JSON.stringify(local_data)); // add updated data


}

export function JSONToSYNCPackage(data: JSON){
    
}

export function JSONStringToSYNCPackage(data: string){
    
}
