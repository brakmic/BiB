/**
 * This is the SessionInfo component.
 * @type {Component}
 */
// Default Angular Classes
import { Component, Input,
         Output,
         EventEmitter,
         OpaqueToken, ElementRef,
         ChangeDetectionStrategy,
         ChangeDetectorRef, Renderer,
         OnInit, SimpleChanges,
         SimpleChange } from '@angular/core';
import { Http, Headers } from '@angular/http';
// Routing
import { ActivatedRoute, Route,
         Router } from '@angular/router';

// Enums
import { MenuType } from 'app/enums';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
// Interfaces
import { IMenuEntry, IAppState,
         ISession, IWindowEx } from 'app/interfaces';
// Services
import { LogService, i18nService,
         ConfigService, SessionService } from 'app/services';
// Helpers
import { Bib } from 'app/helpers';
import * as _ from 'lodash';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { LOGON_FAILED, LOGON_SUCCEEDED,
         LOGOUT_FAILED, SESSION_RESET,
         LOGON_AVAILABLE, LOGON_UNAVAILABLE,
         DEBUG_TOOLS_AVAILABLE, DEBUG_TOOLS_UNAVAILABLE } from 'app/reducers';
const domready = require('domready');

@Component({
    selector: 'bib-session-info',
    styleUrls: ['./session-info.component.scss'] ,
    templateUrl: './session-info.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionInfoComponent implements OnInit {
    @Input() public session: ISession;
    constructor(private cd: ChangeDetectorRef,
                private logService: LogService,) { }

    public ngOnInit() { 
      
    }
    public ngOnChanges(changes: SimpleChanges) {
        const sess = changes['session'];
        if (!_.isEqual(sess.previousValue,sess.currentValue)){
            this.session = sess.currentValue;
            this.cd.markForCheck();
        }
    }
    public ngAfterViewInit() {
        this.cd.markForCheck();
    }

}
