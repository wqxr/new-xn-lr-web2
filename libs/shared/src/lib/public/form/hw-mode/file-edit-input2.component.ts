/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：file-edit-input2.component.ts
 * @summary：注册企业，平台对于申请表补充银行账户信息
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          规范代码         2019-04-23
 * **********************************************************************
 */

import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnInputOptions} from '../xn-input.options';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {FileEditInput1ModalComponent} from './modal/file-edit-input1-modal.component';
import {InputModel} from './bank-card-single-input.component';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    selector: 'app-xn-file-edit-input2',
    templateUrl: './file-edit-input2.component.html',
})
export class FileEditInput2Component implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public files: any[];
    public myClass = '';
    public alert = '';
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public entry: InputModel = new InputModel();

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        // 设置初始值
        const obj = XnUtils.parseObject(this.ctrl.value, []);
        this.entry.accountName = obj.bank.remitName;
        this.entry.accountNumber = obj.bank.remitAccount;
        this.entry.bankName = obj.bank.remitBank;
        if (obj.files !== '' && !(obj.files instanceof Array)) {
            obj.files = JSON.parse(obj.files);
        }
        this.files = obj.files;
        this.toValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     *  编辑
     * @param paramsItems
     */
    public edit(paramsItems: any) {
        const params = {
            items: paramsItems,
            accountName: this.entry.accountName,
            bankName: this.entry.bankName,
            accountNumber: this.entry.accountNumber,
            edit: {
                accountNameBool: true,
                bankNameBool: true,
                accountNumberBool: true,
                canSave: true,
                operating: 'edit',
                required: 0
            },
            title: {
                accountNameTitle: '汇款账户名称',
                bankNameTitle: '汇款开户行名称',
                accountNumberTitle: '汇款账号'
            }
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileEditInput1ModalComponent, params)
            .subscribe(x => {
                if (x.action === 'ok') {
                    this.entry = x.value;
                    this.toValue();
                }
            });
    }

    private toValue() {
        const entry = {
            files: this.files,
            bank: {
                remitName: this.entry.accountName,
                remitAccount: this.entry.accountNumber,
                remitBank: this.entry.bankName
            }
        };
        this.ctrl.setValue(entry);
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
