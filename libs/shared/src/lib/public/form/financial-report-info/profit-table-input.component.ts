/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：ash-profit-table-input.component.ts
 * @summary：现金流量，利润表   type:cash-profit
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-18
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnInputOptions } from '../xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { EditModalComponent, EditParamInputModel } from 'libs/products/avenger/src/lib/shared/components/modal/edit-modal.component';

@Component({
    selector: 'xn-profit-table-input-component',
    templateUrl: './profit-table-input.component.html',
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
        `
    ]
})
export class ProfitTableInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    public alert = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public items: any[] = [];

    constructor(private er: ElementRef,
                private vcr: ViewContainerRef,
                private xn: XnService) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     *  新增表 现金流量
     */
    public handleAdd() {
        const params: EditParamInputModel = {
            title: this.row.title,
            buttons: ['取消', '提交'],
            size: ModalSize.Large,
            checker: [
                {
                    checkerId: 'excel',
                    required: 1,
                    type: 'file',
                    options: { fileext: 'xlsx,xls' },
                    title: '现金流量表',
                    placeholder: '',
                    memo: '请上传EXCEL'
                }, {
                    checkerId: 'courseList',
                    required: 1,
                    type: 'text',
                    title: '科目所在列',
                    id: 'profit',
                    placeholder: '请输入A/B/C/D等英文字母，如有多列科目，请用逗号分隔，如：A,E',
                },
                {
                    checkerId: 'courseInfos',
                    required: 1,
                    type: 'upload-table',
                    title: '添加报表信息',
                }
            ] as CheckersOutputModel[],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
            if (v === null) {
                return;
            }
            this.items.push(v);
            this.toValue();
        });
    }

    /**
   *  删除
   * @param paramItem
   * @param index
   */
    public handleRemove(paramItem, index) {
        this.items.splice(index, 1);

    }

    /**
     *  获取值
     */
    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.toValue();
    }

    /**
  * 下在模板
  */
    public downloadTp02() {
        const a = document.createElement('a');
        a.href = '/assets/lr/doc/financer-mode/cash.xls';
        a.click();
    }
    /**
     *  存储值到当前 表单控制单元
     */
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.items));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
* 点击下载Excel文件
* @param paramData
*/
    public downFile(paramData: any) {
        this.xn.api
            .download('/attachment/download/upload_file_down', {
                key: JSON.parse(paramData).fileId
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, JSON.parse(paramData).fileName);
            });
    }
}
