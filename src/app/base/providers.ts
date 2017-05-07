import { IConfig } from 'app/interfaces';
import config from 'config.json';

import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, Request, RequestOptionsArgs,
         Response, XHRBackend, RequestOptions,
         ConnectionBackend, Headers } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { ENV_PROVIDERS } from 'platform/environment';
/*
 * Platform and Environment providers/directives/pipes
 */
import { APP_RESOLVER_PROVIDERS } from './resolvers';

// Redux Store
// import { appStore } from 'app/stores';

import { IntegralStateType } from 'app/types';

import { TranslateModule,
         TranslateLoader,
         TranslateStaticLoader,
         MissingTranslationHandler } from 'ng2-translate/ng2-translate';

import { ADV_VALIDATORS } from 'app/helpers';

import { BibMissingTranslationHandler } from 'app/handlers';

import { APP_ROUTES, PreloadSelectedModulesStrategy } from './routes';

import { AUTH_PROVIDERS } from 'app/components/shared';


import { RouteActions } from '../actions';
import { RouteEffects } from '../effects';

import {
  AppState, ConfigService,
  LogonService, LogService,
  i18nService, LocalStorageService,
  HttpEx,
  SessionService,
  StatsService,
  UploadService,
  ToastService
} from 'app/services';

import { TranslationProvider } from 'app/providers';


export function _window(): any {
   // return the global native browser window object
   return window;
}

export function _console(): any {
  return console;
}

const BROWSER_PROVIDERS = [
  // { provide: WindowService, useValue: window },
  // { provide: ConsoleService, useValue: console }
];

let EXTRA_PROVIDERS = [];

if (config.useHttpExService) {
  EXTRA_PROVIDERS.push(
      { provide: Http,
        useFactory: function(xhrBackend: XHRBackend,
                     requestOptions: RequestOptions,
                     logService: LogService) {
               return new HttpEx(xhrBackend, requestOptions, logService)
        },
        deps: [XHRBackend, RequestOptions, LogService]
      }
  );
}

EXTRA_PROVIDERS.push(
    {
      provide: MissingTranslationHandler,
      useClass: BibMissingTranslationHandler
    }
  );

const TRANSLATION_SERVICES = [
  i18nService
];

// Application wide providers
const BIB_SERVICES = [
  AppState,
  ConfigService,
  LogonService,
  LogService,
  // ConsoleService,
  // ...BROWSER_PROVIDERS,
  // ...EXTRA_PROVIDERS,
  ...TRANSLATION_SERVICES,
  SessionService,
  StatsService,
  UploadService,
  ToastService
];

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  ...BIB_SERVICES,
  // ...AUTH_PROVIDERS,
  ...ADV_VALIDATORS,
  // appStore,
  PreloadSelectedModulesStrategy
];

const BIB_DIRECTIVES = [
];

const BIB_ACTIONS = [
  RouteActions
];

const BIB_EFFECTS = [
  RouteEffects
];


const APP_DECLARATIONS = [
  ...BIB_DIRECTIVES
];

const ENV_MODULES = [
    HttpModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES,
                            {
                              useHash: config.useHashRouting,
                              enableTracing: config.traceRoutes,
                              // errorHandler: error => console.log(`[ROUTER ERROR] : ${error}`),
                              preloadingStrategy: PreloadAllModules
                            })
];

export function translateLoaderFactory(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

const VENDOR_MODULES = [
  TranslateModule.forRoot({
              // provide: TranslateLoader,
              // useClass: TranslationProvider
              provide: TranslateLoader, deps: [Http],
              useFactory: translateLoaderFactory
  })
];

export {
    ENV_PROVIDERS,
    ENV_MODULES,
    VENDOR_MODULES,
    APP_PROVIDERS,
    BIB_DIRECTIVES,
    BIB_ACTIONS,
    BIB_EFFECTS,
    APP_DECLARATIONS
};
