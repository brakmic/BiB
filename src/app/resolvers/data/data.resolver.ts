import { Resolve, ActivatedRouteSnapshot,
         RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';
import { bibApi } from 'app/apis';

@Injectable()
export class DataResolver implements Resolve<any> {
  constructor(private router: Router) {

  }
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url = _.trim(state.url, ' /');
    switch (url) {
      case 'media':
        return Observable.fromPromise(bibApi.getMediaForDisplay());
      case 'readers':
        return Observable.fromPromise(bibApi.getReaders());
      case 'status':
        return Observable.fromPromise(bibApi.getReaders());
      case 'borrows':
        return Observable.fromPromise(bibApi.getBorrowsForDisplay());
      case 'users':
        return Observable.fromPromise(bibApi.getUsers());
      case 'database':
        return Observable.fromPromise(Promise.all([
          bibApi.getUsers(),
          bibApi.getMedia()
        ]));
      default:
        return Observable.of([]);
    }
  }
}
