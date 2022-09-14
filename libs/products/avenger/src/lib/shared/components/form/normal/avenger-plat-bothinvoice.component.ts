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
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import AvengerFormTable from './avenger-table';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { AvengerViewInvoiceComponent } from '../../modal/avenger-invoice-view.modal';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import * as moment from 'moment';

@Component({
    selector: 'avenger-platboth-invoice-component',
    templateUrl: './avenger-plat-bothinvoice.component.html',
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
@DynamicForm({ type: 'invoiceBoth', formModule: 'avenger-input' })
export class AvengerplatbothInvoiceComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public alert = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public items: any[] = [];
    public Tabconfig: any;
    currentTab: any; // 当前标签页
    private dateCheckTemp = false;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
                public localStorageService: LocalStorageService,
                public hwModeService: HwModeService,

    ) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.items = JSON.parse(this.row.value);
        this.items.forEach(temp => {
            this.xn.avenger.post('/file/allHistoryList',
                {
                    mainFlowId: this.svrConfig.record.mainFlowId,
                    invoiceNum: temp.invoiceNum || temp.upstreamInvoice, invoiceCode: temp.invoiceCode
                }).subscribe(x => {
                    if (x.ret === 0) {
                        temp.mainFlowId = x.data;
                    }

                });
            this.dateCheckTemp = XnUtils.toDateFromString(temp.invoiceDate);
            if (!this.dateCheckTemp) {
                temp.invoiceDate = moment(temp.invoiceDate).format('YYYYMMDD');
            }
        });
        this.Tabconfig = AvengerFormTable.tableFormlist;
        this.currentTab = this.Tabconfig.tabList[3]; // 当前标签页
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    kkkk(item) {
        return Array.isArray(item);
    }
    /**
    * 计算表格合并项
    * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
    */
    public calcAttrColspan(): number {
        const nums: number = this.currentTab.headText.length + 1;
        return nums;
    }
    handleRowClick(item) {
        const params = { ...item, isPreliminary: true};
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerViewInvoiceComponent, params).subscribe(() => {
        });
    }
}
