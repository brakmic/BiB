import { ActionReducer, Action } from '@ngrx/store';

const ACL_UPDATED = 'ACL_UPDATED';
const ACL_CHANGED = 'ACL_CHANGED';

const initialState: any = {};

const aclReducer: ActionReducer<any> = (state: any =
                                                    initialState, action: Action) => {
  switch (action.type) {
    case ACL_UPDATED:
      return Object.assign({}, action.payload);
    case ACL_CHANGED:
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};

export {
  ACL_UPDATED,
  ACL_CHANGED,
  aclReducer
};
