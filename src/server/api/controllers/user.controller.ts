import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IUser } from 'app/interfaces';
import { DbClient } from '../database';

export default class UserController {
    constructor(private dbClient: DbClient) {
    }
    public getUsers(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        if (!_.isNil(request.params['id'])){
            const id = Number(request.params['id']);
            this.dbClient.getUserById(id).then(user => reply(user).code(200))
                                           .catch(err => reply(err).code(404));
        } else {
            this.dbClient.getAllUsers().then(users => reply(users).code(200))
                                         .catch(err => reply(err).code(404));
        }
    }
    public insertUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const user: IUser = request.payload;
        this.dbClient.insertUser(user).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                          .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public deleteUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = Number(request.params['id']);
        this.dbClient.deleteUser(id).then(msg => reply({ msg: msg.msg, code: msg.code }).code(204))
                                      .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public updateUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const user: IUser = request.payload;
        const id: number = Number(request.params['id']);
        this.dbClient.updateUser(id, user).then(msg => reply({ msg: msg.msg, code: msg.code}).code(200))
                                              .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
}
