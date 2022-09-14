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

import {
    Component,
    OnInit,
    Input,
    ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import DragonInfos from '../../bean/checkers.tab';
import { DragonViewContractModalComponent } from '../../../modal/dragon-mfile-detail.modal';
import ContractAndPerformanceSupply from '../../bean/supplement-checkers.tab';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';


@Component({
    selector: 'dragon-plat-contract-show',
    template: `
        <table class="table table-bordered text-center">
            <thead>
                <tr class="table-head">
                    <!-- 全选按钮 -->
                    <!-- title -->
                    <th *ngFor="let head of currentTab.heads">
                        {{ head.label }}
                        <ng-container *ngIf="head.value==='contractType' || head.value==='contractName' ">
                            <i [ngClass]="{'required-label-strong': true,'required-star': true,'fa': true}"></i>
                        </ng-container>
                    </th>
                    <!-- 行操作 -->
                    <th>操作</th>
                </tr>
            </thead>

            <tbody>
                <ng-container *ngIf="items.length; else block">
                    <tr *ngFor="let item of items; let i = index">
                        <td *ngFor="let head of currentTab.heads">
                        <ng-container [ngSwitch]="head.type">
                        <ng-container *ngSwitchCase="'file'">
                        <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
                          <div>
                            <a href="javaScript:void(0)" (click)="viewDetail(item,i)">
                            {{(item.contractFile | xnJson).length>1 ? (item.contractFile | xnJson)[0].fileName + '，...' : (item.contractFile | xnJson)[0].fileName}}
                            </a>
                          </div>
                        </ng-container>
                        </ng-container>
                        <ng-container *ngSwitchCase="'contractType'">
                        <div *ngIf="item[head.value] && item[head.value] !==''">
                            {{item[head.value] | xnSelectTransform:'dragonContracttype'|| ''}}
                      </div>
                        </ng-container>
                        <ng-container *ngSwitchDefault>
                        <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                      </ng-container>
                        </ng-container>
                        </td>
                        <td><a href='javascript:void(0)' (click)='viewDetail(item,i)'>查看</a></td>
                    </tr>
                </ng-container>
                <tr *ngIf="items.length > 0">
                    <td>合计</td>
                    <td>/</td>
                    <td class="money-color">{{amountAll | xnMoney}}</td>
                    <td>/</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
            </tbody>
        </table>
      <table class="table table-bordered text-center" style='float:left'>
        <thead>
          <tr class="table-head">
            <!-- 全选按钮 -->
            <!-- title -->
            <th>序号</th>
            <th>
              合同扫描件
            </th>
            <!-- 行操作 -->
          </tr>
        </thead>
        <tbody>
          <ng-container *ngIf="fileItems.length>0;">
            <tr *ngFor="let sub of fileItems;let i=index">
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
        <div>
        <span style='width:37%'>合同账户信息与供应商收款账户信息是否一致</span>
        <input style='width:63%;padding-top:6px'
        #input
        class="form-control xn-input-font xn-input-border-radius"
        [ngClass]="myClass"
        type="text"
        autocomplete="off" [value]='flag' readonly
        />
        </div>
        <ng-template #block>
            <tr>
                <td [attr.colspan]="6">
                    <div class="empty-message"></div>
                </td>
            </tr>
        </ng-template>
    `,
    styles: [
        `
            .button-reset-style {
                font-size: 12px;
                padding: 5px 35px;
                color: #3c8dbc;
            }

            .tip-memo {
                color: #9a9a9a;
            }
            .tag-color {
                color: #f20000;
            }
        `
    ]
})
@DynamicForm({ type: 'plat-contract', formModule: 'dragon-show' })
export class DragonPlatContractShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public flag = '';
    public items: any[] = [];
    public Tabconfig: any;
    currentTab: any; // 当前标签页
    public amountAll: number; // 合同总金额
    fileItems: any[] = [];

    public myClass = '';

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
    ) { }

    ngOnInit() {
        this.currentTab = DragonInfos.platContract;
        this.items = JSON.parse(this.row.data);
        if (!!!this.items[0].inputFile) {
            const otherFile = [];
            otherFile.push(this.items[0].contractFile);
            this.items[0].inputFile = JSON.stringify(otherFile);
            this.fileItems = JSON.parse(this.items[0].inputFile);
        } else {
            this.fileItems = JSON.parse(this.items[0].inputFile);
        }
        this.items.forEach(x => {
            this.flag = x.flag === 0 ? '否' : '是';
        });
        if (this.items.filter(v => v && v.contractMoney).length > 0) {
            this.amountAll = this.computeSum(this.items.filter(v =>
                v && v.contractMoney).map(v => Number(v.contractMoney))).toFixed(2) || 0;
            this.items.forEach(item => item.contractMoney = Number(item.contractMoney).toFixed(2));
        } else {
            this.amountAll = 0;
        }
        // console.info('this.items', this.items);
    }
    viewDetail(paramsItem, index?: number) {
        const componentType = ['dragon_platform_verify', 'dragon_supplier_sign'].includes(this.row.flowId)
            ? 'dragonContract' : 'vankeContract';
        this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
            if (x.ret === 0) {
                let datainfo = {} as any;
                if (x.data.data.contractType === undefined) {
                    datainfo = paramsItem;
                    datainfo.feeTypeName = x.data.data.feeTypeName;
                    datainfo.type = x.data.data.type;
                    datainfo.wkType = x.data.data.wkType;
                    datainfo.headquarters = x.data.data.headquarters || '';
                    datainfo.contractTypeJd = x.data.data.contractTypeJd || '';
                } else {
                    datainfo = x.data.data;
                    datainfo.contractFile = paramsItem.contractFile;
                    datainfo.contractTypeJd = x.data.data.contractTypeJd || '';
                }
                // this.uploadPicService.viewDetail(datainfo, this.vcr, DragonViewContractModalComponent);
                datainfo.index = index + 1;
                const params = {
                    title: '合同补录',
                    type: 1,
                    contractFile: datainfo.contractFile,
                    checker: ContractAndPerformanceSupply.getConfig(componentType, 1, datainfo, this.row)
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonViewContractModalComponent, params).subscribe(v => {
                });
            }

        });
    }
    public fileView(paramFiles) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, JsonTransForm(paramFiles))
            .subscribe(() => {
            });
    }
    // 具体到单个数组的求和
    private computeSum(array) {
        return array.reduce((prev, curr) => {
            return prev + curr;
        });
    }
}
