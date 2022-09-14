/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：EditModalComponent
 * @summary：新增文件模态框  配置参数  EditParamInputModel
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-05-21
 * **********************************************************************
 */

import { Component, ViewChild, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CheckersOutputModel } from '../../../config/checkers';
import { ModalSize, ModalComponent } from '../../../common/modal/components/modal';
import { XnFormUtils } from '../../../common/xn-form-utils';
import {MultiFileProcessInputComponent} from '../components/form/input/mfile-process-input.component';
import { XnService } from '../../../services/xn.service';
import { XnUtils } from '../../../common/xn-utils';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { SingleSearchListModalComponent } from './single-searchList-modal.component';
import { LoadingPercentService } from '../../../services/loading-percent.service';

/**
 *  参数默认
 */
export class EditParamInputModel {
    /** 标题 */
    public title?: string;
    /** 输入项 */
    public checker: CheckersOutputModel[];
    /** 其他配置 */
    public options?: any;
    /** 按钮*/
    public buttons?: string[];
    /** 弹框大小配置 */
    public size?: any;
    public type?: number;
    public mainFlowId?: string;
    constructor() {
        this.options = { tips: '', capitalPoolId: '' };
        this.buttons = ['取消', '确定'];
        this.size = ModalSize.Large;
    }
}
@Component({
    template: `
    <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
        <form class="form-horizontal" (ngSubmit)="handleSubmit()" [formGroup]="mainForm" *ngIf="!!mainForm">
            <modal-header [showClose]="false">
                <h4 class="modal-title">{{ params.title }}</h4>
            </modal-header>
            <modal-body>
                <div class="clearfix" style="max-height: calc( 100vh - 280px);overflow-y: auto;overflow-x:hidden;">
                    <div class="form-group" *ngFor="let row of params.checker">
                        <div class="col-sm-2 xn-control-label"
                            [class.required-star]="row.required !== false && row.required !== 0">
                            {{ row.title }}
                        </div>
                        <div class="col-sm-8">
                            <app-dynamic-input [row]="row" [form]="mainForm" [svrConfig]="svrConfig"
                             formModule="dragon-input"></app-dynamic-input>
                        </div>
                        <div class="col-sm-2 xn-control-desc">
                            {{ row.memo }}
                        </div>
                    </div>
                </div>
            </modal-body>
            <modal-footer>
                <span *ngIf="params?.options?.tips" class="label-tips">{{params?.options?.tips}}</span>
                <button type="button" class="btn btn-default" (click)="handleCancel()">
                    {{ params.buttons[0] }}
                </button>
                <button type="submit" *ngIf="params.buttons[1] && params.buttons[1] !== ''" class="btn btn-success"
                    [disabled]="!mainForm.valid">{{ params.buttons[1] }}
                </button>
            </modal-footer>
        </form>
    </modal>
    `
})
export class DragonOcrEditModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild(MultiFileProcessInputComponent)
    childComponent: MultiFileProcessInputComponent;
    public params: EditParamInputModel = new EditParamInputModel();
    private observer: any;
    public mainForm: FormGroup;

    public files: any[];
    public ocrInterval: any;

    public constructor(private xn: XnService, private loading: LoadingPercentService, private vcr: ViewContainerRef,
                       private cdr: ChangeDetectorRef) {
    }
    open(params: EditParamInputModel): Observable<any> {
        this.params = Object.assign({}, this.params, params);
        XnFormUtils.buildSelectOptions(this.params.checker);
        this.buildChecker(this.params.checker);
        this.mainForm = XnFormUtils.buildFormGroup(this.params.checker);
        this.modal.open(this.params.size);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  提交
     */
    public async handleSubmit() {
        this.files =  this.mainForm.value && this.mainForm.value.returnFile ? JSON.parse(this.mainForm.value.returnFile) : [];
        this.loading.open(0, 0);
        this.setValueByOcrRes();
    }

    /**
     * orc识别
     * @param file
     */
    public setValueByOcrRes() {
        if (!this.files.length){
            return ;
        }
        // 调用ocr接口
        const postObjs = {
            fileId: this.files[0].fileId,	// 文件id
            fileName: this.files[0].fileName,  // 文件名字
            filePath: this.files[0].filePath,	// 文件路径
        };
        this.getOcrQrcode(0, 0, postObjs);
    }

    /**
     * 获取ocr解析详情
    * @param files
     * @param index
     */
    getOcrQrcode(total: number, index: number, postObjs: any){
        if (total !== 0){
            if (total === index) {
                // 关闭
                this.loading.close();
                // this.xn.msgBox.open(false,'回传文件成功！');
                return;
            }
            // 打开loading,传入上传的总数，和当前上传的图
            this.loading.open(total, index);
        }
        this.xn.api.avenger.post2('/sub_system/ocr/get_ocr_qrcode', postObjs).subscribe(res => {
            if (res.ret === 0){
                // 1=执行中 2=失败 3=完成
                if (res.data.status === 3){
                    setTimeout(() => {
                        // 关闭
                        this.loading.close();
                        // this.xn.msgBox.open(false,'回传文件成功！');
                        this.openReturnDetail(res.data.ocrList);
                    }, 500);
                } else if (res.data.status === 1 || res.data.status === 2){
                    // 执行中
                    setTimeout(() => {
                        this.getOcrQrcode(res.data.count, res.data.nowCount, postObjs);
                    }, 2000);
                }
            }else{
                this.loading.close();
                this.handleCancel();
                this.xn.msgBox.open(false, `${res.msg}`);
            }
        });
    }

    /**
     *  取消
     */
    public handleCancel() {
        this.close({
            action: 'cancel'
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    // ngOnChanges() {
    //     console.info('dskfsaksf--onchange');
    //     XnFormUtils.buildSelectOptions(this.params.checker);
    //     this.buildChecker(this.params.checker);
    //     this.mainForm = XnFormUtils.buildFormGroup(this.params.checker);

    // }
    // change() {
    //     console.info('dskfsaksf--onchange');
    //     XnFormUtils.buildSelectOptions(this.params.checker);
    //     this.buildChecker(this.params.checker);
    //     this.mainForm = XnFormUtils.buildFormGroup(this.params.checker);
    // }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    // 查看回传文件匹配详情
    openReturnDetail(item) {
        // 打开弹框
        const params = {
            get_url: '',
            get_type: '',
            multiple: false,
            title: '回传文件成功',
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
                { label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName' },
                { label: '合同名', value: 'contractName', type: 'text' },
                { label: '文件', value: 'files', type: 'file' }
            ],
            searches: [],
            key: '',
            data: item,
            total: item.length,
            inputParam: {},
            other: {
                capitalPoolId: this.params.options.capitalPoolId
            },
            rightButtons: [{label: '确定', value: 'submit'}]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe((x) => {
            this.close({
                action: 'ok'
            });
        });
    }
}
