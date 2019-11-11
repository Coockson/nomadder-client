import { ILocalData } from './local-data.model';
export interface IPersistanceStrategy {
    persistData(db: ILocalData): void;
    retrieveCache(serverId: any): ILocalData;
}
