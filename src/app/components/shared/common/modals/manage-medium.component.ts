import {Component, ViewContainerRef,
        ViewChild, ReflectiveInjector,
        ComponentFactoryResolver, OnInit,
        ChangeDetectorRef, ChangeDetectionStrategy,
        Input, Output, EventEmitter, Injector } from '@angular/core';  
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import * as _ from 'lodash';
import { LogService, i18nService } from 'app/services';
import { IMedium, IMediumAddedEvent } from 'app/interfaces'; 
import { authorized } from 'app/decorators';
import { ComponentType, ActionType } from 'app/enums';
import { Subject } from 'rxjs/Subject';
import { bibApi } from 'app/apis';

const domready = require('domready');

@Component({
    selector: 'bib-modal-add-media',
    styles: [`
        
        .control-buttons {
            margin-top: 1em;
        }

        #manage-medium-dialog-form {
            display: none;
        }

    `],
    template: `
            <div id="manage-medium-dialog-form" [title]="title">
            <form novalidate (ngSubmit)="onSubmitMedium(form)"
                                            [formGroup]="form">
                    <div class="form-group">
                    <label for="mediumname">{{ 'MediumName' | translate }}</label>
                    <input type="text" name="mediumname"
                            id="mediumname"
                            placeholder=""
                            class="form-control"
                            formControlName="mediumName"/>
                    </div>
                    <div class="form-group">
                    <label for="mediumauthor">{{ 'Author' | translate }}</label>
                    <input type="text" name="mediumauthor"
                            id="mediumauthor" 
                            placeholder=""
                            class="form-control"
                            formControlName="mediumAuthor"/>
                    </div>
                    <div class="form-group">
                    <label for="mediumyear">{{ 'Year' | translate }}</label>
                    <input type="text" name="mediumyear"
                            id="mediumyear" 
                            placeholder=""
                            class="form-control"
                            formControlName="mediumYear"/>
                    </div>
                    <div class="form-group">
                    <label for="mediumdescription">{{ 'Description' | translate }}</label>
                    <input type="text" name="mediumdescription"
                        id="mediumdescription" 
                        placeholder=""
                        class="form-control"
                        formControlName="mediumDescription"/>
                    </div>
                    <div class="form-group">
                    <label for="mediumisbn">{{ 'ISBN' | translate }}</label>
                    <input type="text" name="mediumisbn"
                            id="mediumisbn" 
                            placeholder=""
                            class="form-control"
                            formControlName="mediumISBN"/>
                    </div>
                    <div class="btn-toolbar control-buttons pull-right" role="group">
                        <button class="btn btn-danger" type="button" (click)="onCancelClicked($event)">{{ 'Cancel' | translate }}</button>
                        <button class="btn btn-success" type="submit" [disabled]="form.invalid">{{ 'OK' | translate }}</button>
                    </div>
            </form>
        </div>`,
        changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageMediumComponent implements OnInit {
    public _event: Subject<any> = new Subject<any>();
    private form: FormGroup;
    private dialog: JQuery;
    private action: ActionType;
    private medium: IMedium;
    private mediumID: number;
    private title: string;

    constructor(private formBuilder: FormBuilder,
                private cd: ChangeDetectorRef,
                private logService: LogService,
                private translation: i18nService,
                private injector: Injector) { 
                    this.medium = this.injector.get('medium');
                    this.mediumID = this.injector.get('mediumID');
                    this.action = this.injector.get('action');
    }

    public ngOnInit() { 
        this.setTitle();
        this.initForm();
    }
    public ngOnDestroy() {
        
    }
    public ngAfterViewInit() {
        this.initDialog();
    }
    private setTitle(){
        switch (this.action) {
            case ActionType.AddMedium:
                this.title = this.translation.instant('MediaAdd');
                break;
            case ActionType.ModifyMedium:
                this.title = this.translation.instant('MediaModify');
                break;
            default:
                break;
        }
    }
    private initForm(){
        this.form = this.formBuilder.group({
            mediumName: [this.medium.Title, [Validators.required]],
            mediumAuthor: this.medium.Author,
            mediumYear: this.medium.Year,
            mediumDescription: this.medium.Description,
            mediumISBN: this.medium.ISBN
        });
    }
    private initDialog() {
        const self = this;
        domready(() => {
            this.dialog = $("#manage-medium-dialog-form").dialog({
                autoOpen: true,
                height: 500,
                width: 300,
                modal: true
             });
           this.cd.markForCheck();
        });
    }
    private onCancelClicked($event) {
        this.form.reset();
        this.dialog.dialog('close');
        this.cd.markForCheck();
    }
    @authorized()
    private onSubmitMedium({ value, valid }: { value: {
        mediumAuthor: string;
        mediumDescription: string;
        mediumISBN: string;
        mediumName: string;
        mediumYear: number;
    }, valid: boolean }) {
        const medium: IMedium =  {
            ID: this.medium.ID,
            Author: value.mediumAuthor,
            Description: value.mediumDescription,
            IsAvailable: true,
            ISBN: value.mediumISBN,
            IsDeleted: false,
            Picture: undefined,
            Title: value.mediumName,
            Year: value.mediumYear,
            Type: undefined
        };
        this.form.reset();
        this.dialog.dialog('close');
        this._event.next({
            data: medium,
            action: this.action
        });
    }
}
