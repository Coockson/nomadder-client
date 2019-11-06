import { INomadderEvent } from "./models/nomadder-event.model";


//Imports

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


export function startNomadder(){
    var wsc: WebSocket = initializeSocket(); //localhost for now

    //@ts-ignore
    var allData = Object.entries(localStorage);
    var allKeys = Object.keys(localStorage);

    //var data = localStorage.getItem(nomadder_key);
    //var json_data = JSON.stringify(data);

    if(allKeys){
        wsc.onopen = () => {
            for(var i=0; i<allKeys.length ; i++ ){
                wsc.send(allData[i][1]);
            }           
        }
    }

    // Wait for batch protocol
    wsc.addEventListener("message", ( message) => {
        var msg: INomadderEvent = message as unknown as INomadderEvent; 
        // Ensure right protocol
        if (msg.protocol !== "NOMADDER") {
            return;
        }
        // Verify correct event format
        if (!msg.protocolInformation.event) {
            return;
        }
        switch (msg.protocolInformation.event) { //will add models later
            case "BATCH":
                // the data is good to save
                localStorage.setItem(msg.hash, JSON.stringify(msg));
            default:
                /*tslint:disable-next-line:no-console*/
                console.error('[Unknown event type]: ', msg.protocolInformation.event);
                break;
        }
    });

}
