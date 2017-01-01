import { IUserGroup } from './IUserGroup';
export interface ILocalData {
    user: string;
    hash: string;
    group: IUserGroup;
    created: string;
    language: string;
}
