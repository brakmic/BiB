import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IUser } from 'app/interfaces';
import { DbClient } from '../database';

export default class LoginController {
    constructor(private dbClient: DbClient) {
    }
    public login(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const user: IUser = request.payload;
        this.dbClient.login(user).then(sessionData => reply(sessionData).code(200))
                                 .catch(err => reply(err).code(err.code));
    }
}
