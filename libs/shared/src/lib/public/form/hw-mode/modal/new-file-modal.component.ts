/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：NewFileModalComponent
 * @summary：弹框补充，编辑，查看
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-03-22
 * **********************************************************************
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    template: `
        <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
            <form class="form-horizontal" (ngSubmit)="onSubmit()" [formGroup]="mainForm" *ngIf="!!mainForm">
                <modal-header [showClose]="false">
                    <h4 class="modal-title">{{pageTitle}}</h4>
                </modal-header>
                <modal-body>
                    <div class="checker clearfix">
                        <div class="show-checkers">
                            <div class="form-group checker" *ngFor="let row of rows">
                                <div class="col-sm-3 xn-control-label">
                                    {{row.title}} <span *ngIf="row.required !== false && row.required !== 0" class="required-label">*</span>
                                </div>
                                <div class="col-sm-6">
                                    <xn-input [row]="row" [form]="mainForm"></xn-input>
                                </div>
                                <div class="col-sm-3 xn-control-desc">
                                    {{row.memo}}
                                </div>
                            </div>
                        </div>
                    </div>
                </modal-body>
                <modal-footer>
                    <button type="button" class="btn btn-default" (click)="onCancel()">取消</button>
                    <button type="submit" class="btn btn-success" [disabled]="!mainForm.valid">提交</button>
                </modal-footer>
            </form>
        </modal>
    `,
    styles: [
            `
            .checker {
                max-height: calc(100vh - 280px);
                overflow-x: hidden;
                overflow-y: auto;
            }

            .show-checkers {
                max-height: 100px;
            }

        `
    ]
})
export class NewFileModalComponent {

    @ViewChild('modal') modal: ModalComponent;
    // 文件名
    public pageTitle = '';
    public rows: any[] = [];
    private observer: any;
    public mainForm: FormGroup;

    open(params: any): Observable<any> {
        this.rows = params.checker;
        this.pageTitle = params.title;
        this.buildForm();
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }


    public onSubmit() {
        const v = this.mainForm.value;
        if (v.fileType === 'pdf') {
            this.close({
                files: [JSON.parse(v.pdf)]
            });
        } else {
            this.close({
                files: JSON.parse(v.proveImg)
            });
        }
    }

    public onCancel() {
        this.close(null);
    }

    private buildForm() {
        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
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
