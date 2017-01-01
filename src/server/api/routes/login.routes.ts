import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { LoginController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new LoginController(client);
    server.bind(controller);

    server.route({
        method: 'POST',
        path: '/login',
        config: {
            handler: controller.login,
            description: 'Initiate a new session',
        }
    });
}
