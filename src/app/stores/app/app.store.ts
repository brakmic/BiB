import { provideStore } from '@ngrx/store';
import { IAppState } from 'app/interfaces';
import * as _ from 'lodash';

// Reducers
import { appReducer, i18nReducer,
         sessionReducer, statsReducer,
         aclReducer } from 'app/reducers';

// Define App-Store
const appStore = provideStore({
                    app: appReducer,
                    i18n: i18nReducer,
                    session: sessionReducer,
                    stats: statsReducer,
                    acl: aclReducer
                  },
                  {
                    app: undefined,
                    i18n: undefined,
                    session: undefined,
                    stats: undefined,
                    acl: undefined
                  });

export {
  appStore
};
