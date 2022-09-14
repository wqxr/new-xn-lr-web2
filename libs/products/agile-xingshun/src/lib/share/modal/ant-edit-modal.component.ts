/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：EditModalComponent
 * @summary：编辑模态框  配置参数  EditParamInputModel
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying        雅居乐-星顺数据对接       2020-12-15
 * **********************************************************************
 */

import { AfterContentChecked, ChangeDetectorRef, Component } from '@angular/core';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { Observable } from 'rxjs';
import { ButtonConfigs, ButtonGroup } from '../../logic/table-button.interface';

/**
 *  参数默认
 */
export class EditParamInputModel {
    /** 标题 */
    public title: string;
    /** modal位置类名 */
    public nzWrapClassName?: string;
    /** 图标类型 */
    public tipIconType: string;
    /** 点击蒙层是否允许关闭 */
    public maskClosable?: boolean;
    /** 是否显示图标 */
    public showTipIcon?: boolean;
    /** 图标Icon类型 */
    public tipIconNzType: string;
    /** 图标提示类型 */
    public layout: 'horizontal' | 'vertical' | 'inline';
    /** 弹框宽度配置 */
    public width: any;
    /** 输入项 */
    public formModalFields: FormlyFieldConfig[];
    /** 按钮 */
    public buttons?: ButtonConfigs;
    /** 其他配置 */
    public options?: any;
    constructor() {
        this.title = '标题';
        this.maskClosable = false;
        this.showTipIcon = false;
        this.nzWrapClassName = 'vertical-center-modal',
            this.buttons = {
                left: [],
                right: [
                    { label: '取消', type: 'normal', btnKey: 'cancel' },
                    { label: '确定', type: 'normal', btnKey: 'ok' },
                ]
            };
        this.width = 300;
        this.formModalFields = [];
    }
}
@Component({
    template: `
    <xn-form-modal
    #formModal
    [title]="params.title"
    [width]="params.width"
    [nzWrapClassName]="params.nzWrapClassName"
    [isVisible]="isVisible"
    [maskClosable]="params.maskClosable"
    [showTipIcon]="params.showTipIcon"
    [tipIconType]="params.tipIconType"
    [tipIconNzType]="params.tipIconNzType"
    [layout]="params.layout"
    [fields]="params.formModalFields"
    [modalFooter]="modalFooter"
    (cancel)="handleCancel()"
    >
    <ng-template #modalFooter let-model let-form="form">
        <div nz-row class="table-head-btn">
            <ng-container *ngFor="let key of tableHeadBtnConfig">
                <div nz-col nzSm="12" nzMd="12" nzSpan="12" [ngClass]="{'text-right': key === 'right'}">
                    <ng-container *ngFor="let btn of params.buttons[key]">
                        <nz-space nzDirection="horizontal">
                            <nz-space-item>
                                <ng-container [ngSwitch]="btn.type">
                                    <ng-container *ngSwitchCase="'dropdown'">
                                        <button nz-button nzType="primary" nz-dropdown [nzDropdownMenu]="menu">
                                            {{btn.label}}<i nz-icon nzType="down"></i>
                                        </button>
                                        <nz-dropdown-menu #menu="nzDropdownMenu">
                                            <ul nz-menu *ngIf="btn.children && btn.children.length">
                                                <ng-container *ngFor="let childBtn of btn.children">
                                                    <li nz-menu-item style="text-align: left;">
                                                        <a href="javaScript:void(0)" (click)='handleBtnClick(childBtn, model)'>
                                                            {{childBtn.label}}
                                                        </a>
                                                    </li>
                                                </ng-container>
                                            </ul>
                                        </nz-dropdown-menu>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'normal'">
                                        <ng-container *ngIf="btn.btnKey === '';else normalBtnTpl">
                                        </ng-container>
                                        <ng-template #normalBtnTpl>
                                            <button nz-button nzType="primary" type="button" [disabled]="btn.btnKey === 'ok' && !form?.valid"
                                                (click)="handleBtnClick(btn, model)">
                                                <i *ngIf="!!btn.icon" nz-icon [nzType]="btn.icon" nzTheme="outline"></i>{{btn.label}}
                                            </button>
                                        </ng-template>
                                    </ng-container>
                                </ng-container>
                            </nz-space-item>
                        </nz-space>
                    </ng-container>
                </div>
            </ng-container>
        </div>
    </ng-template>
    </xn-form-modal>
    `,
    styles: [`
    .table-head-btn {
        margin-bottom: 5px;
        width: 100%;
    }
    ::ng-deep .hcy-date-class .ant-picker {
        width:100%;!important
    }
    `]
})
export class YjlAntEditModalComponent implements AfterContentChecked {

    public params: EditParamInputModel = new EditParamInputModel();
    private observer: any;
    public isVisible = true;
    constructor(public cdr: ChangeDetectorRef) { }
    get tableHeadBtnConfig() {
        return Object.keys(this.params.buttons) || [];
    }

    open(params: EditParamInputModel): Observable<any> {
        this.params = Object.assign({}, this.params, params);
        return new Observable(observer => {
            this.observer = observer;
        });
    }

    /**
     *  提交
     */
    public handleSubmit(e: { [key: string]: any }) {
        this.close({
            action: 'ok',
            params: { ...e }
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

    /**
     * 自定义按钮事件
     */
    handleBtnClick(btn: ButtonGroup, model: { [key: string]: any }) {
        if (btn.btnKey === 'ok') {
            this.handleSubmit({ ...model });
        } else if (btn.btnKey === 'cancel') {
            this.handleCancel();
        }
        this.isVisible = false;
    }

    private close(value) {
        this.isVisible = false;
        this.observer.next(value);
        this.observer.complete();
    }

    ngAfterContentChecked(): void {
        this.cdr.detectChanges()
    }
}
