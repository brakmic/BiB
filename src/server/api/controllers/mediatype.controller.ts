import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IMediaType, IConfig, IServerMessage } from 'app/interfaces';
import { DbClient } from '../database';

export default class MediaTypeController {
    constructor(private dbClient: DbClient) {
    }
    public getMediaType(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        if (!_.isNil(request.params['id'])) {
            const id = Number(request.params['id']);
            this.dbClient.getMediaTypeById(id).then(medium => reply(medium).code(200))
                                 .catch(err => reply(err.msg).code(err.code));
        } else {
            this.dbClient.getAllMediaTypes().then(media => reply(media).code(200))
                                   .catch(err => reply(err).code(404));
        }
    }
    public insertMediaType(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const mediaType: IMediaType = request.payload;
        this.dbClient.insertMediaType(mediaType).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                        .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public updateMediaType(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const mediaType: IMediaType = request.payload;
        const id: number = Number(request.params['id']);
        this.dbClient.updateMediaType(id, mediaType).then(msg => reply({ msg: msg.msg, code: msg.code}).code(200))
                                              .catch(err => reply({ msg: err.msg, code: err.code}).code(500));
    }
    public deleteMediaType(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = Number(request.params['id']);
        this.dbClient.deleteMediaType(id).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                      .catch(err => reply({ msg: err.msg, err: err.msg}).code(404));
    }
}
