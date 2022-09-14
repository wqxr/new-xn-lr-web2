
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary： 回款管理匹配
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                    wq             增加             2019-06-19
 * **********************************************************************
 */

import { Component, ElementRef, Input, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import AvengerapprovalTable from './approval.fitall.tab';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { AvengerapprovalFitComponent } from '../../modal/avenger-approval-fitbusiness.modal';
import { AvengerPdfSignModalComponent } from 'libs/shared/src/lib/public/avenger/modal/pdf-sign-modal.component';
import { DragonChoseAccountinfoComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-chose-accountinfo.modal';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';


@Component({
    selector: 'avenger-approval-fitall-component',
    templateUrl: './approval-fitall.component.html',
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
            .noneborder  td{
                width: 700px;
                padding-top: 8px;
                padding: 8px;
                line-height: 1.42857143;
                vertical-align: top;
            }
            .noneborder th{
                width: 700px;
                padding-top: 8px;
                padding: 8px;
                line-height: 1.42857143;
                vertical-align: top;
            }
            .required-star:after {
                content: '*';
                color: red;
            }
            .table-height {
                max-height: 600px;
                overflow: scroll;
            }

        `
    ]
})
@DynamicForm({
    type: [
        'honor-fit',
        'honor-fit1',
        'bank-single1',
        'compare-info',
        'compare-info-yjl',
        'text-info',
        'free-info',
        'deal-info',
        'return-info',
    ], formModule: 'avenger-input'
})
export class AvengerapprovalComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public alert = ''; // 提示
    public alert1 = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public certificateitem: any; // 获取合同信息
    public Tabconfig: any;
    currentTab: any; // 当前标签页
    data: any[] = [];
    datavalue: any;
    datavalue1: any;
    selectOptions: any[] = [];
    selectValue = '';
    // 判断是否是excel格式
    isExcel = false;
    successnum: number;
    failnum: number;
    // 批量验证按钮状态
    // 全选按钮控制状态
    public unfill = false;
    headLeft = 0;
    private flowId: string;


    constructor(private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        private publicCommunicateService: PublicCommunicateService,
    ) {
    }



    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        // console.log('这里的svrConfig', this.svrConfig);
        // console.log('这里的row', this.row);
        this.flowId = this.svrConfig.record?.flowId || this.row.flowId;
        // console.log('这里的flowId', this.flowId);
        this.Tabconfig = AvengerapprovalTable.tableFormlist;
        this.currentTab = this.Tabconfig.tabList[2]; // 当前标签页
        this.selectOptionsInit();
        if (this.row.type === 'honor-fit') {

        } else if (
            this.row.type === 'bank-single1' ||
            this.row.type === 'fee-info' ||
            this.row.type === 'deal-info' ||
            this.row.type === 'text-info'
        ) {
            this.datavalue = !!this.row.value ? JSON.parse(this.row.value) : '';
        } else if (
            this.row.type === 'compare-info' ||
            this.row.type === 'compare-info-yjl'
        ) {
            this.datavalue = !!this.row.value ? JSON.parse(this.row.value) : '';
        }
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /** 判断 是否为恒泽流程 */
    judgeHZFlow() {
        const mainFlowId = this.svrConfig.mainFlowId || this.svrConfig.record.mainFlowId;
        return mainFlowId.endsWith('_hz');
    }
    private isInFlow() {
        return (
            this.flowId === 'sub_jd_change_verification' ||
            this.flowId === 'sub_factoring_change_jd_520' ||
            this.flowId === 'sub_financing_sign_jd_520' ||
            this.flowId === 'sub_customer_verify_jd_520' ||
            this.flowId === 'sub_financing_verify_jd_520'
        );
    }
    /** selectOptions 初始化 */
    selectOptionsInit() {
        this.selectOptions = this.isInFlow() ? SelectOptions.get('changeReasonGemdal') : SelectOptions.get('changeReason');
        if (this.row.type === 'compare-info-yjl') {
            this.selectOptions = SelectOptions.get('changeReasonYjl');

            if (this.judgeHZFlow()) {
                this.selectOptions = SelectOptions.get('changeReasonHZ');
            }
        }
        console.log('this.selectOptions', this.selectOptions)
    }

    private fromValue() {
        this.datavalue = XnUtils.parseObject(this.ctrl.value, []);
        if (this.datavalue.changeReason && typeof this.datavalue.changeReason === 'string') {
            this.datavalue.changeReason = Number(this.datavalue.changeReason);
        }
        this.toValue(this.datavalue);
    }

    // 上传完后取回值
    private toValue(datavalue) {
        if (!datavalue) {
            return;
        }
        if (this.row.type === 'compare-info' || this.row.type === 'compare-info-yjl') {
            const isOk = [this.datavalue.new].some(val => val.receiveOrg !== '' && val.receiveAccount !== '' && val.receiveBank !== '');
            this.alert1 = this.datavalue.changeReason !== '' ? '' : '请选择变更原因';
            if (isOk && this.datavalue.changeReason !== '') {
                this.ctrl.setValue(JSON.stringify(this.datavalue));
            } else {
                this.ctrl.setValue('');
            }
        } else {
            this.ctrl.setValue(JSON.stringify(datavalue));
            this.ctrl.markAsTouched();
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        }

    }
    public downloadTp02() {
        const a = document.createElement('a');
        a.href = '/assets/lr/doc/avenger-mode/商票匹配模板.xlsx';
        a.click();
    }

    public inputChange(e, key) {
        this.datavalue.changeReason = e.target.value;
        this.publicCommunicateService.change.emit(e.target.value);
        this.toValue(this.datavalue);
    }
    public onBlur() {
        if (this.datavalue.receiveOrg === '' || this.datavalue.receiveAccount === ''
            || this.datavalue.receiveBank === '' || this.datavalue.receiveBankNo === '') {
            this.datavalue = XnUtils.parseObject(this.ctrl.value, []);

        } else {
            this.toValue(this.datavalue);
        }
    }
    /**
    * 计算表格合并项
    * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
    */
    public calcAttrColspan(tabconfig): number {
        const nums: number = tabconfig.headText.length + 1;
        return nums;
    }
    textclickInfo() {
        alert('aaaaa');
    }

    // 上传excel
    uploadExcel(e, type: number) {
        if (e.target.files.length === 0) {
            return;
        }

        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;
            $(e.target).val('');
            return;
        }

        const fd = new FormData();
        fd.append('checkerId', this.row.checkerId);
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        /**
         *  应收款保理计划表上传
         */
        if (type === 1) {
            this.xn.api.upload('/custom/avenger/upload/honor_upload', fd).subscribe(json => {
                if (json.type === 'complete') {
                    if (json.data.ret === 0) {
                        if (json.data.data.data.length > 0) {
                            this.datavalue = json.data.data.data;
                            this.failnum = this.datavalue.filter(item => item.result === 0).length;
                            this.successnum = this.datavalue.filter(item => item.result === 1).length;

                        }
                        this.isExcel = true;

                        this.toValue({ datavalue: this.datavalue, failnum: this.failnum, successnum: this.successnum });
                    } else {
                        // this.isExcel = false;
                        this.xn.msgBox.open(false, json.data.msg);
                    }
                    $(e.target).val('');
                    this.ctrl.markAsDirty();
                    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                }
            });
        } else if (type === 2) {
            this.xn.api.upload('/custom/avenger/upload/back_upload', fd).subscribe(json => {
                if (json.type === 'complete') {
                    if (json.data.ret === 0) {
                        if (json.data.data.data.length > 0) {
                            this.datavalue = json.data.data.data;
                            this.failnum = this.datavalue.filter(item => item.result === 0).length;
                            this.successnum = this.datavalue.filter(item => item.result === 1).length;

                        }
                        this.isExcel = true;

                        this.toValue({ datavalue: this.datavalue, failnum: this.failnum, successnum: this.successnum });
                    } else {
                        // this.isExcel = false;
                        this.xn.msgBox.open(false, json.data.msg);
                    }
                    $(e.target).val('');
                    this.ctrl.markAsDirty();
                    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                }
            });
        }

    }
    beforeUpload(e) {
    }
    // 选择交易匹配
    chosebusiness(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerapprovalFitComponent, { params: item.extendInfo })
            .subscribe(v => {
                if (v === null) {
                    return;
                } else {
                    item.mainFlowId = v.mainFlowId;
                    item.result = 1;
                    this.successnum += 1;
                    const list = this.datavalue.map(item => {
                        const {
                            honorNum,
                            receivable,
                            factoringStartDate,
                            factoringEndDate,
                            projectCompany,
                            factoringName,
                            mainFlowId,
                            result
                        } = item;
                        return {
                            honorNum,
                            receivable,
                            factoringStartDate,
                            factoringEndDate,
                            projectCompany,
                            factoringName,
                            mainFlowId,
                            result,
                        };
                    });
                    this.toValue({ datavalue: list, failnum: this.failnum, successnum: this.successnum });
                }
            });

    }

    /**
   *  查看合同
   * @param paramContract
   */
    public showContract(paramContract: any) {
        const params = Object.assign({}, paramContract, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerPdfSignModalComponent, params).subscribe();
    }

    /**
     * 下载模板
     */
    public downloadTp() {
        const a = document.createElement('a');
        a.href = '/assets/lr/doc/avenger-mode/回款匹配模板.xlsx';
        a.click();
    }
    // 验证是否是excel
    private validateExcelExt(s: string): string {
        if (isNullOrUndefined(this.row.options)) {
            return '';
        }
        if ('excelext' in this.row.options) {
            const exts = this.row.options.excelext.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `只支持以下文件格式: ${this.row.options.excelext}`;
            }
        } else {
            return '';
        }
    }
    // 选择收款账户
    handleAdd() {
        if (!this.datavalue.changeReason) {
            this.alert1 = '请选择变更原因';
            return;
        }
        this.alert1 = '';
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonChoseAccountinfoComponent, {})
            .subscribe(v => {
                if (v != null && Array.isArray(v) && v.length) {
                    this.datavalue.new.receiveOrg = v[0].accountName;
                    this.datavalue.new.receiveAccount = v[0].cardCode;
                    this.datavalue.new.receiveBank = v[0].bankName;
                    this.datavalue.new.receiveBankNo = v[0].bankCode;
                    // this.datavalue.new.bankId = v[0].bankCode;
                    this.toValue(this.datavalue);
                    this.cdr.markForCheck();
                }
            });
    }

    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
        // console.log(this.headLeft);
    }

    cleardata(item: number) {
        this.datavalue.splice(item, 1);
        this.toValue({ datavalue: this.datavalue, failnum: this.failnum, successnum: this.successnum });
    }
}
