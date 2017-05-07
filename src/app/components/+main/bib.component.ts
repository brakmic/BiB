/**
 * This is the Bib component.
 * @type {Component}
 */
// Default Angular Classes
import {
  Component, Input,
  Output,
  EventEmitter,
  OpaqueToken, ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef, Renderer,
  ApplicationRef, NgZone
} from '@angular/core';
import { Http, Headers } from '@angular/http';
// Routing
import {
  ActivatedRoute, Route,
  Router
} from '@angular/router';

// Enums
import { MenuType, ActionStatus } from 'app/enums';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
// Interfaces
import {
  IMenuEntry, IAppState,
  ISession, IWindowEx,
  IStats
} from 'app/interfaces';
// Services
import {
  LogService, i18nService,
  ConfigService, SessionService,
  ToastService
} from 'app/services';
// Decorator
import { authorized } from 'app/decorators';
// Helpers
import { Bib } from 'app/helpers';
import { bibApi } from 'app/apis';
import * as _ from 'lodash';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import {
  LOGON_FAILED, LOGON_SUCCEEDED,
  LOGOUT_FAILED, SESSION_RESET,
  LOGON_AVAILABLE, LOGON_UNAVAILABLE,
  DEBUG_TOOLS_AVAILABLE, DEBUG_TOOLS_UNAVAILABLE
} from 'app/reducers';
const domready = require('domready');

@Component({
  selector: 'bib-app',
  templateUrl: './bib.component.html',
  styleUrls: ['./bib.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BibComponent {
  public title = '';
  public sessionData: ISession = undefined;
  // statistics
  public mediaCount: number;
  public readersCount: number;
  public borrowsCount: number;
  public overduesCount: number;

  private isMobile: boolean;
  private themeBlock: string[] | string = undefined;
  private appState: Observable<any>;
  private sessionState: Observable<ISession>;
  private routingSubscription: Subscription;
  private statsState: Observable<IStats>;
  private statsSubscription: Subscription;
  private appSubscription: Subscription;
  private sessionSubscription: Subscription;

  constructor(private el: ElementRef,
              private renderer: Renderer,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private http: Http,
              private store: Store<IAppState>,
              private cd: ChangeDetectorRef,
              private logService: LogService,
              private translate: i18nService,
              private config: ConfigService,
              private appRef: ApplicationRef,
              private ngZone: NgZone,
              private toast: ToastService) {
  }

  /**
   * Initializes observers for menu & search handling
   */

  public ngOnInit() {
    this.initSubscriptions();
    this.title = this.translate.instant('AppTitle');
  }

  public ngOnDestroy() {
    this.destroySubscriptions();
    $('bib-root').siblings().remove();
  }

  public ngAfterViewInit() {
    const msg = this.translate.instant('Welcome');
    const user = this.sessionData.User;
    this.toast.show(`${msg} ${user.AccountName}`, 'BiB', ActionStatus.Success);
  }

  public ngOnChanges(changes: any) {
  }

  /**
   * Selects the module bound to the selected menu
   * @param {Event} [event] Object containing menu data (id, name, optional submenus)
   */
  public onMenuSelected($event: any) {
    this.collectStatistics();
    this.logService.logJson($event.name, 'BiB');
  }

  private initSubscriptions() {
    this.appState = this.store.select(store => store.app);
    this.appSubscription = this.appState.subscribe(info => {
    });
    this.sessionState = this.store.select(store => store.session);
    this.sessionSubscription = this.sessionState.subscribe(session => {
      this.sessionData = session;
      this.cd.markForCheck();
    });
    this.statsState = this.store.select(store => store.stats);
    this.statsSubscription = this.statsState.subscribe(stats => {
      this.collectStatistics();
    });
  }

  private destroySubscriptions() {
    if (this.appSubscription) {
      this.appSubscription.unsubscribe();
    }
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }

  /**
   * Removes the session data from local storage and redirects to logon-page
   */
  private logout() {
    this.store.dispatch({ type: DEBUG_TOOLS_UNAVAILABLE });
    this.store.dispatch({ type: SESSION_RESET, payload: <ISession>{ User: undefined } });
  }
  private collectStatistics() {
    domready(() => {
      bibApi.getStats().then((stats: IStats) => {
        this.readersCount = stats.readersCount;
        this.borrowsCount = stats.borrowsCount;
        this.overduesCount = stats.overduesCount;
        this.mediaCount = stats.mediaCount;
        this.cd.markForCheck();
      });
    });
  }

}
