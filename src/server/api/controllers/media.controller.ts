import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IMedium, IConfig, IServerMessage } from 'app/interfaces';
import { DbClient } from '../database';

export default class MediaController {
    constructor(private dbClient: DbClient) {
    }
    public getMedia(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        if (!_.isNil(request.params['id'])) {
            const id = Number(request.params['id']);
            this.dbClient.getMediumById(id).then(medium => reply(medium).code(200))
                                 .catch(err => reply(err.msg).code(err.code));
        } else {
            this.dbClient.getAllMedia().then(media => reply(media).code(200))
                                   .catch(err => reply(err).code(404));
        }
    }
    public insertMedium(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const medium: IMedium = request.payload;
        this.dbClient.insertMedium(medium).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                        .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public updateMedium(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const medium: IMedium = request.payload;
        const id: number = Number(request.params['id']);
        this.dbClient.updateMedium(id, medium).then(msg => reply({ msg: msg.msg, code: msg.code}).code(200))
                                              .catch(err => reply({ msg: err.msg, code: err.code}).code(500));
    }
    public deleteMedium(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = Number(request.params['id']);
        this.dbClient.deleteMedium(id).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                      .catch(err => reply({ msg: err.msg, err: err.msg}).code(404));
    }
    public isBorrowed(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = Number(request.params['id']);
        this.dbClient.isMediumBorrowed(id).then(msg => reply({ msg: msg, code: 200}))
                                          .catch(err => reply({ msg: err.msg, code: err.code}).code(500));
    }
}
