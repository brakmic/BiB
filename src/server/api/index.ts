import * as Hapi from 'hapi';
import { MediaRoutes,
         MediaTypeRoutes, 
         BorrowRoutes,
         ReaderRoutes,
         UserRoutes,
         UserGroupRoutes,
         UserSettingsRoutes,
         AclRoutes,
         LoginRoutes,
         IsbnRoutes,
         TranslationRoutes,
         StatsRoutes } from './routes';
import { DbClient } from './database';

export function init(hapi: Hapi.Server) {
    const client = new DbClient();
    MediaRoutes(hapi, client);
    MediaTypeRoutes(hapi, client);
    BorrowRoutes(hapi, client);
    ReaderRoutes(hapi, client);
    UserRoutes(hapi, client);
    UserGroupRoutes(hapi, client);
    UserSettingsRoutes(hapi, client);
    AclRoutes(hapi, client);
    LoginRoutes(hapi, client);
    IsbnRoutes(hapi, client);
    TranslationRoutes(hapi, client);
    StatsRoutes(hapi, client);
}
