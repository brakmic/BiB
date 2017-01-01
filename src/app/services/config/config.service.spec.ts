import {
        TestBed,
        getTestBed,
        async,
        fakeAsync,
        tick,
        inject } from '@angular/core/testing';
import { LogonService } from './logon.service';
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
import { ConfigService } from './config.service';
import { LogService } from '../log';
import { Observable } from 'rxjs/Observable';
import { IConfig } from '../../interfaces';

describe('Service: Config', () => {

  class LogServiceMock extends LogService {

    constructor() {
      super();
    }
  }

  let logServiceMockInstance = new LogServiceMock();

  class ConfigServiceMock {
    private config: Observable<IConfig>;

    constructor(private logService: LogService) {
      this.config = this.getConfig();
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

  let configServiceMockInstance = new ConfigServiceMock(logServiceMockInstance);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          { provide: LogService, useValue: logServiceMockInstance },
          { provide: ConfigService, useValue: configServiceMockInstance }
        ]
    });
  });

  it('should exist', inject([ConfigService], fakeAsync((service: ConfigService) => {
    expect(service).toBeTruthy();
  })));

  it('should return a config object', inject([ConfigService], (service: ConfigService) => {
       spyOn(service, 'getConfig');
       expect(service.getConfig).not.toHaveBeenCalled();
       service.getConfig();
       expect(service.getConfig).toHaveBeenCalled();
   }));

});
