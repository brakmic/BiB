import { IRouteState, IMediaState } from 'app/states';
export interface IAppState {
    app: any;
    i18n: any;
    session: any;
    stats: any;
    acl: any;
    route: IRouteState;
    media: IMediaState;
}

