import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { IsbnController } from '../controllers';
import { DbClient } from '../database';
import { IConfig, IWorldCatEntry } from 'app/interfaces';
import * as _ from 'lodash';

export default function(server: Hapi.Server, client: DbClient) {
    
    const controller = new IsbnController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/isbn/{id}',
        config: {
            handler: controller.queryIsbn,
            description: 'Get data for given ISBN',
        }
    });

    server.route({
            method: 'POST',
            path: '/isbn',
            config: {
                handler: controller.queryIsbns,
                description: 'Query multiple ISBNs from an uploaded file',
                payload: {
                output: 'stream',
                parse: true,
                // allow: 'multipart/form-data'
                }
            }
    });

}
