import * as _ from 'lodash';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { IMedium } from 'app/interfaces';
import { MediaAction } from 'app/enums';

/**
 * Use en-US as fallback
 */
const initialState = {};

const CATEGORY: string = 'media';

export const MEDIA_ACTIONS: {[key: string]: MediaAction } = {
  ADD_MEDIUM: MediaAction.Add,
  REMOVE_MEDIUM: MediaAction.Remove,
  BORROW_MEDIUM: MediaAction.Borrow,
  UNBORROW_MEDIUM: MediaAction.UnBorrow,
  RESET_MEDIUM: MediaAction.Reset,
  UNKNOWN_MEDIUM_ACTION: MediaAction.Unknown
};
/**
 * Medium reducer
 */
export function mediaReducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'BORROW_MEDIUM':
      const id = (<IMedium>action.payload).ID;
      return _.assign({}, state, { id: action.payload, medium: action.payload });
    case 'UNBORROW_MEDIUM':
      return _.filter(state, (m: any) => { return m.id !== (<IMedium>action.payload).ID; });
    default:
      return state;
  }
}
