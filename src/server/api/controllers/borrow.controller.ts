import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IMedium, IConfig,
         IBorrow } from 'app/interfaces';
import { DbClient } from '../database';

export default class BorrowController {
    constructor(private dbClient: DbClient) {
    }
    public getBorrows(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        if (!_.isNil(request.params['id'])){
            const id = Number(request.params['id']);
            this.dbClient.getBorrowById(id).then(borrow => reply(borrow).code(200))
                                           .catch(err => reply(err).code(404));
        } else {
            this.dbClient.getActiveBorrows().then(borrows => reply(borrows).code(200))
                                         .catch(err => reply(err).code(404));
        }
    }
    public getActiveBorrows(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        this.dbClient.getActiveBorrows().then(borrows =>  reply(borrows).code(200))
                                        .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public getOverdueBorrows(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        this.dbClient.getOverdueBorrows().then(borrows => reply(borrows).code(200))
                                        .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public insertBorrow(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const borrow: IBorrow = request.payload;
        this.dbClient.insertBorrow(borrow).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                          .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public deleteBorrow(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = Number(request.params['id']);
        this.dbClient.deleteBorrow(id).then(msg => reply({ msg: msg.msg, code: msg.code }).code(204))
                                      .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public updateBorrow(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id: number = Number(request.params['id']);
        this.dbClient.updateBorrow(id).then(msg => reply({ msg: msg.msg, code: msg.code}).code(200))
                                              .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
}
