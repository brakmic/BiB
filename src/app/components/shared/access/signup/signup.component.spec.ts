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
         AppState, LogonService } from 'app/services';
import { IAppState } from 'app/interfaces';
import { Store, provideStore,
         combineReducers, StoreModule } from '@ngrx/store';
import { Signup } from './signup.component';
import { Mock,
         RendererMock,
         ComponentMock,
         RouterMock,
         AuthGuardMock,
         RetailComponentMock,
         getThemeSupport,
         COMMON_TESTING_MODULES,
         COMMON_TESTING_PROVIDERS,
         COMMON_TESTING_COMPONENTS } from 'app/components/base';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

const template = './signup.component.html';
const style = './signup.component.scss';

describe('Component: Signup', () => {
    let signup: Signup;
    let fixture: any;
    let injector: ReflectiveInjector;
    let rootReducer: any;
    let store: Store<IAppState>;

    beforeEach(() => {

        // TestBed.overrideComponent(Signup, {
        //     set: {
        //     template: `<div>Signup Component</div>
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
            declarations: [Signup],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([
                    {
                        path: '**',
                        loadChildren: () => System.import('app/components/shared/access/logon')
                    }
                ])
            ],
            providers: [
                ...COMMON_TESTING_PROVIDERS,
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

        fixture = TestBed.createComponent(Signup);
        signup = fixture.debugElement.componentInstance;
    });

     it('should create component', () => {
        expect(signup).toBeTruthy();
    });

    it('should generate DOM element', () => {
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled).toBeTruthy();
    });

    it('should be able to sign-up a new user', () => {
        spyOn(signup, 'signup');
        expect(signup.signup).not.toHaveBeenCalled();
        signup.signup({ event: 'data' }, 'dummy_user', 'pwd123');
        expect(signup.signup).toHaveBeenCalled();
    });

    it('should be able to forward to logon', () => {
        spyOn(signup, 'login');
        expect(signup.login).not.toHaveBeenCalled();
        signup.login({ event: 'data' });
        expect(signup.login).toHaveBeenCalled();
    });
});
