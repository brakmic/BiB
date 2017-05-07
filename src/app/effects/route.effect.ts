// angular
import { Injectable, Inject,
         forwardRef } from '@angular/core';

// libs
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { IRoute } from '../interfaces';
import { QueryType } from '../enums';
import { IAppState } from '../interfaces';
import * as _ from 'lodash';
import { RouteActions, RouteActionTypes } from '../actions';

@Injectable()
export class RouteEffects {

  @Effect() routeSelected$: Observable<Action> = this.actions$
    .ofType(RouteActionTypes.SELECTED)
    .map(action => action.payload)
    .map(route => this.routeActions.routeChanging(route));

  @Effect() routeChanging$: Observable<Action> = this.actions$
    .ofType(RouteActionTypes.CHANGING)
    .map(action => action.payload)
    .map(route => this.routeActions.routeChanged(route));

  constructor(private store: Store<IAppState>,
          private actions$: Actions,
          private routeActions: RouteActions) { }


}
