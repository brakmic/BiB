import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IAcl } from 'app/interfaces';
import { DbClient } from '../database';

export default class AclController {
    constructor(private dbClient: DbClient) {
    }
    public getAcls(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        if (!_.isNil(request.params['id'])){
            const id = Number(request.params['id']);
            this.dbClient.getAclById(id).then(acl => reply(acl).code(200))
                                           .catch(err => reply(err).code(404));
        } else {
            this.dbClient.getAcls().then(acls => reply(acls).code(200))
                                         .catch(err => reply(err).code(404));
        }
    }
    public insertAcl(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const acl: IAcl = request.payload;
        this.dbClient.insertAcl(acl).then(msg => reply({ msg: msg.msg, code: msg.code }).code(200))
                                          .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public deleteAcl(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = Number(request.params['id']);
        this.dbClient.deleteAcl(id).then(msg => reply({ msg: msg.msg, code: msg.code }).code(204))
                                      .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
    public updateAcl(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const acl: IAcl = request.payload;
        const id: number = Number(request.params['id']);
        this.dbClient.updateAcl(id, acl).then(msg => reply({ msg: msg.msg, code: msg.code}).code(200))
                                              .catch(err => reply({ msg: err.msg, err: err.err}).code(500));
    }
}
