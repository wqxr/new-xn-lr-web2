import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import AvengerplatTable from '../normal/avenger-msgFirstReview-tab';

@Component({
    template: `
    <div style='width:100%'>
    <table class="table table-bordered table-hover file-row-table" width="100%">
    <thead>
      <tr>
        <th>序号</th>
        <th *ngFor="let head of Tabconfigcheck[4].headText">{{head.label}}</th>
      </tr>
    </thead>
    <tbody>
      <ng-container *ngIf="Tabconfigcheck[4].data.length">
        <tr *ngFor="let item of Tabconfigcheck[4].data; let i=index">
          <td>{{i+1}}</td>
          <td *ngFor="let head of Tabconfigcheck[4].headText">
            <div [innerHTML]="item[head.value]"></div>
          </td>
        </tr>
      </ng-container>
      <tr *ngIf="Tabconfigcheck[4].data.length===0">
        <td [attr.colspan]="calcAttrColspan(Tabconfigcheck[4])">
          <div class="empty-message"></div>
        </td>
      </tr>
    </tbody>
  </table>
        <div style="height:40px">
            <xn-pagination [rows]="Tabconfigcheck[4].pageConfig.pageSize" [first]="Tabconfigcheck[4].pageConfig.first"
            [totalRecords]="Tabconfigcheck[4].pageConfig.total" [pageSizeOptions]="[5,10,20,30,50,100]"
            (pageChange)="onPage($event,Tabconfigcheck[4])"></xn-pagination>
        </div>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'alertMsg', formModule: 'avenger-show' })
export class AvengerAlertMsgComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    public items: any[] = [];
    public Tabconfigcheck: any;
    paging = 0; // 共享该变量

    public companyinfo = {
        supplierName: '', // 供应商
        upstreamName: '', // 上游客户
        factoringName: '', // 保理商
        supplierAppId: '',  // 上游客户id
        upstreamAppId: '', // 供应商id
    };
    constructor(
        private xn: XnService, private localStorageService: LocalStorageService,
        private vcr: ViewContainerRef, private communicate: PublicCommunicateService, ) {
    }

    ngOnInit() {
        this.Tabconfigcheck = AvengerplatTable.tableFormlist.tabList;
        this.xn.avenger.post('/sub_system/risk/alert', { companyName: this.svrConfig.record.supplierName }).subscribe(x => {
            if (x.data) {
                this.Tabconfigcheck[4].alldata = x.data;
                this.Tabconfigcheck[4].data = x.data.slice(0, this.Tabconfigcheck[4].pageConfig.pageSize);
                this.Tabconfigcheck[4].pageConfig.total = x.data.length;

            }
        });
        // this.xn.loading.close();

    }

    calcAttrColspan(tabconfig) {
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
