/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：accounts-receivable.component
 * @summary：应收账款证明
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          补充，查看应收账款信息         2019-03-27
 * **********************************************************************
 */

import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {NewFileModalComponent} from './modal/new-file-modal.component';
import {SupplementFileModalComponent} from './modal/supplement-file.modal.component';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnInputOptions} from '../xn-input.options';

@Component({
    selector: 'app-xn-accounts-receivable',
    templateUrl: `./accounts-receivable.component.html`
})
export class AccountsReceivableComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public items: AccountInputModel[] = [];
    public ctrl: AbstractControl;
    public alert = '';
    private btnTitle = ['添加文件', '修改文件'];
    public btnTit = this.btnTitle[0];
    xnOptions: XnInputOptions;

    public constructor(private xn: XnService,
                       private er: ElementRef,
                       private vcr: ViewContainerRef) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        // 取值
        const tem = XnUtils.parseObject(this.ctrl.value, {});
        if (Array.isArray(tem)) {
            this.items = [...this.items, ...tem];
        } else {
            this.items.push(tem);
        }
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i].files || !this.items[i].graceDate) {
                this.ctrl.setValue('');
                this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                break;
            }
        }
    }

    /**
     *  添加应收账款证明文件
     * @param item
     * @param i 当前下标
     */
    public onNew(item, i) {
        const params = {
            title: '新增应收账款证明',
            checker: [
                {
                    title: '应收账款证明文件', checkerId: 'proveImg', type: 'mfile', flowId: 'financing13',
                    options: {
                        filename: '应收账款证明文件',
                        fileext: 'jpg, jpeg, png, pdf, xls, xlsx',
                        picSize: '500'
                    }, memo: '请上传图片、PDF或EXCEL'
                },
            ]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, NewFileModalComponent, params).subscribe(v => {
            if (v === null) {
                return;
            }
            this.items[i] = Object.assign({}, this.items[i], v);
            this.btnTit = this.btnTitle[1];
            this.toValue();
        });
    }

    /**
     *  补充应收账款证明信息
     * @param item
     * @param index 当前文件下标
     *  isCalculation 不可手动修改，系统计算
     */
    public handleSupplement(item: any, index: number) {
        if (!item.files) {
            this.xn.msgBox.open(true, '请先上传文件', () => {
                return;
            });
        } else {
            const params = {
                title: '补录应收账款证明',
                checker: [
                    {
                        title: '委托付款日',
                        checkerId: 'factoringDueDate',
                        flowId: 'financing13',
                        type: 'date3',
                        required: true,
                        value: item.factoringDueDate,
                        options: {isCalculation: true}
                    }, {
                        title: '保理融资到期日',
                        checkerId: 'factoringEndDate', flowId: 'financing13',
                        type: 'date3',
                        required: true,
                        memo: '预计到期日+1天，遇假期顺延',
                        value: item.factoringEndDate,
                        options: {isCalculation: true}
                    }, {
                        title: '宽限日期',
                        checkerId: 'graceDate', flowId: 'financing13',
                        type: 'date3',
                        required: true,
                        value: item.factoringEndDate,
                        memo: '保理融资到期日+30天自然日',
                        options: {isCalculation: true}
                    }, {
                        title: '本批次金额',
                        checkerId: 'currentAmount',
                        flowId: 'financing13',
                        type: 'money',
                        required: true,
                        value: item.currentAmount || 0
                    }
                ],
                data: item
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, SupplementFileModalComponent, params).subscribe(v => {
                if (v === null) {
                    return;
                }
                this.items[index].factoringEndDate = v.factoringEndDate;
                this.items[index].factoringDueDate = v.factoringDueDate;
                this.items[index].currentAmount = v.currentAmount;
                this.items[index].graceDate = v.graceDate;
                this.toValue();
            });
        }
    }

    /**
     *  查看应收账款证明
     * @param item
     * @param view
     */
    public onViewReceivable(item: any, view: string) {
        const params = {
            title: '查看应收账款证明',
            checker: [
                {
                    title: '委托付款日',
                    checkerId: 'factoringDueDate',
                    flowId: 'financing13',
                    type: 'date3',
                    required: true,
                    value: item.factoringDueDate,
                    options: {readonly: true}
                },
                {
                    title: '保理融资到期日',
                    checkerId: 'factoringDueDate',
                    type: 'date',
                    required: true,
                    memo: '预计到期日+1天，遇假期顺延',
                    value: item.factoringEndDate,
                    options: {readonly: true}
                }, {
                    title: '本批次金额',
                    checkerId: 'currentAmount',
                    type: 'money',
                    required: true,
                    value: item.currentAmount,
                    options: {readonly: true}
                }, {
                    title: '宽限日期',
                    checkerId: 'graceDate',
                    type: 'text',
                    required: true,
                    memo: '保理融资到期日+30天自然日',
                    value: item.graceDate,
                    options: {readonly: true}
                },
            ],
            data: item,
            operating: view
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SupplementFileModalComponent, params).subscribe(v => {
        });
    }

    public remove(item: any) {
        this.xn.msgBox.open(true, '确认要删除该证明', () => {
            this.xn.api.post(`/attachment/deletes`, {
                keys: item.files.map(v => v.fileId)
            }).subscribe(() => {
                this.items.splice(this.items.indexOf(item), 1);
                this.toValue();
            });
        });
    }

    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            let count = 0;
            for (let i = 0; i < this.items.length; i++) {
                if (!this.items[i].files || !this.items[i].graceDate) {
                    this.ctrl.setValue('');
                    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                    break;
                } else {
                    ++count;
                }
            }
            if (count === this.items.length) {
                this.ctrl.setValue(JSON.stringify(this.items));
            }
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}

/**
 *  应收账款证明输入输出字段
 */
export class AccountInputModel {
    public fileName?: string;
    public files?: any; // 文件
    public currentAmount?: string; // 本批次金额
    public factoringEndDate?: string; // 保理融资到期日
    public factoringDueDate?: string; // 委托付款日
    public graceDate?: string; // 宽限期
}
