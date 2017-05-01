import { ActionReducer, Action } from '@ngrx/store';

const ACL_UPDATED = 'ACL_UPDATED';
const ACL_CHANGED = 'ACL_CHANGED';

const initialState: any = {};

export function aclReducer(state: any = initialState, action: Action) {
  switch (action.type) {
    case ACL_UPDATED:
      return Object.assign({}, state, { acl: action.payload });
    // case ACL_CHANGED:
    //   return Object.assign({}, state, { acl: action.payload });
    default:
      return state;
  }
}

export {
  ACL_UPDATED,
  ACL_CHANGED
};
