import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IStats } from 'app/interfaces';
import { DbClient } from '../database';

export default class StatsController {
    constructor(private dbClient: DbClient) {
    }
    public getStats(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        this.dbClient.getStats().then(stats => reply(stats).code(200))
                                        .catch(err => reply(err).code(404));
    }
}
