/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-input1.component
 * @summary：万科模式合同添加
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          修改pdf,图片查看         2019-03-27
 * **********************************************************************
 */

import {Component, Input, OnInit, ElementRef, ViewContainerRef} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ContractEditModalComponent } from 'libs/shared/src/lib/public/modal/contract-edit-modal.component';
import { ContractVankeEditModalComponent } from 'libs/shared/src/lib/public/modal/contract-vanke-edit-modal.component';
import { ContractVankeNewModalComponent } from 'libs/shared/src/lib/public/modal/contract-vanke-new-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';


/**
 *  万科模式合同添加
 */
@Component({
    selector: 'app-xn-contract-vanke-input1',
    templateUrl: './contract-vanke-input1.component.html',
    styles: [
            `.file-row-table {
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

        .table > thead > tr > th span {
            line-height: 20px;
        }
        `
    ]
})
@DynamicForm({ type: 'contract-vanke1', formModule: 'new-agile-input' })
export class ContractVankeInput1Component implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    items: any[];
    mode: string;

    alert = '';
    ctrl: AbstractControl;
    numberChange: AbstractControl;
    supplierChange: AbstractControl;
    xnOptions: XnInputOptions;
    asset = false;
    map = false;
    mainFlowId = '';
    // 角色
    public orgType: number;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.orgType = this.xn.user.orgType;
        this.mode = this.row.options.mode || 'upload';
        this.ctrl = this.form.get(this.row.name);
        this.asset = this.row.options.asset || false;
        this.map = this.row.options.map || false;
        this.mainFlowId = this.row.options.mainFlowId || '';

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     *  补充合同信息
     * @param item
     */
    public onEdit(item: any) {
        const p = {} as any;
        for (const k in item) {
            if (item.hasOwnProperty(k)) {
                p[k] = item[k];
            }
        }
        p.supplierInit = this.supplierChange && this.supplierChange.value;
        p.asset = this.asset;
        p.map = this.map;
        p.mainFlowId = this.mainFlowId;
        p.allFiles = this.row.value;

        XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractEditModalComponent, p).subscribe((v: any) => {
            console.log('v: ', v);
            if (v.action !== 'ok') {
                this.toValue();
                return;
            }

            if (this.map !== true) {
                for (const item2 of this.items) {
                    if (item2 !== item && item2.contractNum === v.contractNum) {
                        this.xn.msgBox.open(false, `合同编号(${v.contractNum})重复了，请您检查`);
                        return;
                    }
                }
            }

            // 把填写的内容补充到这里
            for (const k in v) {
                if (v.hasOwnProperty(k)) {
                    item[k] = v[k];  // item是this.items中的一个元素
                }
            }
            this.toValue();
        });
    }

    /**
     *  删除
     * @param item
     */
    public onRemove(item: any) {
        this.xn.api.post(`/attachment/deletes`, {
            keys: item.files.img.map(v => v.fileId)
        }).subscribe(json => {
            this.items.splice(this.items.indexOf(item), 1);
            this.toValue();
        });
    }

    /**
     *  查看文件信息
     * @param item
     * @param mode vanke  万科， gemdale 金地
     */
    public onView(item: any) {
        item.map = this.map;
        item.supplier = this.supplierChange && this.supplierChange.value || item.supplier;
        const params = {
            checkers: [
                {
                    title: '合同编号', checkerId: 'contractNum', type: 'text',
                    required: false, options: {readonly: true}, value: item.files.contractNum || ''
                },
                {
                    title: '合同金额', checkerId: 'contractAmount', type: 'money',
                    required: false, options: {readonly: true}, value: item.files.contractAmount || ''
                },
                {
                    title: '合同名称', checkerId: 'contractAmount', type: 'text',
                    required: false, options: {readonly: true}, value: item.files.contractName || ''
                },
            ],
            title: '查看合同信息',
            value: item,
            isShow: false,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractVankeEditModalComponent, params).subscribe(() => {
        });
    }

    /**
     *  上传合同文件
     * @param item
     * @param action
     */
    public onUpload(item: any, action) {
        const p = Object.assign({}, item);
        const checkers = [
            {
                title: '合同金额', checkerId: 'contractAmount', type: 'money', required: false,
                value: p.files.contractAmount || '',
                options: {readonly: action === 'view'}
            },
            {
                title: '合同文件图片', checkerId: 'img', type: 'mfile', required: true,
                options: {
                    filename: '合同文件图片',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500',
                    readonly: action === 'view'
                },
                value: p.files.img || '',
                memo: '上传图片'
            }, {
                title: '合同名称', checkerId: 'contractName', type: 'text', options: {readonly: true},
                required: false,
                value: p.files.contractName || '',
            },
            {
                title: '合同编号', checkerId: 'contractNum', type: 'text', options: {readonly: true},
                required: false,
                value: p.files.contractNum || '',
            }
        ];
        p.supplierInit = this.supplierChange && this.supplierChange.value;
        p.asset = this.asset;
        p.map = this.map;
        p.mainFlowId = this.mainFlowId;
        p.allFiles = this.row.value;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractVankeNewModalComponent, checkers).subscribe(v => {
            if (v === null) {
                this.toValue();
                return;
            }
            this.items[0].files.contractAmount = v.files.contractAmount;
            this.items[0].files.contractNum = v.files.contractNum;
            this.items[0].files.img = v.files.img;
            this.items[0].files.contractName = v.files.contractName;
            this.toValue();
        });
    }

    /**
     *  初始化值
     */
    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        setTimeout(() => {
            this.toValue();
        });
    }

    /**
     *  格式化值
     */
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            const contractTypeBool = [];
            for (let i = 0; i < this.items.length; i++) {
                contractTypeBool.push(!!(this.items[i].files && this.items[i].files.img
                    && this.items[i].files.img.length > 0));
            }
            contractTypeBool.indexOf(false) > -1 ? this.ctrl.setValue('') : this.ctrl.setValue(JSON.stringify(this.items));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
