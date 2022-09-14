/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：index.component.ts
 * @summary：规则引擎智能审单窗口
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          新增              2019-05-18
 * **********************************************************************
 */
import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';

@Component({
    selector: 'vanke-intelligence-standard-modal',
    templateUrl: './intelligence-standard-modal.component.html',
    styles: [`
        .edit-content {
            display: flex;
            flex-flow: column;
            height: 400px;
    overflow-y: scroll;
        }
        .edit-content-flex {
            flex: 1;
            text-align: center;
            overflow-y: scroll;
            background: #E6E6E6;
        }
        .table > tbody > tr > td{
            border:0px;
        }
        .button-group {
            float: right;
            padding: 0 15px;
        }
        .bold-text {
            font: bolder 15px sans-serif;
        }
        .text-dangerous {
            color: #f81414;
        }
    `]
})

export class IntelligenceStandardModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public shows: any[];
    public params: any;
    pageTitle = '审核标准';
    public constructor(public xn: XnService,
                       public vcr: ViewContainerRef) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.params;
        this.params.forEach(item => {
            if (item.referenceStandard !== null) {
                item.standardCss = item.resultVal === 1 ?
                    'text-primary' : 'text-dangerous';
            }
        });
        // this.shows = params.checkers || [];
        // this.buildFormGroup();
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    public handleCancel() {
        this.close({
            action: 'cancel'
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
