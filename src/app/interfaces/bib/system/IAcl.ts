export interface IAcl {
    ID: number;
    CanAddMedia: boolean;
    CanAddReaders: boolean;
    CanAddUsers: boolean;
    CanAddUserGroups: boolean;
    CanRemoveMedia: boolean;
    CanRemoveReaders: boolean;
    CanRemoveUsers: boolean;
    CanRemoveUserGroups: boolean;
    CanModifyMedia: boolean;
    CanModifyReaders: boolean;
    CanModifyUsers: boolean;
    CanModifyUserGroups: boolean;
}
