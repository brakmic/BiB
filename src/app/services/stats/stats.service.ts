import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IStats } from 'app/interfaces';
import { bibApi } from 'app/apis';
import { LogService } from '../log';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class StatsService {
    
    constructor(private logService: LogService) { 

    }

    public getStats(): Observable<IStats> {
        return Observable.from([]);
    }

}