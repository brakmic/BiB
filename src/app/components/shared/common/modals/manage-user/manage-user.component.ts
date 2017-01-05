import {Component, ViewContainerRef,
        ViewChild, ReflectiveInjector,
        ComponentFactoryResolver, OnInit,
        ChangeDetectorRef, ChangeDetectionStrategy,
        Input, Output, EventEmitter, Injector,
        SimpleChanges } from '@angular/core';  
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import * as _ from 'lodash';
import { LogService, i18nService } from 'app/services';
import { IUser, IUserGroup, IAcl } from 'app/interfaces'; 
import { ActionType, ComponentType } from 'app/enums';
import { authorized } from 'app/decorators';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

import { Subject } from 'rxjs/Subject';
import { bibApi } from 'app/apis';
import { Bib } from 'app/helpers';
const domready = require('domready');

@Component({
    selector: 'bib-modal-manage-user',
    styleUrls: [
        './manage-user.component.scss'
        ],
    templateUrl: './manage-user.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageUserComponent implements OnInit {
    @Input() public user: IUser;
    @Input() public groups: IUserGroup[];
    @Input() public userID: number;
    public _event: Subject<any> = new Subject<any>();
    private form: FormGroup;
    private dialog: JQuery;
    private select: JQuery;
    private action: ActionType;
    private title: string;
    private pwdDirty: boolean = false;
    private originalPwd: string;
    private pwdSub: Subscription;
    

    constructor(private formBuilder: FormBuilder,
                private cd: ChangeDetectorRef,
                private logService: LogService,
                private translation: i18nService,
                private injector: Injector) { }

    public ngOnInit() { 
        this.userID = this.injector.get('userID');
        this.action = this.injector.get('action');
        this.initForm();
        this.initUser();
    }
    public ngOnDestroy() {
        this.pwdSub.unsubscribe();
        this.select.off('change');
    }
    public ngAfterViewInit() {
        this.initDialog();
    }
    private initUser() {
        const id = this.userID;
        if (this.action == ActionType.AddUser) {
            this.user = <IUser>{
                ID: 0,
                AccountName: '',
                Acl: undefined,
                FirstName: '',
                LastName: '',
                Group: <IUserGroup>{
                    ID: 1,
                    Name: 'Standard'
                },
                IsActive: true,
                Password: ''
            };
            this.originalPwd = this.user.Password;
        }
        bibApi.getUserGroups().then(groups => {
            this.groups = _.slice(groups);
            if(id > 0) {
                bibApi.getUser(id).then(user => {
                    this.user = _.clone(user);
                    this.originalPwd = this.user.Password;
                    this.updateForm();
                    this.initSelect2();
                    this.pwdSub = this.form.valueChanges.subscribe(data => {
                        this.pwdDirty = !_.isEqual(this.originalPwd, data.password);
                        this.logService.logEx(`Password changed!`, 'ManageUser');
                    });
                });
            } else {
                this.updateForm();
                this.initSelect2();
                this.pwdSub = this.form.valueChanges.subscribe(data => {
                    this.pwdDirty = !_.isEqual(this.originalPwd, data.password);
                    this.logService.logEx(`Password changed!`, 'ManageUser');
                });
            }
            
        });
    }
    private initForm(){
        this.form = this.formBuilder.group({
            id: ['', [Validators.required]],
            group: ['', [Validators.required]],
            userName: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
        this.title = this.action == ActionType.AddUser ? this.translation.instant('UserAdd') :  
                                                         this.translation.instant('UserModify');
    }
    private initSelect2() {
        this.select = $('#select-group').select2(<Select2Options>{
            placeholder: this.translation.instant('Group'),
            allowClear: true,
            minimumResultsForSearch: Infinity
        });
        this.select.on('change', (e: Select2JQueryEventObject) => {
            const groupName = this.select.select2('val');
            bibApi.getUserGroupByName(groupName).then(group => {
                this.user.Group = group;
                this.cd.markForCheck();
            });
        });
    }
    private updateForm() {
        this.form.setValue({
            id: this.user.ID,
            group: this.user.Group.Name,
            userName: this.user.AccountName,
            firstName: this.user.FirstName,
            lastName: this.user.LastName,
            password: this.user.Password
        });
        this.cd.markForCheck();
    }
    private initDialog() {
        const self = this;
        domready(() => {
            this.dialog = $("#manage-user-dialog-form").dialog({
                autoOpen: true,
                height: self.action == ActionType.AddUser ? 450 : 500,
                width: 300,
                modal: true,
                close: () => {
                    self.select.select2('destroy');
                    $('#select-group').remove();
                    self.cd.markForCheck();
                }
             });
           this.cd.markForCheck();
        });
    }
    private onCancelClicked($event) {
        this.form.reset();
        this.dialog.dialog('close');
    }
    private onPasswordFocus($event: any) {
        $('#password').select();
    }
    @authorized()
    private onSubmitUserData({ value, valid }: { value: {
        id: string;
        group: string;
        userName: string;
        firstName: string;
        lastName: string;
        password: string;
    }, valid: boolean }){
        const user: IUser = {
                ID: Number(value.id),
                Group: this.user.Group,
                AccountName: value.userName,
                FirstName: value.firstName,
                LastName: value.lastName,
                IsActive: true,
                Password: this.pwdDirty ? this.getPwdHash(value.password) : value.password,
                Acl: null
            };
        this.form.reset();
        this.dialog.dialog('close');
        this._event.next({
            data: user,
            action: this.action
        });
    }
    private getPwdHash(pwd: string) {
        const pwdHash = Bib.generateHash(pwd);
        return Bib.toBase64String(pwdHash);
    }

}