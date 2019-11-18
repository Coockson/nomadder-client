import { INomadderEvent, EventTypes, NOMADDER_PROTOCOL } from "./models/nomadder-event.model";

let ws: WebSocket;
const NOMADDER_DATA: string= "NOMADDER-DATA";
const IDENTITY_KEY = "NOMADDER-IDENTITY";

function initializeSocket(url: string){
    let location = window.location;
    let wsUri = null;
    if (location.protocol === "https:") {
        wsUri = "wss:";
    } else {
        wsUri = "ws:";
    }
    let hostname = url ? url : location.host;
    wsUri += "//" + hostname;
    return new WebSocket(wsUri);
}

function setupEventListener(ws: WebSocket, initialized: () => void){
    ws.addEventListener("message", (message) => {
        console.log("Event", message);
        console.log("Event.data", message.data);
        // Parse message data
        let msg: INomadderEvent;
        try {
          msg = JSON.parse(message.data as string) as INomadderEvent;
        } catch {
          // If it is not JSON it has nothing to do with this protocol
          return;
        }
        // Ensure right protocol
        if (msg.protocol !== NOMADDER_PROTOCOL) {
          return;
        }
        // Verify correct event format
        if (!msg.protocolInformation.event) {
            return;
        }

        switch(msg.protocolInformation.event) {
            case EventTypes.BATCH:
                handleBatchEvent(msg);
            break;
            case EventTypes.IDENTITYSYNC:
                handleIdentitySyncEvent(msg);
            break;
        }
    });

    ws.addEventListener("open", (event) => {
        // Initiate protocol here
        initialized();
    });
}

export function initializeNomadderClient(url: string, initialized: () => void) {
    ws = initializeSocket(url);
    setupEventListener(ws, initialized);
}

function handleBatchEvent(payload: INomadderEvent) {
    localStorage.setItem(NOMADDER_DATA, JSON.stringify(payload));
}

function handleIdentitySyncEvent(payload: INomadderEvent) {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(payload));
}


export function sendSyncEvent() {
    let oldBatchEvent = localStorage.getItem(NOMADDER_DATA);
    if (oldBatchEvent) {
        let syncEvent = JSON.parse(oldBatchEvent) as INomadderEvent;
        syncEvent.protocolInformation.event = EventTypes.SYNC;
        ws.send(JSON.stringify(syncEvent));
    } else {
        let emptySyncEvent = {
            "protocol": NOMADDER_PROTOCOL, //  1
            "hash": "", // 2
            "protocolInformation": {
              "event": EventTypes.SYNC, // 3
              "payload": {
                "data": {
                  "serverId": null, // 4
                  "data": [ // 5
                  ],
                  "schemaDefinition": [ // 10
                  ]
                }
              }
            }
          } as INomadderEvent;

        ws.send(JSON.stringify(emptySyncEvent));
    }
}

export function sendIdentityEvent(id: any, collection: string) {
    let identityEvent = {
        "protocol": NOMADDER_PROTOCOL, //  1
        "hash": "", // 2
        "protocolInformation": {
          "event": EventTypes.IDENTITY, // 3
          "payload": {
            "id": id,
            "collection": collection
          }
        }
      } as INomadderEvent;

    ws.send(JSON.stringify(identityEvent));
}

export function sendIdentitySyncEvent() {
    let oldIdentitySyncEvent = localStorage.getItem(IDENTITY_KEY);
    if (oldIdentitySyncEvent) {
        ws.send(oldIdentitySyncEvent);
    } else {
        console.error("You cannot call sendIdentitySyncEvent if you dont have any identity to sync in localstorage");
    }
}

// export function getLocalData(){ 
//     var data= localStorage.getItem(NOMADDER_DATA);
//     return data
// }

// export function connectToServer(){

//     wsc = initializeSocket(); 
  
//     var data = getLocalData();
//     if (data === null){
//         console.log("No data initiated on client");
//     } else{
//         wsc.onopen = () => wsc.send(<string>data);
//     }  
// }  

// export function listenBatch(){
//     // Wait for batch protocol
//     wsc.addEventListener("message", ( message) => {
//         var msg: INomadderEvent = JSON.parse(message.data as unknown as string) ; 
//         // Ensure right protocol
//         if (msg.protocol !== "NOMADDER") {
//             return;
//         }
//         // Verify correct event format
//         if (!msg.protocolInformation.event) {
//             return;
//         }
//         if (msg.protocolInformation.event == EventTypes.BATCH) {
//             saveBatchData(msg.protocolInformation.payload.data)
//         }
//     }); 
// }

// export function saveBatchData(data: IServerData){
//     var local_storage = getLocalData();
//     var local_json = JSON.parse(<string>local_storage); //for now assuming there is data
//     //var serverID = data.serverId; required when multi server is added
//     var local_data = local_json.protocolInformation.payload.data;
//     //console.log(local_data);
//     local_data.data.push(data.data);
//     data.schemaDefinition.forEach( (schema) =>{ //add unique schema values
//         console.log(schema.name);
//         //@ts-ignore
//         if (local_data.schemaDefinition.findIndex(x => x.name==schema.name) === -1 ){
//             local_data.schemaDefinition.push(schema);
//         }
//     });
//     localStorage.removeItem(NOMADDER_DATA);                          // delete old data  
//     localStorage.setItem(NOMADDER_DATA, JSON.stringify(local_data)); // add updated data


// }

// export function JSONToSYNCPackage(data: JSON){
    
// }

// export function JSONStringToSYNCPackage(data: string){
    
// }
