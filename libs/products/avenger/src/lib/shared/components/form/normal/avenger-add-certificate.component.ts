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
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { MfilesViewModalComponent } from 'libs/shared/src/lib/public/modal/mfiles-view-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { EditModalComponent, EditParamInputModel } from 'libs/shared/src/lib/public/avenger/modal/edit-modal.component';
import AvengerFormTable from './avenger-table';
import { AvengeraddContractModalComponent } from '../../modal/avenger-contract-write.modal';

@Component({
    selector: 'avenger-add-certificate-component',
    templateUrl: './avenger-add-certificate.component.html',
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
@DynamicForm({ type: 'lvyue', formModule: 'avenger-input' })
export class AvengerAddCertificateComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public alert = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public certificateitem: any; // 获取合同信息
    public Tabconfig: any;
    currentTab: any; // 当前标签页
    data: any[] = [];
    // 批量验证按钮状态
    // 全选按钮控制状态
    public unfill = false;



    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }



    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.Tabconfig = AvengerFormTable.tableFormlist;
        this.currentTab = this.Tabconfig.tabList[2]; // 当前标签页
        if (this.ctrl && this.ctrl.value && this.ctrl.value.status === 'unfill') {
            this.unfill = true;
        } else {
            this.unfill = false;
        }

        this.ctrl.statusChanges.subscribe(v => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }


    cleardata(item: number) {
        // let clearindex = this.data.findIndex((item) => { return item.appId === head.appId });
        this.data.splice(item, 1);
    }
    handleAdd() {
        const params: EditParamInputModel = {
            title: '新增履约证明材料',
            checker: [
                {
                    title: '单据类型',
                    checkerId: 'documentType',
                    type: 'select',
                    options: { ref: 'Certificateperformance' },
                    validators: {},
                },
                {
                    title: '文件图片',
                    checkerId: 'certificatecontractPic',
                    type: 'mfile',
                    validators: {},
                    isAvenger: true,
                }
            ] as CheckersOutputModel[],
            buttons: ['取消', '确定']
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
            if (v === null) {

                return;
            } else {
                this.certificateitem = v;
                this.data.push(this.certificateitem);
                this.toValue();
            }
        });
    }

    private fromValue() {
        this.data = XnUtils.parseObject(this.ctrl.value, []);
        this.toValue();
    }

    // 上传完后取回值
    private toValue() {
        if (this.data.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.data));

        }
        // this.ctrl.setValue(JSON.stringify(this.data));
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    public fileView(paramFiles) {
        const files = [{ fileId: paramFiles.filePath, isAvenger: true, }];
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, JsonTransForm(files))
            .subscribe(() => {
            });
    }

    showContract(item) {
        const checkers = [
            {
                title: '合同编号',
                checkerId: 'contractNum',
                type: 'text',
                required: false,
                options: { readonly: true },
                value: ''
            },
            {
                title: '合同金额',
                checkerId: 'contractAmount',
                type: 'money',
                required: false,
                options: { readonly: true },
                value: ''
            },
            {
                title: '合同名称',
                checkerId: 'contractName',
                required: false,
                type: 'text',
                options: { readonly: true },
                value: ''
            },
            {
                title: '合同甲方',
                checkerId: 'partA',
                type: 'text',
                required: false,
                options: { readonly: true },
                value: ''
            },
            {
                title: '合同乙方',
                checkerId: 'partB',
                type: 'text',
                options: { readonly: true },
                required: false,
                value: ''
            },
            {
                title: '合同签订时间',
                checkerId: 'contractSignTime',
                required: false,
                type: 'date',
                options: { readonly: true },
                value: '',
                placeholder: '请选择时间'
            },
            {
                title: '合同结算方式',
                checkerId: 'Contractmethod',
                type: 'text',
                required: 0,
                value: ''
            },
            {
                title: '合同商品名称',
                checkerId: 'contractPayment ',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: ''
            },
            {
                title: '合同商品数量',
                checkerId: 'contractReceivable',
                type: 'text',
                options: { readonly: true },
                required: 0,
                value: ''
            },
            {
                title: '合同商品单价',
                checkerId: 'contracttype',
                type: 'text',
                required: 0,
                options: { readonly: true },
                validators: {},
            },
            {
                title: '应收账款类型',
                checkerId: 'contractReceivable',
                type: 'text',
                options: { readonly: true },
                required: 0,
                value: ''
            },
            {
                title: '合同付款期限',
                checkerId: 'contracttype',
                type: 'text',
                options: { readonly: true },
                required: 0,
                validators: {},
            },

        ];
        item.contractFile = item.certificatecontractPic;
        const params = {
            checkers,
            value: item,
            title: '图片查看',
            type: 1,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengeraddContractModalComponent, params)
            .subscribe(v => { });

    }
}
