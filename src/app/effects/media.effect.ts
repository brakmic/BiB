// angular
import { Injectable, Inject,
         forwardRef } from '@angular/core';

// libs
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { IMedium } from '../interfaces';
import { QueryType } from '../enums';
import { IAppState } from '../interfaces';
import * as _ from 'lodash';
import { MediaActions, MediaActionTypes } from '../actions';
import { bibApi } from 'app/apis';

@Injectable()
export class MediaEffects {

  @Effect() mediaInitialized$: Observable<Action> = this.actions$
    .ofType(MediaActionTypes.INIT)
    .switchMap(action => bibApi.getMedia())
    .map((media: IMedium[]) => this.mediaActions.mediaInitialized(media));

  @Effect() mediaUpdated$: Observable<Action> = this.actions$
    .ofType(MediaActionTypes.UPDATED)
    .map(action => this.mediaActions.mediaChanged());

  @Effect() mediaInserted$: Observable<Action> = this.actions$
    .ofType(MediaActionTypes.INSERTED)
    .map(action => this.mediaActions.mediaUpdated(action.payload));

  @Effect() mediaRemoved$: Observable<Action> = this.actions$
    .ofType(MediaActionTypes.REMOVED)
    .map(action => this.mediaActions.mediaChanged());

  @Effect() mediaChanged$: Observable<Action> = this.actions$
    .ofType(MediaActionTypes.CHANGED)
    .switchMap(action => bibApi.getMedia())
    .map((media: IMedium[]) => this.mediaActions.mediaRetrieved(media));

  constructor(private store: Store<IAppState>,
          private actions$: Actions,
          private mediaActions: MediaActions) { }


}
