/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-edit-modal.component
 * @summary：修改提醒配置弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 congying          修改配置          2020-06-16
 * **********************************************************************
 */

import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';

@Component({
    selector: 'edit-notice-config-model',
    templateUrl: './edit-notice-config.model.html',
    styles: [`

    `],
})
export class EditNoticeConfigModalComponent {

    public params: any;  // 传入的数据
    public shows: any;
    public form: FormGroup;
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public formModule = 'dragon-input';
    public paramConfig: any[]; // 参数项配置
    public paramDesc: string; // 参数项描述

    public constructor(
        private xn: XnService,
        private cdr: ChangeDetectorRef) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.paramConfig = this.params.noticeInfo.paramConfig || [];
        this.paramDesc = this.params.noticeInfo.paramDesc || '';
        // 构造row
        this.shows = this.params.checkers;
        // XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);

        // 点击停用需要弹窗提示
        this.form.get('isOpen').valueChanges.subscribe(x => {
            if (x === '0') {
                this.xn.msgBox.open(true, '是否要停用该提醒?',
                    () => { // yes-callback
                    },
                    () => { // cancel-callback
                        this.form.get('isOpen').setValue('1');
                    });
            }
        });
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    /**
     *  取消
     */
    oncancel() {
        this.close({ action: 'cancel' })
    }

    /**
     *  确定
     */
    onOk() {
        this.close({ action: 'cancel' })
    }

    /**
     *  提交
     */
    onsubmit() {
        const params = this.buildParams();
        this.xn.loading.open();
        this.xn.dragon.post('/remind/alter_remind', params).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
                this.close({ action: 'ok' })
            }
        }, () => {
            this.xn.loading.close();
        });

    }

    /**
     *  构建参数
     */
    public buildParams(): any {
        const isSystemRemind = this.form.value.noticeType.includes('1') ? 1 : 0; // 系统提醒是否开启 0=关闭 1=开启
        const isEmailRemind = this.form.value.noticeType.includes('2') ? 1 : 0;  // 邮件提醒是否开启 0=关闭 1=开启
        const userList = this.form.value.userList ? JSON.parse(this.form.value.userList) : []
        let params: any = {
            project_manage_id: Number(this.params.noticeInfo.project_manage_id),
            remindId: this.params.noticeInfo.remindId,
            isOpen: Number(this.form.value.isOpen),
            isSystemRemind: isSystemRemind,
            isEmailRemind: isEmailRemind,
            userList: userList,
            paramConfig: this.form.value.paramConfig
        };
        return params;
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }


}
