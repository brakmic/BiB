import {Component, ViewContainerRef,
        ViewChild, ReflectiveInjector,
        ComponentFactoryResolver, OnInit,
        ChangeDetectorRef, ChangeDetectionStrategy,
        Input, Output, EventEmitter, Injector,
        SimpleChanges, NgZone } from '@angular/core';  
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import * as _ from 'lodash';
import { LogService, i18nService,
         ToastService } from 'app/services';
import { IMedium, IMediumAddedEvent, IAppState } from 'app/interfaces'; 
import { authorized } from 'app/decorators';
import { ComponentType, ActionStatus,
         ActionType } from 'app/enums';
import { Subject } from 'rxjs/Subject';
import { bibApi } from 'app/apis';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { STATS_CHANGED } from 'app/reducers';
const domready = require('domready');

@Component({
    selector: 'bib-modal-borrow',
    styles: [`

        .control-buttons {
            margin-top: 1em;
        }
      
        #borrow-dialog-form {
            display: none;
        }

        #select-reader {
            width: 300px;
        }
        
    `],
    template: `
        <div id="borrow-dialog-form" title="{{ 'BorrowTo' | translate }}">
            <form novalidate (ngSubmit)="onSubmitNewBorrow(form)" [formGroup]="form">
                <div class="form-group">
                <label for="mediumtitle">{{ 'Title' | translate }}</label>
                <input type="text" name="mediumtitle"
                        [readonly]="true"
                        id="mediumtitle" 
                        placeholder=""
                        class="form-control"
                        formControlName="mediumTitle"/>
                </div>
                <div class="form-group">
                    <select id="select-reader">
                        <option value="-1"></option>
                        <option *ngFor="let reader of readers" [value]="reader.ID">
                            {{reader.FirstName}} {{reader.LastName}}
                        </option>
                    </select>
                </div>
                <div class="btn-toolbar control-buttons pull-right" role="group">
                    <button class="btn btn-default btn-danger" type="button" (click)="onCancelClicked($event)">{{ 'Cancel' | translate }}</button>
                    <button class="btn btn-default btn-success" type="submit" [disabled]="form.invalid">{{ 'OK' | translate }}</button>
                </div>
            </form>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BorrowMediaComponent implements OnInit {
    @Input() public mediumID: number;
    @Input() public readers: any[] = [];
    private form: FormGroup;
    public _event: Subject<any> = new Subject<any>();
    private medium: IMedium;

    private dialog: JQuery;
    private select: JQuery;
    private readerID: number;

    constructor(private formBuilder: FormBuilder,
                private cd: ChangeDetectorRef,
                private logService: LogService,
                private translation: i18nService,
                private injector: Injector,
                private ngZone: NgZone,
                private store: Store<IAppState>,
                private toast: ToastService) {
                    this.mediumID = this.injector.get('mediumID');
                    this.readers = this.injector.get('readers');
                    this.medium = this.injector.get('medium');
    }

    public ngOnInit() { 
        this.initForm();
    }
    public ngOnChanges(changes: SimpleChanges) {
    }
    public ngOnDestroy() {
        if (this.dialog) {
            this.dialog.dialog('close');
        }
    }
    public ngAfterViewInit() {
        bibApi.isBorrowed(this.mediumID).then(borrowed => {
            if (borrowed) {
                this.form.reset();
                this.toast.show(this.translation.instant('MediumAlreadyBorrowed'), 
                                this.translation.instant('Error'), ActionStatus.Failure);
                this.cd.markForCheck();
                return;
            } else {
                this.initBorrowDialog();
                bibApi.getMedium(this.mediumID).then(medium => {
                    this.medium = medium;
                    this.form.setValue({
                        mediumTitle: medium.Title
                    });
                    this.cd.markForCheck();
                });
            }
        });
    }
    private initForm(){
        this.form = this.formBuilder.group({ 
            mediumTitle: '',
        });
    }
    private initBorrowDialog(){
        const self = this;
        domready(() => {
                this.dialog = $("#borrow-dialog-form").dialog({
                autoOpen: true,
                height: 250,
                width: 350,
                modal: true,
                open: function(event: Event, ui: JQueryUI.DialogUIParams){
                   self.select = $('#select-reader').select2({
                       placeholder: self.translation.instant('SelectReader'),
                       allowClear: true
                   });
                   self.select.on('change', (e: Select2JQueryEventObject) => {
                       self.readerID = Number(self.select.select2('val'));
                       self.cd.markForCheck();
                   });
                   self.cd.markForCheck();
                },
                close: function() {
                    self.select.select2('destroy');
                    $('#select-reader').remove();
                    self.cd.markForCheck();
                }
            });
            this.cd.markForCheck();
        });
    }
    private onCancelClicked($event: any) {
        this.form.reset();
        this.dialog.dialog('close');
    }
    @authorized()
    private onSubmitNewBorrow({ value, valid }: { value: any, valid: boolean }) {
        if(!this.readerID ||
            this.readerID < 0) {
                return;
            }
        this.ngZone.runOutsideAngular(() => {
            bibApi.borrowMedium(this.readerID, this.mediumID).then(res => {
                bibApi.getMediaForDisplay().then(media => {
                    this.ngZone.run(() => {
                        this._event.next({
                            sender: {},
                            medium: {},
                            type: ComponentType.BorrowMedia,
                            action: ActionType.BorrowMedium
                        });
                        this.store.dispatch({ type: STATS_CHANGED, payload: { data: { mediumID: this.mediumID } } });
                    });
                });
                this.dialog.dialog('close');
                this.cd.markForCheck();
            }).catch(err => this.logService.logJson(err, 'BorrowDialog'));
        });
    }
}
