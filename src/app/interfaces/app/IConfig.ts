import { ICountry } from './ICountry';
export interface IConfig {
    data: any;
    server: string;
    logonUrlPath: string;
    protocol: string;
    debug: boolean;
    baseUrl: string;
    language: string;
    availableLanguages: string[];
    countries: ICountry[];
    logon: {
        username: string;
        password: string;
    };
    insertLogonData: boolean;
    translations: string;
    translationApi: string;
    traceRoutes: boolean;
    useHashRouting: boolean;
    useHttpExService: boolean;
    db: {
        host: string;
        user: string;
        password: string;
        db: string;
    };
    bib_server: string;
    bib_server_port: number;
    bib_server_baseUrl: string;
    bib_overdue_days: number;
    bib_localstorage: string;
    bib_logon_mask_logo: string;
    bib_use_fake_isbn_server: boolean;
    bib_datetime_format: string;
}
