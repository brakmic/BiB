// Router Provider
import { Routes, RouterModule,
         Route, PreloadingStrategy } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

const logon  = () => System.import('app/components/shared/access/logon');
const accessDenied = () => System.import('app/components/shared/access/access-denied');
const main = () => System.import('app/components/main');
import * as bows from 'platform/helpers/bows-alt';
const logger = bows('Preload');

export class PreloadSelectedModulesStrategy implements PreloadingStrategy {
  private loadParam: Function;
  private routeParam: Route;
  public preload(route: Route, load: Function): Observable<any> {
    this.routeParam = route;
    this.loadParam = load;
    return ((<any>route.data) && (<any>route.data).preload) ? this._load() : Observable.of(null);
  }
  private _load(): Observable<any> {
    if (this.routeParam && this.loadParam) {
      const mod = !_.isEmpty(this.routeParam.path) ? this.routeParam.path.toUpperCase() : 'BIB';
      logger.log(`${mod}`);
      return this.loadParam();
    }
    return Observable.of(null);
  }
}

export const APP_ROUTES: Routes = [
  {
    path: 'access-denied',
    loadChildren: accessDenied,
    data: {
      preload: true
    }
  },
  {
    path: 'logon',
    loadChildren: logon
  },
  {
    path: '',
    loadChildren: main,
    data: {
      preload: true
    }
  }
];
