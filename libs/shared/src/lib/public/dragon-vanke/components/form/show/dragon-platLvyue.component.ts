import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DragonViewContractModalComponent } from '../../../modal/dragon-mfile-detail.modal';
import ContractAndPerformanceSupply from '../../bean/supplement-checkers.tab';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
@Component({
  template: `
    <table  class="table table-bordered table-hover text-center file-row-table">
    <thead>
      <tr>
        <th>文件</th>
        <ng-container *ngIf="row.flowId!=='dragon_platform_verify'">
          <th>
            本次产值金额
            <i [ngClass]="{'required-label-strong': true,'required-star': true,'fa': true}"></i>
          </th>
          <th>
            本次付款性质
            <i [ngClass]="{'required-label-strong': true,'required-star': true,'fa': true}"></i>
          </th>
        </ng-container>
        <th>累计确认产值</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items;let i=index">
        <td>
          <ng-container *ngIf="item.performanceFile!==''">
            <a href="javaScript:void (0)" (click)="viewContract(item,i)">
            {{(item.performanceFile | xnJson).length>1 ? (item.performanceFile | xnJson)[0].fileName + '，...' : (item.performanceFile | xnJson)[0].fileName}}
            </a>
          </ng-container>
        </td>
        <ng-container *ngIf="row.flowId!=='dragon_platform_verify'">
          <td>
            <ng-container *ngIf="item.percentOutputValue!==''">
              {{item.percentOutputValue | xnMoney}}
            </ng-container>
          </td>
          <td>
            <ng-container *ngIf="item.payType!==''">
              {{item.payType | xnSelectTransform:'vankePayType'}}
            </ng-container>
          </td>
        </ng-container>
        <td>{{item.totalReceive | xnMoney}}</td>
      </tr>
    </tbody>
  </table>
    `,
})
@DynamicForm({ type: 'platDragon-performance', formModule: 'dragon-show' })
export class ShowlvyueComponent implements OnInit {
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
        // this.uploadPicService.viewDetail(datainfo, this.vcr, DragonViewContractModalComponent);
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

}
