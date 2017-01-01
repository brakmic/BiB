import * as _ from 'lodash';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { ILanguageState } from 'app/interfaces';

/**
 * Use en-US as fallback
 */
const initialState: ILanguageState = {
  code: 'de-DE'
};

const CATEGORY: string = 'i18n';

export const I18N_ACTIONS: any = {
  LANG_CHANGED: `[${CATEGORY}] LANG_CHANGED`
};
/**
 * Language reducer
 */
export const i18nReducer: ActionReducer<ILanguageState> = (state: ILanguageState =
                                                                initialState, action: Action) => {
  switch (action.type) {
    case I18N_ACTIONS.LANG_CHANGED:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
