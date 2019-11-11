"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Imports
var nomadder_event_model_1 = require("./models/nomadder-event.model");
//Global vars
var wsc;
var nomadder_key = "NOMADDER-DATA";
function initializeSocket(serverURL) {
    if (serverURL) {
        //Setup connection with the server
        var ws = new WebSocket(serverURL);
        return ws;
    }
    else {
        var ws = new WebSocket("ws://localhost:8080");
        return ws;
    }
}
exports.initializeSocket = initializeSocket;
function getLocalData() {
    var data = localStorage.getItem(nomadder_key);
    return data;
}
exports.getLocalData = getLocalData;
function connectToServer(serverURL) {
    wsc = initializeSocket(serverURL);
    var data = getLocalData();
    if (data === null) {
        console.log("No data initiated on client");
    }
    var nommadder_sync = {
        protocol: nomadder_event_model_1.NOMADDER_PROTOCOL,
        protocolInformation: {
            event: nomadder_event_model_1.EventTypes.SYNC,
            payload: {}
        },
        hash: "this is a hash"
    };
    wsc.onopen = function () { return wsc.send(JSON.stringify(nommadder_sync)); };
}
exports.connectToServer = connectToServer;
function listenBatch() {
    // Wait for batch protocol
    // wsc.addEventListener("message", (message) => {
    //     console.log("hello")
    //     var msg: INomadderEvent = JSON.parse(message.data as unknown as string);
    //     // Ensure right protocol
    //     if (msg.protocol !== "NOMADDER") {
    //         return;
    //     }
    //     // Verify correct event format
    //     if (!msg.protocolInformation.event) {
    //         return;
    //     }
    //     if (msg.protocolInformation.event == EventTypes.BATCH) {
    //         saveBatchData(msg.protocolInformation.payload.data)
    //     }
    // });
}
exports.listenBatch = listenBatch;
function saveBatchData(data) {
    var local_storage = getLocalData();
    var local_json = JSON.parse(local_storage); //for now assuming there is data
    //var serverID = data.serverId; required when multi server is added
    var local_data = local_json.protocolInformation.payload.data;
    //console.log(local_data);
    local_data.data.push(data.data);
    data.schemaDefinition.forEach(function (schema) {
        console.log(schema.name);
        //@ts-ignore
        if (local_data.schemaDefinition.findIndex(function (x) { return x.name == schema.name; }) === -1) {
            local_data.schemaDefinition.push(schema);
        }
    });
    localStorage.removeItem(nomadder_key); // delete old data  
    localStorage.setItem(nomadder_key, JSON.stringify(local_data)); // add updated data
}
exports.saveBatchData = saveBatchData;
function JSONToSYNCPackage(data) {
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
exports.JSONToSYNCPackage = JSONToSYNCPackage;
function JSONStringToSYNCPackage(data) {
}
exports.JSONStringToSYNCPackage = JSONStringToSYNCPackage;
