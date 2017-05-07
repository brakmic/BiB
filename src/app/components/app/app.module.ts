import { NgModule, ApplicationRef,
         NO_ERRORS_SCHEMA,
         CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { AppState, LogService } from 'app/services';
import { StoreType } from 'app/types';
import { AppComponent } from './app.component';

// State management
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppReducer } from '../../stores';
import { RouteEffects } from '../../effects';

import { ENV_MODULES,
         VENDOR_MODULES, APP_DECLARATIONS,
         ENV_PROVIDERS, APP_PROVIDERS,
         BIB_ACTIONS, BIB_EFFECTS,
         PreloadSelectedModulesStrategy } from 'app/base';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ], // declare Main component
  providers: [      // provide Services to Angular's Dependency Injection mechanism
    ENV_PROVIDERS,
    APP_PROVIDERS,
    BIB_ACTIONS,
    BIB_EFFECTS
  ],
  imports: [          // import Angular's & own modules
    ENV_MODULES,
    VENDOR_MODULES,
    StoreModule.provideStore(AppReducer),
    EffectsModule.run(RouteEffects),
  ],
  declarations: [     // load all available components & directives
    AppComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef,
              public appState: AppState,
              public logService: LogService) {}
  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    this.logService.logEx(`HMR Store: ${JSON.stringify(store, null, 2)}`, 'AppModule');
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }
  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    const state = this.appState._state;
    store.state = state;
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
