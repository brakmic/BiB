/**
 * Provides configuration services.
 * @type {Injectable}
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IConfig } from 'app/interfaces';
import { LogService } from '../log';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class ConfigService {
  private config: Observable<IConfig>;
  /**
   * Creates an instance of ConfigService.
   * 
   * @param {LogService} logService
   */
  constructor(private logService: LogService) {
    this.config = Observable.fromPromise(Promise.resolve(this.readConfig()));
  }
  /**
   * Returns a Config observable stream 
   * 
   * @returns {Observable<IConfig>}
   */
  public getConfig(): Observable<IConfig> {
      return this.config;
  }
  private readConfig(): JQueryPromise<any> {
    return $.getJSON('config.json').then(config => { return config; });
  }
  /**
   * onError handler method 
   * 
   * @private
   * @param {Response} error
   * @returns
   */
  private onError(error: Response) {
    return Observable.throw('[CONFIG-SERVICE ERROR] ' + error.json() || 'Internal server error');
  }
}
