import {
    async,
    TestBed
} from '@angular/core/testing';
import { ReflectiveInjector } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';

import {
    FormGroup,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    RouterTestingModule
} from '@angular/router/testing';
import { ResponseOptions, Response,
         XHRBackend, HttpModule,
         Http, BaseRequestOptions,
         ConnectionBackend } from '@angular/http';

import { LogService,
         AppState, i18nService } from 'app/services';
import { IAppState } from 'app/interfaces';
import { Store, provideStore,
         combineReducers, StoreModule } from '@ngrx/store';
import { Mock,
         RendererMock,
         ComponentMock,
         RouterMock,
         AuthGuardMock,
         RetailComponentMock,
         getThemeSupport,
         COMMON_TESTING_MODULES,
         COMMON_TESTING_PROVIDERS,
         LEAN_COMMON_TESTING_PROVIDERS,
         COMMON_TESTING_COMPONENTS } from 'app/components/base';
import { LogonComponent } from './logon.component';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

const template = './logon.component.html';
const style = './logon.component.scss';

describe('Component: Logon', () => {
    let logon: LogonComponent;
    let fixture: any;
    let injector: ReflectiveInjector;
    let rootReducer: any;
    let store: Store<IAppState>;

    beforeEach(() => {

        // TestBed.overrideComponent(Logon, {
        //     set: {
        //     template: `<div>Logon Component</div>
        //                <router-outlet></router-outlet>`,
        //     styleUrls: [``]
        //     }
        // });

        rootReducer = combineReducers({});

        injector = ReflectiveInjector.resolveAndCreate([
            StoreModule.provideStore(rootReducer, undefined).providers
        ]);

        store = injector.get(Store);

        TestBed.configureTestingModule({
            declarations: [LogonComponent],
            imports: [
                ...COMMON_TESTING_MODULES,
                RouterTestingModule.withRoutes([
                    {
                        path: '**',
                        loadChildren: () => System.import('app/components/shared/access/logout')
                    }
                ])
            ],
            providers: [
                ...LEAN_COMMON_TESTING_PROVIDERS,
                provideStore(rootReducer, undefined),
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

        fixture = TestBed.createComponent(LogonComponent);
        logon = fixture.debugElement.componentInstance;
    });

     it('should create component', () => {
        expect(logon).toBeTruthy();
    });

     it('should call ngOnInit()', () => {
        spyOn(logon, 'ngOnInit');
        expect(logon.ngOnInit).not.toHaveBeenCalled();
        logon.ngOnInit();
        expect(logon.ngOnInit).toHaveBeenCalled();
    });

    it('should generate DOM element', () => {
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled).toBeTruthy();
    });

    it('should be able to logon user', () => {
        spyOn(logon, 'logon');
        expect(logon.logon).not.toHaveBeenCalled();
        logon.logon();
        expect(logon.logon).toHaveBeenCalled();
    });

    it('should be able to sign-up a new user', () => {
        spyOn(logon, 'signup');
        expect(logon.signup).not.toHaveBeenCalled();
        logon.signup({ preventDefault: () => {}});
        expect(logon.signup).toHaveBeenCalled();
    });

    it('should be able to remove private user data', () => {
        spyOn(logon, 'cleanup');
        expect((<any>logon).cleanup).not.toHaveBeenCalled();
        (<any>logon).cleanup();
        expect((<any>logon).cleanup).toHaveBeenCalled();
    });
});
