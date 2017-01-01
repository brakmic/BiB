import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { UserSettingsController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new UserSettingsController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/usersettings/{id?}',
        config: {
            handler: controller.getUserSettings,
            description: 'Get single or multiple user settings',
        }
    });

    server.route({
        method: 'POST',
        path: '/usersettings',
        config: {
            handler: controller.insertUserSettings,
            description: 'Insert new user settings',
        }
    });

    server.route({
        method: 'PUT',
        path: '/usersettings/{id}',
        config: {
            handler: controller.updateUserSettings,
            description: 'Update existing user settings',
        }
    });

    server.route({
        method: 'DELETE',
        path: '/usersettings/{id}',
        config: {
            handler: controller.deleteUserSettings,
            description: 'Delete user settings',
        }
    });

}
