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
    styleUrls: ['./manage-reader.component.scss'],
    templateUrl: './manage-reader.component.html',
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
                private injector: Injector) { }

    public ngOnInit() { 
        this.reader = this.injector.get('reader');
        this.readerID = this.injector.get('readerID');
        this.action = this.injector.get('action');
        this.title = this.action == ActionType.AddReader ? this.translation.instant('ReaderAdd') :  
                                                this.translation.instant('ReaderModify');
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