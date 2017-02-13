import { Component,
        ElementRef, Input, Output,
        ChangeDetectionStrategy,
        ChangeDetectorRef,
        EventEmitter } from '@angular/core';
import { LogService,
         i18nService } from 'app/services';
import { IMenuEntry, IAppState,
         ILanguageState, IWindowEx } from 'app/interfaces';
// Enums
import { MenuType } from 'app/enums';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
const domready = require('domready');

@Component({
  selector: 'bib-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarMenuComponent {
  @Input() public menus: Array<IMenuEntry> = [];
  @Output() public menuSelected = new EventEmitter(true);
  private menuState: Observable<IMenuEntry>;
  private menuSubscription: Subscription;
  private i18nState: Observable<ILanguageState>;
  private i18nSubscription: Subscription;

  /**
   * Creates a Sidebar menu.
   * 
   * @param {Store<IAppState>} store
   * @param {LogService} logService
   * @param {i18nService} i18nService
   * @param {WindowService} windowService
   * @param {ChangeDetectorRef} cd
   */
  constructor(private store: Store<IAppState>,
              private logService: LogService,
              private translate: i18nService,
              private cd: ChangeDetectorRef) {
  }
  public ngOnInit() {
    this.initSubscriptions();
  }
  public ngOnDestroy() {
    this.destroySubscriptions();
  }
  /**
   * Decides if an update of the menu-list should be done.
   * @param {any} [changes] Object containing the latest changes
   */
  public ngOnChanges(changes: any) {
    if (!_.isEqual(changes.menus.currentValue, changes.menus.previousValue)) {
        this.cd.markForCheck();
    }
  }
  /**
   * Defines hooks for Hammer.js for reacting to user gestures (tap, click etc.)
   */
  public ngAfterViewInit() {
      const self = this;
      $('.navbar-nav li').click(function(){
        const a = $(this).children('a')[0];
        const attrib = a.attributes[3];
        if (attrib) {
          const href = _.split(attrib.textContent, '=')[0];
          self.selectMenu(this, href);
          $(this).addClass('isActive').siblings().removeClass('isActive');
          if(!$(this).hasClass('nochange')){
            $('#settings-submenu').removeClass('in');
          }
        }
      });
      this.cd.markForCheck();
  }
  /**
   * Emits a selected-menu event
   * @param {any}    [sender] Event originator
   * @param {string} [name]   Menu name
   */
  private selectMenu(sender: any, name: string) {
    this.menuSelected.emit({
      sender: sender,
      name: _.trim(name)
    });
  }

  private initSubscriptions(): void {
    this.i18nState = this.store.select(store => store.i18n);
    this.i18nSubscription = this.i18nState.subscribe((state: ILanguageState) => {
    });
  }

  private destroySubscriptions() {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
    if (this.i18nSubscription) {
      this.i18nSubscription.unsubscribe();
    }
  }
}
