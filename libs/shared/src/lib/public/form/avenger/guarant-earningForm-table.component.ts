/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：多标签页列表项 根据TabConfig.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-05-13
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, } from '@angular/core';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { AbstractControl } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnInputOptions } from '../xn-input.options';
import GuarantearningFormtab from './guarant-earningForm.tab';

@Component({
    templateUrl: `./guarant-earningForm-table.component.html`,
    selector: 'xn-guarantearningform-table',
    styles: [`
        .title {
            width: 100px;
        }

        .label {
            font-weight: normal;
            flex: 1;
            color: black;
        }

        .flex {
            display: flex;
        }

        .input-check {
            width: 100px;
        }

        .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            /*position: relative;*/
            cursor: pointer
        }

        .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            font-family: 'Glyphicons Halflings';
            opacity: 0.5;
        }

        .table-head .sorting:after {
            content: "\\e150";
            opacity: 0.2
        }

        .table-head .sorting_asc:after {
            content: "\\e155"
        }

        .table-head .sorting_desc:after {
            content: "\\e156"
        }
        .guaranttable {
            width: 50% !important;
            float: left;
            margin-top: 35px;
        }
    `]
})
export class GuarantEarningFormComponent implements OnInit {
    ctrl: AbstractControl;
    selectedItems: any[] = []; // 选中的项
    // 数组字段
    heads: any[] = [];
    @Input() row: any;
    @Input() form: any;

    data: any;
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    alert = '';
    xnOptions: XnInputOptions;
    allCheckedStatus: boolean;
    procedureId: boolean;
    tabConfig: any; // 当前标签页
    balancedata: any[] = []; // 资产负债表
    profile: any[] = []; // 利润表
    cashdata: any[] = []; // 现金流表
    balance = [{
        F003_THS013: '43234',                             // 截止日期
        F019_THS013: 'x234234xx',                            // 货币资金
        F021_THS013: 'x3242xx',                            // 应收票据
        F022_THS013: 'x23xx',                            // 应收账款
        F026_THS013: 'x2xx',                            // 其他应收款
        F027_THS013: 'x23xx',                            // 存货
        F038_THS013: 'x23xx',                            // 固定资产
        F080_THS013: 'x34xx',                            // 资产总计
        F081_THS013: 'x34xx',                            // 短期借款
        F083_THS013: 'x324xx',                            // 应付票据
        F084_THS013: 'xx34x',                            // 应付账款
        F090_THS013: 'x234xx',                            // 其他应付款
        F096_THS013: 'xx234x',                            // 长期借款
        F129_THS013: 'xx34x',                            // 负债合集
        F130_THS013: 'x34xx',                            // 实收资本
        F131_THS013: 'xx34x',                            // 资本公积
        F134_THS013: 'x2xx',                            // 盈余公积
        F137_THS013: 'x2xx',                            // 未分配利润
        F143_THS013: 'x1xx'                             // 所有者权益合计
    },
    {
        F003_THS013: 'xx324x', F019_THS013: 'x234xx', F021_THS013: '324', F022_THS013: 'xxx34',
        F026_THS013: 'xxx', F027_THS013: 'xxx', F038_THS013: 'xx234x', F080_THS013: 'xxx', F081_THS013: 'xxx',
        F083_THS013: 'xxx', F084_THS013: 'xxx', F090_THS013: 'xxx', F096_THS013: 'xxx', F129_THS013: 'xxx',
        F130_THS013: 'xxx', F131_THS013: 'xxx', F134_THS013: 'xxx', F137_THS013: 'xxx', F143_THS013: 'xxx'
    }
    ];
    constructor(private er: ElementRef) {
    }

    ngOnInit(): void {
        this.tabConfig = GuarantearningFormtab.tableFormlist.tabList;
        this.ctrl = this.form.get(this.row.name);
        this.data = this.row.value;
        this.tabConfig[0].data = this.data.balance;
        this.tabConfig[1].data = this.data.balance;
        if (this.data.profile === undefined) {
            this.tabConfig[2].data = [];
        }
        this.tabConfig[3].data = this.data.cash;

        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);


    }



    // 上传完后取回值
    // private toValue() {
    //     if (this.data.length !== this.selectedItems.length) {
    //         this.ctrl.setValue('');
    //     } else {
    //         // 复核流程情况下，如果没有补充，不能提交

    //         this.ctrl.setValue(JSON.stringify(this.datalist));

    //     }
    //     this.ctrl.markAsTouched();
    //     this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    // }

    // private fromValue() {
    //     this.data = XnUtils.parseObject(this.ctrl.value, []);
    //     // 复核流程情况下 ,且 不是会计下载流程
    //     this.toValue();
    // }
}
