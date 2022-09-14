import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import ContractAndPerformanceSupply from 'libs/shared/src/lib/public/dragon-vanke/components/bean/supplement-checkers.tab';
import { DragonConfigMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/config-mfiles-view-modal.component';
import { DragonViewContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-mfile-detail.modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  template: `
  <div style="max-height: 400px;overflow-y: scroll;">
    <table  class="table table-bordered table-hover text-center file-row-table">
    <thead>
    <tr>
    <th>
      <span class="span-line">文件</span>
    </th>
    <th>
      <span class="span-line">文件类型</span>
    </th>
    <th>
      <span class="span-line">履约证明更新时间</span>
    </th>
      <th>
        <span class="span-line">本次产值金额</span>
        <i [ngClass]="{'required-label-strong': true,'required-star': true,'fa': true}"></i>
      </th>
      <th>
        <span class="span-line">本次付款性质</span>
        <i [ngClass]="{'required-label-strong': true,'required-star': true,'fa': true}"></i>
      </th>
    <th>
      <span class="span-line">累计确认产值</span>
    </th>
  </tr>
    </thead>
    <tbody>
    <tr *ngFor="let sub of (items[0]['performanceFile'] | xnJson);let i=index">
    <ng-container>
      <td style="vertical-align: middle">
        <a class="xn-click-a" (click)="onView(items[0],i)">
          {{sub.fileName}}
        </a>
      </td>
      <td style="vertical-align: middle">
        <span>{{ { 'type':sub['firstPerformanceType'],
          'selectBank':sub['secondPerformanceType'] } | xnSelectDeepTransform:'lvYueFileOptions' }}</span>
      </td>

      <ng-container *ngIf="i===0">
        <td style="vertical-align: middle" [attr.rowspan]="(items[0]['performanceFile'] | xnJson).length">
          <span [innerHTML]="items[0]['performanceUpdateTime'] | xnDate:'datetime'"></span>
        </td>
        <td style="vertical-align: middle" [attr.rowspan]="(items[0]['performanceFile'] | xnJson).length">
          <ng-container *ngIf="!!items[0].percentOutputValue!==''">
            {{items[0].percentOutputValue.toFixed(2) | xnMoney}}
          </ng-container>
        </td>
        <td style="vertical-align: middle" [attr.rowspan]="(items[0]['performanceFile'] | xnJson).length">
          <ng-container *ngIf="items[0].payType!==''">
            {{items[0].payType | xnSelectTransform:'vankePayType'}}
          </ng-container>
        </td>
        <td style="vertical-align: middle" [attr.rowspan]="(items[0]['performanceFile'] | xnJson).length">
          <ng-container *ngIf="!!items[0].totalReceive">
            {{items[0].totalReceive.toFixed(2) | xnMoney}}
          </ng-container>
        </td>
      </ng-container>

    </ng-container>
  </tr>
    </tbody>
  </table>
  </div>
    `,
})
@DynamicForm({ type: 'platAgile-performance', formModule: 'dragon-show' })
export class ShowAgilelvyueComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  public items: any[] = [];
  constructor(public xn: XnService, private vcr: ViewContainerRef,) {
  }

  ngOnInit() {
    const data = !!this.row.data ? JSON.parse(this.row.data) : '';
    if (!!data) {
      this.items = data;
      this.items[0]['totalReceive'] = Number(this.items[0]['totalReceive'])
    }
  }

  viewContract(paramsItem, index?: number) {
    const componentType = ['dragon_platform_verify', 'dragon_supplier_sign'].includes(this.row.flowId) ? 'dragonLvYue' : 'vankeLvYue';
    this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
      if (x.ret === 0) {
        let datainfo = null;
        if (x.data.data.contractType === undefined) {
          datainfo = paramsItem;
          datainfo.contractFile = paramsItem.performanceFile;
          datainfo.feeTypeName = x.data.data.feeTypeName;
          datainfo.type = x.data.data.type;
          datainfo.wkType = x.data.data.wkType;
        } else {
          datainfo = x.data.data;
          datainfo.contractFile = paramsItem.performanceFile;
        }
        datainfo.index = index + 1;
        const params = {
          title: '履约证明',
          type: 1,
          contractFile: datainfo.contractFile,
          checker: ContractAndPerformanceSupply.getConfig(componentType, 1, datainfo, this.row)
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonViewContractModalComponent, params).subscribe(v => {
        });
      }

    });
  }

  /**
      *  查看文件
      * @param paramFile file
      * @param index 下标
      */
  public onView(paramFile: any, index: number): void {
    let paramFiles = [];
    paramFiles = [...JSON.parse(this.items[0]['performanceFile'])];
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonConfigMfilesViewModalComponent,
      {
        paramFiles,
        index,
        leftButtons: [{ label: '下载当前文件', operate: 'downloadNow' }],
        rightButtons: []
      }).subscribe(x => { });

  }

}
