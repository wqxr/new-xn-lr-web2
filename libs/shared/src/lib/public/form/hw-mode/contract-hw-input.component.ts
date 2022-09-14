/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-input.component.ts
 * @summary：定向收款模式合同添加
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          修改查看功能         2019-03-27
 * **********************************************************************
 */

import { Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ContractHwNewModalComponent } from './modal/contract-hw-new-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { ContractTypeCommunicateService } from 'libs/shared/src/lib/services/contract-type-communicate.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from '../xn-input.options';
import { ContractVankeEditModalComponent } from '../../modal/contract-vanke-edit-modal.component';

@Component({
    selector: 'app-contract-hw-input',
    templateUrl: `./contract-hw-input.component.html`
})
export class ContractHwInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public items: any[] = [];
    public ctrl: AbstractControl;
    public alert = '';
    xnOptions: any;

    public constructor(private xn: XnService,
                       private er: ElementRef,
                       private vcr: ViewContainerRef,
                       private publicCommunicateService: ContractTypeCommunicateService) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.fromValue();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     *  新增合同
     */
    public onNew() {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractHwNewModalComponent, null).subscribe(v => {
            if (v === null) {
                return;
            }
            v.img = JSON.parse(v.img);
            const params = {
                files: v
            };
            this.items.push(params);
            this.toValue();
        });
    }

    /**
     *  查看合同信息
     * @param item
     */
    public onView(item: any) {
        const params = {
            checkers: [
                {
                    title: '合同编号', checkerId: 'contractNum', type: 'text',
                    required: false, options: { readonly: true }, value: item.files.contractNum || ''
                },
                {
                    title: '合同金额', checkerId: 'contractAmount', type: 'money',
                    required: false, options: { readonly: true }, value: item.files.contractAmount || ''
                },
                {
                    title: '合同类型', checkerId: 'contractType', type: 'select',
                    required: false, options: { readonly: true, ref: ' contractType_jban' }, value: item.files.contractType || ''
                },
            ],
            title: '查看合同信息',
            value: item,
            isShow: false,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractVankeEditModalComponent, params).subscribe(v => {
        });
    }

    /**
     *  编辑合同信息
     * @param item
     * @param index
     */
    public edit(item: any, index: number) {
        const params = {
            edit: true,
            data: item,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractHwNewModalComponent, params).subscribe(v => {
            if (v === null) {
                return;
            }
            if (v.img instanceof Array) {
                // nothing
            } else {
                v.img = JSON.parse(v.img);
            }
            this.items[index].files = v;
            this.toValue();
        });
    }

    public remove(item: any) {
        this.xn.msgBox.open(true, '确认要删除该合同', () => {
            this.xn.api.post(`/attachment/deletes`, {
                keys: item.files.img.map(v => v.fileId)
            }).subscribe(json => {
                this.items.splice(this.items.indexOf(item), 1);
                this.toValue();
            });
        });
    }

    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
            // 为空则不传递
            this.publicCommunicateService.change.emit(null);
        } else {
            const keys = this.items.map((x: any) => x.files.contractType);
            this.publicCommunicateService.change.emit(keys);
            this.ctrl.setValue(JSON.stringify(this.items));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
