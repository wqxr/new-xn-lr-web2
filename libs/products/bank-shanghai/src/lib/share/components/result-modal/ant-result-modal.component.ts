/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AntResultModalComponent
 * @summary：新增文件模态框  配置参数  EditParamInputModel
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao          增加功能1         2019-05-21
 * **********************************************************************
 */

import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ButtonConfigs, ButtonGroup } from '../../../logic/table-button.interface';
import { ResultParamInputModel } from './ant-result-interface';
@Component({
    template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      [nzWrapClassName]="params.nzWrapClassName"
      [nzTitle]="params.nzTitle"
      [nzStyle]="params.nzStyle"
      [nzWidth]="params.nzWidth"
      [nzContent]="modalContent"
      [nzMaskClosable]="params.nzMaskClosable"
      [nzClosable]="params.nzClosable"
      [nzFooter]="!!params.nzFooter ? modalFooter : null"
      [nzBodyStyle]="{'padding': '24px'}"
      (nzOnCancel)="handleCancel()"
    >
    <ng-template #modalContent>
        <ng-container *ngIf="!!params?.message">
            <div class="ant-modal-confirm-body-wrapper">
                <div class="ant-modal-confirm-body">
                    <i nz-icon [nzType]="params.message.nzType" nzTheme="fill" [ngStyle]="{'color': params.message.nzColor}"></i>
                    <span class="ant-modal-confirm-title">
                        <span class="ng-star-inserted">{{params.message.nzTitle}}</span>
                    </span>
                    <div class="ant-modal-confirm-content">
                        <div class="ng-star-inserted">{{params.message.nzContent}}</div>
                    </div>
                </div>
                <div class="ant-modal-confirm-btns text-right" *ngIf="params.message.buttons">
                    <button nz-button [nzType]="params.message.buttons.btnType" type="button" (click)="handleBtnClick(params.message.buttons)">
                        <span class="ng-star-inserted">{{params.message.buttons.label}}</span>
                    </button>
                </div>
            </div>
        </ng-container>
        <ng-container *ngIf="!!params?.result">
            <nz-result class="no-padding"
            [nzStatus]="params.result.nzStatus"
            [nzTitle]="params.result.nzTitle"
            [nzSubTitle]="params.result.nzSubTitle"
            >
            <div nz-result-extra *ngIf="params.result.buttons && params.result.buttons.length">
                <ng-container *ngFor="let btn of params.result.buttons">
                    <button nz-button [nzType]="btn.btnType" type="button"
                        (click)="handleBtnClick(btn)">
                        <i *ngIf="!!btn.icon" nz-icon [nzType]="btn.icon" nzTheme="outline"></i>{{btn.label}}
                    </button>
                </ng-container>
            </div>
            </nz-result>
        </ng-container>
        <ng-container *ngIf="!!params?.localFilesView">
            <div nz-row style="margin-right: 15px;">
                <div nz-col nzSm="24" nzMd="24" nzSpan="24" [ngStyle]="{'min-height': params.localFilesView.height || '500px'}">
                    <iframe
                    [src]="trustUrl(params.localFilesView.src)"
                    frameborder="0"
                    width="100%"
                    height="100%"
                    ></iframe>
                </div>
            </div>
        </ng-container>
        <!-- <ng-container *ngIf="!!params?.components">
            <div nz-row style="margin-right: 15px;">
                <div nz-col nzSm="24" nzMd="24" nzSpan="24" [ngStyle]="{'max-height': params.components?.height || '550px', 'overflow': 'auto'}">
                    <ng-container [ngSwitch]="params.components.componentRef">
                        <ng-container *ngSwitchCase="'lib-business-state-list'">
                            <lib-business-state-list [inputParams]="params.components.inputParams"></lib-business-state-list>
                        </ng-container>
                        <ng-container *ngSwitchDefault>
                        </ng-container>
                    </ng-container>
                </div>
            </div>
        </ng-container> -->
    </ng-template>
    <ng-template #modalFooter>
        <div nz-row>
            <ng-container *ngFor="let key of tableHeadBtnConfig">
                <div nz-col nzSm="12" nzMd="12" nzSpan="12" [ngClass]="{
                    'text-left': key === 'left', 'text-right': key === 'right'
                    }">
                    <ng-container *ngFor="let btn of params.buttons[key]">
                        <nz-space nzDirection="horizontal">
                            <nz-space-item>
                                <ng-container #normalBtnTpl>
                                    <button nz-button nzType="primary" type="button"
                                        (click)="handleBtnClick(btn)">
                                        <i *ngIf="!!btn.icon" nz-icon [nzType]="btn.icon" nzTheme="outline"></i>{{btn.label}}
                                    </button>
                                </ng-container>
                            </nz-space-item>
                        </nz-space>
                    </ng-container>
                </div>
            </ng-container>
        </div>
    </ng-template>
    </nz-modal>
    `,
    styles: [`
    ::ng-deep .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ::ng-deep .vertical-center-modal .ant-modal {
        top: 0;
    }
    ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
    }
    `]
})
export class AntResultModalComponent {
    public params: ResultParamInputModel = {} as ResultParamInputModel;
    private observer: any;
    public isVisible = true;
    get tableHeadBtnConfig() {
        return Object.keys(this.params.buttons) || [];
    }

    constructor(private sanitizer: DomSanitizer) {
        this.params.nzTitle = '';
        this.params.nzFooter = false;
        this.params.nzMaskClosable = true;
        this.params.nzClosable = true;
        this.params.nzStyle = {};
        this.params.nzWrapClassName = 'vertical-center-modal';
        this.params.buttons = { left: [], right: [] };
        this.params.nzWidth = 400;
    }

    open(params: ResultParamInputModel): Observable<any> {
        this.params = Object.assign({}, this.params, params);
        if (params.delayTime){
            setTimeout(() => {
                this.handleCancel();
            }, params.delayTime);
        }
        return new Observable(observer => {
            this.observer = observer;
        });
    }

    /**
     * 自定义按钮事件
     */
    handleBtnClick(btn: ButtonGroup) {
        if (btn.btnKey === 'ok') {
            this.handleSubmit({});
        } else if (btn.btnKey === 'cancel') {
            this.handleCancel();
        }
        this.isVisible = false;
    }

    /**
     *  提交
     */
    public handleSubmit(e: {[key: string]: any}) {
        this.close({
            action: 'ok',
            params: {...e}
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

    private close(value) {
        this.isVisible = false;
        this.observer.next(value);
        this.observer.complete();
    }

    trustUrl(url: string) {
        if (!!url){
            return this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
    }
}
