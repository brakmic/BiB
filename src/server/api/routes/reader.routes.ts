import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { ReaderController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new ReaderController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/readers/{id?}',
        config: {
            handler: controller.getReaders,
            description: 'Get single or multiple readers',
        }
    });

    server.route({
        method: 'GET',
        path: '/readers/{id}/borrows',
        config: {
            handler: controller.getBorrows,
            description: 'Get reader borrows',
        }
    });

    server.route({
        method: 'POST',
        path: '/readers',
        config: {
            handler: controller.insertReader,
            description: 'Insert new reader',
        }
    });

    server.route({
        method: 'PUT',
        path: '/readers/{id}',
        config: {
            handler: controller.updateReader,
            description: 'Update existing reader',
        }
    });

    server.route({
        method: 'DELETE',
        path: '/readers/{id}',
        config: {
            handler: controller.deleteReader,
            description: 'Delete reader',
        }
    });

}
