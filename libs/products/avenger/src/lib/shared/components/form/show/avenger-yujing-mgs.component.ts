import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import AvengerapprovalTable from '../approval-normal/approval.fitall.tab';
import AvengerplatTable from '../normal/avenger-msgFirstReview-tab';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';


@Component({
    template: `
    <div style='width:100%'>
    <table class="table table-bordered table-hover file-row-table" width="100%">
    <thead>
      <tr>
        <th>序号</th>
        <th *ngFor="let head of Tabconfigcheck[3].headText">{{head.label}}</th>
      </tr>
    </thead>
    <tbody>
      <ng-container *ngIf="Tabconfigcheck[3].data.length;">
        <tr *ngFor="let item of Tabconfigcheck[3].data; let i=index">
          <td>{{i+1}}</td>
          <td *ngFor="let head of Tabconfigcheck[3].headText">
            <div [innerHTML]="item[head.value]"></div>
          </td>
        </tr>
      </ng-container>
      <tr *ngIf="Tabconfigcheck[3].data.length===0">
        <td [attr.colspan]="calcAttrColspan(Tabconfigcheck[3])">
          <div class="empty-message"></div>
        </td>
      </tr>
    </tbody>
  </table>
  <div style="height:40px">
    <xn-pagination [rows]=" Tabconfigcheck[3].pageConfig.pageSize" [first]=" Tabconfigcheck[3].pageConfig.first"
      [totalRecords]=" Tabconfigcheck[3].pageConfig.total" [pageSizeOptions]="[5,10,20,30,50,100]"
      (pageChange)="onPage($event,Tabconfigcheck[3])"></xn-pagination>
  </div>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'yujingMsg', formModule: 'avenger-show' })
export class AvengerYujingMsgComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    items: any[] = [];
    alldatalist: any[] = [];
    Tabconfig: any;
    public Tabconfigcheck: any;
    paging = 0; // 共享该变量


    constructor(
        private xn: XnService, private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.Tabconfig = AvengerapprovalTable.tableFormlist;
        this.Tabconfigcheck = AvengerplatTable.tableFormlist.tabList;
        this.xn.avenger.post('/sub_system/risk/warn', { companyName: this.svrConfig.record.supplierName }).subscribe(x => {
            if (x.data) {
                this.Tabconfigcheck[3].alldata = x.data;
                this.Tabconfigcheck[3].data = x.data.slice(0, this.Tabconfigcheck[3].pageConfig.pageSize);
                this.Tabconfigcheck[3].pageConfig.total = x.data.length;
            }

        });

    }

    public calcAttrColspan(tabconfig): number {
        const nums: number = tabconfig.headText.length + 1;
        return nums;
    }

    onPage(e, tableinfo) {
        this.paging = e.page || 1;
        if (this.paging === 1) {
            tableinfo.data = tableinfo.alldata.slice(0, tableinfo.pageConfig.pageSize);

        } else {
            tableinfo.data = tableinfo.alldata.slice((this.paging - 1) * tableinfo.pageConfig.pageSize,
                (this.paging - 1) * tableinfo.pageConfig.pageSize + tableinfo.pageConfig.pageSize);

        }
    }
}
