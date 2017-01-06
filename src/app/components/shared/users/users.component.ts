import { Component, OnInit,
         ChangeDetectorRef, ChangeDetectionStrategy,
         Input, Output, SimpleChanges, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
// Routing
import { ActivatedRoute, Route,
         Router } from '@angular/router';
import { bibApi } from 'app/apis';
import { IUser, IUserDisplay,
         IUserGroup, IUserSettings,
         IAcl, IComponentData,
         IAppState } from 'app/interfaces';
import { ManageUserComponent } from 'app/components';
import { AclComponent } from 'app/components/shared/common/partials';
import { ActionType, ComponentType } from 'app/enums';
import { authorized } from 'app/decorators';
import { LogService, i18nService } from 'app/services';
// State Management with Redux
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { ACL_UPDATED, ACL_CHANGED } from 'app/reducers';
import * as _ from 'lodash';
const domready = require('domready');
const cuid = require('cuid');

@Component({
    selector: 'bib-users',
    styleUrls: ['./users.component.scss'],
    templateUrl: './users.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
    @Input() public users: IUser[] = [];
    
    private userTable: DataTables.DataTable;
    private dynamicComponent: IComponentData = null;
    private confirmDeletionText: string;
    private userAcl: any[] = [];
    private groupAcl: any[] = [];
    private aclTypeUser: string = undefined;
    private aclTypeGroup: string = undefined;
    private userAclColumns: any[] = [];
    private groupAclColums: any[] = [];
    private aclObservable: Observable<IAcl>;
    private aclSubscription: Subscription;
    private selectedUser: IUser = undefined;

    constructor(private cd: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                private logService: LogService,
                private router: Router,
                private route: ActivatedRoute,
                private translation: i18nService,
                private ngZone: NgZone,
                private store: Store<IAppState>) { }

    public ngOnInit() {
        this.route.data.forEach((data: { users: IUser[] }) => {
            this.users = _.slice(data.users);
            this.updateTable();
        });
        this.confirmDeletionText = this.translation.instant('ConfirmDeletionUser');
        this.initSubscriptions();
    }
    public ngOnChanges(changes: SimpleChanges) {
    }
    public ngOnDestroy() {
       $('bib-root').siblings().remove();
       $('#select-group').remove();
       this.destroySubscriptions();
    }
    public ngAfterViewInit() {
        this.initWidgets();
        this.initContextMenu();
        this.cd.markForCheck();
    }
    private initSubscriptions() {
       this.aclObservable = this.store.select(store => store.acl);
       this.aclSubscription = this.aclObservable.subscribe(acl => {
           if (this.selectedUser) {
               this.refreshUserAcls(this.selectedUser.ID);
           }
       });
    }
    private destroySubscriptions() {
        if (this.aclSubscription) {
            this.aclSubscription.unsubscribe();
        }
    }
    private updateTable() {
        if (!_.isNil(this.userTable)) {
            this.userTable.clear();
            this.userTable.rows.add(this.users);
            this.userTable.draw();
            this.cd.markForCheck();
        }
    }
    
    private initWidgets() {
        const self = this;
        domready(() => {
                this.userTable= $('#user').DataTable(<DataTables.Settings>{
                processing: true,
                data: this.users,
                searching: true,
                select: true,
                language: this.translation.getDataTablesLangObject(),
                columns:  [
                    { data : 'ID' },
                    { data : 'AccountName' },
                    { data : 'FirstName' },
                    { data : 'LastName' },
                    { data : 'Password' },
                    { data : 'IsActive' },
                    { data : 'Group' },
                ],
                columnDefs: [
                    {
                        data: 'Group',
                        render: function (data, type, full, meta) {
                            return data ? data.Name : '';
                        },
                        targets: 6
                    },
                    {
                        render: function (data, type, full, meta ) {
                            return _.truncate(data,{
                                length: 10,
                                separator: ' ',
                                omission: ' [...]'
                            });
                        },
                        targets: 4
                     },
                    ]
                });
                this.userTable.on('select', (e: Event, dt: DataTables.DataTable,
                                                type: string, indexes: number[]) => {
                    self.selectedUser = dt.rows(indexes[0]).data()['0'];
                    self.refreshUserAcls(self.selectedUser.ID); 
                });
            this.cd.markForCheck();
        });
    }
    private refreshUserAcls(id: number) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.getUsers().then(users => {
                this.ngZone.run(() => {
                    this.users = _.slice(users);
                    this.showAcls(id);
                });
            });
        });
    }
    private initContextMenu() {
        const self = this;
        domready(() => {
                $('#user').children('tbody').contextMenu({
                selector: 'tr',
                build: function($trigger, e) {
                    return {
                        className: 'data-title',
                        autoHide: true,
                        callback: function(key, options) {            
                            switch(key) {
                            case 'adduser':
                            {
                                const data: IComponentData = {
                                    component: ManageUserComponent,
                                    inputs: {
                                        action: ActionType.AddUser,
                                        userID: -1
                                    },
                                    type: ComponentType.AddUser
                                };
                                self.dynamicComponent = data;
                                self.cd.markForCheck();
                                
                            }
                            break;
                            case 'removeuser':
                            {
                                let userID;
                                let userName;
                                const data = $(this).children('td');
                                const elem = _.find(data, d => { return $(d).hasClass('sorting_1'); });
                                if(!_.isNil(elem)){
                                    userID = Number(elem.textContent);
                                    userName = elem.nextSibling.textContent;
                                } else {
                                    return;
                                }
                                $.confirm({
                                    text: `${self.confirmDeletionText} : "${userName}"`,
                                    title: self.translation.instant("UserRemove"),
                                    confirm: () => {
                                        self.removeUser(userID);
                                    },
                                    cancel: () => {
                                        
                                    },
                                });
                            }
                            break;
                            case 'modifyuser': {
                                const data = $(this).children('td');
                                const el = _.find(data, d => { return $(d).hasClass('sorting_1'); });
                                if (!_.isNil(el)) {
                                    const userID = Number(el.textContent);
                                    const data: IComponentData = {
                                        component: ManageUserComponent,
                                        inputs: {
                                            userID: userID,
                                            action: ActionType.ModifyUser
                                        },
                                        type: ComponentType.ModifyUser
                                    };
                                    self.dynamicComponent = data;
                                    self.cd.markForCheck();
                                }
                            }
                            break;
                            default:
                                break;
                            }
                        },
                        items: {
                            'adduser': {
                                name: self.translation.instant('UserAdd'),
                                icon: 'fa-plus-circle',
                            },
                            'modifyuser': {
                                name: self.translation.instant('UserModify'),
                                icon: 'fa-user-md',
                            },
                            'removeuser': {
                                name: self.translation.instant('UserRemove'),
                                icon: 'fa-remove',
                            }
                        }
                    }
                },
                
            });
            self.cd.markForCheck();
        });
    }
    private showAcls(userID: number) {
        const user = _.find(this.users, user => {
            return user.ID == userID;
        });
        this.userAcl = [];
        this.groupAcl = [];
        const _user: any[] = [];
        const _group: any[] = [];
        if (!_.isNil(user.Acl) &&
            _.keys(user.Acl).length > 0){
            const info_header_user = `${this.translation.instant('AclTypeUser')} - ${user.AccountName}`; 
            this.aclTypeUser = info_header_user;            
            this.userAcl.push({ ... _.clone(user.Acl) });
        }
        if (!_.isNil(user.Group) &&
            _.keys(user.Group.Acl).length > 0) {
            const info_header_group = `${this.translation.instant('AclTypeGroup')} - ${user.Group.Name}`;
            this.aclTypeGroup = info_header_group;
            this.groupAcl.push({ ..._.clone(user.Group.Acl) });
        }
        this.cd.markForCheck();
    }
    @authorized()
    private removeUser(userID: number) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.removeUser(userID).then(res => {
                this.ngZone.run(() => {
                    this.users = _.filter(this.users,(e) => {
                                    return e.ID != userID;
                                });
                    this.updateTable();  
                });
            }).catch(err => this.logService.logJson(err, 'User'));
        });
    }
    private onDynamicEvent($event: { data: IUser,
                                     action: ActionType }) {
        if ($event.action == ActionType.ModifyUser) {
            bibApi.updateUser($event.data).then(res => {
                bibApi.getUsers().then(users => {
                    this.users = _.slice(users);
                    this.updateTable();
                });
            }).catch(err => {
                this.logService.logJson(err, 'User');
                this.cd.markForCheck();
            });
        } else {
            bibApi.insertUser($event.data).then(res => {
                bibApi.getUsers().then(users => {
                    this.users = _.slice(users);
                    this.updateTable();
                });
            }).catch(err => {
                this.logService.logJson(err, 'User');
                this.cd.markForCheck();
            });
        }
    }
}
