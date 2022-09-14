
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：修改规则提醒弹窗 type:
 * @type: 弹窗类型  delete-unuse-rule:删除未使用规则 delete:删除使用中规则 edit:修改使用中规则 view: 查看使用中规则 delete-module: 删除模型
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   hcy               添加            2020-04-27
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';
declare const moment: any;

@Component({
    templateUrl: `./sampling-edit-rule.component.html`,
    selector: 'sampling-edit-rules',
    styles: [`
    .modal-title{
        height:50px;
    }
        .title {
            font-weight:bold;
        }

    `]
})
export class SamplingEditRuleComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    // 数据
    private observer: any;
    public moduleList: any[] = []; // 规则下模型列表
    public params: any;

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, private cdr: ChangeDetectorRef, ) {
    }

    ngOnInit(): void {}

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params;
        // 弹窗尺寸
        if (this.params.type === 'delete-unuse-rule' || this.params.type === 'delete-module') {
            this.modal.open(ModalSize.Small);
        } else {
            this.modal.open(ModalSize.XLarge);
        }
        this.getRuleLIst();
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  getRuleLIst 获取使用该规则下的模型列表
     */
    getRuleLIst() {
        if (this.params.type === 'delete-unuse-rule' || this.params.type === 'delete-module') {
            return;
        }
        this.xn.loading.open();
        const params = { ruleId: this.params.ruleId };
        // 修改规则
        this.xn.dragon.post('/rule/rule_model_list', params).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
                this.moduleList = x.data.data;
            }
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  取消
     */
    oncancel() {
        this.close({ action: false, data: {} });
    }

    /**
     *  继续修改
     */
    onOk() {
        this.close({ action: true, data: {} });
    }

    /**
     *  删除规则
     */
    onDelete() {
        this.xn.loading.open();
        const params = { ruleId: this.params.ruleId };
        this.xn.dragon.post('/rule/delete_rule', params).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
                this.close({ action: true, data: {} });
            }
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  删除模型
     */
    deleteModel() {
        this.xn.loading.open();
        const params = { modelId: this.params.modelId };
        this.xn.dragon.post('/rule/delete_model', params).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
                this.close({ action: true, data: {} });
            }
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  close
     *  @param value
     */
    close(value: { action: boolean, data: any }) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
