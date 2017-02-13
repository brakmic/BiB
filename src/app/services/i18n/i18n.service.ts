import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { TranslateService } from 'ng2-translate/ng2-translate';
import 'rxjs/add/operator/take';
// Configuration
import { ConfigService } from '../config';
// Logging
import { LogService } from '../log';
import { ILanguage, ILanguageState,
         IAppState, IConfig } from 'app/interfaces';

// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { i18nReducer, I18N_ACTIONS } from 'app/reducers';

const datatablesDE = require('../../../assets/i18n/datatables.de.json');
const datatablesEN = require('../../../assets/i18n/datatables.en.json');
const datatablesFR = require('../../../assets/i18n/datatables.fr.json');
const datatablesIT = require('../../../assets/i18n/datatables.it.json');
const datatablesRU = require('../../../assets/i18n/datatables.ru.json');
const datatablesTR = require('../../../assets/i18n/datatables.tr.json');

const datatablesLanguagefiles = [
  { lang: 'de', file: datatablesDE },
  { lang: 'en', file: datatablesEN },
  { lang: 'fr', file: datatablesFR },
  { lang: 'it', file: datatablesIT },
  { lang: 'ru', file: datatablesRU },
  { lang: 'tr', file: datatablesTR },
];

@Injectable()
export class i18nService {

  // default languages
  public static SUPPORTED_LANGUAGES: ILanguage[] = [
    { code: 'en-US', language: 'en', title: 'English'  },
    { code: 'en-GB', language: 'en', title: 'English'  },
    { code: 'de-DE', language: 'de', title: 'Deutsch'  },
    { code: 'fr-FR', language: 'fr', title: 'Français'  },
    { code: 'it-IT', language: 'it', title: 'Italiano'  },
    { code: 'ru-RU', language: 'ru', title: 'русский'  },
    { code: 'tr-TR', language: 'tr', title: 'Türk'  },
  ];

  constructor(private translate: TranslateService,
              private store: Store<IAppState>,
              private config: ConfigService,
              private logService: LogService) {

    this.config.getConfig().subscribe((cfg: IConfig) => this.initialize(cfg.language));
  }
  /**
   * Immediately translate the given key
   *
   * @param {string} key
   * @returns {string}
   */
  public instant(key: string): string {
    return this.translate.instant(key);
  }
  /**
   * Switch language
   *
   * @param {string} code
   */
  public changeLang(code: string) {
    if (_.includes(_.map(i18nService.SUPPORTED_LANGUAGES, 'code'), code)) {
      this.store.dispatch({ type: I18N_ACTIONS.LANG_CHANGED, payload: { code } });
    }
  }

  public getCurrentLang(): string {
    return this.translate.currentLang;
  }

  public getDataTablesLangObject() {
     const found = _.find(datatablesLanguagefiles, dtf => {
          let userLang = this.translate.currentLang.split('-')[0];
          return dtf.lang == userLang;
     });
     if (found) {
       return found.file;
     }
     return datatablesLanguagefiles['en'];
  }

  private initialize(defaultLang: string) {
    // fallback
    this.translate.setDefaultLang(defaultLang);

    // use browser language info
    let userLang = window.navigator.language.split('-')[0];
    let userLangCode = window.navigator.language;
    // subscribe to language-change stream
    this.store.select(store => store.i18n).subscribe((state: ILanguageState) => {
      if (_.isNil(state))return;
      // trigger refresh of translation-pipes throughout the document structure
      if (this.translate.getLangs() && (this.translate.getLangs().indexOf(state.code) > -1)) {
        this.translate.use(state.code);
      } else {
        this.translate.reloadLang(state.code).take(1).subscribe(() => {
          setTimeout(() => this.translate.use(state.code), 0);
        });
      }
    });

    // trigger default init
    this.changeLang(userLangCode);
  }
}
