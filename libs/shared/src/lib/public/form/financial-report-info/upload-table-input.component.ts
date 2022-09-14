/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：upload-table-input-component.ts
 * @summary：利润，现金表上传 [报表日期，数列值可添加删除列] type: upload-table
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan             增加           2019-05-21
 * 1.0                 zhyuanan           checkers  字段为测试自定义2019-05-25
 * **********************************************************************
 */

import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnInputOptions } from '../xn-input.options';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { ManagerInformationInputComponent } from '../vanke/manager-information-input.component';

@Component({
    selector: 'xn-upload-table-input-component',
    templateUrl: './upload-table-input.component.html',
    styles: [`
        .form {
            transition: all 0.5s ease-in-out;
        }
    `]
})

export class UploadTableInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    public alert = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    // 内部表单组
    public mainFormList: FormGroup[] = [];
    public formlist: any[] = [];

    // 默认项
    public defaultCheckers = [
        {
            checkerId: 'dateRange',
            required: 1,
            type: 'quantum1',
            title: '日期范围',
            options: { position: 'up' },

        }, {
            checkerId: 'numValue',
            required: 1,
            type: 'text',
            title: '数值所在列',
            id: 'upload-table',
            placeholder: ' 请输入A/B/C/D等英文字母，如有多列科目，请用逗号分隔，如：A,E',
        }
    ] as CheckersOutputModel[];

    constructor() {
    }

    ngOnInit() {

        this.ctrl = this.form.get(this.row.name);
        // 构建一个默认表单组
        this.buildChecker(this.defaultCheckers);
        const mainForm = XnFormUtils.buildFormGroup(this.defaultCheckers);
        const mainFormtype = [mainForm.value.dateRange.beginTime, mainForm.value.dateRange.endTime, mainForm.value.dateRange.numValue];
        // 添加一个formGroup
        this.mainFormList.push(mainForm);
    }

    /**
     * 新增报表列
     */
    public handleAdd() {
        const mainForm = XnFormUtils.buildFormGroup(this.defaultCheckers);
        this.mainFormList.push(mainForm);
    }

    /**
     * 删除报表列
     * @param removeIndex 删除的该列下标
     */
    public handleRemove(removeIndex: number) {
        this.mainFormList.splice(removeIndex, 1);
    }

    /**
     *  保存表单
     */
    public handleSaveTable() {
        this.toValue();
    }

    /**
     *  每一个表单都验证通过
     */
    public checkerForm(): boolean {
        return this.mainFormList.some((mainForm: FormGroup) => mainForm.invalid);
    }

    /**
     * checkers 构建输出模板
     * @param paramLists
     */
    private buildChecker(paramLists: CheckersOutputModel[]) {
        XnFormUtils.buildSelectOptions(paramLists);
        for (const list of paramLists) {
            XnFormUtils.convertChecker(list);
        }
    }

    /**
     *  存储值到当前 表单控制单元
     */
    private toValue() {
        this.mainFormList.map(mainform => {
            const b = Object.values(JSON.parse(mainform.value.dateRange));
            b.push(mainform.value.numValue);
            this.formlist.push(b);
        });
        this.ctrl.setValue(this.formlist);
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
