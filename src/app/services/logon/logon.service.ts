/**
 * Provides logon / authorization services.
 * @type {Injectable}
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IUser, IConfig,
         IUserGroup, IUserSettings,
         IAcl, IDbUser } from 'app/interfaces';
import { logonApi, bibApi } from 'app/apis';
import { ConfigService } from '../config';
import { LogService } from '../log';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
const _url = 'http://localhost:10000/login';

@Injectable()
export class LogonService {
  private url: string;
  private config: Observable<IConfig>;
  private configSubscription: Subscription;
  /**
   * Creates an instance of LogonService.
   * 
   * @param {Http} http
   * @param {ConfigService} configService
   * @param {LogService} logService
   */
  constructor(private http: Http,
              private configService: ConfigService,
              private logService: LogService) {
    this.url = _url;
    this.initSubscriptions();
  }
  public doLogon(userName: number, passwordHash: string,
                  headers: any = undefined): Observable<IDbUser> {
    const data = {
      'AccountName': userName,
      'Password': passwordHash
    };
    return this.http.post(this.url, JSON.stringify(data), {headers: headers})
      .map((response: Response) => response.json())
      .catch(this.onError);
  }

  private onError(error: Response) {
    let _error = {
      error: {}
    };
    try {
      const message = error.json();
      _error.error = message;
    } catch (error) {
      _error.error =  `Internal Server Error`;
    }
    return Observable.of<any>(_error);
  }

  private initSubscriptions() {
    this.config = this.configService.getConfig();
    this.configSubscription = this.config.subscribe(config => {
      this.url = `${config.protocol}://${config.server}/${config.logonUrlPath}`;
    });
  }

  private destroySubscriptions() {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
}
