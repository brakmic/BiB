import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { UserController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new UserController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/users/{id?}',
        config: {
            handler: controller.getUsers,
            description: 'Get single or multiple users',
        }
    });

    server.route({
        method: 'POST',
        path: '/users',
        config: {
            handler: controller.insertUser,
            description: 'Insert new user',
        }
    });

    server.route({
        method: 'PUT',
        path: '/users/{id}',
        config: {
            handler: controller.updateUser,
            description: 'Update existing user',
        }
    });

    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        config: {
            handler: controller.deleteUser,
            description: 'Delete user',
        }
    });

}
