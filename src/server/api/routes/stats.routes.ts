import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { StatsController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new StatsController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/stats',
        config: {
            handler: controller.getStats,
            description: 'Get statistics',
        }
    });

}
