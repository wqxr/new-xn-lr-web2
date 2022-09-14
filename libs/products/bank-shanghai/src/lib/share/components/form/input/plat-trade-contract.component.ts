/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光/万科/上海银行--平台初审交易合同（优化）
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao            增加             2019-08-30
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ShEditModalComponent } from '../../../modal/edit-modal.component';
import { ShangHaiMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { ShangHaiViewContractModalComponent } from '../../../modal/shanghai-mfile-detail-modal.component';
import { ContractLvyueConfig, ContractInfo } from '../../bean/contract-lvyue';
import ContractAndPerformanceSupply from '../../bean/supplement-checkers.tab';

@Component({
  selector: 'lib-plat-trade-contract',
  template: `
  <div class="contract-info">
    <table class="table table-bordered text-center">
      <thead>
        <tr class="table-head">
          <!-- title -->
          <th *ngFor="let head of tabconfig.heads" [ngStyle]="{width: head.width}">
            {{head.label}}
            <i [ngClass]="{
              'required-label-strong': ['contractType', 'contractName'].includes(head.value),
              'required-star': ['contractType', 'contractName'].includes(head.value),
              'fa': ['contractType', 'contractName'].includes(head.value)
            }">
            </i>
          </th>
          <!-- 行操作 -->
          <th style="width: '8%'">操作</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngIf="!!contractInfos.length;else empty" >
          <tr *ngFor="let item of contractInfos;let i=index" >
            <td *ngFor="let head of tabconfig.heads" [ngStyle]="{width: head.width}">
              <ng-container [ngSwitch]="head.type">
                <!-- 合同类型 -->
                <ng-container *ngSwitchCase="'contractType'">
                    <div [innerHTML]="item[head.value] | xnSelectTransform:'vankeContracttype' || ''"></div>
                </ng-container>
                <!-- 文件 -->
                <ng-container *ngSwitchCase="'files'">
                  <ng-container *ngIf="!!item[head.value]">
                      <ng-container *ngIf="['sh_vanke_financing_sign'].includes(svrConfig.flow.flowId);else shSign">
                        <a  href='javascript:void(0)' (click)="viewDetail(item,1,i)">
                          {{(item[head.value] | xnJson).length>1 ? (item[head.value] | xnJson)[0].fileName + '，...' : (item[head.value] | xnJson)[0].fileName}}
                        </a>
                      </ng-container>
                      <ng-template #shSign>
                        <a  href='javascript:void(0)' (click)="viewDetail(item,2,i)">
                          {{(item[head.value] | xnJson).length>1 ? (item[head.value] | xnJson)[0].fileName + '，...' : (item[head.value] | xnJson)[0].fileName}}
                        </a>
                      </ng-template>
                  </ng-container>
                </ng-container>
                <!-- 金额 -->
                <ng-container *ngSwitchCase="'money'">
                    <ng-container *ngIf="!!item[head.value] || item[head.value]===0">
                      <div>{{item[head.value] | number:'1.2-2' | xnMoney: 'true'}}</div>
                    </ng-container>
                </ng-container>
                <!-- 默认 -->
                <ng-container *ngSwitchDefault>
                    <div [innerHTML]="item[head.value]"></div>
                </ng-container>
              </ng-container>
            </td>
            <td style="width: '8%'">
              <ng-container *ngIf="!['dragon_supplier_sign', 'vanke_financing_sign', 'sh_vanke_financing_sign'].includes(svrConfig.flow.flowId)">
                <a href='javascript:void(0)' (click)='viewDetail(item,2,i)'>补充</a>
              </ng-container>
              <ng-container *ngIf="['dragon_supplier_sign'].includes(svrConfig.flow.flowId) && !['vanke_financing_sign', 'sh_vanke_financing_sign'].includes(svrConfig.flow.flowId)">
                <a href='javascript:void(0)' (click)='viewDetail(item,1,i)'>查看</a>
              </ng-container>
            </td>
          </tr>
        </ng-container>
        <ng-container *ngIf="!!contractInfos.length;else empty1">
          <tr>
            <td *ngFor="let head of tabconfig.heads" [ngStyle]="{width: head.width}">
              <ng-container [ngSwitch]="head.value">
                <!-- 合计-->
                <ng-container *ngSwitchCase="'contractId'">
                    <div [innerHTML]="'合计'"></div>
                </ng-container>
                <!-- 合同金额 -->
                <ng-container *ngSwitchCase="'contractMoney'">
                    <div [innerHTML]="statistics.contractMoney | number:'1.2-2' | xnMoney: 'true'"></div>
                </ng-container>
                <!-- 默认 -->
                <ng-container *ngSwitchDefault>
                    <div [innerHTML]="'/'"></div>
                </ng-container>
              </ng-container>
            </td>
            <td style="width: '8%'"><div [innerHTML]="'/'"></div></td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
  <div class="contract-files no-padding" *ngIf="!['dragon_supplier_sign', 'vanke_financing_sign', 'sh_vanke_financing_sign'].includes(svrConfig.flow.flowId)">
    <dragon-xn-mfile-input [row]='fileUpCheckers[0]' [form]="fileUpForm"></dragon-xn-mfile-input>
    <table class="table table-bordered text-center" style='float:left'>
      <thead>
        <tr class="table-head">
          <!-- title -->
          <th>序号</th>
          <th>合同扫描件</th>
          <!-- 行操作 -->
          <th *ngIf="!['dragon_supplier_sign', 'vanke_financing_sign', 'sh_vanke_financing_sign'].includes(svrConfig.flow.flowId)">操作</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngIf="!!scansFilesList.length">
          <tr *ngFor="let sub of scansFilesList;let i=index">
            <ng-container>
              <td>
                <span>{{i+1}}</span>
              </td>
              <td><a href='javascript:void(0)' (click)="fileView(sub)">
                {{(sub | xnJson).length>1 ? (sub | xnJson)[0].fileName + '，...' : (sub | xnJson)[0].fileName}}
                </a>
              </td>
              <td *ngIf="!['dragon_supplier_sign', 'vanke_financing_sign', 'sh_vanke_financing_sign'].includes(svrConfig.flow.flowId)">
                <a href='javascript:void(0)' (click)='editFile(sub,i+1)'>修改</a>
                &nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' (click)='deleteFile(i)'>删除</a>
              </td>
            </ng-container>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
  <div class="match-info">
    <span style='width:37%'>{{matchInfo.label}}</span>
    <input style='width:63%;padding-top:6px' #input class="form-control xn-input-font xn-input-border-radius" [ngClass]="myClass"
      type="text" nz-buttonautocomplete="off" [value]='matchInfo.isMatch' readonly/>
  </div>
  <span class="xn-input-alert">{{alert}}</span>
  <ng-template #empty>
    <tr>
      <td [attr.colspan]="6">
        <div class="empty-message"></div>
      </td>
    </tr>
  </ng-template>
  <ng-template #empty1>
    <tr>
      <td [attr.colspan]="3">
        <div class="empty-message"></div>
      </td>
    </tr>
  </ng-template>
  `
})
@DynamicForm({ type: 'trade-contract', formModule: 'dragon-input' })
export class PlatTradeContractComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public ctrl: AbstractControl;
  public lvYueCtrl: AbstractControl;
  // 表头配置
  public tabconfig = ContractLvyueConfig.platContract;
  // 交易合同信息列表
  public contractInfos: ContractInfo[] = [];
  // 统计列
  public statistics: { [key: string]: any } = {
    contractMoney: 0  // 合同总金额
  };
  // 合同扫描件列表
  public scansFilesList: any[] = [];
  // 上传文件checkers
  public fileUpCheckers: CheckersOutputModel[] = ContractLvyueConfig.fileUpCheckers;
  // 上传组件表单
  fileUpForm: FormGroup;

  // 判断合同账户信息与供应商收款账户信息是否一致
  public matchInfo = {
    label: '合同账户信息与供应商收款账户信息是否一致',
    isMatch: '否'  // 0否 1是
  };
  public xnOptions: XnInputOptions;
  alert = '';
  myClass = '';
  constructor(
    private xn: XnService, private vcr: ViewContainerRef, private er: ElementRef,
    private cdr: ChangeDetectorRef, private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.fileUpForm = XnFormUtils.buildFormGroup(this.fileUpCheckers);
    // 设置初始值
    const val = XnUtils.parseObject(this.row.value, []);
    this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe({
      next: (res: any) => {
        if (res && res.ret === 0 && res.data.data) {
          const contractInfo = Object.assign({}, val[0], this.removePropertyNull(res.data.data));
          this.contractInfos = [contractInfo];
          this.statistics.contractMoney = this.contractInfos.reduce((prev: any, current: any, index: number) => {
            const value = prev + (!!current.contractMoney ? this.formatMoney2Num(current.contractMoney) : 0);
            return value.toFixed(2);
          }, 0);
          if (!contractInfo.inputFile) {
            this.contractInfos[0].inputFile = JSON.stringify([contractInfo.contractFile]);
            this.scansFilesList = [];
          } else {
            this.scansFilesList = XnUtils.parseObject(contractInfo.inputFile, []);
          }
          this.toValue(this.contractInfos);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {}
    });
    this.ctrl.valueChanges.subscribe((x: any) => {
      this.contractInfos = XnUtils.parseObject(x, []);
      this.scansFilesList = XnUtils.parseObject(this.contractInfos[0].inputFile, []);
      this.statistics.contractMoney = this.contractInfos.reduce((prev: any, current: any, index: number) => {
        const value = prev + (!!current.contractMoney ? this.formatMoney2Num(current.contractMoney) : 0);
        return value.toFixed(2);
      }, 0);
      this.cdr.markForCheck();
    });
    // 文件上传订阅
    this.fileUpForm.valueChanges.subscribe((res: any) => {
      this.scansFilesList.push(res.contractUpload);
      this.setFile();
    });
  }

  /**
   * @description: 补录/查看
   * @param {any} item
   * @param {number} paramType
   * @param {number} index
   * @return {*}
   */
  viewDetail(item: any, paramType: number, index?: number) {
    this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
      if (x.ret === 0) {
        const dataInfo = Object.assign({}, item, this.removePropertyNull(x.data.data, [0]));
        const editType = paramType === 1 ? 1 : 2;
        const componentType = ['dragon_platform_verify', 'dragon_supplier_sign'].includes(this.row.flowId) ? 'dragonContract' : 'vankeContract';
        const params = {
          title: '交易合同',
          checkerId: 'dealContract',
          type: editType,
          mainFlowId: this.svrConfig.record.mainFlowId,
          debtUnit: item.debtUnit || '',
          projectCompany: item.projectCompany || '',
          receive: item.receive || '',
          contractFile: item.contractFile,
          inputFile: item.inputFile,
          checker: ContractAndPerformanceSupply.getConfig(componentType, editType, dataInfo, this.row)
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiViewContractModalComponent, params).subscribe(v => {
          if (!!v && v.action === 'ok') {
            const dataObj = Object.assign({}, v.contractInfo, {
              debtUnit: item.debtUnit || '',
              projectCompany: item.projectCompany || '',
              // receive: item.receive || '',
              contractFile: item.contractFile,
              inputFile: item.inputFile,
              contractType: Number(v.contractInfo.contractType)
            });
            this.contractInfos = [dataObj];
            this.statistics.contractMoney = this.contractInfos.reduce((prev: any, current: any, index: number) => {
              const value = prev + (!!current.contractMoney ? this.formatMoney2Num(current.contractMoney) : 0);
              return value.toFixed(2);
            }, 0);
            this.toValue(this.contractInfos);
            // 更新performanceFile组件值
            this.toUpdateLvYue(dataObj);
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
   * @description: 更新performanceFile组件值
   * @param {any} dataObj
   * @return {*}
   */
  toUpdateLvYue(dataObj: any) {
    this.lvYueCtrl = this.form.get('performanceFile');
    const lvYueFiles = XnUtils.parseObject(this.lvYueCtrl.value, [])[0]?.performanceFile || '';
    const updateVal = JSON.parse(JSON.stringify(dataObj));
    const updateVals = this.removeProperty(updateVal, ['contractFile', 'inputFile', 'performanceFile']);
    this.lvYueCtrl.patchValue(JSON.stringify([{
      ...updateVals,
      performanceFile: lvYueFiles
    }]));
  }

  /**
   * @description: 文件预览
   * @param {any} fileList
   * @return {*}
   */
  public fileView(fileList: any[]) {
    const files = XnUtils.parseObject(fileList, []);
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiMfilesViewModalComponent, files).subscribe(() => { });
  }

  /**
   * @description: 删除文件
   * @param {number} index
   * @return {*}
   */
  deleteFile(index: number) {
    this.scansFilesList.splice(index, 1);
    this.setFile();
    this.cdr.markForCheck();
  }

  /**
   * @description: 修改文件
   * @param {any} subFiles
   * @param {number} index
   * @return {*}
   */
  editFile(subFiles: any, index: number) {
    const params = {
      title: '合同修改弹窗',
      checker: [
        { title: '合同文件序号', checkerId: 'fileIndexInList', type: 'text', options: { readonly: true }, value: index, required: false },
        {
          title: '合同文件图片', checkerId: 'files', type: 'dragonMfile', options: {
            fileext: ['vanke_platform_verify', 'sh_vanke_platform_verify'].includes(this.row.flowId) ?
              'jpg, jpeg, png' : 'jpg, jpeg, png,pdf', picSize: '500'
          }, required: true, value: subFiles
        }
      ]
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe((x) => {
      if (!!x) {
        this.scansFilesList[index - 1] = x.files;
        this.setFile();
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * @description: 文件操作后处理
   * @param {*}
   * @return {*}
   */
  private setFile() {
    if (!!this.scansFilesList.length) {
      this.contractInfos[0].contractFile = JSON.stringify(this.flatten(this.scansFilesList));
      this.contractInfos[0].inputFile = JSON.stringify(this.scansFilesList);
    } else {
      this.contractInfos[0].contractFile = '';
    }
    this.toValue(this.contractInfos);
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
   * @description: 数值格式转换
   * @param {string} val
   * @return {*}
   */
  private formatMoney2Num(val: string | number = ''): number {
    const filterVal = Number(val.toString().replace(/,/g, '')).toFixed(2);
    return Number(filterVal);
  }

  /**
   * @description: 数组扁平化处理
   * @param {*} arr
   * @return {*}
   */
  flatten(arr: any[]) {
    return arr.reduce((res: any[] | string, current: any[] | string) => {
      const next = XnUtils.parseObject(current, []);
      return res.concat(Array.isArray(next) ? this.flatten(next) : next);
    }, []);
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
