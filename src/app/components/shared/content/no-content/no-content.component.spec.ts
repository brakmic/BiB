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

import { LogService, AppState } from 'app/services';
import { IAppState } from 'app/interfaces';
import { Store, provideStore,
         combineReducers, StoreModule } from '@ngrx/store';
import { NoContent } from './no-content.component';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

const template = './no-content.component.html';
const style = './no-content.component.scss';

describe('Component: NoContent', () => {
    let noContent: NoContent;
    let fixture: any;
    let injector: ReflectiveInjector;
    let rootReducer: any;
    let store: Store<IAppState>;

    beforeEach(() => {

        // TestBed.overrideComponent(NoContent, {
        //     set: {
        //     template: `<div>NoContent Component</div>
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
            declarations: [NoContent],
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
                LogService,
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

        fixture = TestBed.createComponent(NoContent);
        noContent = fixture.debugElement.componentInstance;
    });

     it('should create component', () => {
        expect(noContent).toBeTruthy();
    });

    it('should generate DOM element', () => {
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled).toBeTruthy();
    });
});
