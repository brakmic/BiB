import {
    Component, Input,
    Output, EventEmitter,
    OnInit, ChangeDetectorRef,
    ChangeDetectionStrategy, SimpleChanges,
    NgZone
} from '@angular/core';
// Routing
import {
    ActivatedRoute, Route,
    Router
} from '@angular/router';
import {
    LogService,
    i18nService
} from 'app/services';
import { bibApi } from 'app/apis';
import * as _ from 'lodash';
import {
    IReader, IBorrow,
    IMedium, IReaderSelectedEvent,
    IBorrowDisplay
} from 'app/interfaces';

const domready = require('domready');

@Component({
    selector: 'reader-status',
    templateUrl: './reader-status.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReaderStatusComponent implements OnInit {
    @Input() public readers: IReader[] = [];
    @Input() public borrows: IBorrowDisplay[] = [];
    public isBorrowsCmpStandalone: boolean = false;
    public isReadersCmpStandalone: boolean = false;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private translation: i18nService,
        private logService: LogService,
        private zone: NgZone) { }

    public ngOnInit() {
        this.route.data.forEach((data: { readers: IReader[] }) => {
            this.readers = _.slice(data.readers);
        });
    }

    public ngAfterViewInit() {
    }
    public ngOnChanges(changes: SimpleChanges) {
        this.cd.markForCheck();
    }
    public ngOnDestroy() {
        $('bib-root').siblings().remove();
    }
    public onReaderSelected($event: IReaderSelectedEvent) {
        this.zone.runOutsideAngular(() => {
            bibApi.getBorrowsForDisplay().then((borrows: IBorrowDisplay[]) => {
                this.zone.run(() => {
                    this.borrows = _.filter(borrows, b => {
                        return ((_.eq(_.toString(b.ReaderID), _.toString($event.reader.ID))) && _.isNil(b.ReturnDate));
                    });
                    this.cd.markForCheck();
                });
            });
        });
    }
    public onBorrowSelected($event: any) {

    }

}
