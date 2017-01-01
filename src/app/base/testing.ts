
import { Component, Input,
         Output,
         EventEmitter,
         OpaqueToken, ElementRef,
         ChangeDetectionStrategy,
         ChangeDetectorRef, Renderer,
         OnInit, OnChanges,
         OnDestroy, AfterViewInit,
         ViewContainerRef, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanActivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot } from '@angular/router';
import { ResponseOptions, Response,
         XHRBackend, HttpModule,
         Http, BaseRequestOptions,
         ConnectionBackend } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { SpyLocation } from '@angular/common/testing';
import { Injector, ReflectiveInjector } from '@angular/core';
import { ActivatedRoute, Route,
         Router, Routes, RouterModule,
         provideRoutes } from '@angular/router';
import { APP_BASE_HREF, Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_PROVIDERS } from './providers';
import {
        AppState, ConfigService,
        LogonService, LogService,
        ConsoleService, WindowService,
        i18nService, LocalStorageService,
        HttpEx, SessionService
} from 'app/services';
import { DataResolver } from 'app/resolvers';
import { appStore } from 'app/stores/app';
// Reducers
import { sessionReducer,
         appReducer, i18nReducer } from 'app/reducers';
import { TranslateModule, TranslatePipe,
         TranslateService, TranslateLoader,
         TranslateStaticLoader, MissingTranslationHandler,
         MissingTranslationHandlerParams } from 'ng2-translate/ng2-translate';
import { Store, provideStore,
         combineReducers, StoreModule } from '@ngrx/store';
import { IConfig, IAppState,
         ILogEntry, ISession,
         IWindow, IWindowEx,
         IUser, IUserSettings, IUserGroup } from 'app/interfaces';
import { Observable } from 'rxjs/Observable';
import { Signup, NoContent,
         AuthGuard } from 'app/components/shared';
import { BibComponent } from 'app/components/main/bib.component';
import { App } from 'app/components/app';
const config: IConfig = require('config.json');

const SERVICES = [
    AppState, ConfigService,
    LogonService, LogService,
    ConsoleService, WindowService,
    i18nService, LocalStorageService,
    HttpEx, SessionService
];

/* MOCKS BEGIN */

class Mock {

}

class RendererMock {}

class RouterMock {
    navigate() {
    }
}

class ActivateRouteMock extends ActivatedRoute {
    constructor() {
        super();
    }
}

class ComponentMock implements Component {
    constructor() {
    }
}

class AppComponentMock extends App {
     constructor(private _router: Router,
                 private _route: ActivatedRoute,
                 private _log: LogService,
                 private _session: SessionService) {
         super(_router, _route, _log, _session);
     }
     public ngAfterViewInit() {
     }
}

class LogServiceMock extends LogService {
  constructor() {
    super();
  }
  public log(entry: ILogEntry): void { }

  public logEx(content: any, component?: string): void { }

  public logJson(content: any, component?: string): void { }

  public logTable(content: any, propkeys?: string[], component?: string): void { }
}

class LogonServiceMock {
    constructor() {
    }
    public doLogon(userNo: number, passwordHash: string,
                  headers: any = undefined): Observable<any> {
    const data = {
        Id: 0,
        No: -1,
        Name: 'TestUser',
        AllowWebLogin: true,
        IsSeller: false,
        SellerName: undefined,
        IsUserAdmin: true,
        CanCreateFlexAnalysis: true,
        Culture: 'de-DE',
        Favorites: undefined
    };
    return Observable.from([data]);
  }
}

class ConfigServiceMock {
    private config: Observable<IConfig>;

    constructor(private logService: LogService) {
        this.config = this.getConfig();
    }
    public getConfig(): Observable<IConfig> {
        return Observable.fromPromise(Promise.resolve(config));
    }
}

class AuthGuardMock implements CanActivate {
    constructor(private store: Store<IAppState>,
              private router: Router,
              private logService: LogService,
              private sessionService: SessionService) {

    }
    public canActivate(next:  ActivatedRouteSnapshot,
                    state: RouterStateSnapshot): boolean {
       return true;
  }
}

class LogServiceMockSimple extends LogService {

    constructor() {
      super();
    }
  }

class ConfigServiceMockLocal {
    constructor(private logService: LogService) {
    }
    public getConfig(): Observable<IConfig> {
        return Observable.fromPromise(Promise.resolve(<IConfig>
                {
                    'server'       : 'localhost',
                    'baseUrl'      : 'localhost',
                    'logonUrlPath' : 'retaildbapi/api/Logon',
                    'protocol'     : 'https',
                    'debug'        : true,
                    'language'     : 'de-DE',
                    'logon': {
                        'username': 'dummy',
                        'password': 'password123'
                    },
                    'translations': 'assets/i18n',
                    'insertLogonData': true,
                    'traceRoutes': false,
                    'useHashRouting': false,
                    'useHttpExService': false
                }));
    }
}

class SessionServiceMock {
    constructor(private http: Http,
                private configService: ConfigServiceMock,
                private logService: LogServiceMock,
                private store: Store<IAppState>) {
  }
  public getSessionStatus(): Observable<ISession> {
    return Observable.of({});
  }
}

class TranslateStaticLoaderMock implements TranslateLoader {
    private http;
    private prefix;
    private suffix;
    constructor(http: Http, prefix?: string, suffix?: string) {
    }
    /**
     * Gets the translations from the server
     * @param lang
     * @returns {any}
     */
    getTranslation(lang: string): Observable<any> {
        return Observable.from([{
                            'KEY': 'VALUE'
                        }]);
    }
}

class MissingTranslationHandlerMock extends MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams): any {
        return params.key;
    }
}

class BibComponentMock extends BibComponent {

    public ngAfterViewInit() {

    }
}

/* MOCKS END */

/* HELPER FUNCTIONS */

let getLogService = () => {
    return new LogServiceMock();
};

let getConfigService = () => {
    return new ConfigServiceMock(getLogService());
};

let getTranslateStaticLoader = () => {
    return new TranslateStaticLoaderMock(new Http(new MockBackend(), new BaseRequestOptions()));
};

let getTranslateService = () => {
    return new TranslateService(getTranslateStaticLoader(), undefined, new MissingTranslationHandlerMock());
};


let getStore = () => {
    let injector: Injector;
    let reflectiveInjector: ReflectiveInjector;
    let rootReducer: any;
    let store: Store<IAppState>;
    rootReducer = combineReducers({
                    session: sessionReducer,
                    app: appReducer,
                    i18n: i18nReducer,
                  });

    reflectiveInjector = ReflectiveInjector.resolveAndCreate([
        StoreModule.provideStore(rootReducer, undefined).providers
    ]);

    store = reflectiveInjector.get(Store);
    return store;
};

let getHttpProvider = () => {
    return {
        provide: Http,
        useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
    };
};


let getSessionService = () => {
    return new SessionServiceMock(new Http(new MockBackend(), new BaseRequestOptions()),
                                            getConfigService(),
                                            getLogService(),
                                            getStore());
};

let getAuthGuard = () => {
    return new AuthGuardMock(undefined, undefined, undefined, undefined);
};

let getRouter = () => {
    return new RouterMock();
};

/* HELPER FUNCTIONS END */

/* EXPORTS */

export const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

export const COMMON_TESTING_COMPONENTS = [
    Signup,
    NoContent,
    AuthGuard
];

export const COMMON_TESTING_PROVIDERS = [
    ...APP_PROVIDERS,
    BaseRequestOptions,
    MockBackend,
    {
        provide: Http, useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
    },
    { provide: WindowService, useValue: window },
    { provide: AuthGuard, useValue: getAuthGuard() },
    { provide: SessionService, useValue: getSessionService() },
    { provide: Store, useValue: getStore() },
    { provide: ConfigService, useValue: getConfigService() },
    { provide: LogService, useValue: getLogService() },
    { provide: TranslateService, useValue: getTranslateService() },
    { provide: i18nService, useClass: i18nService },
    { provide: LogonService, useClass: LogonServiceMock },
    { provide: DataResolver, useClass: DataResolver },
    { provide: TemplateRef, useClass: TemplateRef }
];

export const LEAN_COMMON_TESTING_PROVIDERS = [
    {
        provide: Http, useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
    },
    { provide: WindowService, useValue: window },
    { provide: AuthGuard, useValue: getAuthGuard() },
    { provide: SessionService, useValue: getSessionService() },
    { provide: Store, useValue: getStore() },
    { provide: ConfigService, useValue: getConfigService() },
    { provide: LogService, useValue: getLogService() },
    { provide: TranslateService, useValue: getTranslateService() },
    { provide: i18nService, useClass: i18nService },
    { provide: LogonService, useClass: LogonServiceMock },
    { provide: DataResolver, useClass: DataResolver },
    { provide: TemplateRef, useClass: TemplateRef }
];

export const COMMON_TESTING_MODULES = [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
       provide: TranslateLoader,
       useValue: getTranslateStaticLoader()
    })
];

export {
    Mock,
    ComponentMock,
    AppComponentMock,
    RendererMock,
    RouterMock,
    AuthGuardMock,
    LogServiceMock,
    LogServiceMockSimple,
    ConfigServiceMockLocal,
    ActivateRouteMock,
    TranslateStaticLoaderMock
};

export {
    getAuthGuard,
    getConfigService,
    getHttpProvider,
    getLogService,
    getSessionService,
    getStore,
    getRouter,
    getTranslateStaticLoader,
    getTranslateService
};
