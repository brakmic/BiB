import { TestBed, async, inject } from '@angular/core/testing';
import { TranslateModule, TranslatePipe,
         TranslateService, TranslateLoader,
         TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { Injector, ReflectiveInjector } from '@angular/core';
import { ResponseOptions, Response,
         XHRBackend, HttpModule,
         Http, BaseRequestOptions,
         ConnectionBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Store, provideStore,
         combineReducers, StoreModule } from '@ngrx/store';
import { IConfig, IAppState } from '../../interfaces';
import { i18nService } from './i18n.service';
// import { WindowService } from '../window';
import { ConfigService } from '../config';
import { LogService } from '../log';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';

describe('Service: i18n', () => {
  let translate: TranslateService;
  let store: Store<IAppState>;
  let rootReducer: any;
  let reflectiveInjector: ReflectiveInjector;

  class LogServiceMock extends LogService {
    constructor() {
      super();
    }
  }

  class ConfigServiceMock {
    constructor() {
    }
    public getConfig(): Observable<IConfig> {
      return Observable.fromPromise(Promise.resolve(<IConfig>
                    {
                      'server'       : 'localhost',
                      'baseUrl'      : 'localhost',
                      'logonUrlPath' : 'logon/api',
                      'protocol'     : 'https',
                      'debug'        : true,
                      'language'     : 'de-DE',
                      'logon': {
                          'username': 'user',
                          'password': 'pwd'
                      },
                      'translations': 'assets/i18n',
                      'insertLogonData': true,
                      'traceRoutes': false,
                      'useHashRouting': false,
                      'useHttpExService': false
                    }));
    }
  }

  beforeEach(() => {

    translate = new TranslateService(undefined, undefined, undefined);

    rootReducer = combineReducers({});

    reflectiveInjector = ReflectiveInjector.resolveAndCreate([
        StoreModule.provideStore(rootReducer, undefined).providers
    ]);

    store = reflectiveInjector.get(Store);

    TestBed.configureTestingModule({
      providers: [
        // { provide: WindowService, useValue: window },
        i18nService,
        provideStore(rootReducer, undefined),
        { provide: LogService, useClass: LogServiceMock },
        { provide: TranslateService, useValue: translate },
        { provide: ConfigService, useClass: ConfigServiceMock },
        MockBackend,
        {
            provide: Http,
            useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
                return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        },
      ]
    });
  });

  it('should exist', inject([i18nService], (service: i18nService) => {
    expect(service).toBeTruthy();
  }));

  it('should deliver an immediate translation', inject([i18nService], (service: i18nService) => {
       spyOn(service, 'instant');
       expect(service.instant).not.toHaveBeenCalled();
       service.instant('foreign_language_term');
       expect(service.instant).toHaveBeenCalled();
   }));

   it('should be able to switch languages', inject([i18nService], (service: i18nService) => {
       spyOn(service, 'changeLang');
       expect(service.changeLang).not.toHaveBeenCalled();
       service.changeLang('en-US');
       expect(service.changeLang).toHaveBeenCalled();
   }));

   it('should be able to return current language', inject([i18nService], (service: i18nService) => {
       spyOn(service, 'getCurrentLang');
       expect(service.getCurrentLang).not.toHaveBeenCalled();
       service.getCurrentLang();
       expect(service.getCurrentLang).toHaveBeenCalled();
   }));

});
