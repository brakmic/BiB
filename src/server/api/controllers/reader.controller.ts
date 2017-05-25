import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IMedium, IConfig,
         IBorrow, IReader } from 'app/interfaces';
import { DbClient } from '../database';

export default class ReaderController {
    constructor(private dbClient: DbClient) {
    }
    public getReaders(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        if (!_.isNil(request.params['id'])){
            const id = Number(request.params['id']);
            this.dbClient.getReaderById(id).then(reader => reply(reader).code(200))
                                           .catch(err => reply(err).code(404));
        } else {
            this.dbClient.getAllReaders().then(readers => reply(readers).code(200))
                                         .catch(err => reply(err).code(404));
        }
    }
    public insertReader(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const reader: IReader = request.payload;
        this.dbClient.insertReader(reader).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                          .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public deleteReader(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = Number(request.params['id']);
        this.dbClient.deleteReader(id).then(msg => reply({ msg: msg.msg, code: msg.code }).code(204))
                                      .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public updateReader(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const reader: IReader = request.payload;
        const id: number = Number(request.params['id']);
        this.dbClient.updateReader(id, reader).then(msg => reply({ msg: msg.msg, code: msg.code}).code(200))
                                              .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public getBorrows(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id: number = Number(request.params['id']);
        this.dbClient.getBorrowsForUserId(id).then(borrows => reply(borrows).code(200))
                                              .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
}
