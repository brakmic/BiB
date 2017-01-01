import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { UserGroupController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new UserGroupController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/usergroups/{id?}',
        config: {
            handler: controller.getUserGroups,
            description: 'Get single or multiple user groups',
        }
    });

    server.route({
        method: 'POST',
        path: '/usergroups',
        config: {
            handler: controller.insertUserGroup,
            description: 'Insert new user group',
        }
    });

    server.route({
        method: 'PUT',
        path: '/usergroups/{id}',
        config: {
            handler: controller.updateUserGroup,
            description: 'Update existing user group',
        }
    });

    server.route({
        method: 'DELETE',
        path: '/usergroups/{id}',
        config: {
            handler: controller.deleteUserGroup,
            description: 'Delete user group',
        }
    });

}
