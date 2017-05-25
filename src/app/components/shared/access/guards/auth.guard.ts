import { Injectable } from '@angular/core';
import { CanActivate,
         Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot } from '@angular/router';
// Services
import { LogService, SessionService } from 'app/services';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { LOGON_FAILED, LOGON_SUCCEEDED,
          LOGOUT_FAILED, SESSION_RESET } from 'app/reducers';
// Helpers
import { Bib } from 'app/helpers';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
// Interfaces
import { IAppState, ISession } from 'app/interfaces';
import * as _ from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  private sessionState: Observable<ISession>;
  private sessionSubscription: Subscription;
  private loggedOn: boolean = false;

  constructor(private store: Store<IAppState>,
              private router: Router,
              private logService: LogService,
              private sessionService: SessionService)  {
      this.sessionSubscription = this.getSessionState()
                                     .subscribe(state => this.loggedOn = !_.isNil(state) &&
                                                                         !_.isNil(state.User));
  }

  public canActivate(next:  ActivatedRouteSnapshot,
                    state: RouterStateSnapshot): Observable<boolean> {
    return Observable.from([this.loggedOn]);
  }

  private getSessionState(): Observable<ISession> {
    return this.sessionService.getSessionStatus();
  }
}
