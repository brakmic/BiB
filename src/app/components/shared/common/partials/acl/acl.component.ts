import { Component, Input, 
         OnInit, ChangeDetectionStrategy,
         ChangeDetectorRef, SimpleChanges,
         NgZone } from '@angular/core';
import { IAcl } from 'app/interfaces';
import { LogService, i18nService } from 'app/services';
import { bibApi } from 'app/apis';
import { authorized } from 'app/decorators';
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
    @Input() public header: string = 'ACLList';
    private columns: any[] = [];
    private rights: any = undefined;
    private tableId: string = '__table__';
    private aclTable: DataTables.DataTable = undefined;

    constructor(private cd: ChangeDetectorRef,
                private logService: LogService,
                private translation: i18nService,
                private ngZone: NgZone) { }

    public ngOnInit() { 
         const title = _.replace(this.header, / /g,'_');
         this.tableId = `${title}_${cuid()}`;
         this.columns = _.map(_.keys(_.omit(this.rights, 'ID')), k => {
                 return {
                     data: k,
                     render: function (data, type, full, meta) {
                            const checked = data ? 'checked' : '';
                            const val = meta.settings.aoColumns[meta.col].data;
                            return `<input name="${cuid()}" value="${val}" type="checkbox" ${checked}>`;
                        }
                 };
             });
    }
    public ngOnChanges(changes: SimpleChanges) {
        const hdr = changes['header'];
        const acl = changes['acl'];
        if((hdr && !_.isEqual(hdr.currentValue, hdr.previousValue)) ||
            (acl && !_.isEqual(acl.currentValue, acl.previousValue))){
               this.rights = acl.currentValue[0]; // there's always only one element in this array
               this.updateTable();
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
    public ngOnDestroy() {
        $('bib-root').siblings().remove();
        this.aclTable.off('change');
    }
    public ngAfterViewInit() {
        this.initWidgets();
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
              let _rights = {};
              _rights[right] = granted;
              self.rights = _.assign(_rights, _.omit(self.rights, right));
              self.updateAcl();
              
          });
          this.cd.markForCheck();
        });
    }
    @authorized()
    private updateAcl() {
        this.ngZone.runOutsideAngular(() => {
            bibApi.updateAcl(this.rights).then(result => {
                this.ngZone.run(() => {
                    this.cd.markForCheck();
                });
            });
        });
    }

}