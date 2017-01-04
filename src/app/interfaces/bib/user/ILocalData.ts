import { IUserGroup } from './IUserGroup';
import { IAcl } from '../system/IAcl';
export interface ILocalData {
    user: string;
    userID: number;
    hash: string;
    userAclID: number;
    groupID: number;
    logonDate: string;
    language: string;
    isActive: boolean;
}
