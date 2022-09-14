import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import AvengerplatTable from '../normal/avenger-msgFirstReview-tab';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  template: `
  <table class="table table-bordered table-striped text-center">
  <tbody>
    <ng-container>
      <tr>
        <td>项目</td>
        <td>最新一份财报的时间范围</td>
        <td>倒数第二份财报的时间范围</td>
        <!-- <td>倒数第三份财报的时间范围</td> -->
      </tr>
      <tr *ngIf='keydetail.length>0'>
        <td>经营活动现金净流量/总债务</td>
        <td><i class="fa" [style.color]='keydetail[0].CASH_FLOW_DIVI_TOTAL_DEBT.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[0].CASH_FLOW_DIVI_TOTAL_DEBT.healthAssessment==='#FF0000','fa-arrow-up':keydetail[0].CASH_FLOW_DIVI_TOTAL_DEBT.healthAssessment==='#008000','fa-arrow-right':keydetail[0].CASH_FLOW_DIVI_TOTAL_DEBT.healthAssessment==='#FFFF00'}"></i>{{keydetail[0].CASH_FLOW_DIVI_TOTAL_DEBT.value}}
        </td>
        <td><i class="fa" [style.color]='keydetail[1].CASH_FLOW_DIVI_TOTAL_DEBT.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[1].CASH_FLOW_DIVI_TOTAL_DEBT.healthAssessment==='#FF0000','fa-arrow-up':keydetail[1].CASH_FLOW_DIVI_TOTAL_DEBT.healthAssessment==='#008000','fa-arrow-right':keydetail[1].CASH_FLOW_DIVI_TOTAL_DEBT.healthAssessment==='#FFFF00'}"></i>{{keydetail[1].CASH_FLOW_DIVI_TOTAL_DEBT.value}}
        </td>
        <!-- <td [style.color]='keydetail[2].CASH_FLOW_DIVI_TOTAL_DEBT.healthAssessment'>{{keydetail[2].CASH_FLOW_DIVI_TOTAL_DEBT.value}}</td> -->
      </tr>
      <tr *ngIf='keydetail.length>0'>
        <td>净资产收益率(%)</td>
        <td><i class="fa" [style.color]='keydetail[0].EQUITY_YIELD.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[0].EQUITY_YIELD.healthAssessment==='#FF0000','fa-arrow-up':keydetail[0].EQUITY_YIELD.healthAssessment==='#008000','fa-arrow-right':keydetail[0].EQUITY_YIELD.healthAssessment==='#FFFF00'}"></i>{{keydetail[0].EQUITY_YIELD.value}}
        </td>
        <td><i class="fa" [style.color]='keydetail[1].EQUITY_YIELD.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[1].EQUITY_YIELD.healthAssessment==='#FF0000','fa-arrow-up':keydetail[1].EQUITY_YIELD.healthAssessment==='#008000','fa-arrow-right':keydetail[1].EQUITY_YIELD.healthAssessment==='#FFFF00'}"></i>{{keydetail[1].EQUITY_YIELD.value}}
        </td>
        <!-- <td [style.color]='keydetail[2].EQUITY_YIELD.healthAssessment'>{{keydetail[2].EQUITY_YIELD.value}}</td> -->
      </tr>
      <tr *ngIf='keydetail.length>0'>
        <td>销售（营业）利润率</td>
        <td><i class="fa" [style.color]='keydetail[0].SALE_BENE_RATE.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[0].SALE_BENE_RATE.healthAssessment==='#FF0000','fa-arrow-up':keydetail[0].SALE_BENE_RATE.healthAssessment==='#008000','fa-arrow-right':keydetail[0].SALE_BENE_RATE.healthAssessment==='#FFFF00'}"></i>{{keydetail[0].SALE_BENE_RATE.value}}
        </td>
        <td><i class="fa" [style.color]='keydetail[1].SALE_BENE_RATE.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[1].SALE_BENE_RATE.healthAssessment==='#FF0000','fa-arrow-up':keydetail[1].SALE_BENE_RATE.healthAssessment==='#008000','fa-arrow-right':keydetail[1].SALE_BENE_RATE.healthAssessment==='#FFFF00'}"></i>{{keydetail[1].SALE_BENE_RATE.value}}
        </td>
        <!-- <td [style.color]='keydetail[2].SALE_BENE_RATE.healthAssessment'>{{keydetail[2].SALE_BENE_RATE.value}}</td> -->
      </tr>
      <tr *ngIf='keydetail.length>0'>
        <td>流动资产周转率（次）</td>
        <td><i class="fa" [style.color]='keydetail[0].LIQUIDITY_CYCLE.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[0].LIQUIDITY_CYCLE.healthAssessment==='#FF0000','fa-arrow-up':keydetail[0].LIQUIDITY_CYCLE.healthAssessment==='#008000','fa-arrow-right':keydetail[0].LIQUIDITY_CYCLE.healthAssessment==='#FFFF00'}"></i>{{keydetail[0].LIQUIDITY_CYCLE.value}}
        </td>
        <td><i class="fa" [style.color]='keydetail[1].LIQUIDITY_CYCLE.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[1].LIQUIDITY_CYCLE.healthAssessment==='#FF0000','fa-arrow-up':keydetail[1].LIQUIDITY_CYCLE.healthAssessment==='#008000','fa-arrow-right':keydetail[1].LIQUIDITY_CYCLE.healthAssessment==='#FFFF00'}"></i>{{keydetail[1].LIQUIDITY_CYCLE.value}}
        </td>
        <!-- <td [style.color]='keydetail[2].LIQUIDITY_CYCLE.healthAssessment'>{{keydetail[2].LIQUIDITY_CYCLE.value}}</td> -->
      </tr>
      <tr *ngIf='keydetail.length>0'>
        <td>销售（营业）增长率</td>
        <td><i class="fa" [style.color]='keydetail[0].SALE_INCREASE_RATE.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[0].SALE_INCREASE_RATE.healthAssessment==='#FF0000','fa-arrow-up':keydetail[0].SALE_INCREASE_RATE.healthAssessment==='#008000','fa-arrow-right':keydetail[0].SALE_INCREASE_RATE.healthAssessment==='#FFFF00'}"></i>{{keydetail[0].SALE_INCREASE_RATE.value}}
        </td>
        <td><i class="fa" [style.color]='keydetail[1].SALE_INCREASE_RATE.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[1].SALE_INCREASE_RATE.healthAssessment==='#FF0000','fa-arrow-up':keydetail[1].SALE_INCREASE_RATE.healthAssessment==='#008000','fa-arrow-right':keydetail[1].SALE_INCREASE_RATE.healthAssessment==='#FFFF00'}"></i>{{keydetail[1].SALE_INCREASE_RATE.value}}
        </td>
        <!-- <td [style.color]='keydetail[2].SALE_INCREASE_RATE.healthAssessment'>{{keydetail[2].SALE_INCREASE_RATE.value}}</td> -->
      </tr>
      <tr *ngIf='keydetail.length>0'>
        <td>总债务/ebitda</td>
        <td><i class="fa" [style.color]='keydetail[0].TOTAL_DEBT.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[0].TOTAL_DEBT.healthAssessment==='#FF0000','fa-arrow-up':keydetail[0].TOTAL_DEBT.healthAssessment==='#008000','fa-arrow-right':keydetail[0].TOTAL_DEBT.healthAssessment==='#FFFF00'}"></i>{{keydetail[0].TOTAL_DEBT.value}}
        </td>
        <td><i class="fa" [style.color]='keydetail[1].TOTAL_DEBT.healthAssessment'
            [ngClass]="{'fa-arrow-down':keydetail[1].TOTAL_DEBT.healthAssessment==='#FF0000','fa-arrow-up':keydetail[1].TOTAL_DEBT.healthAssessment==='#008000','fa-arrow-right':keydetail[1].TOTAL_DEBT.healthAssessment==='#FFFF00'}"></i>{{keydetail[1].TOTAL_DEBT.value}}
        </td>
        <!-- <td [style.color]='keydetail[2].TOTAL_DEBT.healthAssessment'>{{keydetail[2].TOTAL_DEBT.value}}</td> -->
      </tr>
      <tr *ngIf="keydetail.length===0">
          <td [attr.colspan]="3">
            <div class="empty-message"></div>
          </td>
        </tr>
    </ng-container>
  </tbody>
</table>
    `,
  styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'accountsTarget', formModule: 'avenger-show' })
export class AvengerAccountsTargetComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
  };

  public Tabconfigcheck: any;
  keydetail: any[] = [];

  constructor(private xn: XnService) {
  }

  ngOnInit() {
    this.Tabconfigcheck = AvengerplatTable.tableFormlist.tabList;
    this.xn.api.post('/custom/avenger/guarantee_manager/financing_target', {
      dt: this.getNowFormatDate(),
      orgName: this.svrConfig.record.supplierName,
    }).subscribe(data => {
      if (data.ret === 0) {
        this.keydetail = data.data.data;
      } else {
      }
    });
  }
  getNowFormatDate() {
    const date = new Date();
    const seperator1 = '-';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const strDate = date.getDate();
    let currentmonth = '';
    let currentDate = '';
    if (month >= 1 && month <= 9) {
      currentmonth = '0' + month;
    } else {
      currentmonth = month.toString();
    }
    if (strDate >= 0 && strDate <= 9) {
      currentDate = '0' + strDate;
    } else {
      currentDate = strDate.toString();
    }
    const currentdate = year + seperator1 + currentmonth + seperator1 + currentDate;
    return currentdate;
  }
}
