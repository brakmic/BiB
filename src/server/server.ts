const fetch = require('node-fetch');
global['fetch'] = fetch;
import { IConfig } from 'app/interfaces';
const Path = require('path');
import * as Hapi from 'hapi';
const Inert = require('inert');
import * as Api from './api';
const corsHeaders = require('hapi-cors-headers');
import * as _ from 'lodash';

class Server {
    public static init(): Hapi.Server {
        const server = new Hapi.Server();
        server.connection({
            port: 10000,
            router: {
                isCaseSensitive: false,
                stripTrailingSlash: true
            },
            routes: {
                timeout: {
                    server: 10000,
                    socket: false
                },
                cors: {
                    credentials: true,
                    origin: ['*'],
                    headers: ['Accept', 'Authorization',
                              'Content-Type', 'If-None-Match',
                              'Access-Control-Allow-Origin',
                              'Accept-Language']
                },
                files: {
                    relativeTo: Path.join(__dirname, '../')
                }
            }
        });
        server.ext('onPreResponse', corsHeaders);
        server.register(Inert, () => {});
        Api.init(server);
        return server;
    }
}

export default (function(){
    const server = Server.init();
    server.start(() => {
        console.log('Server running at:', server.info.uri);
    });
}());
