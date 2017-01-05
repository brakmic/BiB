// Default Angular Classes
import { Component, Output,
         EventEmitter, OpaqueToken,
         ChangeDetectionStrategy, ChangeDetectorRef,
         NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LogonService, LogService,
         i18nService, ConfigService,
         ToastService } from 'app/services';
import { ActionStatus } from 'app/enums';
import { FormBuilder, Validators, FormGroup,
         FormControl } from '@angular/forms';
import { Http, Headers } from '@angular/http';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';

import { I18N_ACTIONS, DEBUG_TOOLS_AVAILABLE,
         DEBUG_TOOLS_UNAVAILABLE,
         LOGON_FAILED, LOGON_SUCCEEDED,
         LOGOUT_FAILED, SESSION_RESET,
         LOGON_AVAILABLE, LOGON_UNAVAILABLE } from 'app/reducers';

// Helpers
import { Bib } from 'app/helpers';
// IUserData
import { IAppState, IUserGroup, IUserSettings,
         ISession, IConfig, IWindowEx,
         ICountry, ILocalData, IUser, IDbUser } from 'app/interfaces';
// Theming Support
import { ThemeConfigProvider, ThemeConfig } from 'app/themes/default';
import { ImageLoaderService, ThemePreloader, ThemeSpinner }
                from 'app/themes/default/services';
// Headers
import { contentHeaders } from 'app/components/shared/common';
import * as _ from 'lodash';
// Images
import { bibApi } from 'app/apis';

@Component({
  selector: 'logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogonComponent {
  private logonForm: FormGroup;
  private password: FormControl;
  private username: FormControl;
  private headerImage: any;
  private sessionState: Observable<ISession>;
  private configState: Observable<IConfig>;
  private sessionSubscription: Subscription;
  private configSubscription: Subscription;
  private logonSubscription: Subscription;
  private placeholderUserName = 'USER-ID';
  private placeholderPassword = 'PASSWORD';
  private status = '';
  private appConfig: IConfig;
  private countries: ICountry[] = [];
  private mime = 'data:image/png;base64,';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private store: Store<IAppState>,
              private logonService: LogonService,
              private formBuilder: FormBuilder,
              private cd: ChangeDetectorRef,
              private logService: LogService,
              private translate: i18nService,
              private config: ConfigService,
              private toast: ToastService,
              private ngZone: NgZone) {
  }

  public ngOnInit() {
    this.setFormDefaults();
    this.initSubscriptions();
  }

  public ngOnDestroy() {
    this.destroySubscriptions();
  }

  public ngAfterViewInit() {
  }

  public ngOnChanges(changes: any) {
  }
  
  public logon() {
    const pwdHash = Bib.generateHash(this.logonForm.controls['password'].value);
    const b64Encoded = Bib.toBase64String(pwdHash);
    this.logonSubscription = this.logonService.doLogon(this.logonForm.controls['username'].value,
                                                            b64Encoded, contentHeaders)
                                                                                .subscribe(
      userData => {
        if (!_.has(userData, 'error')) {
              this.persistSessionData(userData);
           } else {
             this.toast.show(this.translate.instant('AccessDenied'), this.translate.instant('Error'), ActionStatus.Failure);
             
           }
      },
      error => {
        this.logService.logJson(error, 'Logon');
        this.router.navigate(['access-denied'], { skipLocationChange: true,
                                                  replaceUrl: false });
      }
    );
  }
  public signup(event) {
    event.preventDefault();
    this.router.navigate(['signup']);
  }

  private persistSessionData(userData: IDbUser) {

      localStorage.setItem(this.appConfig.bib_localstorage, JSON.stringify(<ILocalData>{
        user: userData.AccountName,
        userID: userData.ID,
        userAclID: userData.ACL_ID,
        hash: userData.Password,
        groupID: userData.Group_ID,
        logonDate: new Date().toString(),
        language: this.translate.getCurrentLang(),
        isActive: userData.IsActive == 1 ? true : false
      }));
      this.store.dispatch({ type: LOGON_AVAILABLE });
      this.store.dispatch({ type: LOGON_SUCCEEDED, payload: <ISession>{ User: userData } });
      this.router.navigate(['']);
  }

  private initSubscriptions() {
    const self = this;
    this.config.getConfig().subscribe(config => {
      this.appConfig = config;
      this.countries = config.countries;
      this.cleanup();
      this.logonForm.controls['username'].setValue(this.appConfig.logon.username);
      this.logonForm.controls['password'].setValue(this.appConfig.logon.password);
      $('#select-language').select2({
        allowClear: false,
        minimumResultsForSearch: Infinity,
        templateSelection: (object: Select2SelectionObject) => {
                            const isoAlpha2 = _.trim(object.text);
                            const country = _.find(this.countries, c => {
                              return c.isoAlpha2 == isoAlpha2;
                            });
                            
                            self.translate.changeLang(country.language);
                            return country.isoAlpha2;    
                        },
        templateResult: (object: Select2SelectionObject) => {
           if(!object.id) return object.text;
           const isoAlpha2 = _.trim(object.text);
           const country = _.find(this.countries, c => {
             return c.isoAlpha2 == isoAlpha2;
           });
           const tmpl = $(`<img src="data:image/png;base64,${country.flag}" style="width:30px;height:20px;">`);
           return tmpl;
        }
      });
      this.cd.markForCheck();
    });
    this.sessionState = this.store.select(store => store.session);
    this.sessionSubscription = this.sessionState.subscribe(session => {
    });
    this.configSubscription = this.config.getConfig().subscribe((config: IConfig) => {
      if (!_.isNil(config)) {
        this.store.dispatch({ type: I18N_ACTIONS.LANG_CHANGED,
                              payload: { code: config.language } });
        if (config.insertLogonData) {
          this.logonForm.patchValue({ 'username' : config.logon.username,
                                      'password': config.logon.password
                                    });
        }
      }
    });
  }

  private destroySubscriptions() {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
    if (this.logonSubscription) {
      this.logonSubscription.unsubscribe();
    }
  }

  private setFormDefaults() {
    this.config.getConfig().subscribe(config => {
       this.headerImage = config.bib_logon_mask_logo;
       this.cd.markForCheck();
    });
    this.logonForm = this.formBuilder.group({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  private cleanup() {
    localStorage.removeItem(this.appConfig.bib_localstorage);
  }

  private onInputChanged($event: any) {
    this.status = "";
  }

  private onSelectChanged(value: any) {
    
  }
}
