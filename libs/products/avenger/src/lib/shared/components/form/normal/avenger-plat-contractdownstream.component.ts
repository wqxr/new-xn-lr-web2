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

import { Component, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import AvengerFormTable from './avenger-table';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { AvengeraddContractModalComponent } from '../../modal/avenger-contract-write.modal';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';


@Component({
    selector: 'avenger-platdownstreamboth-invoice-component',
    templateUrl: './avenger-plat-contractdownstream.component.html',
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
@DynamicForm({ type: 'contractDownstream', formModule: 'avenger-input' })
export class AvengerplatbothdownstreamComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    public alert = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public items: any[] = [];
    public twoselect: any[] = [];
    public threeselect: any[] = [];
    public Tabconfig: any;
    currentTab: any; // 当前标签页

    constructor(private xn: XnService,
                private er: ElementRef, private vcr: ViewContainerRef,
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
        this.Tabconfig = AvengerFormTable.tableFormlist;
        this.currentTab = this.Tabconfig.tabList[6]; // 当前标签页
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
    /**
   * 行按钮组事件
   * @param paramItem 当前行数据
   * @param paramBtnOperate 按钮操作配置
   * @param i 下标
   */
    public handleRowClick(paramItem, paramBtnOperate: ButtonConfigModel, i: number) {
        const curentparam = paramItem;

        const checkers = [
            {
                title: '合同编号',
                checkerId: 'contractNum',
                type: 'text',
                required: 0,
                value: paramItem.contractNum
            },
            {
                title: '合同金额',
                checkerId: 'contractAmt',
                type: 'money',
                required: 0,
                value: paramItem.contractAmt
            },
            {
                title: '合同名称',
                checkerId: 'contractName',
                required: 0,
                type: 'text',
                value: paramItem.contractName
            },
            {
                title: '合同甲方',
                checkerId: 'contractJia',
                type: 'text',
                required: 0,
                value: paramItem.contractJia
            },
            {
                title: '合同签订时间',
                checkerId: 'contractSignTime',
                required: false,
                type: 'date',
                value: '',
                placeholder: '请选择时间'
            },
            {
                title: '合同乙方',
                checkerId: 'contractYi',
                type: 'text',
                required: 0,
                value: paramItem.contractYi
            },
            {
                title: '合同结算方式',
                checkerId: 'contractJiesuan',
                type: 'text',
                required: 0,
                value: ''
            },
            {
                title: '合同付款期限',
                checkerId: 'contractPayTime ',
                type: 'text',
                required: 0,
                value: ''
            },
            {
                title: '应收账款类型',
                checkerId: 'receiveType',
                type: 'moreselect',
                required: 0,
                options: { ref: 'moneyType' },
                validators: {},
                value: { twoselect: paramItem.twoselect, threeselect: paramItem.threeselect, valueinfo: paramItem.receiveType }
            },

        ];




        const params = {
            checkers,
            value: paramItem,
            title: '销售合同补录',
            type: 2,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengeraddContractModalComponent, params)
            .subscribe(v => {

                if (v.action === 'cancel') {
                    return;
                } else {
                    const contractFile1 = paramItem.contractFile;
                    const receicevalueinfo1 = paramItem.receiveType;
                    const reveiveType1 = v.contractType.receiveType === '' ? paramItem.twoselect : v.contractType.receiveType.twoselect;
                    const reveiveType2 = v.contractType.receiveType === '' ? paramItem.threeselect : v.contractType.receiveType.threeselect;
                    paramItem = v.contractType;
                    paramItem.contractFile = contractFile1;
                    paramItem.receiveType = v.contractType.receiveType === '' ?
                        receicevalueinfo1 : JSON.stringify(v.contractType.receiveType.valueinfo);
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
                    } = paramItem;
                    paramItem.owner = curentparam.owner;
                    paramItem.id = curentparam.id;
                    paramItem.mainFlowId = curentparam.mainFlowId;
                    paramItem.updateTime = curentparam.updateTime;
                    paramItem.createTime = curentparam.createTime;
                    const index = this.items.findIndex((x: any) => x.contractId === paramItem.contractId);
                    if (index >= 0) {
                        this.items[index] = paramItem;
                    }
                    this.toValue();
                    paramItem.twoselect = reveiveType1;
                    paramItem.threeselect = reveiveType2;


                }
            });

    }
    // 上传完后取回值
    private toValue() {
        this.ctrl.setValue(JSON.stringify(this.items));
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
