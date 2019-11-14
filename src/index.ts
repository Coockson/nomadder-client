//Imports
import { INomadderEvent, EventTypes, NOMADDER_PROTOCOL } from "./models/nomadder-event.model";
import { IServerData } from "./models/server-data.model";
import { IProtocolPayload } from './models/protocol-information.model';
import { ISyncEventPayload } from './models/sync-event-payload.model';

//Global vars
let wsc: WebSocket;
const nomadder_key: string = "NOMADDER-DATA";

export function initializeSocket(serverURL?: string) {
    if (serverURL) {
        //Setup connection with the server
        var ws = new WebSocket(serverURL);
        return ws
    }
    else {
        var ws = new WebSocket("ws://localhost:8080");
        return ws
    }
}

export function getLocalData() {
    var data = localStorage.getItem(nomadder_key);
    return data
}

export function connectToServer(serverURL?: string) {

    wsc = initializeSocket(serverURL);

    const data = getLocalData();
    let save_data :IServerData
    let payload :ISyncEventPayload

    if (data === null) {
        console.log("No data initiated on client");
        payload = {}
    } else {
        save_data = JSON.parse(data) as IServerData
        payload = {data: save_data}
    }
    
    const nommadder_sync: INomadderEvent = {
        protocol: NOMADDER_PROTOCOL,
        protocolInformation:
        {
            event: EventTypes.SYNC,
            payload
        },
        hash: "this is a hash"
    }

    wsc.onopen = () => wsc.send(JSON.stringify(nommadder_sync));
}

export function listenBatch() {
    // Wait for batch protocol
    wsc.addEventListener("message", (message) => {
        console.log("hello")
        console.log(message)
        // var msg: INomadderEvent = JSON.parse(message.data as unknown as string);
        // // Ensure right protocol
        // if (msg.protocol !== "NOMADDER") {
        //     return;
        // }
        // // Verify correct event format
        // if (!msg.protocolInformation.event) {
        //     return;
        // }
        // if (msg.protocolInformation.event == EventTypes.BATCH) {
            
        //     saveBatchData(msg.protocolInformation.payload.data)
        // }
    });
}

export function saveBatchData(data: IServerData) {
    var local_storage = getLocalData();
    var local_json = JSON.parse(<string>local_storage); //for now assuming there is data
    //var serverID = data.serverId; required when multi server is added
    var local_data = local_json.protocolInformation.payload.data;
    //console.log(local_data);
    local_data.data.push(data.data);
    data.schemaDefinition.forEach((schema) => { //add unique schema values
        console.log(schema.name);
        //@ts-ignore
        if (local_data.schemaDefinition.findIndex(x => x.name == schema.name) === -1) {
            local_data.schemaDefinition.push(schema);
        }
    });
    localStorage.removeItem(nomadder_key);                          // delete old data  
    localStorage.setItem(nomadder_key, JSON.stringify(local_data)); // add updated data
}

export function JSONToSYNCPackage(data: JSON) {

    // const payload = {
    //     event: EventTypes.SYNC
    //     payload: {  } as ISyncEventPayload

    // } as IProtocolPayload

    // // let sync_package = {
    // //     protocol: NOMADDER_PROTOCOL,
    // //     protocolInformation: ,
    // //     hash: "",
    // // } as INomadderEvent


    // sync_package.protocol = NOMADDER_PROTOCOL


}

export function JSONStringToSYNCPackage(data: string) {

}
