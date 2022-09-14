import { Component, OnInit, ElementRef, Input, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
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
          <!-- 行操作 -->
          <th style="width: '16%'">操作</th>
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
                  <a class="xn-click-a" (click)="viewDetail(item,2,i)">
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
            <td [ngStyle]="{width: ['dragon_supplier_sign'].includes(svrConfig.flow.flowId) ? '8%' : '16%'}">
              <ng-container *ngIf="!['dragon_supplier_sign'].includes(svrConfig.flow.flowId)">
                <a class="xn-click-a" (click)="viewDetail(item,2,i)">补充</a>&nbsp;&nbsp;
                <a class="xn-click-a" (click)="changeFile(item)">修改文件</a>
              </ng-container>
              <ng-container *ngIf="['dragon_supplier_sign'].includes(svrConfig.flow.flowId)">
                <a class="xn-click-a" (click)="viewDetail(item,1,i)">查看</a>
              </ng-container>
            </td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
  <span class="xn-input-alert">{{alert}}</span>
  <ng-template #empty>
    <tr>
      <td [attr.colspan]="6">
        <div class="empty-message"></div>
      </td>
    </tr>
  </ng-template>
  `
})
@DynamicForm({ type: 'lvyue-performance', formModule: 'dragon-input' })
export class PlatlvyueComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  // 表头配置
  public tabconfig = ContractLvyueConfig.getLvYue('lvyue', '');
  public ctrl: AbstractControl;
  public contractCtrl: AbstractControl;
  public lvyueFileList: ContractInfo[] = [];  // 履约文件列表
  // 履约扫描件列表
  public scansFilesList: any[] = [];
  public alert = '';
  public xnOptions: XnInputOptions;

  public constructor(private xn: XnService, private er: ElementRef, private vcr: ViewContainerRef, private cdr: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.tabconfig = ContractLvyueConfig.getLvYue('lvyue', this.row.flowId);
    const val = XnUtils.parseObject(this.row.value, []);
    this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe({
      next: (res: any) => {
        if (res && res.ret === 0 && res.data.data) {
          const contractInfo = Object.assign({}, val[0], this.removePropertyNull(res.data.data));
          this.lvyueFileList = [contractInfo];
          this.scansFilesList = XnUtils.parseObject(contractInfo.performanceFile, []);
          this.toValue(this.lvyueFileList);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {}
    });
    this.ctrl.valueChanges.subscribe((x: any) => {
      this.lvyueFileList = XnUtils.parseObject(x, []);
      this.scansFilesList = XnUtils.parseObject(this.lvyueFileList[0].performanceFile, []);
      this.cdr.markForCheck();
    });
  }

  /**
   * @description: 修改履约证明文件
   * @param {*} files
   * @return {*}
   */
  changeFile(files: any) {
    const params = {
      title: '履约证明修改弹窗',
      checker: [
        {
          title: '履约证明', checkerId: 'files', type: 'dragonMfile', options: { fileext: 'jpg, jpeg, png, pdf', picSize: '500' },
          required: true, value: files.performanceFile,
        }
      ]
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe((x) => {
      if (!!x) {
        this.lvyueFileList[0].performanceFile = x.files;
        this.scansFilesList = x.files;
        this.toValue(this.lvyueFileList);
        this.cdr.markForCheck();
      }
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
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiViewContractModalComponent, params).subscribe(v => {
          if (!!v && v.action === 'ok') {
            const dataObj = Object.assign({}, v.contractInfo, {
              debtUnit: item.debtUnit || '',
              projectCompany: item.projectCompany || '',
              // receive: item.receive || '',
              performanceFile: item.performanceFile,
              contractType: Number(v.contractInfo.contractType)
            });
            this.lvyueFileList = [dataObj];
            this.toValue(this.lvyueFileList);
            // 更新dealContract组件值
            this.toUpdateContract(dataObj);
            this.cdr.markForCheck();
          }
        });
      }
    });
  }

  /**
   * @description: 表单组件set值
   * @param {*} val
   * @return {*}
   */
  private toValue(val: any[] = []) {
    this.ctrl.setValue(JSON.stringify(val));
    this.ctrl.markAsTouched();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }

  /**
   * @description: 更新dealContract组件值
   * @param {any} dataObj
   * @return {*}
   */
  toUpdateContract(dataObj: any) {
    this.contractCtrl = this.form.get('dealContract');
    const inputFiles = XnUtils.parseObject(this.contractCtrl.value, [])[0]?.inputFile || '';
    const contractFiles = XnUtils.parseObject(this.contractCtrl.value, [])[0]?.contractFile || '';
    const updateVal = JSON.parse(JSON.stringify(dataObj));
    const updateVals = this.removeProperty(updateVal, ['contractFile', 'inputFile', 'performanceFile']);
    this.contractCtrl.patchValue(JSON.stringify([{
      ...updateVals,
      contractFile: contractFiles,
      inputFile: inputFiles,
    }]));
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
