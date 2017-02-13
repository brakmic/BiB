import {
    Component, ViewContainerRef,
    ViewChild, ReflectiveInjector,
    ComponentFactoryResolver, OnInit,
    ChangeDetectorRef, ChangeDetectionStrategy,
    Input, Output, EventEmitter, Injector
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    styleUrls: ['./manage-medium.component.scss'],
    templateUrl: './manage-medium.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageMediumComponent implements OnInit {
    public _event: Subject<any> = new Subject<any>();
    public form: FormGroup;
    public action: ActionType;
    public medium: IMedium;
    public mediumID: number;
    public title: string;
    private dialog: JQuery;

    constructor(private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private logService: LogService,
        private translation: i18nService,
        private injector: Injector) { }

    public ngOnInit() {
        this.medium = this.injector.get('medium');
        this.mediumID = this.injector.get('mediumID');
        this.action = this.injector.get('action');
        this.setTitle();
        this.initForm();
    }
    public ngOnDestroy() {

    }
    public ngAfterViewInit() {
        this.initDialog();
    }
    public onCancelClicked($event) {
        this.form.reset();
        this.dialog.dialog('close');
        this.cd.markForCheck();
    }
    @authorized()
    public onSubmitMedium({ value, valid }: {
        value: {
            mediumAuthor: string;
            mediumDescription: string;
            mediumISBN: string;
            mediumName: string;
            mediumYear: number;
        }, valid: boolean
    }) {
        const medium: IMedium = {
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
    private setTitle() {
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
    private initForm() {
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
            this.dialog = $('#manage-medium-dialog-form').dialog({
                autoOpen: true,
                height: 500,
                width: 300,
                modal: true
            });
            this.cd.markForCheck();
        });
    }
}
