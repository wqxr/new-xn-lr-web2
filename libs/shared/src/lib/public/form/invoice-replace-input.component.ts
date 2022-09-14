/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：invoice-replace-input.component
 * @summary：定向收款模式 发票上传、验证、替换组件   xn-input   type='invoice-replace-info'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          修改         2019-03-29
 * **********************************************************************
 */

import {Component, OnInit, Input, ElementRef, ViewContainerRef} from '@angular/core';
import {XnService} from '../../services/xn.service';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {isNullOrUndefined} from 'util';
import {XnUtils} from '../../common/xn-utils';
import {setTimeout} from 'core-js/library/web/timers';
import {LoadingService} from '../../services/loading.service';
import {InvoiceUploadService} from '../../services/invoice-upload.service';
import {LoadingPercentService} from '../../services/loading-percent.service';
import {UploadPicService} from '../../services/upload-pic.service';
import {PublicCommunicateService} from '../../services/public-communicate.service';
import {InvoiceDirectionViewModalComponent} from '../modal/invoice-direction-view-modal.component';

declare let $: any;

@Component({
    selector: 'app-xn-invoice-replace-input',
    templateUrl: './invoice-replace-input.component.html',
    styles: [
            `
            .file-row-table {
                margin-bottom: 0
            }

            .file-row-table td {
                padding: 6px;
                border-color: #d2d6de;
                font-size: 12px;
            }

            .file-row-table th {
                font-weight: normal;
                border-color: #d2d6de;
                border-bottom-width: 1px;
                line-height: 100%;
                font-size: 12px;
            }

            .table-bordered {
                border-color: #d2d6de;
            }

            .table > thead > tr > th {
                padding-top: 7px;
                padding-bottom: 7px;
            }

            .widthMax {
                width: 120px;
            }

            .widthMiddle {
                width: 80px;
            }

            .gray {
                color: #666;
            }

            .fr {
                float: right
            }

            .xn-table-upload {
                padding-top: 5px;
            }

            .checkbox-select {
                width: 1.5rem;
                height: 1.5rem;
            }

            .block {
                display: block
            }

            .text-color {
                color: #d00000;
            }

            .money-color {
                color: #b10000;
            }

            .a-btn {
                margin: 0 1px;
            }

            .sorting:after, .sorting_asc:after, .sorting_desc:after {
                font-family: 'Glyphicons Halflings';
                opacity: 0.5;
            }

            .sorting:after {
                content: "\\e150";
                opacity: 0.2
            }

            .sorting_asc:after {
                content: "\\e155"
            }

            .sorting_desc:after {
                content: "\\e156"
            }

            .text-line {
                line-height: 20px;
            }

            .button-padding {
                padding: 2px 5px
            }
        `
    ]
})
export class InvoiceReplaceInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    // 全选框选择状态
    public checkedAllStatus = false;
    // 上传的数据- 初始状态
    public items: any[] = [];
    public alert = '';
    // 含税
    public amountAll = 0;
    // 不含税
    public preAmountAll = 0;
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    private itemLength = 0; // 上传的发票总数
    // 角色
    public orgType = this.xn.user.orgType;
    // 批量验证按钮状态
    public btnStatus = false;
    // 全选按钮控制状态
    public SelectedBtnStatus = false;
    // 表头样式
    public sort = {invoiceDate: 'sorting', invoiceAmount: 'sorting'};

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
                private loading: LoadingPercentService,
                private invoiceUpload: InvoiceUploadService,
                private loadingService: LoadingService,
                private uploadPicService: UploadPicService,
                private publicCommunicateService: PublicCommunicateService) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }

    /**
     *  发票排序
     * @param {string} label
     */
    public onSort(label: string) {
        if (this.sort[label] === 'sorting' || this.sort[label] === 'sorting_desc') {
            this.sort[label] = 'sorting_asc';
            this.items = this.items.sort((a, b) => a[label] - b[label]);
        } else if (this.sort[label] === 'sorting_asc') {
            this.sort[label] = 'sorting_desc';
            this.items = this.items.sort((a, b) => b[label] - a[label]);
        }
    }

    public sortClass() {
        return this.sort;
    }

    /**
     * 上传发票要素表
     * @param e
     */
    public uploadInvoiceExcel(e) {
        if (e.target.files.length === 0) {
            return;
        }
        // todo 暂时取消
        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;
            // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
            $(e.target).val('');
            return;
        }
        const fd = new FormData();
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        if (!!this.form.controls.mainFlowId && !!this.form.controls.nextDate) {
            fd.append('mainFlowId', this.form.controls.mainFlowId.value);
            fd.append('nextDate', this.form.controls.nextDate.value);
        }
        this.loadingService.open();
        this.xn.api.upload('/custom/direct_v3/direct_payment/upload_excel_invoice', fd).subscribe({
            next: x => {
                if (x.type === 'complete') {
                    e.target.value = '';
                    if (x.data.ret !== 0) {
                        this.xn.msgBox.open(false, x.data.msg);
                    } else {
                        // excel表中的数据手工查验，文件名为'/'
                        this.items = x.data.data.data.map(c => {
                            c.status = c.status ? c.status : 5;
                            return c;
                        });
                        this.toValue();
                        this.getDeputeMoney();
                        if (x.data.data.invoiceStatus === 1) {
                            this.xn.msgBox.open(false, '已过滤重复发票');
                        }
                    }
                }
            },
            error: errs => {
                this.xn.msgBox.open(false, errs);
            },
            complete: () => {
                this.loadingService.close();
            }
        });
    }

    /**
     * 查看发票详情
     * @param item
     * @param i
     *  invoiceCode: item.invoiceCode,
     *  invoiceNum: item.invoiceNum,
     *  invoiceDate: item.invoiceDate,
     *  invoiceAmount: item.invoiceAmount,
     *  amount: item.amount || item.invoiceAmount,
     */
    public viewInvoicesDetail(item: any, i?: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceDirectionViewModalComponent, item).subscribe(() => {
        });
    }

    /**
     *  全部删除
     * @param bool false 不执行删除操作，删除后更改发票指引组件状态
     */
    public deleteAll(bool: boolean) {
        if (!bool) {
            return;
        }
        const finds = this.items.filter((x: any) => x.clicked && x.clicked === true);
        finds.map(x => {
            this.isUploadInvoiceNum({value: x.invoiceNum, change: 0});
        });
        this.items = this.items.filter((x: any) => x.clicked === undefined || x.clicked === false);
        if (this.items.length === 0) {
            this.checkedAllStatus = false;
            this.btnStatus = false;
        }
        this.toValue();
        this.getDeputeMoney();
    }

    /**
     *  单个删除文件 ，删除后更改发票指引组件状态
     * @param val
     * @param i
     */
    public onRemove(val: any, i) {
        // 过滤掉包含此 invoiceCode 的文件
        this.items = this.items.filter((x, n) => n !== i);
        this.btnStatus = this.items.some((x: any) => x.clicked === true);
        this.checkedAllStatus = !this.items.some((x: any) => x.clicked === undefined || x.clicked === false) && this.items.length > 0;
        this.toValue();
        this.getDeputeMoney();
        this.isUploadInvoiceNum({value: val.invoiceNum, change: 0});
    }

    /**
     *  单选项
     * @param index
     */
    public handleSelect(index) {
        this.items[index].clicked = !(this.items[index].clicked && this.items[index].clicked === true);
        // 当有选中时,可以点击查验按钮
        this.btnStatus = this.items.some((x: any) => x.clicked === true);
        // 当数组中不具有clicked 且为false。没有找到则表示全选中。
        this.checkedAllStatus = !this.items.some((x: any) => x.clicked === undefined || x.clicked === false);
    }

    /**
     *  选择框状态 true 全选，false 非全选
     */
    public handleAllSelect() {
        this.checkedAllStatus = !this.checkedAllStatus;
        if (this.checkedAllStatus) {
            this.items.map(item => item.clicked = true);
            this.btnStatus = true;
        } else {

            this.items.map(item => item.clicked = false);
            this.btnStatus = false;
        }
    }

    /**
     *  excel批量验证发票 - 验证未验证/失败 （重复验证 3, 验证失败 2, 验证成功 1,作废 4, undefined 未验证);
     */
    public handleVerification() {
        // 未验证/失败excel
        const filterItem = this.items.filter(x =>
            x.clicked && x.clicked === true && (x.status === 2 || x.status === 5 || x.status === undefined));
        if (filterItem.length > 0) {
            const paramArr = [];
            filterItem.map(x => {
                paramArr.push(
                    {
                        invoiceCode: x.invoiceCode === 'undefined' ? '' : x.invoiceCode,
                        invoiceNum: x.invoiceNum === 'undefined' ? '' : x.invoiceNum,
                        invoiceDate: x.invoiceDate === 'undefined' ? '' : x.invoiceDate,
                        invoiceAmount: x.invoicePretaxAmount === 'undefined' ? '' : x.amount, // 不含税金额
                        // invoiceAmount: x.amount === 'undefined' ? '' : x.amount,
                        invoiceTypeString: x.invoiceTypeString === 'undefined' ? '' : x.invoiceTypeString
                    });
            });
            // 多张验证参数
            this.postInit(paramArr, 0); // 多张逐个验证
        } else {
            this.xn.msgBox.open(false, '无未验证Excel发票', () => {
                this.items.forEach(x => {
                    if (x.clicked && x.clicked === true) {
                        x.clicked = false;
                    }
                    // 取消全选状态
                    this.checkedAllStatus = !this.items.some(c => !c.clicked || !!c.clicked && c.clicked === false);
                });
            });
        }
    }

    /**
     *  excel 发票验证
     * @param filterItem
     * @param i
     */
    public postInit(filterItem: any, i?: number) {
        if (!(filterItem instanceof Array)) {
            const file = {
                invoiceCode: filterItem.invoiceCode === 'undefined' ? '' : filterItem.invoiceCode,
                invoiceNum: filterItem.invoiceNum === 'undefined' ? '' : filterItem.invoiceNum,
                invoiceDate: filterItem.invoiceDate === 'undefined' ? '' : filterItem.invoiceDate,
                invoiceAmount: filterItem.invoicePretaxAmount === 'undefined' ? '' : filterItem.amount, // 不含税金额
                // invoiceAmount: filterItem.amount === 'undefined' ? '' : filterItem.amount, // 不含税金额
                invoiceTypeString: filterItem.invoiceTypeString === 'undefined' ? '' : filterItem.invoiceTypeString
            };
            filterItem = [file];
            i = 0;
        }
        if (filterItem.length === i) {
            this.items.map(item => item.clicked = false); // 取消全选
            this.toValue();
            this.loading.close();
            return;
        }
        const params = {invoices: [filterItem[i]]};
        this.loading.open(filterItem.length, i);
        this.xn.api.postMap('/ljx/invoice/invoices_check', params).subscribe(val => {
            if (val.ret === 0) {
                const verData = val.data;
                verData.map((item) => {
                    const find = this.items.find(fis => fis.invoiceNum === item.data.invoiceNum);
                    if (find) {
                        if (item.code === 0 && this.items && this.items.length) {
                            find.status = item.data.status;
                            // find['invoiceAmount'] = item.data.invoiceAmount;
                            this.isUploadInvoiceNum({value: find.invoiceNum, change: 1});
                        } else {
                            find.status = 2;
                        }
                        // 验证完成后取消选择checked选中状态
                        if (find.clicked && find.clicked === true) {
                            find.clicked = false;
                        }
                    }
                });
            }
            this.toValue();
            i++;
            this.postInit(filterItem, i);
        }, () => {
        }, () => {
            // 取消全选状态
            this.checkedAllStatus = !this.items.some(c => !c.clicked || !!c.clicked && c.clicked === false);
        });
    }

    /**
     *  替换发票流程适用
     *  委托付款金额 deputeMoney
     *  托管账户余额 deputeLeft
     */
    private getDeputeMoney() {
        if (this.row.flowId !== 'financing_invoice_replace13') {
            return;
        }
        const invoiceFile = this.items.map(c => {
            return {
                invoiceRepaymentDate: c.invoiceRepaymentDate,
                invoiceAmount: c.invoiceAmount
            };
        });
        const params = {mainFlowId: this.form.controls.mainFlowId.value, invoiceFile, nextDate: this.form.controls.nextDate.value};
        this.xn.api.postMap('/custom/direct_v3/project/get_depute_money', params).subscribe(x => {
            this.form.controls.deputeMoney.setValue(x.data.deputeMoney);
            this.form.controls.deputeLeft.setValue(x.data.deputeLeft);
        });
    }

    /**
     * 根据 invoiceNum的值 来验证是否上传了发票,传值至 发票指引组件
     * @param obj
     */
    private isUploadInvoiceNum(obj: InvoiceChangeModel) {
        this.invoiceUpload.change.emit(obj);
    }

    /**
     *  格式化初始值
     */
    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.getDeputeMoney();
        if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
            this.amountAll = this.computeSum(this.items.filter(v => v && v.invoiceAmount)
                .map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
        }
        this.SelectedBtnStatus = this.items.length > 0;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
     *  格式化，表单数据
     */
    private toValue() {
        this.itemLength = this.items.length; // 记录上传发票总数
        if (this.itemLength === 0) {
            this.ctrl.setValue('');
            this.amountAll = 0;
        } else {
            const contractTypeBool = []; // 必须每张发票都包含发票号，金额，开票日期
            for (let i = 0; i < this.itemLength; i++) {
                contractTypeBool.push(!!(this.items[i].invoiceAmount) && !!(this.items[i].invoiceNum && !!this.items[i].invoiceDate));
            }
            contractTypeBool.indexOf(false) > -1 ? this.ctrl.setValue('') : this.ctrl.setValue(JSON.stringify(this.items));
            if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
                this.amountAll = this.computeSum(this.items.filter(v =>
                    v && v.invoiceAmount).map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
            } else {
                this.amountAll = 0;
            }
        }
        // 计算完金额后向外抛出的值
        this.publicCommunicateService.change.emit(this.amountAll);
        this.SelectedBtnStatus = this.items.length > 0;
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        // 判断发票是否重复验证发票
        // todo 方便测试 暂时关闭发票重复验证
        for (let i = 0; i < this.itemLength; i++) {
            if ([3, 2, 5, undefined].includes(this.items[i].status)) {
                this.ctrl.setErrors({duplicateVerification: true});
                this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                break;
            }
        }
    }

    /**
     *  数组求和
     * @param array
     */
    private computeSum(array) {
        return array.reduce((prev, curr) => {
            return prev + curr;
        });
    }

    /**
     *  验证所选文件格式
     * @param s
     */
    private validateExcelExt(s: string): string {
        if (isNullOrUndefined(this.row.options)) {
            return '';
        }
        if ('fileext' in this.row.options) {
            const exts = this.row.options.fileext.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `只支持以下文件格式: ${this.row.options.fileext}`;
            }
        } else {
            return '';
        }
    }
}

// 发票是否上传
export class InvoiceChangeModel {
    value: string; // 发票号码
    change: number; // 1，添加，0 ,删除
}
