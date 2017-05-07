import * as _ from 'lodash';
import {
    IMedium, IConfig,
    IBorrow, IReader,
    IMediaType, IUser,
    IUserGroup, IUserSettings,
    IAcl, IWorldCatEntry,
    IMediaEntry, IStats,
    IGoogleBook, ISBNDbBook
} from 'app/interfaces';

import * as fetchApi from '../../../app/apis/fetch';
import * as bibApi from '../../../app/apis/bib.api';
import * as moment from 'moment';

const mariaClient = require('mariasql');
const config: IConfig = require('../../../config.json');

export default class DbClient {
    private client: mariasql.MariaClient;
    constructor() {
        this.init();
    }
    // MEDIA API
    public getAllMediaTypes(): Promise<IMediaType[]> {
        return this.queryAllData<IMediaType[]>(`SELECT * FROM mediatype`);
    }
    public getMediaTypeById(id: number): Promise<IMediaType> {
        return this.querySingleDatum<IMediaType>(`SELECT * FROM media WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]);
    }
    public insertMediaType(mediaType: IMediaType): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`
                                            INSERT INTO mediatype VALUES(
                                                                     :id,
                                                                     :name)`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: mediaType.ID,
                name: mediaType.Name
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: 'Could not insert new media type.',
                            err: err
                        });
                    } else {
                        resolve({
                            msg: 'New media type successfully inserted',
                            code: 200
                        });
                    }
                });
        });
    }
    public deleteMediaType(id: number): Promise<any> {
        return this.deleteSingleDatum(`DELETE FROM mediatype WHERE ID = :id`, [{ 'id': id }]);
    }
    public updateMediaType(id: number, mediaType: IMediaType): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`UPDATE mediatype SET 
                                                                              Name = :name
                                                                              WHERE ID = :id`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: id,
                name: mediaType.Name
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not update media type with id: ${id}, Reason: ${err}`,
                            code: 500
                        });
                    } else if (result.info.affectedRows === '0') {
                        reject({
                            msg: `There weren't any changes for media type with id: ${id}`,
                            code: 404
                        });
                    } else {
                        resolve({
                            msg: `Successfully updated media type with id: ${id}`,
                            code: 200
                        });
                    }
                });
        });
    }
    public getAllMedia(): Promise<IMedium[]> {
        return this.queryAllData<IMedium[]>(`SELECT * FROM medium WHERE IsDeleted = 0
                                                                  AND   IsAvailable = 1`);
    }
    public getMediumById(id: number): Promise<IMedium> {
        return this.querySingleDatum<IMedium>(`SELECT * FROM medium WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]);
    }
    public insertMedium(medium: IMedium): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`
                                            INSERT INTO medium (ID,
                                                                Title,
                                                                Author,
                                                                Description,
                                                                Year,
                                                                ISBN,
                                                                Picture,
                                                                Type,
                                                                IsAvailable,
                                                                DevelopmentPlan) VALUES (
                                                                     :id,
                                                                     :title,
                                                                     :author,
                                                                     :description,
                                                                     :year,
                                                                     :isbn,
                                                                     :picture,
                                                                     :type,
                                                                     :isAvailable,
                                                                     :developmentPlan)`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: null,
                title: medium.Title,
                author: medium.Author,
                description: medium.Description,
                year: medium.Year,
                isbn: medium.ISBN,
                picture: medium.Picture ? medium.Picture : null,
                type: medium.Type ? medium.Type : null,
                isAvailable: medium.IsAvailable ? 1 : 0,
                developmentPlan: medium.DevelopmentPlan
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: 'Could not insert new medium.',
                            err: err
                        });
                    } else {
                        resolve({
                            msg: 'New medium successfully inserted',
                            code: 200
                        });
                    }
                });
        });
    }
    public deleteMedium(id: number): Promise<any> {
        return this.deleteSingleDatum(`DELETE FROM medium WHERE ID = :id`, [
            {
                key: 'id',
                value: id
            }
        ]);
    }
    public updateMedium(id: number, medium: IMedium): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`UPDATE medium SET 
                                                                              Title = :title,
                                                                              Author = :author,
                                                                              Description = :description,
                                                                              ISBN = :isbn,
                                                                              Picture = :picture,
                                                                              IsAvailable = :isAvailable,
                                                                              IsDeleted = :isDeleted,
                                                                              DevelopmentPlan = :developmentPlan
                                                                              WHERE ID = :id`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: id,
                title: medium.Title,
                author: medium.Author,
                description: medium.Description,
                isbn: medium.ISBN,
                picture: medium.Picture,
                isAvailable: medium.IsAvailable ? 1 : 0,
                isDeleted: medium.IsDeleted ? 1 : 0,
                developmentPlan: medium.DevelopmentPlan
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not update medium with id: ${id}, Reason: ${err}`,
                            code: 500
                        });
                    } else if (result.info.affectedRows === '0') {
                        reject({
                            msg: `There weren't any changes for medium with id: ${id}`,
                            code: 404
                        });
                    } else {
                        resolve({
                            msg: `Successfully updated medium with id: ${id}`,
                            code: 200
                        });
                    }
                });
        });
    }
    public isMediumBorrowed(id: number): Promise<boolean> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`SELECT COUNT(*) FROM borrow 
                                                                       WHERE Medium_ID = :mediumid
                                                                       AND ReturnDate is NULL`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                mediumid: id
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not get borrow info on medium with id: ${id}. Reason: ${err}`,
                            code: 500
                        });
                    } else {
                        resolve(result[0]['COUNT(*)'] === '1' ? true : false);
                    }
                });
        });
    }
    // ********************************

    // BORROW API
    public getAllBorrows(): Promise<IBorrow[]> {
        return this.queryAllData<IBorrow[]>(`SELECT * FROM borrow`);
    }
    public getActiveBorrows(): Promise<IBorrow[]> {
        return this.queryAllData<IBorrow[]>(`SELECT * FROM borrow WHERE ReturnDate is NULL`);
    }
    public getOverdueBorrows(): Promise<IBorrow[]> {
        return this.queryAllData<IBorrow[]>(`SELECT * FROM borrow 
                                            WHERE
                                            ReturnDate is NULL AND 
                                            (SELECT DATEDIFF(NOW(), BorrowDate)) > ${config.bib_overdue_days}`);
    }
    public getBorrowById(id: number): Promise<IBorrow> {
        return this.querySingleDatum<IBorrow>(`SELECT * FROM borrow WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]);
    }
    public getBorrowsForUserId(id: number): Promise<IBorrow[]> {
        return this.queryAllData<IBorrow[]>(`SELECT * FROM borrow WHERE Reader_ID = :id`, [
            {
                key: 'id',
                value: id
            }
        ]);
    }
    public insertBorrow(borrow: IBorrow): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`
                                            INSERT INTO borrow VALUES(
                                                                     :id,
                                                                     :readerid,
                                                                     :mediumid,
                                                                     :borrowdate,
                                                                     :returndate)`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: null,
                readerid: borrow.ReaderID,
                mediumid: borrow.MediumID,
                borrowdate: moment(new Date(borrow.BorrowDate).toISOString()).format('YYYY-MM-DD'),
                returndate: null
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: 'Could not insert new borrow.',
                            err: err
                        });
                    } else {
                        resolve({
                            msg: 'New borrow successfully inserted',
                            code: 200
                        });
                    }
                });
        });
    }
    public deleteBorrow(id: number): Promise<any> {
        return this.deleteSingleDatum(`DELETE FROM borrow WHERE ID = :id`, [
            {
                key: 'id',
                value: id
            }
        ]);
    }
    public updateBorrow(id: number): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`UPDATE borrow SET 
                                                                              ReturnDate = :returndate
                                                                              WHERE ID = :id`);
        const date = moment(new Date().toISOString()).format('YYYY-MM-DD');
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: id,
                returndate: date
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not update borrow with id: ${id}, Reason: ${err}`,
                            code: 500
                        });
                    } else if (result.info.affectedRows === '0') {
                        reject({
                            msg: `There weren't any changes for borrow with id: ${id}`,
                            code: 404
                        });
                    } else {
                        resolve({
                            msg: `Successfully updated borrow with id: ${id}`,
                            code: 200
                        });
                    }
                });
        });
    }
    // ****************************

    // READER API
    public getAllReaders(): Promise<IReader[]> {
        return this.queryAllData<IReader[]>(`SELECT * FROM reader`).then(readers => {
            return _.map(readers, (r: any) => {
                return bibApi.convertToBibReader(r);
            });
        });
    }
    public getReaderById(id: number): Promise<IReader> {
        return this.querySingleDatum<IReader>(`SELECT * FROM reader WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]).then(reader => {
                return bibApi.convertToBibReader(reader);
            });
    }
    public insertReader(reader: IReader): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`
                                            INSERT INTO reader VALUES(
                                                                     :id,
                                                                     :card_id,
                                                                     :firstname,
                                                                     :lastname,
                                                                     :phone,
                                                                     :address,
                                                                     :isactive)`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: null,
                card_id: reader.CardID,
                firstname: reader.FirstName,
                lastname: reader.LastName,
                phone: reader.Phone,
                address: reader.Address,
                isactive: reader.IsActive ? 1 : 0
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: 'Could not insert new reader.',
                            err: err
                        });
                    } else {
                        resolve({
                            msg: 'New reader successfully inserted',
                            code: 200
                        });
                    }
                });
        });
    }
    public deleteReader(id: number): Promise<any> {
        return this.deleteSingleDatum(`DELETE FROM reader WHERE ID = :id`, [
            {
                key: 'id',
                value: id
            }
        ]);
    }
    public updateReader(id: number, reader: IReader): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`UPDATE reader SET 
                                                                              Card_ID = :card_id,
                                                                              FirstName = :firstname,
                                                                              LastName = :lastname,
                                                                              Phone = :phone,
                                                                              Address = :address,
                                                                              IsActive = :isactive
                                                                              WHERE ID = :id`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: id,
                card_id: reader.CardID,
                firstname: reader.FirstName,
                lastname: reader.LastName,
                phone: reader.Phone,
                address: reader.Address,
                isactive: reader.IsActive ? 1 : 0
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not update reader with id: ${id}, Reason: ${err}`,
                            code: 500
                        });
                    } else if (result.info.affectedRows === '0') {
                        reject({
                            msg: `There weren't any changes for reader with id: ${id}`,
                            code: 404
                        });
                    } else {
                        resolve({
                            msg: `Successfully updated reader with id: ${id}`,
                            code: 200
                        });
                    }
                });
        });
    }
    // ***********************

    // USER API
    public getAllUsers(): Promise<IUser[]> {
        return this.queryAllData<any[]>(`SELECT ID FROM user`).then(users => {
            const results = _.map(users, user => {
                return this.getUserById(user.ID);
            });
            return Promise.all(results);
        });
    }
    public getUserById(id: number): Promise<IUser> {
        const self = this;
        return this.querySingleDatum<any>(`SELECT * FROM user WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]).then(user => {
                if (user.Group_ID &&
                    user.ACL_ID) {
                    return self.getUserGroupById(user.Group_ID).then(group => {
                        user.Group = group;
                        delete user.Group_ID;
                        return self.getAclById(user.ACL_ID).then(acl => {
                            user.Acl = acl;
                            delete user.ACL_ID;
                            return user;
                        });
                    });
                } else if (user.Group_ID &&
                    !user.ACL_ID) {
                    return self.getUserGroupById(user.Group_ID).then(group => {
                        user.Group = group;
                        delete user.Group_ID;
                        delete user.ACL_ID;
                        return user;
                    });
                } else if (!user.Group_ID &&
                    user.ACL_ID) {
                    return self.getAclById(user.ACL_ID).then(acl => {
                        user.Acl = acl;
                        delete user.ACL_ID;
                        delete user.Group_ID;
                        return user;
                    });
                }
                return user;
            });
    }
    public insertUser(user: IUser): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`
                                            INSERT INTO user VALUES(
                                                                     :id,
                                                                     :group_id,
                                                                     :acl_id,
                                                                     :accountname,
                                                                     :firstname,
                                                                     :lastname,
                                                                     :password,
                                                                     :isactive)`);
        return new Promise((resolve, reject) => {
            const pr = {
                id: 0,
                accountname: user.AccountName,
                firstname: user.FirstName,
                lastname: user.LastName,
                password: user.Password,
                isactive: user.IsActive ? 1 : 0
            };
            if (user.Group) {
                pr['group_id'] = user.Group.ID;
            }
            if (user.Acl) {
                pr['acl_id'] = user.Acl.ID;
            }
            this.client.query(prep(pr),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: 'Could not insert new user.',
                            err: err
                        });
                    } else {
                        resolve({
                            msg: 'New user successfully inserted',
                            code: 200
                        });
                    }
                });
        });
    }
    public deleteUser(id: number): Promise<any> {
        return this.deleteSingleDatum(`DELETE FROM user WHERE ID = :id`, [
            {
                key: 'id',
                value: id
            }
        ]);
    }
    public updateUser(id: number, user: IUser): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`UPDATE user SET 
                                                                              group_id = :group_id,
                                                                              acl_id = :acl_id,
                                                                              accountname = :accountname,
                                                                              firstname = :firstname,
                                                                              lastname = :lastname,
                                                                              password = :password,
                                                                              isactive = :isactive
                                                                              WHERE ID = :id`);
        return new Promise((resolve, reject) => {
            const pr = {
                id: id,
                accountname: user.AccountName,
                firstname: user.FirstName,
                lastname: user.LastName,
                password: user.Password,
                isactive: user.IsActive ? 1 : 0
            };
            if (user.Group) {
                pr['group_id'] = user.Group.ID;
            }
            if (user.Acl) {
                pr['acl_id'] = user.Acl.ID;
            }
            this.client.query(prep(pr),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not update user with id: ${id}, Reason: ${err}`,
                            code: 500
                        });
                    } else if (result.info.affectedRows === '0') {
                        reject({
                            msg: `There weren't any changes for user with id: ${id}`,
                            code: 404
                        });
                    } else {
                        resolve({
                            msg: `Successfully updated user with id: ${id}`,
                            code: 200
                        });
                    }
                });
        });
    }
    // **********************

    // USER GROUP API

    public getAllUserGroups(): Promise<IUserGroup[]> {
        return this.queryAllData<any[]>(`SELECT ID FROM user_group`).then(groups => {
            const results = _.map(groups, group => {
                return this.getUserGroupById(group.ID);
            });
            const r = Promise.all(results);
            return r;
        });
    }
    public getUserGroupById(id: number): Promise<IUserGroup> {
        return this.querySingleDatum<any>(`SELECT * FROM user_group WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]).then(group => {
                return this.getAclById(group.ACL_ID).then(acl => {
                    group.Acl = acl;
                    delete group.ACL_ID;
                    return group;
                });
            });
    }
    public insertUserGroup(userGroup: IUserGroup): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`
                                            INSERT INTO user_group VALUES(
                                                                     :id,
                                                                     :name,
                                                                     :aclid)`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: null,
                name: userGroup.Name,
                aclid: userGroup.Acl.ID
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: 'Could not insert new user group.',
                            err: err
                        });
                    } else {
                        resolve({
                            msg: `New user group ${userGroup.Name} successfully inserted`,
                            code: 200
                        });
                    }
                });
        });
    }
    public deleteUserGroup(id: number): Promise<any> {
        return this.deleteSingleDatum(`DELETE FROM user_group WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]);
    }
    public updateUserGroup(id: number, userGroup: IUserGroup): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`UPDATE user_group SET 
                                                                            name = :name,
                                                                            aclid = :aclid
                                                                            WHERE ID = :id`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: id,
                name: userGroup.Name,
                aclid: userGroup.Acl.ID
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not update user settings with id: ${id}, Reason: ${err}`,
                            code: 500
                        });
                    } else if (result.info.affectedRows === '0') {
                        reject({
                            msg: `There weren't any changes for user settings with id: ${id}`,
                            code: 404
                        });
                    } else {
                        resolve({
                            msg: `Successfully updated user settings with id: ${id}`,
                            code: 200
                        });
                    }
                });
        });
    }
    // *********************

    // USER SETTINGS API 
    public getAllUserSettings(): Promise<IUserSettings[]> {
        return this.queryAllData<IUserSettings[]>(`SELECT * FROM user_settings`);
    }
    public getUserSettingsForUserId(id: number): Promise<IUserSettings> {
        return this.querySingleDatum<IUserSettings>(`SELECT * FROM user_settings WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]);
    }
    public insertUserSettings(userSettings: IUserSettings): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`
                                            INSERT INTO user VALUES(
                                                                     :id,
                                                                     :userid,
                                                                     :language,
                                                                     :datetimeformat,
                                                                     :isactive)`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: null,
                userid: userSettings.UserID,
                language: userSettings.Language,
                datetimeformat: userSettings.DateTimeFormat,
                isactive: userSettings.IsActive
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: 'Could not insert new user settings.',
                            err: err
                        });
                    } else {
                        resolve({
                            msg: 'New user settings successfully inserted',
                            code: 200
                        });
                    }
                });
        });
    }
    public deleteUserSettings(id: number): Promise<any> {
        return this.deleteSingleDatum(`DELETE FROM user_settings WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]);
    }
    public updateUserSettings(id: number, userSettings: IUserSettings): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`UPDATE user SET 
                                                                              language = :language,
                                                                              datetimeformat = :datetimeformat,
                                                                              isactive = :isactive
                                                                              WHERE ID = :id`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: id,
                language: userSettings.Language,
                datetimeformat: userSettings.DateTimeFormat,
                isactive: userSettings.IsActive
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not update user settings with id: ${id}, Reason: ${err}`,
                            code: 500
                        });
                    } else if (result.info.affectedRows === '0') {
                        reject({
                            msg: `There weren't any changes for user settings with id: ${id}`,
                            code: 404
                        });
                    } else {
                        resolve({
                            msg: `Successfully updated user settings with id: ${id}`,
                            code: 200
                        });
                    }
                });
        });
    }
    // ****************************

    // LOGIN API
    public login(user: IUser): Promise<any> {
        return this.querySingleDatum(`SELECT * FROM user WHERE AccountName = :name
                                                            AND Password = :password`,
            [
                {
                    key: 'name',
                    value: user.AccountName
                },
                {
                    key: 'password',
                    value: user.Password
                }
            ]);
    }
    // *********************

    // ACL API 

    public getAcls(): Promise<IAcl[]> {
        return this.queryAllData<IAcl[]>(`SELECT * FROM acl`);
    }
    public getAclById(id: number): Promise<IAcl> {
        return this.querySingleDatum<IAcl>(`SELECT * FROM acl WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]);
    }
    public insertAcl(acl: IAcl): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`
                                            INSERT INTO acl VALUES(
                                                                    :id,
                                                                    :canaddmedia,
                                                                    :canaddreaders,
                                                                    :canaddusers,
                                                                    :canaddusergroups,
                                                                    :canremovemedia,
                                                                    :canremovereaders,
                                                                    :canremoveusers,
                                                                    :canremoveusergroups,
                                                                    :canmodifymedia,
                                                                    :canmodifyreaders,
                                                                    :canmodifyusers,
                                                                    :canmodifyusergroups)`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: null,
                canaddmedia: acl.CanAddMedia ? 1 : 0,
                canaddreaders: acl.CanAddReaders ? 1 : 0,
                canaddusers: acl.CanAddUsers ? 1 : 0,
                canaddusergroups: acl.CanAddUserGroups ? 1 : 0,
                canremovemedia: acl.CanRemoveMedia ? 1 : 0,
                canremovereaders: acl.CanRemoveReaders ? 1 : 0,
                canremoveusers: acl.CanRemoveUsers ? 1 : 0,
                canremoveusergroups: acl.CanRemoveUserGroups ? 1 : 0,
                canmodifymedia: acl.CanModifyMedia ? 1 : 0,
                canmodifyreaders: acl.CanModifyReaders ? 1 : 0,
                canmodifyusers: acl.CanModifyUsers ? 1 : 0,
                canmodifyusergroups: acl.CanModifyUserGroups ? 1 : 0
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: 'Could not insert new ACL.',
                            err: err
                        });
                    } else {
                        resolve({
                            msg: 'New ACL successfully inserted',
                            code: 200
                        });
                    }
                });
        });
    }
    public updateAcl(id: number, acl: IAcl): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(`UPDATE acl SET 
                                                                             canaddmedia = :canaddmedia,
                                                                             canaddreaders = :canaddreaders,
                                                                             canaddusers = :canaddusers,
                                                                             canaddusergroups = :canaddusergroups,
                                                                             canremovemedia = :canremovemedia,
                                                                             canremovereaders = :canremovereaders,
                                                                             canremoveusers = :canremoveusers,
                                                                             canremoveusergroups = :canremoveusergroups,
                                                                             canmodifymedia = :canmodifymedia,
                                                                             canmodifyreaders = :canmodifyreaders,
                                                                             canmodifyusers = :canmodifyusers,
                                                                             canmodifyusergroups = :canmodifyusergroups
                                                                              WHERE ID = :id`);
        return new Promise((resolve, reject) => {
            this.client.query(prep({
                id: id,
                canaddmedia: acl.CanAddMedia ? 1 : 0,
                canaddreaders: acl.CanAddReaders ? 1 : 0,
                canaddusers: acl.CanAddUsers ? 1 : 0,
                canaddusergroups: acl.CanAddUserGroups ? 1 : 0,
                canremovemedia: acl.CanRemoveMedia ? 1 : 0,
                canremovereaders: acl.CanRemoveReaders ? 1 : 0,
                canremoveusers: acl.CanRemoveUsers ? 1 : 0,
                canremoveusergroups: acl.CanRemoveUserGroups ? 1 : 0,
                canmodifymedia: acl.CanModifyMedia ? 1 : 0,
                canmodifyreaders: acl.CanModifyReaders ? 1 : 0,
                canmodifyusers: acl.CanModifyUsers ? 1 : 0,
                canmodifyusergroups: acl.CanModifyUserGroups ? 1 : 0
            }),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not update ACL with id: ${id}, Reason: ${err}`,
                            code: 500
                        });
                    } else if (result.info.affectedRows === '0') {
                        reject({
                            msg: `There weren't any changes for ACL with id: ${id}`,
                            code: 404
                        });
                    } else {
                        resolve({
                            msg: `Successfully updated ACL with id: ${id}`,
                            code: 200
                        });
                    }
                });
        });
    }
    public deleteAcl(id: number): Promise<any> {
        return this.deleteSingleDatum(`DELETE FROM acl WHERE ID = :id`,
            [
                {
                    key: 'id',
                    value: id
                }
            ]);
    }
    // ISBN API 
    public queryIsbn(isbn: string): Promise<IGoogleBook> {
        // return fetchApi.doFetch(`${bibApi.worldcatUrl}/${isbn}/${bibApi.worldcatQueryMethod}`);
        const queryUrl = _.replace(`${bibApi.googleBooksApiUrl}`, '[ISBN_VALUE]', isbn);
        // const queryUrl = _.replace(`${bibApi.isbndbBooksApiUrl}`, '[ISBN_VALUE]', isbn);
        console.log(`querying ${queryUrl}`);
        return fetchApi.doFetch(queryUrl);
    }

    // *********************

    // STATS API 

    public getStats(): Promise<IStats> {
        const media = this.querySingleDatum<any>(`SELECT COUNT(*) AS mediaCount FROM medium`);
        const readers = this.querySingleDatum<any>(`SELECT COUNT(*) AS readersCount FROM reader WHERE IsActive != 0`);
        const users = this.querySingleDatum<any>(`SELECT COUNT(*) AS usersCount FROM user WHERE IsActive != 0`);
        const borrows = this.querySingleDatum<any>(`SELECT COUNT(*) AS borrowsCount FROM borrow WHERE ReturnDate IS NULL`);
        const overdue = this.querySingleDatum<any>(`SELECT SUM((DATEDIFF(CURDATE(),BorrowDate) > ${config.bib_overdue_days})) as overduesCount FROM borrow WHERE ReturnDate IS NULL`);
        return Promise.all([media, readers, users, borrows, overdue]).then(all => {
            return Promise.resolve(<IStats>{
                mediaCount: Number(all[0].mediaCount),
                readersCount: Number(all[1].readersCount),
                borrowsCount: Number(all[3].borrowsCount),
                usersCount: Number(all[2].usersCount),
                overduesCount: all[4].overduesCount != null ? Number(all[4].overduesCount) : 0
            });
        });
    }

    // *********************

    public destroy() {
        if (this.client &&
            this.client.connected) {
            this.client.destroy();
            this.client = null;
        }
    }

    // DB API 
    private init() {
        this.client = new mariaClient(<mariasql.ClientConfig>{
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            db: config.db.db
        });
        if (!_.isNil(this.client)) {
            this.setCharset(this.client, 'utf8').then(msg => console.log(msg))
                .catch(err => console.log(err));
            console.log(`Successfully created mariasql client.`);
        }
    }

    private setCharset(c: mariasql.MariaClient, code: string): Promise<any> {
        const prep = c.prepare(`set names '${code}';`);
        return new Promise((resolve, reject) => {
            c.query(prep({}),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not set charset to ${code}`,
                            err: err
                        });
                    } else {
                        resolve({
                            msg: `Set charset to ${code}`,
                            code: 200
                        });
                    }
                });
        });
    }
    private queryAllData<T>(sqlStatement: string, params: any[] = []): Promise<T> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(sqlStatement);
        return new Promise((resolve, reject) => {
            let parameters = {};
            _.each(params, par => {
                parameters[par.key] = par.value;
            });
            this.client.query(prep(parameters), (err, result) => {
                if (!_.isNil(err)) {
                    reject({
                        msg: err,
                        code: 500
                    });
                } else if (result.info.numRows === '0') {
                    // reject({
                    //     msg: 'No entries!',
                    //     code: 404
                    // });
                    resolve([]);
                } else {
                    const rows = _.map(_.filter(result, (o: any) => {
                        return o.ID !== undefined;
                    }));
                    resolve(rows);
                }
            });
        });
    }
    private querySingleDatum<T>(sqlStatement: string, params: any[] = []): Promise<T> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(sqlStatement);
        return new Promise((resolve, reject) => {
            let parameters = {};
            _.each(params, par => {
                parameters[par.key] = par.value;
            });
            this.client.query(prep(parameters), (err, result) => {
                if (!_.isNil(err)) {
                    reject({
                        msg: err,
                        code: 500
                    });
                } else if (result.info.numRows === '0') {
                    reject({
                        msg: 'No entries!',
                        code: 404
                    });
                } else {
                    resolve(result[0]);
                }
            });
        });
    }
    private deleteSingleDatum<T>(sqlStatement: string, params: any[] = []): Promise<any> {
        const prep: mariasql.MariaPreparedQuery = this.client.prepare(sqlStatement);
        return new Promise((resolve, reject) => {
            let parameters = {};
            _.each(params, par => {
                parameters[par.key] = par.value;
            });
            this.client.query(prep(parameters),
                (err, result) => {
                    if (!_.isNil(err)) {
                        reject({
                            msg: `Could not delete medium with id: ${params['id']}, Reason: ${err}`,
                            code: 500
                        });
                    } else if (result.info.affectedRows === '0') {
                        reject({
                            msg: `Could not find medium with id: ${params['id']}`,
                            code: 404
                        });
                    } else {
                        resolve({ msg: 'OK', code: 204 });
                    }
                });
        });
    }
}
