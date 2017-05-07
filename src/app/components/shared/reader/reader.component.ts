import {
    Component, Input,
    Output, EventEmitter,
    OnInit, ChangeDetectorRef,
    ChangeDetectionStrategy,
    SimpleChanges, NgZone,
    ApplicationRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Routing
import {
    ActivatedRoute, Route,
    Router
} from '@angular/router';
import { LogService, i18nService } from 'app/services';
import { ManageReaderComponent } from 'app/components';
import { bibApi } from 'app/apis';
import { ActionType, ComponentType } from 'app/enums';
import { authorized } from 'app/decorators';
import * as _ from 'lodash';
import {
    IReader, IBorrow,
    IMedium, IReaderSelectedEvent,
    IComponentData, IAppState
} from 'app/interfaces';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { STATS_CHANGED } from 'app/reducers';

const domready = require('domready');

@Component({
    selector: 'bib-reader',
    templateUrl: './reader.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReaderComponent implements OnInit {
    @Input() public readers: IReader[] = [];
    @Output() public readerSelected = new EventEmitter<IReaderSelectedEvent>(true);
    @Input() public standalone: boolean = true;
    public dynamicComponent: IComponentData = null;
    public title: string;

    private readerTable: DataTables.DataTable;
    private confirmDeletionText: string;
    private selectedReaderID: number;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cd: ChangeDetectorRef,
                private translation: i18nService,
                private logService: LogService,
                private formBuilder: FormBuilder,
                private ngZone: NgZone,
                private store: Store<IAppState>,
                private appRef: ApplicationRef) { }

    public ngOnInit() {
        this.route.data.forEach((data: { readers: IReader[] }) => {
            this.readers = _.slice(data.readers);
        });
        this.title = this.standalone ? this.translation.instant('ReaderControl') :
            this.translation.instant('Readers');
        this.confirmDeletionText = this.translation.instant('ConfirmDeletionReader');
    }
    public ngOnChanges(changes: SimpleChanges) {
    }
    public ngOnDestroy() {
        $('#add-reader-dialog-form').remove();
        $('bib-root').siblings().remove();
    }
    public ngAfterViewInit() {
        this.initWidgets();
        if (this.standalone) {
            this.initContextMenu();
        }
    }
    public onDynamicEvent($event: {
        data: IReader,
        action: ActionType
    }) {
        if ($event.action === ActionType.AddReader) {
            this.ngZone.runOutsideAngular(() => {
                bibApi.insertReader($event.data).then(result => {
                    bibApi.getReaders().then((readers: IReader[]) => {
                        this.readers = _.slice(readers);
                        this.ngZone.run(() => {
                            this.updateTable();
                            this.store.dispatch({ type: STATS_CHANGED, payload: { data: $event.data } });
                        });
                    });
                }).catch(err => this.logService.logJson(err, 'Reader'));
            });
        } else if ($event.action === ActionType.ModifyReader) {
            bibApi.updateReader($event.data).then(res => {
                bibApi.getReaders().then((readers: IReader[]) => {
                    this.readers = _.slice(readers);
                    this.ngZone.run(() => {
                        this.updateTable();
                        this.store.dispatch({ type: STATS_CHANGED, payload: { data: $event.data } });
                    });
                });
            }).catch(err => {
                this.logService.logJson(err, 'Reader');
                this.cd.markForCheck();
            });
        }
    }
    private updateTable() {
        if (!_.isNil(this.readerTable)) {
            this.readerTable.clear();
            this.readerTable.rows.add(this.readers);
            this.readerTable.draw(false);
            this.cd.markForCheck();
        }
    }
    private initContextMenu() {
        const self = this;
        domready(() => {
            $('#reader').children('tbody').contextMenu({
                selector: 'tr',
                build: function ($trigger, e) {
                    // this callback is executed every time the menu is to be shown
                    // its results are destroyed every time the menu is hidden
                    // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
                    return {
                        autoHide: true,
                        className: 'data-title',
                        events: { show: function(options: any) {
                                     $('.data-title').attr('data-menutitle', self.translation.instant('Readers'));
                                },
                        },
                        callback: function (key, options) {
                            switch (key) {
                                case 'addreader':
                                    {
                                        self.addReader();
                                    }
                                    break;
                                case 'removereader':
                                    {
                                        let readerID;
                                        let readerName;
                                        const data = $(this).children('td');
                                        (<any>self).action = ActionType.RemoveReader;
                                        const elem = _.find(data, d => { return $(d).hasClass('sorting_1'); });
                                        if (!_.isNil(elem)) {
                                            if (!_.isNaN(_.toNumber(elem.textContent))) {
                                                readerID = Number(elem.textContent);
                                            } else {
                                                readerID = Number(elem.previousSibling.textContent);
                                            }
                                            readerName = elem.nextSibling.textContent;
                                        } else {
                                            return;
                                        }
                                        $.confirm({
                                            text: `${self.confirmDeletionText} : "${readerName}"`,
                                            title: self.translation.instant('ReaderRemove'),
                                            confirm: () => {
                                                self.removeReader(readerID);
                                            },
                                            cancel: () => {

                                            },
                                        });
                                    }
                                    break;
                                case 'modifyreader': {
                                    let readerID;
                                    const data = $(this).children('td');
                                    (<any>self).action = ActionType.ModifyReader;
                                    const elem = _.find(data, d => { return $(d).hasClass('sorting_1'); });
                                    if (!_.isNil(elem)) {
                                        if (!_.isNaN(_.toNumber(elem.textContent))) {
                                            readerID = Number(elem.textContent);
                                        } else {
                                            readerID = Number(elem.previousSibling.textContent);
                                        }
                                        self.modifyReader(readerID);
                                    }
                                }
                                    break;
                                default:
                                    break;
                            }
                        },
                        items: {
                            'addreader': {
                                name: self.translation.instant('ReaderAdd'),
                                icon: 'fa-plus-circle',
                            },
                            'modifyreader': {
                                name: self.translation.instant('ReaderModify'),
                                icon: 'fa-user-md',
                            },
                            'removereader': {
                                name: self.translation.instant('ReaderRemove'),
                                icon: 'fa-remove',
                            }
                        }
                    };
                },
            });
            self.cd.markForCheck();
        });
    }
    private initWidgets() {
        domready(() => {
            this.readerTable = $('#reader').DataTable(<DataTables.Settings>{
                processing: true,
                select: true,
                data: this.readers,
                language: this.translation.getDataTablesLangObject(),
                columns: [
                    { 'data': 'ID' },
                    { 'data': 'CardID' },
                    { 'data': 'FirstName' },
                    { 'data': 'LastName' },
                    { 'data': 'Phone' }
                ],
                columnDefs: [
                    {
                        'targets': [0],
                        'visible': this.standalone,
                        'searchable': this.standalone,
                    },
                    {
                        'targets': [1],
                        'visible': this.standalone,
                        'searchable': this.standalone,
                    }
                ]
            });
            this.readerTable.on('select', (e: Event, dt: DataTables.DataTable,
                type: string, indexes: number[]) => {
                let reader = dt.rows(indexes[0]).data()['0'];
                this.readerSelected.emit({
                    sender: this,
                    reader: reader
                });
            });
            this.readerTable.on('select', (e: Event, dt: DataTables.DataTable, type: string, indexes: any[] ) => {
                if (type === 'row') {
                    let data = this.readerTable.rows(indexes).data().pluck('ID');
                    this.selectedReaderID = Number(data[0]);
                    console.log(`Selected Reader ID: ${this.selectedReaderID}`);
                }
            });
            this.cd.markForCheck();
        });
    }
    private initSubscriptions() {

    }
    private destroySubscriptions() {

    }
    @authorized()
    private addReader() {
        const reader = this.getEmptyReader();
        const data: IComponentData = {
            component: ManageReaderComponent,
            inputs: {
                reader: reader,
                readerID: reader.ID,
                action: ActionType.AddReader
            },
            type: ComponentType.AddReader
        };
        this.dynamicComponent = data;
        this.cd.markForCheck();
    }
    @authorized()
    private modifyReader(readerID: number) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.getReader(readerID).then(reader => {
                this.ngZone.run(() => {
                    const data: IComponentData = {
                        component: ManageReaderComponent,
                        inputs: {
                            reader: reader,
                            readerID: readerID,
                            action: ActionType.ModifyReader
                        },
                        type: ComponentType.ModifyReader
                    };
                    this.dynamicComponent = data;
                    this.cd.markForCheck();
                });
            });
        });
    }
    @authorized()
    private removeReader(readerID: number) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.removeReader(readerID).then(res => {
                bibApi.getReaders().then((readers: IReader[]) => {
                    this.ngZone.run(() => {
                        this.readers = readers;
                        this.updateTable();
                        this.store.dispatch({ type: STATS_CHANGED, payload: { data: res } });
                    });
                });
            }).catch(err => this.logService.logJson(err, 'Reader'));
        });
    }
    private getEmptyReader(): IReader {
        return <IReader>{
            ID: -1,
            CardID: '',
            FirstName: '',
            LastName: '',
            Address: '',
            Phone: '',
            IsActive: true
        };
    }
}
