import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import AvengerplatTable from '../normal/avenger-msgFirstReview-tab';

@Component({
  template: `
    <div style='width:100%'>
    <table class="table table-bordered table-hover file-row-table" width="100%">
    <thead>
      <tr>
        <th>序号</th>
        <th *ngFor="let head of Tabconfigcheck[1].headText">{{head.label}}</th>

      </tr>
    </thead>
    <tbody>
      <ng-container *ngIf="historydata.length!==0">
        <tr>
          <td>1</td>
         <td>{{historydata[0].supplierName}}</td>
         <td>{{historydata[0].historyCounts}}</td>
         <td>{{historydata[0].historyAmount}}</td>
         <td>{{historydata[0].historyAverageAmount}}</td>
         <td>{{historydata[0].backAbnormalCounts}}</td>
        </tr>
      </ng-container>
      <tr *ngIf="historydata.length===0">
      <td [attr.colspan]="6">
        <div class="empty-message"></div>
      </td>
    </tr>
    </tbody>
  </table>
  <p>详情列表</p>
  <table class="table table-bordered table-hover file-row-table" width="100%">
    <thead>
      <tr>
          <th>序号</th>
        <th *ngFor="let head of Tabconfigcheck[2].headText">{{head.label}}</th>
      </tr>
    </thead>
    <tbody>
      <ng-container *ngIf="historydata.length">
        <tr *ngFor="let item of items; let i=index">
            <td>{{i+1}}</td>
            <td *ngFor="let head of Tabconfigcheck[2].headText">
                  <ng-container *ngIf="head.type==='mainFlowId'">
                      <a href="javaScript:void(0)"
                         (click)="hwModeService.viewProcess(item[head.value],50)">{{item[head.value]}}</a>
                    </ng-container>
                    <ng-container *ngIf="head.value!=='mainFlowId'">
                        <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                    </ng-container>
            </td>

        </tr>
      </ng-container>
      <tr *ngIf="items.length===0">
        <td [attr.colspan]="calcAttrColspan(Tabconfigcheck[2])">
          <div class="empty-message"></div>
        </td>
      </tr>

    </tbody>
  </table>
  <div style="height:40px">
    <xn-pagination [rows]="pageConfighistory.pageSize" [first]="pageConfighistory.first" [totalRecords]="pageConfighistory.total"
      [pageSizeOptions]="[5,10,20,30,50,100]" (pageChange)="onPagehistory($event)"></xn-pagination>
  </div>
    </div>
    `,
  styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'historyBusiness', formModule: 'avenger-show' })
export class AvengerHistoryBusinessComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() memo: string;
  @Input() svrConfig: any;

  pageConfighistory = {
    pageSize: 5,
    first: 0,
    total: 0,
  };
  public historydata: any[] = [];
  public items: any[] = [];
  public Tabconfigcheck: any;


  constructor(private xn: XnService, public hwModeService: HwModeService, ) {
  }

  ngOnInit() {
    this.Tabconfigcheck = AvengerplatTable.tableFormlist.tabList;
    // const data = this.row.data;
    this.xn.avenger.post('/sub_system/history/allBusiness', {
      mainFlowId: this.svrConfig.record.mainFlowId,
      start: 0, length: this.pageConfighistory.pageSize
    }).subscribe(x => {

      if (x.ret !== 0) {
        this.xn.msgBox.open(false, x.msg);
      } else {
        if (x.data) {
          this.items = x.data.rows;
          this.historydata[0] = x.data.history;
          this.pageConfighistory.total = this.items.length;
        }
      }
    });
  }


  onPagehistory(page: number) {
    page = page || 1;
    this.xn.loading.open();
    this.xn.avenger.post('/sub_system/history/allBusiness', {
      mainFlowId: this.svrConfig.record.mainFlowId,
      start: (page - 1) * this.pageConfighistory.pageSize, length: this.pageConfighistory.pageSize
    }).subscribe(x => {
      if (x.ret !== 0) {
        this.xn.msgBox.open(false, x.msg);
      } else {
        if (x.data) {
          this.items = x.data.rows;
          this.historydata[0] = x.data.history;
          this.pageConfighistory.total = this.items.length;
        }
      }
    });
    this.xn.loading.close();
  }

  public calcAttrColspan(tabconfig): number {
    const nums: number = tabconfig.headText.length + 1;
    return nums;
  }
}
