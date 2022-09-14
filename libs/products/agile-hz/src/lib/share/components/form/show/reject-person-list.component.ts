import { Component, Input, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';


@Component({
  template: `
    <table class="table table-bordered table-hover file-row-table" width="100%">
    <thead>
      <tr>
        <th>序号</th>
        <th>交易id</th>
        <th>付款确认书编号</th>
        <th>收款单位</th>
        <th>申请付款单位</th>
        <th>应收账款金额</th>
        <th>资产转让折扣率</th>
        <th>交易状态</th>
        <th *ngIf="row.flowId!=='sub_factoring_jd_retreat'">撤销登记证明文件</th>
        <th *ngIf="false">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items;let i=index">
        <td>{{i+1}}</td>
        <td style='word-break:break-all'><a href="javaScript:void(0)"
        (click)="hwModeService.AgileHzViewProcess(item.mainFlowId)">{{item.mainFlowId}}</a></td>
        <td>{{item?.payConfirmId}}</td>
        <td>{{ item?.debtUnit }}</td>
        <td>{{ item?.projectCompany }}</td>
        <td style='word-break:break-all'>{{ item?.receive.toFixed(2)| xnMoney}}</td>
        <td style='word-break:break-all'>{{ item?.discountRate}}%</td>
        <td>
            <ng-container *ngIf="item['mainFlowId'].endsWith('a')">
                {{ item?.flowId | xnSelectTransform:'agileXingshunTradeStatus' }}
            </ng-container>
        </td>
        <td *ngIf="(!item.certificateFile || item.certificateFile==='')&& svrConfig.record.flowId!=='sub_factoring_jd_retreat'"></td>
        <td *ngIf="item.certificateFile!=='' && item.certificateFile!==undefined">
        <a class='xn-click-a' (click)='ViewFile(item.certificateFile)'>
        {{(item.certificateFile | xnJson).length>1 ? (item.certificateFile | xnJson)[0].fileName + '，...' : (item.certificateFile | xnJson)[0].fileName}}
        </a></td>

      </tr>
    </tbody>
  </table>
    `,
  styles: [`
    table tbody {
        display:block;
        max-height: 200px;
        overflow-y:scroll;
        word-break: break-all;
        -webkit-overflow-scrolling: touch; // 为了滚动顺畅
    }
    table tbody::-webkit-scrollbar {
        display: none; // 隐藏滚动条
    }
    table thead, tbody tr {
        display:table;
        width:100%;
        table-layout:fixed;
    }
    table tbody tr td{
        max-width: 150px;
        word-wrap:break-word"
    }
     `

  ]
})
@DynamicForm({ type: 'retreat-list-yjl', formModule: 'dragon-show' })
export class RejectPersonListJdshowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;


  public items: any[] = [];


  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public hwModeService: HwModeService,
  ) {
  }

  ngOnInit() {
    this.items = JSON.parse(this.row.data);
  }

  ViewFile(pramFile) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, JSON.parse(pramFile))
      .subscribe(() => {
      });
  }

}
