import { doFetch, doPost,
         doPut, doDelete } from './fetch';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IMedium, IReader,
         IBorrow, IConfig,
         IBorrowDisplay, IMediumDisplay,
         IUser, IUserGroup,
         IUserSettings, IAcl,
         IWorldCatEntry, IMediaEntry,
         IStats } from 'app/interfaces';
const config: IConfig = require('../../config.json');
const server = `http://${config.bib_server}:${config.bib_server_port}${config.bib_server_baseUrl}`;
const worldcatServer = `http://xisbn.worldcat.org`;
const worldcatIsbnService = `webservices/xid/isbn`;
const worldcatQueryMethod = `?method=getMetadata&format=json&fl=*`;
const mediaUrl = `${server}media`;
const readersUrl = `${server}readers`;
const borrowsUrl = `${server}borrows`;
const usersUrl = `${server}users`;
const aclsUrl = `${server}acls`;
const groupsUrl = `${server}usergroups`;
const worldcatUrl = `${worldcatServer}/${worldcatIsbnService}`;
const isbnUrl = `${server}isbn`;
const translationsUrl = `${server}translations`;
const statsUrl = `${server}stats`;

const getMedium = (id: number): Promise<IMedium> => {
    return doFetch(`${mediaUrl}/${id}`);
};

const getMedia = (): Promise<IMedium[]> => {
    return doFetch(`${mediaUrl}`);
};

const insertMedium = (medium: IMedium): Promise<any> => {
    return doPost(`${mediaUrl}`, medium);
};

const insertMedia = (media: IMedium[], ignoreDuplicates: boolean = true): Promise<any[]> => {
    if (ignoreDuplicates) {
        return getMedia().then(existing => {
            const byISBN = _.differenceBy(media, existing, 'ISBN');
            const newMedia = _.differenceBy(byISBN, existing, 'Title');
            const promises = _.map(newMedia, medium => {
                                return insertMedium(medium);
                            });
            return Promise.all(promises);
        });
    } else {
        const promises = _.map(media, medium => {
            return insertMedium(medium);
        });
        return Promise.all(promises);
    }
};

const removeMedium = (id: number): Promise<any> => {
    return doDelete(`${mediaUrl}/${id}`, id);
};

const updateMedium = (medium: IMedium): Promise<any> => {
    return doPut(`${mediaUrl}/${medium.ID}`, medium);
};

const isBorrowed = (id: number): Promise<boolean> => {
    return doFetch(`${mediaUrl}/${id}/borrowed`).then(result => {
        return result.msg;
    });
};

const borrowMedium = (readerId: number, mediumId: number): Promise<any> => {
    const borrow: IBorrow = {
        ID: -1,
        BorrowDate: moment(Date.now()).format('YYYY-MM-DD'),
        MediumID: mediumId,
        ReaderID: readerId,
        ReturnDate: undefined
    };
    return doPost<IBorrow>(`${borrowsUrl}`, borrow);
};

const unborrow = (id: number): Promise<any> => {
    return doPut(`${borrowsUrl}/${id}`, id);
};

const getBorrowsForUser = (id: number): Promise<any> => {
    return doFetch(`${readersUrl}/${id}/borrows`);
};

const prepareMediumForDisplay = (medium: IMedium): Promise<IMediumDisplay> => {
    return isBorrowed(medium.ID).then(ib => {
        return <IMediumDisplay>{
            Author: medium.Author,
            Description: medium.Description,
            Year: medium.Year,
            ID: medium.ID,
            ISBN: medium.ISBN,
            IsBorrowed: ib,
            Picture: medium.Picture,
            Title: medium.Title
        };
    });
};

const getMediaForDisplay = (): Promise<IMediumDisplay[]> => {
    return getMedia().then(media => {
        const results = _.map(media, m => {
            return prepareMediumForDisplay(m).then(_m => {
                return _m;
            });
        });
        const r = Promise.all(results);
        return r;
    });
};

const getMediaDisplayForDb = (media: IMediumDisplay[]): IMedium[] => {
    return _.map(media, medium => {
            return <IMedium>{
                ID: -1,
                Author: medium.Author,
                Description: medium.Description,
                IsAvailable: true,
                ISBN: medium.ISBN,
                IsDeleted: false,
                Picture: medium.Picture,
                Title: medium.Title,
                Type: Number(medium.Type),
                Year: Number(medium.Year)
            };
        })
};

const createFakeMedium = (id: number): IMedium => {
    return {
        Author: `Dummy ${id}`,
        ID: id,
        ISBN: `12345${id}`,
        Picture: '',
        Title: `Book Nr. ${id}`,
        Type: 1,
        Description: 'info info info',
        Year: 2010,
        IsAvailable: true,
        IsDeleted: false
    };
};

const getFakeMedia = (amount: number): IMedium[] => {
    let media: IMedium[] = [];
    const ids = _.times(amount, _.constant(0));
    _.each(ids, (id, idx, col) => {
        media.push(createFakeMedium(idx));
    });
    return media;
};

const createFakeReader = (id: number): IReader => {
    return {
        FirstName: 'FirstDummy',
        LastName: 'LastDummy',
        ID: id,
        Phone: '022411234567',
        Address: 'Musterstraße',
        CardID: '5000',
        IsActive: true
    };
};

const getFakeReaders = (amount: number): IReader[] => {
    let readers: IReader[] = [];
    const ids = _.times(amount, _.constant(0));
    _.each(ids, (id, idx, col) => {
        readers.push(createFakeReader(idx));
    });
    return readers;
};

const getReaders = (): Promise<IReader[]> => {
    return doFetch(`${readersUrl}`);
};

const getReader = (id: number): Promise<IReader> => {
    return doFetch(`${readersUrl}/${id}`);
};

const insertReader = (reader: IReader): Promise<any> => {
    return doPost(`${readersUrl}`, reader);
};

const removeReader = (id: number): Promise<any> => {
    return doDelete(`${readersUrl}/${id}`, id);
};

const updateReader = (reader: IReader): Promise<any> => {
    return doPut(`${readersUrl}/${reader.ID}`, reader);
};

const convertToDbReader = (reader: IReader): any => {
    console.log(reader);
    return {
        ID: reader.ID,
        Card_ID: reader.CardID,
        FirstName: reader.FirstName,
        LastName: reader.LastName,
        Phone: reader.Phone,
        IsActive: reader.IsActive ? 1 : 0,
        Address: reader.Address
    };
};

const convertToBibReader = (reader: any): IReader => {
    return <IReader>{
        ID: reader.ID,
        CardID: reader.Card_ID,
        FirstName: reader.FirstName,
        LastName: reader.LastName,
        Phone: reader.Phone,
        IsActive: reader.IsActive == 1 ? true : false,
        Address: reader.Address
    };
};

const createFakeBorrow = (id: number): IBorrow => {
    return {
        BorrowDate: new Date().toLocaleString(),
        ReturnDate: undefined,
        MediumID: id,
        ID: id,
        ReaderID: id
    };
};

const getFakeBorrows = (amount: number): IBorrow[] => {
    let borrows: IBorrow[] = [];
    const ids = _.times(amount, _.constant(0));
    _.each(ids, (id, idx, col) => {
        borrows.push(createFakeBorrow(idx));
    });
    return borrows;
};

const getBorrows = (): Promise<IBorrow[]> => {
    return doFetch(`${borrowsUrl}`).then(results => {
        return _.map(results, (r: any) => {
            return {
                ID: r.ID,
                ReaderID: r.Reader_ID,
                MediumID: r.Medium_ID,
                BorrowDate: r.BorrowDate,
                ReturnDate: r.ReturnDate
            };
        });
    });
};

const getBorrow = (id: number): Promise<IBorrow> => {
    return doFetch(`${borrowsUrl}/${id}`);
};

const isOverdue = (borrowDate: any): boolean => {
    const maxDays = config.bib_overdue_days;
    const borrow = moment(borrowDate);
    const now = moment(Date.now());
    return Math.abs(borrow.diff(now, 'days')) > maxDays;
};

const isMediumBorrowed = (id: number): Promise<boolean> => {
   return getActiveBorrows().then(borrows => {
       return _.filter(borrows, borrow => {
           return borrow.ReaderID == id;
       }).length > 0;
   });
};

const getActiveBorrows = (): Promise<IBorrow[]> => {
    return getBorrows().then(borrows => {
        return _.filter(borrows, borrow => {
            return _.isNil(borrow.ReturnDate);
        });
    });
};

const prepareBorrowForDisplay = (borrow: IBorrow): Promise<IBorrowDisplay> => {
    return getMedium(borrow.MediumID).then(medium => {
                return getReader(borrow.ReaderID).then(reader => {
                    return <IBorrowDisplay>{
                        BorrowDate: borrow.BorrowDate,
                        ID: borrow.ID,
                        MediumID: borrow.MediumID,
                        ReaderID: borrow.ReaderID,
                        MediumTitle: medium.Title,
                        ReaderName: `${reader.FirstName} ${reader.LastName}`,
                        IsOverdue: isOverdue(borrow.BorrowDate),
                        ReturnDate: borrow.ReturnDate
                    };
            });
    });
};

const convertToBorrowsDisplay = (borrows: IBorrow[]): Promise<IBorrowDisplay[]> => {
        const results = _.map(borrows, borrow => {
            return prepareBorrowForDisplay(borrow);
        });
        const r = Promise.all(results);
        return r;
};

const getBorrowsForDisplay = (): Promise<IBorrowDisplay[]> => {
    return getBorrows().then(borrows => {
        const results = _.map(borrows, b => {
            return prepareBorrowForDisplay(b).then(_b => {
                return _b;
            });
        });
        const r = Promise.all(results);
        return r;
    });
};

const getUsers = (): Promise<IUser[]> => {
    return doFetch(`${usersUrl}`).then(users => {
        return _.map(users, (user: IUser) => {
            return _mapUser(user);
        });
    });
}

const getUser = (id: number): Promise<IUser> => {
    return doFetch(`${usersUrl}/${id}`).then(user => {
        return _mapUser(user);
    });
};

const _mapUser = (user: IUser): IUser => {
    const _user: IUser = <IUser>_.omit(user, 'Acl');
    _user.Acl = _mapAcl(user.Acl);
    if (_user.Group) {
        _user.Group.Acl = _mapAcl(_user.Group.Acl);
    };
    return _user;
};

const getUserByName = (name: string): Promise<any> => {
    return doFetch(`${usersUrl}`).then(users => {
        return _.find(users, (user: IUser) => {
            return user.AccountName == name;
        });
    });
};

const removeUser = (id: number): Promise<any> => {
    return doDelete(`${usersUrl}/${id}`, id);
};

const updateUser = (user: IUser): Promise<any> => {
    return doPut(`${usersUrl}/${user.ID}`, user);
};

const insertUser = (user: IUser): Promise<any> => {
    return doPost(`${usersUrl}`, user);
};

const getUserGroups = (): Promise<IUserGroup[]> => {
    return doFetch(`${groupsUrl}`).then(groups => {
        return _.map(groups, group => {
            return _mapUserGroup(group);
        });
    });
};

const getUserGroup = (id: number): Promise<IUserGroup> => {
    return doFetch(`${groupsUrl}/${id}`).then(group => {
        return _mapUserGroup(group);
    });
};

const _mapUserGroup = (group: any): IUserGroup => {
    const _group = <IUserGroup>_.omit(group, 'Acl');
    const acl = _mapAcl(group.Acl);
    _group['Acl'] = acl;
    return _group;
};

const getUserGroupByName = (name: string): Promise<IUserGroup> => {
    return doFetch(`${groupsUrl}`).then(groups => {
        const grp = _.find(groups, (group: IUserGroup) => {
            return group.Name == name;
        });
        return _mapUserGroup(grp);
    });
};

const getAcls = (): Promise<IAcl[]> => {
    return doFetch(`${aclsUrl}`).then((acls: any) => {
        return _.map(acls, acl => {
            return _mapAcl(acl);
        });
    })
};

const getAcl = (id: number): Promise<IAcl> => {
    return doFetch(`${aclsUrl}/${id}`).then((acl: any) => {
        return _mapAcl(acl);
    });
};

const _mapAcl = (acl: any): IAcl => {
    if (!acl) return undefined;
    return <IAcl>{
            ID: acl.ID,
            CanAddMedia: acl.CanAddMedia == 1 ? true : false,
            CanAddReaders: acl.CanAddReaders == 1 ? true : false,
            CanAddUsers: acl.CanAddUsers == 1 ? true : false,
            CanAddUserGroups: acl.CanAddUserGroups == 1 ? true : false,
            CanRemoveMedia: acl.CanRemoveMedia == 1 ? true : false,
            CanRemoveReaders: acl.CanRemoveReaders == 1 ? true : false,
            CanRemoveUsers: acl.CanRemoveUsers == 1 ? true : false,
            CanRemoveUserGroups: acl.CanRemoveUserGroups == 1 ? true : false,
            CanModifyMedia: acl.CanModifyMedia == 1 ? true : false,
            CanModifyReaders: acl.CanModifyReaders == 1 ? true : false,
            CanModifyUsers: acl.CanModifyUsers == 1 ? true : false,
            CanModifyUserGroups: acl.CanModifyUserGroups == 1 ? true : false
        };
};

const updateAcl = (acl: IAcl): Promise<any> => {
    return doPut(`${aclsUrl}/${acl.ID}`, acl);
};

const deleteAcl = (id: number): Promise<any> => {
    return doDelete(`${aclsUrl}`,id);
};

const getWorldCatEntry = (isbn: string): Promise<IWorldCatEntry> => {
    return doFetch(`${isbnUrl}/${isbn}`);
};

const getStats = (): Promise<IStats> => {
    return doFetch(`${statsUrl}`);
};

export {
    getMedia,
    getMedium,
    getBorrowsForUser,
    getFakeMedia,
    createFakeMedium,
    createFakeReader,
    getFakeReaders,
    createFakeBorrow,
    getFakeBorrows,
    getReaders,
    getReader,
    updateReader,
    convertToDbReader,
    convertToBibReader,
    getBorrows,
    unborrow,
    convertToBorrowsDisplay,
    isBorrowed,
    isMediumBorrowed,
    getActiveBorrows,
    prepareMediumForDisplay,
    getMediaForDisplay,
    getMediaDisplayForDb,
    getBorrowsForDisplay,
    isOverdue,
    borrowMedium,
    insertMedium,
    insertMedia,
    removeMedium,
    updateMedium,
    insertReader,
    removeReader,
    getUser,
    getUserByName,
    getUsers,
    removeUser,
    updateUser,
    insertUser,
    getAcl,
    getAcls,
    updateAcl,
    deleteAcl,
    getUserGroups,
    getUserGroup,
    getUserGroupByName,
    getWorldCatEntry,
    worldcatUrl,
    worldcatQueryMethod,
    translationsUrl,
    getStats,
    isbnUrl
};

