import {
    Component, Input,
    OnInit, ChangeDetectionStrategy,
    ChangeDetectorRef, SimpleChanges,
    NgZone
} from '@angular/core';
import { IAcl, IAppState } from 'app/interfaces';
import { LogService, i18nService } from 'app/services';
import { bibApi } from 'app/apis';
import { authorized } from 'app/decorators';
// State Management with Redux
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { ACL_UPDATED, ACL_CHANGED } from 'app/reducers';
import * as _ from 'lodash';
const domready = require('domready');
const cuid = require('cuid');

@Component({
    selector: 'bib-acl',
    templateUrl: './acl.component.html',
    styleUrls: [
        './acl.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AclComponent implements OnInit {
    @Input() public acl: any[] = [];
    @Input() public header: string = 'ACL_List';
    public columns: any[] = [];
    public tableId: string = '__table__';
    private aclTable: DataTables.DataTable = undefined;
    private aclObservable: Observable<IAcl>;
    private aclSubscription: Subscription;

    constructor(private cd: ChangeDetectorRef,
        private logService: LogService,
        private translation: i18nService,
        private ngZone: NgZone,
        private store: Store<IAppState>) { }

    public ngOnInit() {
        const title = _.replace(this.header, / /g, '_');
        this.tableId = `${title}_${cuid()}`;
        const rights = this.acl[0];
        this.columns = _.map(_.keys(_.omit(rights, 'ID')), k => {
            return {
                data: k,
                render: function (data, type, full, meta) {
                    const checked = data ? 'checked' : '';
                    const val = meta.settings.aoColumns[meta.col].data;
                    return `<input name="${cuid()}" value="${val}" type="checkbox" ${checked}>`;
                }
            };
        });
        this.initSubscriptions();
    }
    public ngOnChanges(changes: SimpleChanges) {
        const hdr = changes['header'];
        const acl = changes['acl'];
        if ((hdr && !_.isEqual(hdr.currentValue, hdr.previousValue)) ||
            (acl && !_.isEqual(acl.currentValue, acl.previousValue))) {
            this.updateTable();
        }
    }
    public ngOnDestroy() {
        $('bib-root').siblings().remove();
        this.aclTable.off('change');
        this.destroySubscriptions();
    }
    public ngAfterViewInit() {
        this.initWidgets();
    }
    private initSubscriptions() {
        this.aclObservable = this.store.select(store => store.acl);
        this.aclSubscription = this.aclObservable.subscribe(acl => {
            if (_.eq(_.toString(acl.ID), _.toString(this.acl[0].ID))) {
                this.acl[0] = _.cloneDeep(acl);
                this.updateTable();
            }
        });
    }
    private destroySubscriptions() {
        if (this.aclSubscription) {
            this.aclSubscription.unsubscribe();
        }
    }
    private updateTable() {
        if (!_.isNil(this.aclTable)) {
            this.aclTable.clear();
            this.aclTable.rows.add(this.acl);
            this.aclTable.draw();
            this.cd.markForCheck();
        }
    }
    private initWidgets() {
        const self = this;
        domready(() => {
            this.aclTable = $(`#${this.tableId}`).DataTable(<DataTables.Settings>{
                processing: true,
                data: this.acl,
                searching: false,
                select: false,
                scrollX: true,
                language: this.translation.getDataTablesLangObject(),
                columns: this.columns,
            });
            this.aclTable.on('change', (e: any, dt: DataTables.DataTable,
                type: string, indexes: number[]) => {
                const right = e.target.value;
                const granted = e.target.checked;
                let rights = {};
                rights[right] = granted;
                const acl = _.assign(rights, _.omit(this.acl[0], right)) as IAcl;
                self.updateAcl(acl);
            });
            this.cd.markForCheck();
        });
    }
    @authorized()
    private updateAcl(acl: IAcl) {
        this.ngZone.runOutsideAngular(() => {
            bibApi.updateAcl(acl).then(result => {
                this.ngZone.run(() => {
                    this.store.dispatch({ type: ACL_UPDATED, payload: acl });
                });
            });
        });
    }

}
