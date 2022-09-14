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
            <td>序号</td>
            <td>项目</td>
            <td>检查结果</td>
            <td>财报周期</td>
          </tr>
          <tr *ngFor="let item of Tabconfigcheck[7].data;let i=index">
            <td>{{i+1}}</td>
            <td>{{item.itemDesc}}</td>
            <td>{{item.outcomeDesc}}</td>
            <td>{{item.dateKey}}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
    <xn-pagination [rows]="Tabconfigcheck[7].pageConfig.pageSize" [first]="Tabconfigcheck[7].pageConfig.first"
      [totalRecords]="Tabconfigcheck[7].pageConfig.total" [pageSizeOptions]="[5,10,20,30,50,100]"
      (pageChange)="onPagefinacate($event)">
    </xn-pagination>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'accountsCheck', formModule: 'avenger-show' })
export class AvengerAccountsCheckComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };

    public items: any[] = [];
    public Tabconfigcheck: any;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        this.Tabconfigcheck = AvengerplatTable.tableFormlist.tabList;
        this.xn.api.post('/custom/avenger/guarantee_manager/financing_check', {
            dt: '2019-07-15',
            orgName: this.svrConfig.record.supplierName,
            start: 0,
            length: 10,
        }).subscribe(data => {
            this.Tabconfigcheck[7].data = data.data.data;
            this.Tabconfigcheck[7].pageConfig.total = data.data.count;

        });
    }

    onPagefinacate(page: number) {
        page = page || 1;
        this.xn.loading.open();
        this.xn.api.post('/custom/avenger/guarantee_manager/financing_check', {
            dt: this.getNowFormatDate(),
            orgName: this.svrConfig.record.supplierName,
            start: page,
            length: 10,
        }).subscribe(x => {
            if (x.data) {
                this.Tabconfigcheck[7].data = x.data.data;

            }
        });
        this.xn.loading.close();
    }

    /**
    * 计算表格合并项
    * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
    */
    public calcAttrColspan(tabconfig): number {
        const nums: number = tabconfig.headText.length + 1;
        return nums;
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
