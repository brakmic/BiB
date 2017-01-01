import {Component, ViewContainerRef,
        ViewChild, ReflectiveInjector,
        ComponentFactoryResolver, OnInit,
        ChangeDetectorRef, ChangeDetectionStrategy,
        Input, Output, EventEmitter, Injector,
        SimpleChanges } from '@angular/core';  
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import * as _ from 'lodash';
import { LogService, i18nService } from 'app/services';
import { IReader } from 'app/interfaces'; 
import { ActionType, ComponentType } from 'app/enums';
import { authorized } from 'app/decorators';
import { Subject } from 'rxjs/Subject';
import { bibApi } from 'app/apis';
const domready = require('domready');

@Component({
    selector: 'bib-modal-manage-reader',
    styles: [`

        .control-buttons {
            margin-top: 1em;
        }

        #manage-reader-dialog-form {
            display: none;
        }

    `],
    template: `
        <div id="manage-reader-dialog-form" [title]="title">
            <form novalidate (ngSubmit)="onSubmitReader(form)" [formGroup]="form">
                        <div class="form-group">
                        <label for="cardid">{{ 'CardID' | translate }}</label>
                        <input type="text" name="cardid"
                                id="cardid" 
                                placeholder=""
                                class="form-control"
                                formControlName="cardID"/>
                        </div>
                        <div class="form-group">
                        <label for="firstname">{{ 'FirstName' | translate }}</label>
                        <input type="text" name="firstname"
                                id="firstname" 
                                placeholder=""
                                class="form-control"
                                formControlName="firstName"/>
                        </div>
                        <div class="form-group">
                        <label for="lastname">{{ 'LastName' | translate }}</label>
                        <input type="text" name="lastname"
                                id="lastname" 
                                placeholder=""
                                class="form-control"
                                formControlName="lastName"/>
                        </div>
                        <div class="form-group">
                        <label for="phone">{{ 'Phone' | translate }}</label>
                        <input type="text" name="phone"
                            id="phone" 
                            placeholder=""
                            class="form-control"
                            formControlName="phone"/>
                        </div>
                        <div class="form-group">
                        <label for="address">{{ 'Address' | translate }}</label>
                        <input type="text" name="address"
                                id="address"
                                placeholder=""
                                class="form-control"
                                formControlName="address"/>
                        </div>
                        <div class="btn-toolbar control-buttons" role="group">
                            <button class="btn btn-default btn-danger" type="button" (click)="onCancelClicked($event)">{{ 'Cancel' | translate }}</button>
                            <button class="btn btn-default btn-success" type="submit" [disabled]="form.invalid">{{ 'OK' | translate }}</button>
                        </div>
                </form>
        </div>
        `,
        changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageReaderComponent implements OnInit {
    @Input() public reader: IReader;
    @Input() public readerID: number;
    public _event: Subject<any> = new Subject<any>();
    private form: FormGroup;
    private dialog: JQuery;
    private title: string;
    private action: ActionType;

    constructor(private formBuilder: FormBuilder,
                private cd: ChangeDetectorRef,
                private logService: LogService,
                private translation: i18nService,
                private injector: Injector) { 
                    this.reader = this.injector.get('reader');
                    this.readerID = this.injector.get('readerID');
                    this.action = this.injector.get('action');
                    this.title = this.action == ActionType.AddReader ? this.translation.instant('ReaderAdd') :  
                                                         this.translation.instant('ReaderModify');
                }

    public ngOnInit() { 
      this.initForm();
      this.initReader();
    }
    public ngAfterViewInit() {
      this.initDialog();
    }
    public ngOnDestroy() {
    }
    private initReader() {
        this.form.setValue({
                cardID: this.reader.CardID,
                firstName: this.reader.FirstName,
                lastName: this.reader.LastName,
                phone: this.reader.Phone,
                address: this.reader.Address
        });
    }
    private initForm(){
        this.form = this.formBuilder.group({
            cardID: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            phone: '',
            address: ''
        });
    }
    private initDialog() {
        domready(() => {
            this.dialog = $("#manage-reader-dialog-form").dialog({
                autoOpen: true,
                height: 500,
                width: 255,
                modal: true,
             });
        });
    }
    private onCancelClicked($event) {
        this.form.reset();
        this.dialog.dialog('close');
    }
    @authorized()
    private onSubmitReader({ value, valid }: { value: {
        cardID: string;
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
    }, valid: boolean }) {
        const reader: IReader =  {
            ID: this.reader.ID,
            Address: value.address,
            CardID: value.cardID,
            FirstName: value.firstName,
            LastName: value.lastName,
            IsActive: true,
            Phone: value.phone
        };
        this.form.reset();
        this.dialog.dialog('close');
        this._event.next({
            data: reader,
            action: this.action
        });
    }

}