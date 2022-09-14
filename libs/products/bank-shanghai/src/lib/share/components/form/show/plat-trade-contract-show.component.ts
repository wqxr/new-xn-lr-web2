/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光供应商上传资料平台复核交易合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2019-08-30
 * **********************************************************************
 */

import { Component, OnInit, Input, ViewContainerRef, ElementRef,  } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
    selector: 'lib-plat-contract-show',
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
                        <a  href='javascript:void(0)' (click)="viewDetail(item,1,i)">
                        {{(item[head.value] | xnJson).length>1 ? (item[head.value] | xnJson)[0].fileName + '，...' : (item[head.value] | xnJson)[0].fileName}}
                        </a>
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
                <a href='javascript:void(0)' (click)='viewDetail(item,1,i)'>查看</a>
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
    <!-- *ngIf="!['dragon_supplier_sign', 'vanke_financing_sign', 'sh_vanke_financing_sign'].includes(svrConfig.flow.flowId)" -->
    <div class="contract-files no-padding">
      <table class="table table-bordered text-center" style='float:left'>
        <thead>
          <tr class="table-head">
            <!-- title -->
            <th>序号</th>
            <th>合同扫描件</th>
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
@DynamicForm({ type: 'trade-contract', formModule: 'dragon-show' })
export class PlatTradeContractShowComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
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

    // 判断合同账户信息与供应商收款账户信息是否一致
    public matchInfo = {
        label: '合同账户信息与供应商收款账户信息是否一致',
        isMatch: '否'  // 0否 1是
    };
    myClass = '';
    constructor(
        private xn: XnService, private vcr: ViewContainerRef, private er: ElementRef) {
    }

    ngOnInit() {
        // 设置初始值
        const val = XnUtils.parseObject(this.row.data, []);
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
                }
            },
            error: (err: any) => {
                console.error(err);
            },
            complete: () => { }
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
                XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiViewContractModalComponent, params).subscribe(v => { });
            }
        });
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
