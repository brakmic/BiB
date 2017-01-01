import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IUserGroup } from 'app/interfaces';
import { DbClient } from '../database';

export default class UserGroupController {
    constructor(private dbClient: DbClient) {
    }
    public getUserGroups(request: Hapi.Request, reply: Hapi.IReply) {
        if (!_.isNil(request.params['id'])){
            const id = Number(request.params['id']);
            this.dbClient.getUserGroupById(id).then(user => reply(user).code(200))
                                           .catch(err => reply(err).code(404));
        } else {
            this.dbClient.getAllUserGroups().then(users => reply(users).code(200))
                                         .catch(err => reply(err).code(404));
        }
    }
    public insertUserGroup(request: Hapi.Request, reply: Hapi.IReply) {
        const userGroup: IUserGroup = request.payload;
        this.dbClient.insertUserGroup(userGroup).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                          .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public deleteUserGroup(request: Hapi.Request, reply: Hapi.IReply) {
        const id = Number(request.params['id']);
        this.dbClient.deleteUserGroup(id).then(msg => reply({ msg: msg.msg, code: msg.code }).code(204))
                                      .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public updateUserGroup(request: Hapi.Request, reply: Hapi.IReply) {
        const userGroup: IUserGroup = request.payload;
        const id: number = Number(request.params['id']);
        this.dbClient.updateUserGroup(id, userGroup).then(msg => reply({ msg: msg.msg, code: msg.code}).code(200))
                                              .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
}
