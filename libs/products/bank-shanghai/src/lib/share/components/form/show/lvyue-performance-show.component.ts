import { Component, Input, OnInit, ViewContainerRef, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ShEditModalComponent } from '../../../modal/edit-modal.component';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ContractLvyueConfig, ContractInfo } from '../../bean/contract-lvyue';
import ContractAndPerformanceSupply from '../../bean/supplement-checkers.tab';
import * as moment from 'moment';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ShangHaiViewContractModalComponent } from '../../../modal/shanghai-mfile-detail-modal.component';

@Component({
  template: `
  <div class="input-group" style="width: 100%" [formGroup]="form">
    <table class="table table-bordered table-hover file-row-table text-center" width="100%">
      <thead>
        <tr class="table-head">
          <!-- title -->
          <th *ngFor="let head of tabconfig.heads" [ngStyle]="{width: head.width}">
            {{head.label}}
            <i [ngClass]="{
              'required-label-strong': ['percentOutputValue', 'payType'].includes(head.value),
              'required-star': ['percentOutputValue', 'payType'].includes(head.value),
              'fa': ['percentOutputValue', 'payType'].includes(head.value)
            }">
            </i>
          </th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngIf="!!lvyueFileList.length && !!lvyueFileList.length;else empty" >
          <tr *ngFor="let item of lvyueFileList;let i=index" >
            <td *ngFor="let head of tabconfig.heads" [ngStyle]="{width: head.width}">
              <ng-container [ngSwitch]="head.type">
                <!-- 文件 -->
                <ng-container *ngSwitchCase="'files'">
                  <ng-container *ngIf="!!item[head.value]">
                  <a class="xn-click-a" (click)="viewDetail(item,1,i)">
                    {{(item.performanceFile | xnJson).length>1 ? (item.performanceFile | xnJson)[0].fileName + '，...' : (item.performanceFile | xnJson)[0].fileName}}
                  </a>
                  </ng-container>
                </ng-container>
                <!-- 本次付款性质 -->
                <ng-container *ngSwitchCase="'payType'">
                  <div [innerHTML]="item[head.value] | xnSelectTransform:'vankePayType' || ''"></div>
                </ng-container>
                <!-- 金额 -->
                <ng-container *ngSwitchCase="'money'">
                    <ng-container *ngIf="!!item[head.value] || item[head.value]===0">
                      <div>{{item[head.value] | xnMoney: 'true'}}</div>
                    </ng-container>
                </ng-container>
                <!-- 默认 -->
                <ng-container *ngSwitchDefault>
                    <div [innerHTML]="item[head.value]"></div>
                </ng-container>
              </ng-container>
            </td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
  <ng-template #empty>
    <tr>
      <td [attr.colspan]="6">
        <div class="empty-message"></div>
      </td>
    </tr>
  </ng-template>
  `
})
@DynamicForm({ type: 'lvyue-performance', formModule: 'dragon-show' })
export class PlatlvyueShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  // 表头配置
  public tabconfig = ContractLvyueConfig.getLvYue('lvyue', '');
  public lvyueFileList: ContractInfo[] = [];  // 履约文件列表
  // 履约扫描件列表
  public scansFilesList: any[] = [];
  public constructor(private xn: XnService, private er: ElementRef, private vcr: ViewContainerRef) {
  }

  public ngOnInit() {
    this.tabconfig = ContractLvyueConfig.getLvYue('lvyue', this.row.flowId);
    const val = XnUtils.parseObject(this.row.data, []);
    this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe({
      next: (res: any) => {
        if (res && res.ret === 0 && res.data.data) {
          const contractInfo = Object.assign({}, val[0], this.removePropertyNull(res.data.data));
          this.lvyueFileList = [contractInfo];
          this.scansFilesList = XnUtils.parseObject(contractInfo.performanceFile, []);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {}
    });
  }

  /**
   * @description: 补录/查看
   * @param {any} item
   * @param {number} type
   * @param {number} index
   * @return {*}
   */
  viewDetail(item: any, type: number, index?: number) {
    this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
      if (x.ret === 0) {
        const dataInfo = Object.assign({}, item, this.removePropertyNull(x.data.data, [0]), {
          index: index + 1
        });
        const componentType = ['dragon_platform_verify', 'dragon_supplier_sign'].includes(this.row.flowId) ? 'dragonLvYue' : 'vankeLvYue';
        const params = {
          title: '履约证明',
          checkerId: 'performanceFile',
          type,
          mainFlowId: this.svrConfig.record.mainFlowId,
          debtUnit: item.debtUnit || '',
          projectCompany: item.projectCompany || '',
          receive: item.receive || '',
          contractFile: item.performanceFile,
          checker: ContractAndPerformanceSupply.getConfig(componentType, type, dataInfo, this.row)
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiViewContractModalComponent, params).subscribe(v => {});
      }
    });
  }

  /**
   * @description: 数值格式转换
   * @param {string} val
   * @return {*}
   */
  private formatNum2Money(val: string | number = ''): string {
    const filterVal = Number(val.toString().replace(/,/g, '')).toFixed(2);
    const truncNum = filterVal.indexOf('.') > -1 ? filterVal.substring(0, filterVal.indexOf('.')) : filterVal;
    const integer = truncNum.toString().replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
    const decimal = filterVal.indexOf('.') > -1 ?
      filterVal.substring(filterVal.indexOf('.') + 1, filterVal.length) : '';
    const formatVal = `${integer}${!!decimal ? '.' : ''}${decimal}`;
    return formatVal;
  }

  /**
   * @description: 移除对象特定键值对
   * @param {any} obj
   * @param {string} kesArr
   * @return {*}
   */
  removeProperty(obj: any, kesArr: string[] = []): any {
    const objs = {};
    Object.keys(obj).filter((x: string) => !kesArr.includes(x)).map((key: string) => {
      objs[key] = obj[key];
    });
    return objs;
  }

  /**
   * @description: 移除对象空值键值对
   * @param {any} obj
   * @param {string} kesArr
   * @return {*}
   */
  removePropertyNull(obj: any, ext: any[] = []): any {
    const objs = {};
    Object.keys(obj).filter((x: string) => !XnUtils.isEmptys(obj[x], ext)).map((key: string) => {
      objs[key] = obj[key];
    });
    return objs;
  }
}
