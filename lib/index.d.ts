import { IServerData } from "./models/server-data.model";
export declare function initializeSocket(serverURL?: string): WebSocket;
export declare function getLocalData(): string | null;
export declare function connectToServer(serverURL?: string): void;
export declare function listenBatch(): void;
export declare function saveBatchData(data: IServerData): void;
export declare function JSONToSYNCPackage(data: JSON): void;
export declare function JSONStringToSYNCPackage(data: string): void;
