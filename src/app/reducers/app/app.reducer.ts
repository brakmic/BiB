import { ActionReducer, Action } from '@ngrx/store';

const LOGON_AVAILABLE = 'LOGON_AVAILABLE';
const LOGON_UNAVAILABLE = 'LOGON_UNAVAILABLE';
const DEBUG_TOOLS_AVAILABLE = 'DEBUG_TOOLS_AVAILABLE';
const DEBUG_TOOLS_UNAVAILABLE = 'DEBUG_TOOLS_UNAVAILABLE';

const initialState: any = {};

export function appReducer(state: any = initialState, action: Action) {
  switch (action.type) {
    case LOGON_AVAILABLE:
      return Object.assign({}, state, { logon: true }, action.payload);
    case LOGON_UNAVAILABLE:
      return Object.assign({}, state, { logon: false }, action.payload);
    case DEBUG_TOOLS_AVAILABLE:
      return Object.assign({}, state, { debugTools: true }, action.payload);
    case DEBUG_TOOLS_UNAVAILABLE:
      return Object.assign({}, state, { debugTools: false }, action.payload);
    default:
      return state;
  }
};

export {
  LOGON_AVAILABLE,
  LOGON_UNAVAILABLE,
  DEBUG_TOOLS_AVAILABLE,
  DEBUG_TOOLS_UNAVAILABLE
};
