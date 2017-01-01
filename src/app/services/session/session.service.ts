/**
 * Session management service.
 * @type {Injectable}
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IUser, IConfig,
         IUserGroup, IUserSettings, ISession,
         IAppState } from 'app/interfaces';
import { ConfigService } from '../config';
import { LogService } from '../log';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { LOGON_FAILED, LOGON_SUCCEEDED,
         LOGOUT_FAILED, SESSION_RESET,
         LOGON_AVAILABLE,
         LOGON_UNAVAILABLE, sessionReducer } from 'app/reducers';

@Injectable()
export class SessionService {
    private sessionSubscription: Subscription;
    private sessionState: Observable<ISession>;
  /**
   * Creates an instance of SessionService.
   * 
   * @param {Http} http
   * @param {ConfigService} configService
   * @param {LogService} logService
   */
  constructor(private http: Http,
              private configService: ConfigService,
              private logService: LogService,
              private store: Store<IAppState>) {
  }
  public getSessionStatus(): Observable<ISession> {
    return this.store.select(store => store.session);
  }
}
