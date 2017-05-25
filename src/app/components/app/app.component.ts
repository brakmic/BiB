import './app.loader';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService, SessionService } from 'app/services';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { MediaActions } from 'app/actions';
import * as _ from 'lodash';

const domready = require('domready');
// const normalize = 'app/assets/styles/normalize.css';
const normalize = '';
const style = './app.component.scss';

@Component({
  selector: 'bib-root',
  templateUrl: './app.component.html',
  styleUrls: [normalize, style],
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent {
  private sessionSubscription: Subscription;
  /**
   * App constructor
   * @param {Router}         private router     Default router
   * @param {ActivatedRoute} private route      Current route
   * @param {LogService}     private logService Logging service
   * @param {SessionService} private sessionService Session service
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private logService: LogService,
              private sessionService: SessionService,
              private mediaActions: MediaActions) {
  }

  public ngOnInit() {
    // this.mediaActions.mediaInit();
  }

  public ngOnDestroy() {
    this.destroySubscriptions();
  }

  public ngAfterViewInit() {
    this.initSubscriptions();
    this.blockBrowserMenu();
  }
  public ngOnChanges(changes: any) {
  }
  private blockBrowserMenu() {
    domready(() => {
      $('body').contextmenu(function (e) {
        return (e.target.nodeName === 'td');
      });
    });
  }
  private initSubscriptions() {
    domready(() => {
      this.sessionSubscription = this.sessionService.getSessionStatus().subscribe(state => {
        if (_.isNil(state) ||
          _.isNil(state.User)) {
          try {
            this.router.navigate(['logon']);
          } catch (error) {
            this.logService.logJson(error, 'App');
          }
        }
      });
    });
  }

  private destroySubscriptions() {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
  }

}
