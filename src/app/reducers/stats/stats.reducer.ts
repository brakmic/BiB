import * as _ from 'lodash';
import * as Immutable from 'immutable';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { IStats } from 'app/interfaces';

const initialState = {};

const CATEGORY: string = 'stats';

export const STATS_CHANGED = 'STATS_CHANGED';
/**
 * Medium reducer
 */
export function statsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'STATS_CHANGED':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
