/**
 * Media management service.
 * @type {Injectable}
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IMedium, IMediumDisplay,
         IAppState } from 'app/interfaces';
import { ConfigService } from '../config';
import { LogService } from '../log';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { MediaEffects } from 'app/effects';
import { extractMedia } from 'app/stores';
import { bibApi } from 'app/apis';


@Injectable()
export class MediaService {

    private media: IMediumDisplay[] = [];
    private mediaInitialized: Subscription;
    private mediaUpdated: Subscription;
    private mediaInserted: Subscription;
    private mediaRemoved: Subscription;
    private mediaRetrieved: Subscription;

    constructor(private log: LogService,
                private mediaEffects: MediaEffects) {
                    this.initSubscriptions();
                }

    public getMedia() {
        return Promise.resolve(this.media);
    }

    private initSubscriptions() {
      this.mediaInitialized =  this.mediaEffects.mediaInitialized$.subscribe(action => {
            if (!_.isNil(action) &&
                !_.isNil(action.payload)) {
                    this.log.logEx(`Media initialized`, 'MediaService');
                    this.convert(action.payload as IMedium[]);
                }
       });
       this.mediaRetrieved = this.mediaEffects.mediaRemoved$.subscribe(action => {
            if (!_.isNil(action) &&
                !_.isNil(action.payload)) {
                    this.log.logEx(`Media retrieved`, 'MediaService');
                    this.convert(action.payload as IMedium[]);
            }
       });
    }

    private destroySubscriptions() {
        if (!_.isNil(this.mediaInitialized)) {
            this.mediaInitialized.unsubscribe();
        }
    }

    private convert(media: IMedium[]) {
       let mapped = _.map(media, m => {
            return bibApi.prepareMediumForDisplay(m);
       });
       Promise.all(mapped).then(allMedia => {
           this.media = _.slice(allMedia);
       });
    }

}
