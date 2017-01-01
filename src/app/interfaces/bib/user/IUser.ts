import { IAcl } from '../system/IAcl';
import { IUserGroup } from './IUserGroup';

export interface IUser {
  ID: number;
  Group: IUserGroup;
  Acl: IAcl;
  AccountName: string;
  FirstName: string;
  LastName: string;
  Password: string;
  IsActive: boolean;
}
