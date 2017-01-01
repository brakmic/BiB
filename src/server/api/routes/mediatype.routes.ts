import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { MediaTypeController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new MediaTypeController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/mediatypes/{id?}',
        config: {
            handler: controller.getMediaType,
            description: 'Get single or multiple media types',
        }
    });

    server.route({
        method: 'POST',
        path: '/mediatypes',
        config: {
            handler: controller.insertMediaType,
            description: 'Insert new media type',
        }
    });

    server.route({
        method: 'PUT',
        path: '/mediatypes/{id}',
        config: {
            handler: controller.updateMediaType,
            description: 'Update existing media type',
        }
    });

    server.route({
        method: 'DELETE',
        path: '/mediatypes/{id}',
        config: {
            handler: controller.deleteMediaType,
            description: 'Delete media type',
        }
    });

}
