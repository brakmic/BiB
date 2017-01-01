import {
        TestBed,
        getTestBed,
        async,
        fakeAsync,
        tick,
        inject } from '@angular/core/testing';
import { LogonService } from './logon.service';
import { ConfigService } from '../config';
import { ResponseOptions, Response,
         XHRBackend, HttpModule,
         Http, BaseRequestOptions,
         ConnectionBackend,
         RequestOptions,
         RequestOptionsArgs,
         Headers,
         Request } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { SpyLocation } from '@angular/common/testing';
import { Injector, ReflectiveInjector } from '@angular/core';
import { LogService } from '../log';
import { IConfig } from '../../interfaces';
import { Observable } from 'rxjs/Observable';

describe('Service: Logon', () => {
  let injector: Injector;
  let mockBackend: MockBackend;
  let connection: MockConnection;

  class LogServiceMock extends LogService {

    constructor() {
      super();
    }
  }

  class ConfigServiceMock {
    constructor(private logService: LogService) {
    }
    public getConfig(): Observable<IConfig> {
      return Observable.fromPromise(Promise.resolve(<IConfig>
                    {
                      'server'       : 'localhost',
                      'baseUrl'      : 'localhost',
                      'logonUrlPath' : 'api/Logon',
                      'protocol'     : 'https',
                      'debug'        : true,
                      'language'     : 'de-DE',
                      'logon': {
                          'username': 'test',
                          'password': 'test'
                      },
                      'translations': 'assets/i18n',
                      'insertLogonData': true,
                      'traceRoutes': false,
                      'useHashRouting': false,
                      'useHttpExService': false
                    }));
    }
  }

  let logServiceMockInstance = new LogServiceMock();
  let configServiceMockInstance = new ConfigServiceMock(logServiceMockInstance);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          LogonService,
          { provide: LogService, useValue: logServiceMockInstance },
          { provide: ConfigService, useValue: configServiceMockInstance },
          BaseRequestOptions,
          MockBackend,
          {
             provide: Http,
             useFactory: function(backend: ConnectionBackend,
                                  defaultOptions: BaseRequestOptions) {
                return new Http(backend, defaultOptions);
             }, deps: [MockBackend, BaseRequestOptions]
          }
      ]
    });
  });

  afterEach(() => {
    injector = undefined;
    mockBackend = undefined;
    connection = undefined;
   });

  it('should exist', inject([LogonService], (service: LogonService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able log-on a user', inject([LogonService], (service: LogonService) => {
       spyOn(service, 'doLogon');
       expect(service.doLogon).not.toHaveBeenCalled();
       service.doLogon(123, 'pwd', {});
       expect(service.doLogon).toHaveBeenCalled();
   }));

});
