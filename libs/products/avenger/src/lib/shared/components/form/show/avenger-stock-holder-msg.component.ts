import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import AvengerplatTable from '../normal/avenger-msgFirstReview-tab';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';

@Component({
  template: `
    <div style='width:100%'>
    <p>万科供应商股东出资信息</p>
    <table class="table table-bordered table-hover file-row-table" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th *ngFor="let head of Tabconfig[5].headText">{{head.label}}</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngIf="Tabconfig[5].data.length;">
          <tr *ngFor="let item of Tabconfig[5].data; let i=index">
            <td>{{i+1}}</td>
            <td *ngFor="let head of Tabconfig[5].headText">
              <div *ngIf="head.value==='moneytype'">人民币</div>
              <div *ngIf="item[head.value]!==''" [innerHTML]="item[head.value] || '/'"></div>
            </td>
          </tr>
        </ng-container>
        <tr *ngIf="Tabconfig[5].data.length===0">
          <td [attr.colspan]="calcAttrColspan(Tabconfig[5])">
            <div class="empty-message"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="height:40px">
      <xn-pagination [rows]="Tabconfig[5].pageConfig.pageSize" [first]="Tabconfig[5].pageConfig.first"
        [totalRecords]="Tabconfig[5].pageConfig.total" [pageSizeOptions]="[5,10,20,30,50,100]"
        (pageChange)="onPage($event,Tabconfig[5])"></xn-pagination>
    </div>
    <p>上游客户股东出资信息</p>
    <table class="table table-bordered table-hover file-row-table" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th *ngFor="let head of Tabconfig[6].headText">{{head.label}}</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngIf="Tabconfig[6].data.length;">
          <tr *ngFor="let item of Tabconfig[6].data; let i=index">
            <td>{{i+1}}</td>

            <td *ngFor="let head of  Tabconfig[6].headText">
              <div *ngIf="head.value==='moneytype'">人民币</div>

                  <div *ngIf="item[head.value]!==''" [innerHTML]="item[head.value] || '/'"></div>
                  <!-- <div *ngIf="item[head.value]===''">-</div> -->


            </td>
          </tr>
        </ng-container>
        <tr *ngIf="Tabconfig[6].data.length===0">
          <td [attr.colspan]="calcAttrColspan(Tabconfig[6])">
            <div class="empty-message"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="height:40px">
      <xn-pagination [rows]="Tabconfig[6].pageConfig.pageSize" [first]="Tabconfig[6].pageConfig.first"
        [totalRecords]="Tabconfig[6].pageConfig.total" [pageSizeOptions]="[5,10,20,30,50,100]"
        (pageChange)="onPage($event,Tabconfig[6])"></xn-pagination>
    </div>
    </div>
    `,
  styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'stockHolderMsg', formModule: 'avenger-show' })
export class AvengerStockHolderMsgComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
  };

  public items: any[] = [];
  public Tabconfig: any;
  paging = 0; // 共享该变量



  constructor(
    private xn: XnService, private vcr: ViewContainerRef,
    private localStorageService: LocalStorageService, private communicate: PublicCommunicateService) {
  }

  ngOnInit() {
    this.Tabconfig = AvengerplatTable.tableFormlist.tabList;
    const item = this.Tabconfig[5];
    const tablesinfo = this.Tabconfig[6];
    this.xn.loading.open();
    this.xn.avenger.post('/sub_system/qichacha/getCompanyMaster',
      { company: this.svrConfig.record.supplierName }).subscribe(x => {
        if (x.data && x.data.Result) {
          item.alldata = x.data.Result.Partners;
          item.data = x.data.Result.Partners.slice(0, this.Tabconfig[5].pageConfig.pageSize);
          item.pageConfig.total = x.data.Result.Partners.length;
        } else {
          this.xn.msgBox.open(false, '未查到该企业信息');
        }
      });

    this.xn.avenger.post('/sub_system/qichacha/getCompanyMaster',
      { company: this.svrConfig.record.upstreamName }).subscribe(x => {
        if (x.data && x.data.Result) {
          tablesinfo.alldata = x.data.Result.Partners;
          tablesinfo.data = x.data.Result.Partners.slice(0, this.Tabconfig[6].pageConfig.pageSize);
          tablesinfo.pageConfig.total = x.data.Result.Partners.length;
        } else {
          this.xn.msgBox.open(false, '未查到该企业信息');
        }
      });

    this.xn.loading.close();

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
