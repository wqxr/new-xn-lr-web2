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
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { AvengeraddContractModalComponent } from '../../modal/avenger-contract-write.modal';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import AvengerFormTable from './avenger-table';
import * as lodashall from 'lodash';


@Component({
    selector: 'avenger-lvyueboth-invoice-component',
    templateUrl: './avenger-plat-lvyueboth.component.html',
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
@DynamicForm({ type: 'lvyueBoth', formModule: 'avenger-input' })
export class AvengerplatbothlvyueComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public alert = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public items: any[] = [];
    public Tabconfig: any;
    public documentAllType: any;
    public documentType: string;
    public uploader: string;
    currentTab: any; // 当前标签页

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
    ) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.items = lodashall.sortBy(JSON.parse(this.row.value), 'documentType');
        this.Tabconfig = AvengerFormTable.tableFormlist;
        this.currentTab = this.Tabconfig.tabList[5]; // 当前标签页
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
    public handleRowClick(paramItem, paramBtnOperate: ButtonConfigModel, i: number) {
        this.documentAllType = SelectOptions.get('Certificateperformance');
        this.documentAllType.filter(item => {
            if (item.value === paramItem.documentType) {
                return this.documentType = item.label;
            }
        });
        if (paramItem.owner === 1) {
            this.uploader = '上游客户';
        } else if (paramItem.owner === 0) {
            this.uploader = '供应商';
        }

        const checkers = [
            {
                title: '首次发货时间',
                checkerId: 'firstSendTime',
                type: 'date',
                required: 0,
                value: paramItem.firstSendTime || '',
            },
            {
                title: '发货方',
                checkerId: 'contractAmount',
                type: 'text',
                required: 0,
                value: paramItem.contractAmount || '',
            },
            {
                title: '数量',
                checkerId: 'counts',
                required: 0,
                type: 'text',
                value: paramItem.counts,
            },
            {
                title: '最后签收时间',
                checkerId: 'lastSignTime',
                type: 'date',
                required: 0,
                value: paramItem.lastSignTime || '',
            },
            {
                title: '签收方',
                checkerId: 'consiger',
                type: 'text',
                required: 0,
                value: paramItem.consiger
            },
            {
                title: '金额',
                checkerId: 'lvyueAmount',
                required: false,
                type: 'money',
                value: paramItem.lvyueAmount,
            },
            {
                title: '单据类型',
                checkerId: 'documentType',
                type: 'text',
                required: 0,
                value: this.documentType,
                options: { readonly: true }
            },
            {
                title: '上传方',
                checkerId: 'uploader ',
                type: 'text',
                required: 0,
                value: this.uploader,
                options: { readonly: true }
            },

        ];
        const params = {
            checkers,
            value: paramItem,
            title: '履约证明资料补录',
            type: 2,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengeraddContractModalComponent, params)
            .subscribe(v => {

                if (v.action === 'cancel') {
                    return;
                } else {
                    paramItem.consiger = v.contractType.consiger;
                    paramItem.counts = v.contractType.counts;
                    paramItem.firstSendTime = v.contractType.firstSendTime;
                    paramItem.lastSignTime = v.contractType.lastSignTime;
                    paramItem.lvyueAmount = v.contractType.lvyueAmount;
                    paramItem.uploader = v.contractType.uploader;
                    paramItem.contractAmount = v.contractType.contractAmount;
                    this.toValue();


                }
            });
    }
    private toValue() {
        this.ctrl.setValue(JSON.stringify(this.items));
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
