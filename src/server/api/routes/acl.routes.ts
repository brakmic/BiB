import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { AclController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new AclController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/acls/{id?}',
        config: {
            handler: controller.getAcls,
            description: 'Get single or multiple ACLs',
        }
    });

    server.route({
        method: 'POST',
        path: '/acls',
        config: {
            handler: controller.insertAcl,
            description: 'Insert new ACL',
        }
    });

    server.route({
        method: 'PUT',
        path: '/acls/{id}',
        config: {
            handler: controller.updateAcl,
            description: 'Update existing ACL',
        }
    });

    server.route({
        method: 'DELETE',
        path: '/acls/{id}',
        config: {
            handler: controller.deleteAcl,
            description: 'Delete ACL',
        }
    });

}
