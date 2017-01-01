import { Component, Input,
         Output, EventEmitter,
         OnInit, ChangeDetectorRef,
         ChangeDetectionStrategy,
         SimpleChanges, NgZone } from '@angular/core';
// Routing
import { ActivatedRoute, Route,
         Router } from '@angular/router';
import { LogService, i18nService,
         ConfigService } from 'app/services';
import { bibApi } from 'app/apis';
import * as _ from 'lodash';
import { IReader, IBorrow,
         IMedium, IBorrowDisplay,
         IAppState } from 'app/interfaces';
import { authorized } from 'app/decorators';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { STATS_CHANGED } from 'app/reducers';
import * as moment from 'moment';
const domready = require('domready');

@Component({
    selector: 'bib-borrow',
    templateUrl: './borrow.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BorrowComponent implements OnInit {
    @Input() public borrows: IBorrowDisplay[] = [];
    @Output() public borrowSelected = new EventEmitter(true);
    @Input() public standalone: boolean = true;

    private borrowTable: DataTables.DataTable;
    private dateTimeFormat: string;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cd: ChangeDetectorRef,
                private translation: i18nService, 
                private logService: LogService,
                private store: Store<IAppState>,
                private ngZone: NgZone,
                private configService: ConfigService) { }

    public ngOnInit() {
        this.route.data.forEach((data: { borrows: IBorrowDisplay[] }) => {
            this.borrows = _.slice(data.borrows);
        });
        this.configService.getConfig().subscribe(config => {
            this.dateTimeFormat = config.bib_datetime_format;
        });
    }
    public ngOnDestroy() {
        $('bib-root').siblings().remove();
    }
    public ngAfterViewInit() {
        this.initWidgets();
        this.initContextMenu();
    }
    public ngOnChanges(changes: SimpleChanges) {
        const borrows = changes['borrows'];
        if (!_.isEqual(borrows.currentValue, borrows.previousValue)) {
            this.updateTable();
        }

    }
    private updateTable() {
        if (!_.isNil(this.borrowTable)) {
            this.borrowTable.clear();
            this.borrowTable.rows.add(this.borrows);
            this.borrowTable.draw();       
            this.cd.markForCheck();
            
        }
    }
    private initWidgets() {
        const self = this;
        domready(() => {
          this.borrowTable = $('#borrow').DataTable(<DataTables.Settings>{
             processing: true,
             data: this.borrows,
             searching: true,
             select: true,
             language: this.translation.getDataTablesLangObject(),
             columns:  [
                 { 'data' : 'ID' },
                 { 'data' : 'ReaderID' },
                 { 'data' : 'ReaderName' },
                 { 'data' : 'MediumTitle' },
                 { 'data' : 'BorrowDate' },
                 { 'data' : 'IsOverdue' }
             ],
             columnDefs: [
                  {
                        "targets": [ 2 ],
                        "visible": this.standalone,
                        "searchable": this.standalone,
                  },
                  {
                        "targets": [ 4 ],
                        "visible": this.standalone,
                        "searchable": this.standalone,
                  },
                  {
                    data: 'BorrowDate',
                    render: function (data, type, full, meta) {
                       return moment(data).format(self.dateTimeFormat);
                    },
                    targets: 4
                 },
                  {
                    data: 'IsOverdue',
                    render: function (data, type, full, meta) {
                        const text = data ? 'Ja' : 'Nein';
                        if (data) {
                            return `<div class="text-center" 
                                         style="background-color: red; 
                                         color: white;">${text}</div>`;
                        } else {
                            return `<div class="text-center" 
                                         style="background-color: limegreen; 
                                         color: white;">${text}</div>`;
                        }
                    },
                    targets: 5
                 },
             ]
          });
          this.cd.markForCheck();
        });
    }
    private initContextMenu() {
        const self = this;
        domready(() => {
                $('#borrow').children('tbody').contextMenu({
                    selector: 'tr',
                    className: 'data-title',
                    autoHide: true,
                    callback: function(key, options) {
                        let borrowID = -1;
                        let readerID = -1;
                        const data = $(this).children('td');
                        const elem = _.find(data, el => {
                            return $(el).hasClass('sorting_1');
                        });
                        if(!_.isNil(elem)){
                            borrowID = Number(elem.textContent);
                            readerID = Number(elem.nextSibling.textContent);
                            self.unborrow(borrowID, readerID);
                        }
                    },
                    items: {
                        'mediareturn': {
                            name: this.translation.instant('MediaReturned'),
                            icon: 'fa-exchange',
                        }
                    }
                });
                // set title for context menu
                $('.data-title').attr('data-menutitle', self.translation.instant('EntryEdit'));
                this.cd.markForCheck();
        });
    }
    private initSubscriptions() {

    }
    private destroySubscriptions() {

    }
    @authorized()
    private unborrow(borrowID: number, readerID: number) {
        this.ngZone.runOutsideAngular(() => { 
            bibApi.getBorrowsForUser(readerID).then(result => {
                _.each(result, borrow => {   
                    if (borrow.ID == borrowID) {   
                        bibApi.unborrow(borrowID).then(res => {
                            bibApi.getBorrowsForDisplay().then(borrows => {
                                this.borrows = _.slice(borrows);
                                this.updateTable();
                                this.ngZone.run(() => {
                                    this.store.dispatch({ type: STATS_CHANGED, payload: { data: `Medium returned by reader` } });
                                });
                            });
                        });
                    }
                });
            });
        });
    }
}
