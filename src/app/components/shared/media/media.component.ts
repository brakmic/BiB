import {
    Component, Input,
    Output, EventEmitter,
    OnInit, ChangeDetectorRef,
    ChangeDetectionStrategy,
    SimpleChanges, ElementRef,
    NgZone
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogService, i18nService } from 'app/services';
import { ManageMediumComponent, BorrowMediaComponent } from 'app/components';
import { ComponentType, ActionType } from 'app/enums';
import { bibApi } from 'app/apis';
import * as _ from 'lodash';
import {
    IReader, IBorrow,
    IMedium, IMediumSelectedEvent,
    IMediumDisplay, IComponentData,
    IAppState
} from 'app/interfaces';
import { authorized } from 'app/decorators';
// Routing
import {
    ActivatedRoute, Route,
    Router
} from '@angular/router';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { STATS_CHANGED } from 'app/reducers';

const domready = require('domready');

@Component({
    selector: 'bib-media',
    templateUrl: './media.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaComponent implements OnInit {
    @Input() public media: IMediumDisplay[] = [];
    @Output() public mediumSelected = new EventEmitter<IMediumSelectedEvent>(true);
    public dynamicComponent: IComponentData = null;
    public form: any;
    public readers: IReader[] = [];
    public selectedReaderID: number;
    public confirmDeletionText: string;

    private mediaTable: DataTables.DataTable;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private translation: i18nService,
        private logService: LogService,
        private el: ElementRef,
        private store: Store<IAppState>,
        private ngZone: NgZone) { }

    public ngOnInit() {
        this.route.data.forEach((data: { media: IMediumDisplay[] }) => {
            this.media = _.slice(data.media);
        });
        bibApi.getReaders().then(readers => {
            this.readers = _.slice(readers);
        });
        this.confirmDeletionText = this.translation.instant('ConfirmDeletionMedium');
    }
    public ngOnChanges(changes: SimpleChanges) {
        const media = changes['media'];
        if (media.currentValue !== media.previousValue) {
            if (!_.isNil(this.mediaTable)) {
                this.mediaTable.data().clear().push(media.currentValue);
                this.updateTable();
            }
        }
    }
    public ngOnDestroy() {
        $('#borrow-dialog-form').remove();
        $('#select-reader').remove();
        $('bib-root').siblings().remove();
    }
    public ngAfterViewInit() {
        this.initOptions();
        this.initWidgets();
        this.initContextMenu();
        this.cd.markForCheck();
    }
    public onDynamicEvent($event: {
        sender: any,
        data: IMedium,
        type: ComponentType,
        action: ActionType
    }) {
        switch ($event.action) {
            case ActionType.AddMedium:
                this.insertMedium($event.data);
                break;
            case ActionType.ModifyMedium:
                this.updateMedium($event.data);
                break;
            case ActionType.RemoveMedium:
                this.deleteMedium($event.data.ID)
                break;
            default:
                this.refresh();
                break;
        }
    }

    private updateTable() {
        if (!_.isNil(this.mediaTable)) {
            this.mediaTable.clear();
            this.mediaTable.rows.add(this.media);
            this.mediaTable.draw();
            this.cd.markForCheck();
        }
    }
    private initOptions() {
        $.confirm.options = {
            text: 'Are you sure?',
            title: '',
            confirmButton: this.translation.instant('Yes'),
            cancelButton: this.translation.instant('Cancel'),
            post: false,
            submitForm: false,
            confirmButtonClass: 'btn-warning',
            cancelButtonClass: 'btn-default',
            dialogClass: 'modal-dialog'
        }
    }
    private initWidgets() {
        const self = this;
        domready(() => {
            this.mediaTable = $('#media').DataTable(<DataTables.Settings>{
                processing: true,
                select: true,
                data: this.media,
                language: this.translation.getDataTablesLangObject(),
                columns: [
                    { 'data': 'ID' },
                    { 'data': 'Title' },
                    { 'data': 'Author' },
                    { 'data': 'Description' },
                    { 'data': 'Year' },
                    { 'data': 'ISBN' },
                    { 'data': 'IsBorrowed' }
                ],
                columnDefs: [
                    {
                        'targets': [2],
                        'visible': false,
                        'searchable': true,
                    },
                    {
                        'targets': [3],
                        'visible': false,
                        'searchable': true,
                    },
                    {
                        data: 'IsBorrowed',
                        render: function (data, type, row) {
                            return data ? self.translation.instant('Yes') : self.translation.instant('No');
                        },
                        targets: 6
                    },
                ]
            });
            this.mediaTable.on('select', (e: Event, dt: DataTables.DataTable,
                type: string, indexes: number[]) => {
                let medium = dt.rows(indexes[0]).data()['0'];
                this.mediumSelected.emit({
                    sender: this,
                    medium: medium
                });
            });
            this.cd.markForCheck();
        });
    }
    private initContextMenu() {
        const self = this;
        domready(() => {
            $('#media').children('tbody').contextMenu({
                selector: 'tr',
                build: function ($trigger, e) {
                    // this callback is executed every time the menu is to be shown
                    // its results are destroyed every time the menu is hidden
                    // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
                    return {
                        className: 'data-title',
                        autoHide: true,
                        callback: function (key, options) {
                            switch (key) {
                                case 'borrowmedium':
                                    {
                                        let mediumID = -1;
                                        const data = $(this).children('td');
                                        const elem = _.find(data, el => {
                                            return $(el).hasClass('sorting_1');
                                        });
                                        if (!_.isNil(elem)) {
                                            mediumID = Number(elem.textContent);
                                            self.borrowMedium(mediumID);
                                        }
                                    }
                                    break;
                                case 'addmedium':
                                    {
                                        self.addMedium();
                                    }
                                    break;
                                case 'modifymedium':
                                    {
                                        let mediumID = -1;
                                        const data = $(this).children('td');
                                        const elem = _.find(data, el => {
                                            return $(el).hasClass('sorting_1');
                                        });
                                        if (!_.isNil(elem)) {
                                            mediumID = Number(elem.textContent);
                                            self.modifyMedium(mediumID);
                                        }
                                    }
                                    break;
                                case 'removemedium':
                                    {
                                        let mediumID = -1;
                                        let title = '';
                                        const data = $(this).children('td');
                                        const elem = _.find(data, el => {
                                            return $(el).hasClass('sorting_1');
                                        });
                                        if (!_.isNil(elem)) {
                                            mediumID = Number(elem.textContent);
                                            title = elem.nextSibling.textContent;
                                        } else {
                                            return;
                                        }
                                        $.confirm({
                                            text: `${self.confirmDeletionText} : "${title}"`,
                                            title: self.translation.instant('MediaRemove'),
                                            confirm: () => {
                                                self.removeMedium(mediumID);
                                            },
                                            cancel: () => {

                                            },
                                        });
                                    }
                                    break;
                                default:
                                    break;
                            }
                        },
                        items: {
                            'borrowmedium': {
                                name: self.translation.instant('MediaBorrow'),
                                icon: 'fa-exchange',
                            },
                            'addmedium': {
                                name: self.translation.instant('MediaAdd'),
                                icon: 'fa-plus-circle',
                            },
                            'modifymedium': {
                                name: self.translation.instant('MediaModify'),
                                icon: 'fa-address-book',
                            },
                            'removemedium': {
                                name: self.translation.instant('MediaRemove'),
                                icon: 'fa-remove',
                            }
                        }
                    };
                },
            });
            self.cd.markForCheck();
        });
    }


    private initSubscriptions() {

    }
    private destroySubscriptions() {

    }
    @authorized()
    private borrowMedium(mediumID: number) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.getReaders().then(readers => {
                const cmpData: IComponentData = {
                    component: BorrowMediaComponent,
                    inputs: {
                        mediumID: mediumID,
                        readers: readers,
                        medium: undefined,
                        action: ActionType.BorrowMedium
                    },
                    type: ComponentType.BorrowMedia
                };
                this.ngZone.run(() => {
                    this.dynamicComponent = cmpData;
                    this.cd.markForCheck();
                });
            });
        });
    }
    @authorized()
    private addMedium() {
        const medium = this.getEmptyMedium();
        const data: IComponentData = {
            component: ManageMediumComponent,
            inputs: {
                medium: medium,
                mediumID: medium.ID,
                action: ActionType.AddMedium
            },
            type: ComponentType.AddMedia
        };
        this.dynamicComponent = data;
        this.cd.markForCheck();
    }
    @authorized()
    private modifyMedium(mediumID: number) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.getMedium(mediumID).then(medium => {
                const data: IComponentData = {
                    component: ManageMediumComponent,
                    inputs: {
                        medium: medium,
                        mediumID: medium.ID,
                        action: ActionType.ModifyMedium
                    },
                    type: ComponentType.AddMedia
                };
                this.ngZone.run(() => {
                    this.dynamicComponent = data;
                    this.cd.markForCheck();
                });
            });
        });
    }
    @authorized()
    private removeMedium(mediumID: number) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.removeMedium(mediumID).then(result => {
                this.ngZone.run(() => {
                    this.refresh();
                });
            }).catch(err => this.logService.logJson(err, 'Media'));
        });
    }
    private refresh() {
        bibApi.getMediaForDisplay().then((media: IMediumDisplay[]) => {
            this.media = _.slice(media);
            this.updateTable();
            this.store.dispatch({ type: STATS_CHANGED, payload: { data: `Media list has changed.` } });
        });
    }
    private insertMedium(medium: IMedium) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.insertMedium(medium).then(result => {
                this.ngZone.run(() => {
                    this.refresh();
                });
            });
        });
    }
    private updateMedium(medium: IMedium) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.updateMedium(medium).then(result => {
                this.ngZone.run(() => {
                    this.refresh();
                });
            });
        });
    }
    private deleteMedium(mediumID: number) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.removeMedium(mediumID).then(result => {
                this.ngZone.run(() => {
                    this.refresh();
                });
            });
        });
    }
    private getEmptyMedium(): IMedium {
        return <IMedium>{
            ID: -1,
            Author: '',
            Description: '',
            IsAvailable: true,
            ISBN: '',
            IsDeleted: false,
            Picture: '',
            Title: '',
            Type: undefined,
            Year: new Date().getFullYear()
        };
    }
}
