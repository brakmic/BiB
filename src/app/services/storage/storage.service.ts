import { Injectable } from '@angular/core';
import { LogService,
         ConfigService } from 'app/services';
import * as _ from 'lodash';

// const mariaClient = require('mariasql');

@Injectable()
export class StorageService {
    private client: mariasql.MariaClient;

    constructor(private logService: LogService,
                private configService: ConfigService) {
        //    this.configService.getConfig().subscribe(config => {
        //        this.client = new mariaClient(<mariasql.ClientConfig>{
        //           host: config.db.host,
        //           user: config.db.user,
        //           password: config.db.password,
        //           db: config.db.db
        //        });
        //        if (!_.isNil(this.client)) {
        //            this.logService.logEx(`Successfully created mariasql client.`, 'StorageService');

        //            this.client.query('SHOW DATABASES', (err, rows) => {
        //                 if (err) {
        //                     throw err;
        //                 } else {
        //                     this.logService.logJson(rows, 'StorageService');
        //                 }
        //            });
        //            this.client.end();
        //        }
        //    });
       }
}
