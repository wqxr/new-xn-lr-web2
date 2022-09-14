/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：公用信息添加，补充，编辑
 * @summary：合同文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          修改         2019-03-29
 * **********************************************************************
 */

import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ModalComponent } from '../../common/modal/components/modal';
import { XnFormUtils } from '../../common/xn-form-utils';
/**
 *  参数默认
 */
export class ParamInputModel {
    /** 标题 */
    public title?: string;
    /** 输入项 */
    public checker: any[];
    /** 其他配置 */
    public options?: any;
    /** 按钮*/
    public buttons?: string[];
    /** 弹框大小配置 */
    public size?: any;

    constructor() {
        this.buttons = ['取消', '确定'];
        this.options = { tips: '' };
    }
}
@Component({
    template: `
        <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
            <form class="form-horizontal" (ngSubmit)="handleSubmit()" [formGroup]="mainForm" *ngIf="!!mainForm">
                <modal-header [showClose]="false">
                    <h4 class="modal-title">{{pageTitle}}</h4>
                </modal-header>
                <modal-body>
                    <div class="form-group" *ngFor="let row of rows">
                        <div class="col-sm-3 xn-control-label"
                             [class.required-star]="row.required !== false && row.required !== 0">
                            {{row.title}}
                        </div>
                        <div class="col-sm-6">
                            <xn-input [row]="row" [form]="mainForm"></xn-input>
                        </div>
                        <div class="col-sm-3 xn-control-desc">
                            {{row.memo}}
                        </div>
                    </div>
                </modal-body>
                <modal-footer>
                    <span *ngIf="params?.options?.tips" class="label-tips">{{params?.options?.tips}}</span>
                    <button type="button" class="btn btn-default" (click)="handleCancel()"> {{params.buttons[0] }}</button>
                    <button type="submit" class="btn btn-success" [disabled]="!mainForm.valid">{{params.buttons[1]}}</button>
                </modal-footer>
            </form>
        </modal>
    `
})
export class EditInfoModalComponent {

    @ViewChild('modal') modal: ModalComponent;
    // 文件名
    public pageTitle = '';
    public rows: any[] = [];
    public params: ParamInputModel = new ParamInputModel();
    private observer: any;
    public mainForm: FormGroup;

    open(params: ParamInputModel): Observable<any> {
        this.params = Object.assign({}, this.params, params);
        this.rows = this.params.checker;
        this.pageTitle = this.params.title;
        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
        this.modal.open(this.params.size);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  提交
     */
    public handleSubmit() {
        this.close(this.mainForm.value);
    }

    /**
     *  取消
     */
    public handleCancel() {
        this.close(null);
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
}
