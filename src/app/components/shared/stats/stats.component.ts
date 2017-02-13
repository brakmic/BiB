import {
    Component, Input,
    Output, EventEmitter,
    OnInit, ChangeDetectorRef,
    ChangeDetectionStrategy,
    SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Routing
import {
    ActivatedRoute, Route,
    Router
} from '@angular/router';
import { LogService, i18nService } from 'app/services';
import { ManageReaderComponent } from 'app/components';
import { bibApi, imagesApi } from 'app/apis';
import { ActionType, ComponentType } from 'app/enums';
import { authorized } from 'app/decorators';
import * as _ from 'lodash';
import {
    IReader, IBorrow,
    IMedium, IReaderSelectedEvent,
    IComponentData, IAppState, IStats
} from 'app/interfaces';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

const domready = require('domready');

@Component({
    selector: 'bib-stats',
    styleUrls: ['./stats.component.scss'],
    templateUrl: './stats.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent implements OnInit {

    @Input('media') public mediaCount: number;
    @Input('readers') public readersCount: number;
    @Input('borrows') public borrowsCount: number;
    @Input('overdues') public overduesCount: number;

    public kidsImage: string;
    public libraryImage: string;
    public sandClockImage: string;
    public booksImage: string;

    public kidsImageTitle = '';
    public booksImageTitle = '';
    public libraryImageTitle = '';
    public sandClockImageTitle = '';

    private statsState: Observable<IStats>;
    private statsSubscription: Subscription;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private logService: LogService,
        private translate: i18nService,
        private store: Store<IAppState>) { }

    public ngOnInit() {
    }
    public ngOnDestroy() {
    }
    public ngOnChanges(changes: any) {
    }
    public ngAfterViewInit() {
        this.libraryImage = imagesApi.getImageData('library');
        this.kidsImage = imagesApi.getImageData('kids');
        this.booksImage = imagesApi.getImageData('books');
        this.sandClockImage = imagesApi.getImageData('sandclock');

        this.libraryImageTitle = this.translate.instant('Media');
        this.kidsImageTitle = this.translate.instant('Members');
        this.booksImageTitle = this.translate.instant('Borrowed');
        this.sandClockImageTitle = this.translate.instant('Overdue');
    }

}
