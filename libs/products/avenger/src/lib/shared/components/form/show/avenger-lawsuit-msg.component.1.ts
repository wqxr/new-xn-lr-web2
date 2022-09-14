import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import AvengerapprovalTable from '../approval-normal/approval.fitall.tab';
import AvengerplatTable from '../normal/avenger-msgFirstReview-tab';

@Component({
  template: `
    <div style='width:100%'>
    <ng-container *ngFor="let table of lawsuitMsgtable">
    <p>{{table.title}}</p>
    <table class="table table-bordered table-hover file-row-table" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th *ngFor="let head of table.headText">{{head.label}}</th>

        </tr>
      </thead>
      <tbody>
        <ng-container *ngIf="table.data.length;else block">
          <tr *ngFor="let item of table.data; let i=index">
            <td>{{i+1}}</td>
            <td *ngFor="let head of table.headText">
              <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
            </td>
          </tr>
        </ng-container>
        <tr *ngIf="table.data.length===0">
          <td [attr.colspan]="calcAttrColspan(table)">
            <div class="empty-message"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="height:40px">
      <xn-pagination [rows]="table.pageConfig.pageSize" [first]="table.pageConfig.pageIndex"
        [totalRecords]="table.pageConfig.total" [pageSizeOptions]="[5,10,20,30,50,100]"
        (pageChange)="onPagelawsuit($event,table.get_url,table.pageConfig,table)">
      </xn-pagination>
    </div>
  </ng-container>
    </div>
    `,
  styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'lawsuitMsg', formModule: 'avenger-show' })
export class AvengerLawsuitMsgComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  public Tabconfig: any;
  public lawsuitMsgtable: any;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef, private localStorageService: LocalStorageService, private communicate: PublicCommunicateService) {
  }

  ngOnInit() {
    this.Tabconfig = AvengerapprovalTable.tableFormlist;
    this.lawsuitMsgtable = AvengerplatTable.tableFormlist.tabList.slice(8, this.Tabconfig.length);

    for (let i = 0; i < this.lawsuitMsgtable.length; i++) {
      const item = this.lawsuitMsgtable[i];
      this.xn.avenger.post(item.get_url,
        { company: this.svrConfig.record.supplierName, pageIndex: 0, pageSize: 5 }).subscribe(x => {
          if (x.data && x.data.Result !== null && x.data.Result.length > 0) {
            item.data = x.data.Result;
            item.pageConfig.total = x.data.Result.length;
          } else {
            item.data = [];
            item.pageConfig.total = 0;
          }
        });
    }
  }

  public calcAttrColspan(tabconfig): number {
    const nums: number = tabconfig.headText.length + 1;
    return nums;
  }

  onPagelawsuit(e, url, pageconfig, table) {
    pageconfig = Object.assign({}, pageconfig, e);
    const params: any = {
      pageIndex: e.page || 1,
      pageSize: pageconfig.pageSize,
      company: this.svrConfig.record.supplierName,
    };
    this.xn.avenger.post(url, params).subscribe(x => {
      if (x.data && x.data.Result !== null) {
        table.data = x.data.Result;
        table.pageConfig.total = x.data.Paging.TotalRecords;
      }

    });

  }
}
