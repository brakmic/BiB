import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as _ from 'lodash';
import { IWorldCatEntry, IMediaEntry,
         IConfig } from 'app/interfaces';
import { DbClient } from '../database';
const config: IConfig = require('../../../config.json');
const fakeIsbnListResponse: IWorldCatEntry[] = require('../../../assets/isbn_response.json');
const fs = require('fs');

export default class IsbnController {
    private useFakeServer: boolean;

    constructor(private dbClient: DbClient) {
        this.useFakeServer = config.bib_use_fake_isbn_server;
    }
    public queryIsbn(request: Hapi.Request, reply: Hapi.IReply) {
        const isbn = request.params['id'];
        this.dbClient.queryIsbn(isbn).then(mediaData => reply(mediaData).code(200))
                                     .catch(err => reply(err).code(404));
        
    }
    public queryIsbns(request: Hapi.Request, reply: Hapi.IReply) {
        let body = '';
                request.payload.file.on('data', (data) => {
                    body += data;
                });

                request.payload.file.on('end', () => {
                    if (!this.useFakeServer) {
                            const separatedIsbns = _.split(body, '\r\n');
                            const promises = _.map(separatedIsbns, isbn => {
                                return this.dbClient.queryIsbn(isbn);
                            });
                            Promise.all(promises).then(results => {
                                const result = {
                                    description: request.payload.description,
                                    file: {
                                        data: results,
                                        filename: request.payload.file.hapi.filename,
                                        headers: request.payload.file.hapi.headers
                                    }
                                };
                                reply(JSON.stringify(result));
                            }).catch(err => reply(JSON.stringify(err)));
                        } else {
                            const result = {
                                    description: request.payload.description,
                                    file: {
                                        data: fakeIsbnListResponse,
                                        filename: request.payload.file.hapi.filename,
                                        headers: request.payload.file.hapi.headers
                                    }
                                };
                            return reply(JSON.stringify(result));
                        }
                    });
    }
}
