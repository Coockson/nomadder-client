import { IProtocolPayload } from './protocol-information.model';
export declare enum EventTypes {
    SYNC = "SYNC",
    BATCH = "BATCH"
}
export declare type ProtocolType = 'NOMADDER';
export declare const NOMADDER_PROTOCOL: ProtocolType;
export interface INomadderEvent {
    protocol: ProtocolType;
    protocolInformation: IProtocolPayload;
    hash: string;
}
