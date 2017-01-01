import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { BorrowController } from '../controllers';
import { DbClient } from '../database';

export default function(server: Hapi.Server, client: DbClient) {
    const controller = new BorrowController(client);
    server.bind(controller);

    server.route({
        method: 'GET',
        path: '/borrows/active',
        config: {
            handler: controller.getActiveBorrows,
            description: 'Get active borrows',
        }
    });

    server.route({
        method: 'GET',
        path: '/borrows/overdue',
        config: {
            handler: controller.getOverdueBorrows,
            description: 'Get overdue borrows',
        }
    });

    server.route({
        method: 'GET',
        path: '/borrows/{id?}',
        config: {
            handler: controller.getBorrows,
            description: 'Get single or multiple borrow(s)',
        }
    });

    server.route({
        method: 'POST',
        path: '/borrows',
        config: {
            handler: controller.insertBorrow,
            description: 'Insert new borrow',
        }
    });

    server.route({
        method: 'PUT',
        path: '/borrows/{id}',
        config: {
            handler: controller.updateBorrow,
            description: 'Update existing borrow',
        }
    });

    server.route({
        method: 'DELETE',
        path: '/borrows/{id}',
        config: {
            handler: controller.deleteBorrow,
            description: 'Delete borrow',
        }
    });

}
