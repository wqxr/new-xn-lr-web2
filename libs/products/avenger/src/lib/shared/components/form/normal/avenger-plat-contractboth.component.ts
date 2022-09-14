/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：供应商首页经办
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                    wq             增加             2019-06-10
 * **********************************************************************
 */

import { Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { AvengerBothPlatContractModalComponent } from '../../modal/avenger-bothcontract-view.modal';
import AvengerFormTable from './avenger-table';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { AvengeraddContractModalComponent } from '../../modal/avenger-contract-write.modal';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';


@Component({
    selector: 'avenger-contractboth-invoice-component',
    templateUrl: './avenger-plat-contractboth.component.html',
    styles: [
        `
            .button-reset-style {
                font-size: 12px;
                padding: 5px 35px;
                color: #3c8dbc;
            }

            .tip-memo {
                color: #9A9A9A;
            }
            .tag-color {
                color: #f20000;;
            }
        `
    ]
})
@DynamicForm({ type: 'contractBoth', formModule: 'avenger-input' })
export class AvengerplatbothContractComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public alert = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public items: any[] = [];
    public Tabconfig: any;
    public twoselect: any[] = [];
    public threeselect: any[] = [];
    currentTab: any; // 当前标签页


    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
    ) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.items = JSON.parse(this.row.value);
        this.row.selectOptions = SelectOptions.get('moneyType');
        this.items.map((item) => {
            this.row.selectOptions.map(itemone => {
                if (itemone.value === JSON.parse(item.receiveType).firstValue) {
                    itemone.children.map(itemtwo => {
                        if (itemtwo.value === JSON.parse(item.receiveType).secondValue) {
                            item.twoselect = itemone.children;
                        }
                    });
                }
            });
        });
        this.items.map(item => {
            item.twoselect.map(itemone => {
                if (itemone.value === JSON.parse(item.receiveType).secondValue) {
                    itemone.children.map(itemtwo => {
                        if (itemtwo.value === JSON.parse(item.receiveType).thirdValue) {
                            item.threeselect = itemone.children;
                        }
                    });
                }
            });
        });
        this.items.map((item) => {
            if (item.upstreamContractNum && item.upstreamContractNum !== '') {
                this.row.selectOptions.map(itemone => {
                    if (itemone.value === JSON.parse(item.upstreamReceiveType).firstValue) {
                        itemone.children.map(itemtwo => {
                            if (itemtwo.value === JSON.parse(item.upstreamReceiveType).secondValue) {
                                item.upstreamtwoselect = itemone.children;
                            }
                        });
                    }
                });
            }
        });
        this.items.map(item => {
            if (item.upstreamContractNum && item.upstreamContractNum !== '') {
                item.upstreamtwoselect.map(itemone => {
                    if (itemone.value === JSON.parse(item.upstreamReceiveType).secondValue) {
                        itemone.children.map(itemtwo => {
                            if (itemtwo.value === JSON.parse(item.upstreamReceiveType).thirdValue) {
                                item.upstreamthreeselect = itemone.children;
                            }
                        });
                    }
                });
            }
        });




        this.Tabconfig = AvengerFormTable.tableFormlist;
        this.currentTab = this.Tabconfig.tabList[4]; // 当前标签页
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    /**
    * 计算表格合并项
    * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
    */
    public calcAttrColspan(): number {
        let nums: number = this.currentTab.headText.length + 1;
        const boolArray = [this.currentTab.canChecked,
        this.currentTab.edit && this.currentTab.edit.rowButtons && this.currentTab.edit.rowButtons.length > 0];
        nums += boolArray.filter(arr => arr === true).length;
        return nums;
    }
    private fromValue() {
        this.items = XnUtils.parseObject(this.items, []);
        this.toValue();
    }
    /**
      * 行按钮组事件
      * @param paramItem 当前行数据
      * @param paramBtnOperate 按钮操作配置
      * @param i         let curentparam = paramItem;
      下标
      */
    public handleRowClick(paramItem) {
        const curentparam = paramItem;
        if (paramItem.upstreamName !== undefined && paramItem.supplierName !== undefined) {
            paramItem.contractJia = paramItem.upstreamName;
            paramItem.contractYi = paramItem.supplierName;
        }
        if (paramItem.contractSignTime === 0) {
            paramItem.contractSignTime = '';
        }
        // if (paramItem.upstreamContractNum && paramItem.contractNum && paramItem.upstreamContractNum === paramItem.contractNum) {
        //     paramItem.upstreamContractFile = paramItem.upstreamContractFile;
        // } else {
        //     // let upstreaminfo = this.items.filter((x: any) => x.upstreamContractNum !== undefined);
        //     // if (upstreaminfo.length > 0) {
        //     //     paramItem.upstreamFile = [];
        //     //     upstreaminfo.forEach(x => {
        //     //         paramItem.upstreamFile = paramItem.upstreamFile.concat(JSON.parse(x.contractFile));

        //     //     });
        //     //     paramItem.upstreamFile = JSON.stringify(paramItem.upstreamFile);
        //     // }
        // }
        const checkers = [
            {
                title: '合同编号',
                checkerId: 'contractNum',
                type: 'text',
                required: true,
                value: paramItem.contractNum
            },
            {
                title: '合同金额',
                checkerId: 'contractAmt',
                type: 'money',
                required: true,
                value: paramItem.contractAmt
            },
            {
                title: '合同名称',
                checkerId: 'contractName',
                required: true,
                type: 'text',
                value: paramItem.contractName
            },
            {
                title: '合同甲方',
                checkerId: 'contractJia',
                type: 'text',
                required: true,
                value: paramItem.supplierName
            },
            {
                title: '合同结算方式',
                checkerId: 'contractJiesuan',
                type: 'text',
                required: 0,
                value: paramItem.contractJiesuan
            },
            {
                title: '合同乙方',
                checkerId: 'contractYi',
                type: 'text',
                required: true,
                value: paramItem.upstreamName
            },
            {
                title: '合同付款期限',
                checkerId: 'contractPayTime ',
                type: 'text',
                required: 0,
                value: paramItem.contractPayTime
            },
            {
                title: '应收账款金额',
                checkerId: 'receive',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: paramItem.receive
            },
            {
                title: '合同签订时间',
                checkerId: 'contractSignTime',
                required: false,
                type: 'date',
                value: paramItem.contractSignTime,
                placeholder: '请选择时间'
            },
            {
                title: '应收账款类型',
                checkerId: 'receiveType',
                type: 'moreselect',
                required: 0,
                options: { ref: 'moneyType' },
                value: { twoselect: paramItem.twoselect, threeselect: paramItem.threeselect, valueinfo: paramItem.receiveType }

            },

        ];
        const params = {
            checkers,
            value: paramItem,
            type: 2,
            title: '采购合同补录'
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerBothPlatContractModalComponent, params)
            .subscribe(v => {

                if (v.action === 'cancel') {
                    paramItem.contractFile = curentparam.contractFile;
                    return;
                } else {
                    const contractFile1 = curentparam.contractFile;
                    const receicevalueinfo1 = paramItem.receiveType;
                    const reveiveType1 = v.contractType.receiveType === '' ? paramItem.twoselect : v.contractType.receiveType.twoselect;
                    const reveiveType2 = v.contractType.receiveType === '' ? paramItem.threeselect : v.contractType.receiveType.threeselect;
                    paramItem = v.contractType;
                    paramItem.supplierName = v.contractType.contractJia;
                    paramItem.upstreamName = v.contractType.contractYi;
                    paramItem.contractFile = contractFile1;
                    paramItem.contractSignTime = v.contractType.contractSignTime;
                    paramItem.receiveType = v.contractType.receiveType === '' ?
                        receicevalueinfo1 : JSON.stringify(v.contractType.receiveType.valueinfo);
                    if (curentparam.upstreamContractNum && curentparam.upstreamContractNum !== '') {
                        paramItem.upstreamReceiveType = curentparam.upstreamReceiveType;
                        paramItem.upstreamContractNum = curentparam.upstreamContractNum;

                    }
                    const {
                        contractAmt,
                        contractFile,
                        contractJia,
                        contractJiesuan,
                        contractName,
                        contractNum,
                        contractPayTime,
                        contractSignTime,
                        contractYi,
                        receive,
                        receiveType,
                        upstreamName,
                        supplierName,
                        upstreamReceiveType,
                        upstreamContractNum
                    } = paramItem;
                    paramItem.receive = curentparam.receive;
                    paramItem.owner = curentparam.owner;
                    paramItem.id = curentparam.id;
                    paramItem.mainFlowId = curentparam.mainFlowId;
                    paramItem.updateTime = curentparam.updateTime;
                    paramItem.createTime = curentparam.createTime;
                    paramItem.upstreamContractFile = curentparam.upstreamContractFile || '[]';
                    const index = this.items.findIndex((x: any) => x.id === paramItem.id);
                    if (index >= 0) {
                        this.items[index] = paramItem;
                    }
                    this.toValue();
                    paramItem.twoselect = reveiveType1;
                    paramItem.threeselect = reveiveType2;
                    if (curentparam.upstreamContractNum && curentparam.upstreamContractNum !== '') {
                        paramItem.upstreamtwoselect = curentparam.upstreamtwoselect;
                        paramItem.upstreamthreeselect = curentparam.upstreamthreeselect;
                    }


                }
            });
    }

    showContract(paramItem) {

        if (paramItem.upstreamName !== undefined && paramItem.supplierName !== undefined) {
            paramItem.contractJia = paramItem.upstreamName;
            paramItem.contractYi = paramItem.supplierName;
        }
        if (paramItem.contractSignTime === 0) {
            paramItem.contractSignTime = '';
        }
        // if (paramItem.contractNum === undefined) {
        //     // this.xn.msgBox.open(false, '上游客户合同编号不存在，不可以补录');
        //     return;

        // }
        const checkers = [
            {
                title: '合同编号',
                checkerId: 'contractNum',
                type: 'text',
                required: true,
                options: { readonly: true },
                value: paramItem.contractNum
            },
            {
                title: '合同金额',
                checkerId: 'contractAmt',
                type: 'money',
                required: true,
                options: { readonly: true },
                value: paramItem.contractAmt
            },
            {
                title: '合同名称',
                checkerId: 'contractName',
                required: true,
                type: 'text',
                options: { readonly: true },
                value: paramItem.contractName
            },
            {
                title: '合同甲方',
                checkerId: 'contractJia',
                type: 'text',
                required: true,
                options: { readonly: true },
                value: paramItem.contractJia
            },
            {
                title: '合同乙方',
                checkerId: 'contractYi',
                type: 'text',
                required: true,
                options: { readonly: true },
                value: paramItem.contractYi
            },
            {
                title: '合同结算方式',
                checkerId: 'contractJiesuan',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: paramItem.contractJiesuan
            },
            {
                title: '合同付款期限',
                checkerId: 'contractPayTime ',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: paramItem.contractPayTime
            },
            {
                title: '应收账款金额',
                checkerId: 'receive',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: paramItem.receive
            },
            {
                title: '合同签订时间',
                checkerId: 'contractSignTime',
                required: false,
                type: 'date',
                value: paramItem.contractSignTime,
                options: { readonly: true },
                placeholder: '请选择时间'
            },
            {
                title: '应收账款类型',
                checkerId: 'receiveType',
                type: 'moreselect',
                required: 0,
                options: { ref: 'moneyType' },
                value: { twoselect: paramItem.twoselect, threeselect: paramItem.threeselect, valueinfo: paramItem.receiveType }

            },

        ];
        const params = {
            checkers,
            value: paramItem,
            type: 1,
            title: '采购合同补录'
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengeraddContractModalComponent, params)
            .subscribe(v => { });


    }
    // 上传完后取回值
    private toValue() {
        const datas = this.items.filter(item =>
            item.contractNum && item.contractNum !== ''

        );
        datas.map(item => {
            if (!item.contractName && !item.contractYi && !item.contractJia && !item.contractAmt) {
                this.ctrl.setValue('');
            } else {
                this.ctrl.setValue(JSON.stringify(this.items));
            }
        });
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
