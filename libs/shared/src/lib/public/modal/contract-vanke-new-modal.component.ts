/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：ContractVankeNewModalComponent
 * @summary：金地合同添加
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          适配不同尺寸屏幕       2019-04-18
 * **********************************************************************
 */

import { Component, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

@Component({
    templateUrl: './contract-vanke-new-modal.component.html',
    styles: [`
        .show-checker {
            max-height: calc(100vh - 260px);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .checkers {
            max-height: 100%;
        }
    `]
})
export class ContractVankeNewModalComponent {

    @ViewChild('modal') modal: ModalComponent;

    private observer: any;
    public mainForm: FormGroup;
    public rows: any[] = [];
    private ctrl: AbstractControl;
    public pageTitle = '合同补录';

    /**
     * 模态框回调
     * @param params 导入模态框参数
     */
    open(params?: any): Observable<any> {
        this.rows = params;
        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    public onSubmit() {
        const v = this.mainForm.getRawValue();
        if (v.img instanceof Array) {
            // 不做处理
        } else {
            v.img = JSON.parse(v.img);
        }
        v.img = _.sortBy(v.img, 'fileName');
        if (v.fileType === 'pdf') {
            this.close({
                files: v
            });
        } else {
            this.close({
                files: v
            });
        }
    }

    onCancel() {
        this.close(null);
    }
}
