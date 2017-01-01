import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IUserSettings } from 'app/interfaces';
import { DbClient } from '../database';

export default class UserSettingsController {
    constructor(private dbClient: DbClient) {
    }
    public getUserSettings(request: Hapi.Request, reply: Hapi.IReply) {
        if (!_.isNil(request.params['id'])){
            const id = Number(request.params['id']);
            this.dbClient.getUserById(id).then(userSettings => reply(userSettings).code(200))
                                           .catch(err => reply(err).code(404));
        } else {
            this.dbClient.getAllUserSettings().then(allUserSettings => reply(allUserSettings).code(200))
                                         .catch(err => reply(err).code(404));
        }
    }
    public insertUserSettings(request: Hapi.Request, reply: Hapi.IReply) {
        const userSettings: IUserSettings = request.payload;
        this.dbClient.insertUserSettings(userSettings).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                          .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public deleteUserSettings(request: Hapi.Request, reply: Hapi.IReply) {
        const id = Number(request.params['id']);
        this.dbClient.deleteUserSettings(id).then(msg => reply({ msg: msg.msg, code: msg.code }).code(204))
                                      .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public updateUserSettings(request: Hapi.Request, reply: Hapi.IReply) {
        const userSettings: IUserSettings = request.payload;
        const id: number = Number(request.params['id']);
        this.dbClient.updateUserSettings(id, userSettings).then(msg => reply({ msg: msg.msg, code: msg.code}).code(200))
                                              .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
}
