/**
 * This is the Database component.
 * @type {Component}
 */
// Default Angular Classes
import {
    Component, Input,
    Output, OnInit,
    EventEmitter,
    OpaqueToken, ElementRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef, Renderer,
    NgZone
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, RequestOptions, Request } from '@angular/http';
// Routing
import {
    ActivatedRoute, Route,
    Router
} from '@angular/router';
import { bibApi } from 'app/apis';
// Enums
import { MenuType, ActionStatus } from 'app/enums';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { STATS_CHANGED } from 'app/reducers';
// Interfaces
import {
    IMenuEntry, IAppState,
    ISession, IWindowEx,
    IWorldCatEntry, IMediaEntry,
    IMediumDisplay, IMedium,
    IGoogleBook, ISBNDbBook
} from 'app/interfaces';
// Services
import {
    LogService, i18nService,
    ConfigService, SessionService,
    UploadService, ToastService
} from 'app/services';
// Helpers
import { Bib } from 'app/helpers';
import * as _ from 'lodash';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
const domready = require('domready');

@Component({
    selector: 'bib-database',
    templateUrl: './database.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatabaseComponent implements OnInit {
    public form: FormGroup;
    public media: IMediumDisplay[] = [];
    public shouldUpload: boolean = true;
    public ignoreDuplicates: boolean = true;
    private uploadTable: DataTables.DataTable;
    private uploadButtonTitle = 'Select';
    private subscription: Subscription;

    constructor(private formBuilder: FormBuilder,
                private el: ElementRef,
                private renderer: Renderer,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private http: Http,
                private store: Store<IAppState>,
                private cd: ChangeDetectorRef,
                private logService: LogService,
                private translate: i18nService,
                private config: ConfigService,
                private upload: UploadService,
                private ngZone: NgZone,
                private translation: i18nService,
                private toast: ToastService) { }

    public ngOnInit() {
    }
    public ngAfterViewInit() {
        this.initWidgets();
        this.initContextMenu();
    }
    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        $('bib-root').siblings().remove();
    }
    public onCancelClicked($event) {
        this.shouldUpload = true;
        this.media = [];
        this.updateTable();
        this.store.dispatch({ type: STATS_CHANGED, payload: { data: 'Upload canceled' } });
        this.toast.show(this.translate.instant('MediaUploadCanceled'),
            this.translate.instant('Warning'), ActionStatus.Canceled);
    }
    public onInsertIntoDbClicked($event) {
        this.ngZone.runOutsideAngular(() => {
            const media = bibApi.getMediaDisplayForDb(this.media);
            bibApi.insertMedia(media, this.ignoreDuplicates).then(results => {
                this.ngZone.run(() => {
                    this.shouldUpload = true;
                    this.media = [];
                    this.updateTable();
                    this.store.dispatch({ type: STATS_CHANGED, payload: { data: 'Upload succeeded' } });
                    this.toast.show(this.translate.instant('MediaUploadCompleted'),
                        this.translate.instant('Info'), ActionStatus.Success);
                });
            });
        });
    }
    public onFileSelected($event) {
        let fileList: FileList = $event.target.files;
        this.subscription = this.upload.uploadFile(`${bibApi.isbnUrl}`, fileList).subscribe(result => {
            console.log(JSON.stringify(result));
            let counter = 1;
            if (_.isNil(result.file)) {
                this.toast.show(`No data retrieved!`, this.translate.instant('Error'), ActionStatus.Failure);
                this.updateTable();
                this.shouldUpload = false;
                return;
            }
            const filtered = _.filter(result.file.data, (raw: IGoogleBook) => {
                return !_.isEmpty(raw.items);
            });
            this.media = _.map(filtered, f => {
                // const entry = f.list[0];
                const entry = f.items[0].volumeInfo;
                // return <IMediumDisplay>{
                //     ID: counter++,
                //     Author: !_.isEmpty(entry.author_data) ? entry.author_data[0].name : '',
                //     Description: '',
                //     ISBN: !_.isNil(entry.isbn13) ? entry.isbn13 : entry.isbn10,
                //     IsBorrowed: false,
                //     Picture: '',
                //     Title: entry.title,
                //     Type: 'Book',
                //     Year: 0
                // };
                return <IMediumDisplay>{
                    ID: counter++,
                    Author: !_.isEmpty(entry.authors) ? entry.authors[0] : '',
                    Description: '',
                    ISBN: !_.isNil(entry.industryIdentifiers[1]) ? entry.industryIdentifiers[1].identifier : '',
                    IsBorrowed: false,
                    Picture: !_.isEmpty(entry.imageLinks) ? entry.imageLinks.thumbnail : '',
                    Title: entry.title,
                    Type: entry.printType,
                    Year: Number(entry.publishedDate)
                };
            });
            const statusInfo = `Retrieved ${this.media.length} entries.`;
            this.toast.show(statusInfo, this.translate.instant('Info'), ActionStatus.Success);
            this.updateTable();
            this.shouldUpload = false;
        });
    }
    private updateTable() {
        if (!_.isNil(this.uploadTable)) {
            this.uploadTable.clear();
            this.uploadTable.rows.add(this.media);
            this.uploadTable.draw(false);
            this.styleUploadButton();
            this.cd.markForCheck();
        }
    }
    private initWidgets() {
        domready(() => {
            this.uploadTable = $('#upload').DataTable(<DataTables.Settings>{
                processing: true,
                select: true,
                data: this.media,
                language: this.translation.getDataTablesLangObject(),
                columns: [
                    { 'data': 'ID' },
                    { 'data': 'Title' },
                    { 'data': 'Author' },
                    { 'data': 'Year' },
                    { 'data': 'ISBN' },
                ],
            });
            this.uploadTable.on('select', (e: Event, dt: DataTables.DataTable,
                type: string, indexes: number[]) => {
                let medium = dt.rows(indexes[0]).data()['0'];
                //   this.mediumSelected.emit({
                //       sender: this,
                //       medium: medium
                //   });
            });
            this.styleUploadButton();
            this.cd.markForCheck();
        });
    }
    private initContextMenu() {

    }
    private styleUploadButton() {
        this.ngZone.run(() => {
            (<any>$(':file')).filestyle({
                buttonName: 'btn-primary',
                buttonText: this.translate.instant('SelectFile'),
                buttonBefore: true,
                badge: true,
                input: false,
                classButton: 'btn btn-primary'
            });
        });
    }
}
