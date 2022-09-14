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

import { Component, OnInit, Input, ViewContainerRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { AbstractControl } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { MultiplePickerInputComponent } from '../vanke/multiple-picker-input.component';
import { isNgTemplate } from '@angular/compiler';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import TabConfig from 'libs/products/avenger/src/lib/customer-manage/customer-template/customers-panel';
import { CustomerAddCompanyModalComponent } from 'libs/products/avenger/src/lib/customer-manage/customer-addCompany-template/customer-addCompany.modal.component';
import { EditModalComponent } from 'libs/products/avenger/src/lib/shared/components/modal/edit-modal.component';
// tslint:disable-next-line:max-line-length
import { ChoseManageModalComponent } from 'libs/products/avenger/src/lib/guarant-management/guarant-add-manage.template/guarant-add-manage.template.modal';

@Component({
    templateUrl: `./xn-input-table.component.html`,
    selector: 'xn-table-input',
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
export class InputTableComponent implements OnInit {
    tabConfig: any;
    // 数据
    // tslint:disable-next-line: no-use-before-declare
    data: CustomerdataInfo = new CustomerdataInfo();
    // tslint:disable-next-line: no-use-before-declare
    test: CustomSingerdatainfo = new CustomSingerdatainfo();
    currentTab: any; // 当前标签页
    ctrl: AbstractControl;
    label: string;
    selectedItems: any[] = []; // 选中的项
    // 数组字段
    heads: any[] = [];
    @Input() row: any;
    @Input() form: any;
    public alert = '';
    datalist: any[] = [];
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量

    xnOptions: XnInputOptions;
    allCheckedStatus: boolean;
    procedureId: boolean;
    items: any[] = [];
    public typechose: boolean[] = [false, false];
    manageheads = [
        { label: '用户Id', value: 'userId' },
        { label: '用户名称', value: 'userName' }
    ];
    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, ) {
    }

    ngOnInit(): void {
        this.label = '请点击右侧按钮进行选择';
        if (this.row.title === '选择调整供应商') {
            this.tabConfig = TabConfig.changeCustomer;
            this.typechose = [true, false];

        } else {
            this.tabConfig = TabConfig.changeCustomermanager;
            this.typechose = [false, true];

        }
        this.heads = this.tabConfig.tabList.headText;
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.label = '请点击右侧按钮进行选择';
        this.currentTab = this.tabConfig.tabList[0]; // 当前标签页


    }


    /**
     *  判读列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.datalist.some(x => !x.checked || x.checked && x.checked === false) || this.datalist.length === 0);
    }

    /**
     *  全选
     * @param e
     */
    public checkAll(e) {
        if (!this.isAllChecked()) {
            this.datalist.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.datalist], 'appId');
        } else {
            this.datalist.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
        this.toValue();
    }

    /**
     * 单选
     * @param e
     * @param item
     * @param index
     */
    public singelChecked(e, item, index) {
        if (item.checked && item.checked === true) {
            item.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.appId !== item.appId);
        } else {
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'appId'); // 去除相同的项
        }
        this.toValue();

    }

    public openChoseCompany() {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, CustomerAddCompanyModalComponent, { type: 2 })
            .subscribe(v => {
                if (v === null) {
                    return;
                } else if (v.length !== 0) {

                    this.data.datainfo = v.map(x => {
                        return Object.assign({}, this.test, {
                            appId: x.appId,
                            orgName: x.orgName,
                            certification: x.certification,
                            supplierType: x.supplierType,
                            totalFLV: x.totalFLV,
                            usedAmount: x.usedAmount,
                            whiteStatus: x.whiteStatus,
                            sysfactoringUseFLV: x.sysfactoringUseFLV,
                            sysfactoringServiceFLV: x.sysfactoringServiceFLV,
                            sysplatformServiceFLV: x.sysplatformServiceFLV,
                            sysnowlimit: x.sysnowlimit,
                            sysmaxAmount: x.sysmaxAmount,
                            subFactoringUseFLV: x.subFactoringUseFLV,
                            subFactoringServiceFLV: x.subFactoringServiceFLV,
                            subPlatformServiceFLV: x.subPlatformServiceFLV,
                            subNowlimit: x.subNowlimit,
                            subMaxAmount: x.subMaxAmount,
                            customerManager: x.customerManager,
                            factoringType: x.factoringType,
                            depositRate: x.depositRate,
                            maxAmount: x.maxAmount,
                            pastStatus: x.pastStatus,
                            pastMemo: x.pastMemo,
                            oldpastStatus: 3,
                            oldsupplierType: 2,
                            firstFactoringType: x.firstFactoringType,
                            secondFactoringType: x.secondFactoringType,
                            payCompany: 0,

                        });
                    });
                    this.datalist = this.datalist.concat(this.data.datainfo);
                    this.toValue();
                    this.datalist = XnUtils.distinctArray2(this.datalist, 'appId'); // 去除相同的项


                } else {
                    this.datalist = [];
                    this.toValue();
                }
            });
    }
    // 删除
    cleardata(item: number) {
        this.datalist.splice(item, 1);
    }
    handleHeadClick(btn: any) {
        let params = null;
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择企业');
            return;
        }
        switch (btn.label) {
            case '白名单状态':
                params = {
                    title: '白名单状态',
                    checker: [
                        {
                            title: '白名单状态',
                            checkerId: 'whiteStatus',
                            type: 'select',
                            options: { ref: 'whiteNameStatusForOrg' },
                            required: 1,
                            // value: this.selectedItems[0].whiteStatus,

                        }
                    ] as CheckersOutputModel[],
                    buttons: ['取消', '确定'],
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
                    .subscribe(v => {
                        if (v === null) {
                            return;
                        } else {
                            this.selectedItems.forEach(item => {
                                // tslint:disable-next-line:radix
                                item.whiteStatus = parseInt(v.whiteStatus);
                            });
                            this.toValue();
                        }
                    });
                break;
            case '保证金比例':
                params = {
                    title: '保证金比例',
                    checker: [
                        {
                            title: '保证金比例',
                            type: 'text',
                            checkerId: 'depositRate',  // depositRate
                            required: 1,
                            memo: '%',
                        },
                        {
                            title: '缴付方',
                            type: 'select',
                            checkerId: 'payCompany',
                            options: { ref: 'payCompany' },
                            required: 1,

                        }
                    ] as CheckersOutputModel[],
                    buttons: ['取消', '确定'],
                };

                XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
                    .subscribe(v => {
                        if (v === null) {
                            return;
                        } else {
                            this.selectedItems.forEach(item => {
                                item.depositRate = parseFloat(v.depositRate);
                                item.payCompany = Number(v.payCompany);
                            });
                            this.toValue();

                        }
                    });
                break;
            case '保理类型':
                params = {
                    title: '保理类型',
                    checker: [
                        {
                            title: '保理类型1',
                            type: 'select',
                            checkerId: 'firstFactoringType',
                            options: { ref: 'FactoringOneType' },
                            required: 1,
                        },
                        {
                            title: '保理类型2',
                            type: 'select',
                            checkerId: 'secondFactoringType',
                            options: { ref: 'FactoringTwoType' },
                            required: 1,

                        }
                    ] as CheckersOutputModel[],
                    buttons: ['取消', '确定'],
                };

                XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
                    .subscribe(v => {
                        if (v === null) {
                            return;
                        } else {
                            this.selectedItems.forEach(item => {
                                item.firstFactoringType = Number(v.firstFactoringType);
                                item.secondFactoringType = Number(v.secondFactoringType);

                            });
                            this.toValue();

                        }
                    });
                break;
            case '确权凭证':
                params = {
                    title: '确权凭证',
                    checker: [
                        {
                            title: '确权凭证',
                            checkerId: 'evidence',
                            type: 'select',
                            options: { ref: 'evidence' },
                            required: 1,
                        },
                        {
                            title: '还款方',
                            checkerId: 'payBackPoint',
                            type: 'select',
                            options: { ref: 'payBackPoint' },
                            required: 0,
                        }
                    ] as CheckersOutputModel[],
                    buttons: ['取消', '确定'],
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
                    .subscribe(v => {
                        if (v === null) {
                            return;
                        } else {
                            this.selectedItems.forEach(item => {
                                item.certification = Number(v.evidence);
                                item.payBackPoint = Number(v.payBackPoint);
                            });
                            this.toValue();
                        }
                    });
                break;
            case '过会情况':
                params = {
                    title: '过会情况',
                    checker: [
                        {
                            title: '过会情况',
                            checkerId: 'goMeetingQuestion',
                            type: 'select',
                            options: { ref: 'goMeetingQuestion' },
                            required: 1,
                        },
                        {
                            title: '过会备注',
                            checkerId: 'pastMemo',
                            type: 'text',
                            required: 0,
                        },
                    ] as CheckersOutputModel[],
                    buttons: ['取消', '确定'],
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
                    .subscribe(v => {
                        if (v === null) {
                            return;
                        } else {
                            this.selectedItems.forEach(item => {
                                item.oldpastStatus = item.pastStatus;
                                item.pastStatus = Number(v.goMeetingQuestion);
                                item.pastMemo = v.pastMemo;                // 过会备注
                            });
                            this.toValue();
                        }
                    });
                break;
            case '管户客户经理':
                this.xn.api.post('/custom/avenger/customer_manager/manager_list', {}).subscribe(x => {
                    this.xn.loading.close();
                    const param = {
                        heads: this.manageheads,
                        data: x.data.data || x.data.lists || [],
                        total: x.data.recordsTotal || (x.data.data && x.data.data.length) || (x.data.lists && x.data.lists.length) || 0,
                    };
                    XnModalUtils.openInViewContainer(this.xn, this.vcr, ChoseManageModalComponent, param)
                        .subscribe(v => {
                            if (v === null) {
                                return;
                            } else {
                                this.selectedItems.forEach(item => {
                                    item.customerManager = v.value[0].userName;
                                });
                                this.toValue();
                            }
                        });
                });
                break;
            case '供应商类型':
                params = {
                    title: '供应商类型',
                    checker: [
                        {
                            title: '供应商类型',
                            checkerId: 'companyType',
                            type: 'select',
                            options: { ref: 'companyType' },
                            required: 1,
                        },
                        {
                            title: '人工保理服务率',
                            checkerId: 'subFactoringServiceFLV',
                            type: 'text',
                            required: 1,
                            memo: '%'
                        },
                        {
                            title: '人工保理使用费率',
                            checkerId: 'subFactoringUseFLV',
                            type: 'text',
                            required: 1,
                            memo: '%'
                        },
                        {
                            title: '人工平台服务费率',
                            checkerId: 'subPlatformServiceFLV',
                            type: 'text',
                            required: 1,
                            memo: '%'
                        },
                        {
                            title: '人工期限',
                            checkerId: 'subNowlimit',
                            type: 'text',
                            required: 1,
                        },
                        {
                            title: '人工最大额度',
                            checkerId: 'subMaxAmount',
                            type: 'text',
                            required: 1,
                        },
                    ] as CheckersOutputModel[],
                    buttons: ['取消', '确定'],
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
                    .subscribe(v => {
                        if (v === null) {
                            return;
                        } else {
                            this.selectedItems.forEach(item => {
                                item.oldsupplierType = item.supplierType;
                                item.supplierType = Number(v.companyType);
                                item.subFactoringServiceFLV = this.valueChange(v.subFactoringServiceFLV) || '';
                                item.subFactoringUseFLV = this.valueChange(v.subFactoringUseFLV) || '';
                                item.subMaxAmount = this.valueChange(v.subMaxAmount) || '';
                                item.subNowlimit = this.valueChange(v.subNowlimit) || '';
                                item.subPlatformServiceFLV = this.valueChange(v.subPlatformServiceFLV) || '';
                            });
                            this.toValue();

                        }
                    });
                break;
        }
    }

    // 将取到的值变为两位小数结尾数字
    private valueChange(data) {
        return Number(parseFloat(data).toFixed(2));
    }

    // 上传完后取回值
    private toValue() {
        if (this.datalist.length !== this.selectedItems.length) {
            if (this.row.checkerId = 'adjustOrg') {
                this.ctrl.setValue(JSON.stringify(this.selectedItems));
            } else {
                this.ctrl.setValue('');
            }
        } else {
            // 复核流程情况下，如果没有补充，不能提交
            if (!this.procedureId && this.row.checkerId !== 'adjustOrg') {
                let valid = true;
                for (let i = 0; i < this.datalist.length; i++) {
                    if (this.datalist[i].province === '' || this.datalist[i].city === '' || this.datalist[i].addressNO === '') {
                        valid = false;
                        break;
                    }
                }
                valid ? this.ctrl.setValue(JSON.stringify(this.datalist)) : this.ctrl.setValue('');

            } else {
                this.ctrl.setValue(JSON.stringify(this.datalist));
            }
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    private fromValue() {
        this.datalist = XnUtils.parseObject(this.ctrl.value, []);
        // 复核流程情况下 ,且 不是会计下载流程
        if (!this.procedureId && this.row.checkerId !== 'adjustOrg') {
            this.datalist.forEach(c => c.checked ? c.checked = true : '');
            this.selectedItems = this.datalist;
            this.allCheckedStatus = true;
            this.toValue();
        } else {
            // 如果this.items中存在checked字段，将this.items中的checked变为false
            this.datalist.forEach(c => c.checked ? c.checked = false : '');
        }
        this.datalist = this.datalist.map(c => Object.assign({}, c, { checked: false }));
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        this.toValue();
    }

    /**
     *  取消并返回
     */
    public onCancel() {
        this.xn.user.navigateBack();
    }

    public getDatalist() {
        return this.selectedItems;
    }
}

class CustomSingerdatainfo {
    appId: 1;                       // 企业id
    orgName: '';                    // 企业名称
    orgType: 0;                       // 企业类型
    whiteStatus: 0;                   //  白名单状态
    certification: 0;                  //   确权凭证
    pastStatus: 0;                     // 过会情况
    supplierType: 0;                 // 供应商类型
    depositRate: 0;                   // 保证金比例
    totalFLV: 0;                       // 当前综合费率
    factoringUseFLV: 0;                      //  当前保理使用费率
    factoringServiceFLV: 0;                      //   当前保理服务费率
    platformServiceFLV: 0;                      // 当前平台服务费率
    nowlimit: 0;                     //   当前期限
    maxAmount: 0;                       // 当前最大额度
    usedAmount: 0;                     //  已使用额度
    leftAmount: 0;                    //    剩余额度
    customerManager: '';                     //  管户客户经理
    businessType: 0;                 //   业务类型: 1——万科供应商保理业


    constructor() {
    }
}

class CustomerdataInfo {
    public datainfo: CustomSingerdatainfo[];

    constructor() {

    }

}
