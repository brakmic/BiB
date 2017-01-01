import { provideStore } from '@ngrx/store';
import { IAppState } from 'app/interfaces';
import * as _ from 'lodash';

// Reducers
import { appReducer, i18nReducer,
         sessionReducer, statsReducer } from 'app/reducers';

// Define App-Store
const appStore = provideStore({
                    app: appReducer,
                    i18n: i18nReducer,
                    session: sessionReducer,
                    stats: statsReducer
                  },
                  {
                    app: undefined,
                    i18n: undefined,
                    session: undefined,
                    stats: undefined
                  });

export {
  appStore
};
