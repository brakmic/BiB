import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { ITranslation } from 'app/interfaces';
import { DbClient } from '../database';

export default class TranslationController {
    constructor(private dbClient: DbClient) {
    }
    public getTranslation(request: Hapi.Request, reply: any) {
        if (!_.isNil(request.params['id'])) {
            const id = request.params['id'];
            reply.file(`assets/i18n/${id}.json`);
        }
    }
}
