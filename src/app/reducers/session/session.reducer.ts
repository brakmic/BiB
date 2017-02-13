import { ActionReducer, Action } from '@ngrx/store';
import { ISession } from 'app/interfaces';

const LOGON_SUCCEEDED = 'LOGON_SUCCEEDED';
const LOGON_FAILED = 'LOGON_FAILED';
const SESSION_RESET = 'SESSION_RESET';
const LOGOUT_FAILED = 'LOGOUT_FAILED';

const initialState: ISession = {
  User: undefined
};

export function sessionReducer(state: ISession = initialState, action: Action) {
  switch (action.type) {
    case LOGON_SUCCEEDED:
      return Object.assign({}, state, action.payload);
    case LOGON_FAILED:
      return Object.assign({}, state, <ISession> { User: undefined });
    case SESSION_RESET:
      return Object.assign({}, state, <ISession> { User: undefined });
    case LOGOUT_FAILED:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

export {
  LOGON_SUCCEEDED,
  LOGON_FAILED,
  SESSION_RESET,
  LOGOUT_FAILED
};
