import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { TranslationController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new TranslationController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/translations/{id}',
        config: {
            handler: controller.getTranslation,
            description: 'Get translation for given language',
        }
    });

}
