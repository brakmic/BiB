import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { MediaController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new MediaController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/media/{id?}',
        config: {
            handler: controller.getMedia,
            description: 'Get single or multiple media',
        }
    });

    server.route({
        method: 'GET',
        path: '/media/{id}/borrowed',
        config: {
            handler: controller.isBorrowed,
            description: 'Check if medium is borrowed or not',
        }
    });

    server.route({
        method: 'POST',
        path: '/media',
        config: {
            handler: controller.insertMedium,
            description: 'Insert new medium',
        }
    });

    server.route({
        method: 'PUT',
        path: '/media/{id}',
        config: {
            handler: controller.updateMedium,
            description: 'Update existing medium',
        }
    });

    server.route({
        method: 'DELETE',
        path: '/media/{id}',
        config: {
            handler: controller.deleteMedium,
            description: 'Delete medium',
        }
    });

}
