/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：通用签章流程中上传模板组件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2021-06-22
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CfcaSetTextContractModalComponent } from 'libs/console/src/lib/management/common-cfca-signlist/modal/cfca-set-text-contract.modal';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';



@Component({
    selector: 'cfca-add-contract',
    templateUrl: './cfca-contract-upload.component.html',
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
@DynamicForm({ type: 'cauploadTemplate', formModule: 'dragon-input' })
export class CfcaAddContractComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public alert = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public items: any[] = [];
    mainForm: FormGroup;
    islineDown = false; // 判断是否是线上还是线下盖章 false为线上盖章
    public fileUpload = [{
        name: '',
        checkerId: 'contractUpload',
        type: 'dragonMfile',
        required: 1,
        value: '',
        options: '{"filename": "交易合同","fileext": "pdf", "picSize": "500"}',
    }];

    constructor(private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef

    ) {
    }
    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        XnFormUtils.convertChecker(this.fileUpload[0]);
        this.islineDown = this.form.get('signType').value === '1' ? true : false;
        this.mainForm = XnFormUtils.buildFormGroup(this.fileUpload);
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        console.log('this.ctrl.value', this.ctrl.value);
        if (this.ctrl.value) {
            this.items = JSON.parse(this.ctrl.value);
            this.toValue();
        }
        this.form.get('signType').valueChanges.subscribe(x => {
            if (Number(x) === 1) {
                this.islineDown = true;
            } else {
                this.islineDown = false;
            }
            this.toValue();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.mainForm.valueChanges.subscribe(x => {
            this.items = this.items.concat(JSON.parse(x.contractUpload));
            this.items.forEach(x => {
                if (!x.keyword) {
                    x.keyword = [];
                }
            });
            this.toValue();
        });
    }

    setSignText(paramFile: any, index: number) { //  type：2  代表盖章位置可改
        XnModalUtils.openInViewContainer(this.xn, this.vcr,
            CfcaSetTextContractModalComponent, { paramFiles: paramFile, type: 2 }).subscribe(x => {
                if (x.action === 'ok') {
                    console.log(x);
                    this.items[index].keyword = x.setTextParams;
                    this.toValue();
                }

            });
    }

    // 上传完后取回值
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            if (!this.islineDown) {
                const hasValue = this.items.some(x => x.keyword.length === 0);
                if (hasValue) {
                    this.ctrl.setValue('');
                } else {
                    this.ctrl.setValue(JSON.stringify(this.items));
                }
            } else {
                this.ctrl.setValue(JSON.stringify(this.items));
            }

        }

        this.ctrl.markAsTouched();
        this.cdr.markForCheck();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    public fileView(paramFiles) {
        const paramsFiles=[];
        paramsFiles.push(paramFiles);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, JsonTransForm(paramsFiles))
            .subscribe(() => {
            });
    }
    // 删除文件
    deleteFile(paramFiles, index) {
        this.items.splice(index, 1);
        this.toValue();
    }
}
