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

import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import TabConfig from 'libs/products/avenger/src/lib/customer-manage/customer-template/customers-panel';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { FormGroup } from '@angular/forms';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnInputComponent } from 'libs/shared/src/lib/public/form/xn-input.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

@Component({
    templateUrl: `./customer-managing.component.html`,
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
    `]
})
export class CustomerChangeManagerComponent implements OnInit {
    tabConfig: any;
    // 数据
    // tslint:disable-next-line: no-use-before-declare
    currentTab: any; // 当前标签页
    label: string;
    selectedItems: any[] = []; // 选中的项
    pageTitle = '发起新流程';
    pageDesc = '';
    datalist: any[] = [];
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    mainForm: FormGroup;
    rows: CheckersOutputModel[] = [];
    @ViewChild(XnInputComponent)
    private getdatalist: XnInputComponent;

    constructor(private xn: XnService,
                public hwModeService: HwModeService) {
    }

    ngOnInit(): void {
        this.tabConfig = TabConfig.changeCustomer;
        this.label = '请点击右侧按钮进行选择';
        this.currentTab = this.tabConfig.tabList[0]; // 当前标签页
        this.buildForm();

    }

    buildForm() {
        this.rows = ([
            {
                title: '选择调整供应商',
                checkerId: 'adjustOrg',
                type: 'orgList',
                options: '',
                required: 1,
            },
            {
                required: false,
                checkerId: 'Remarks',
                type: 'textarea',
                options: '',
                title: '备注'
            }
        ] as CheckersOutputModel[]);
        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
    }


    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    public onSubmit() {
        this.selectedItems = this.getdatalist.gettabledatalist();
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择企业');
            return;
        }
        const customername = this.selectedItems.map(item => {
            return item.customerManager;
        });
        if (customername.indexOf('') !== -1) {
            this.xn.msgBox.open(false, '请输入管户客户经理');
        }
        const appIdlist = this.selectedItems.map(item => {
            return [item.appId, item.customerManager];
        });
        this.xn.api.post('/custom/avenger/customer_manager/adjust_manager', {
            customerManager: appIdlist
        }).subscribe(data => {
            if (data.ret === 0) {
                this.xn.router.navigate(['/avenger/customer-manage']);
                return;
            }
        });
    }
    onCancel() {
        this.xn.user.navigateBack();
    }
}
