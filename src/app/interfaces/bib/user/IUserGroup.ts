import { IAcl } from '../system/IAcl';

export interface IUserGroup {
    ID: number;
    Acl: IAcl;
    Name: string;
}
