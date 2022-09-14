
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：银行账号选择
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-08-28
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';
import { HwModeService } from '../../../services/hw-mode.service';
import { OperateType } from '../../../config/enum/common-enum';

@Component({
    templateUrl: `./cancel-modal.component.html`,
    selector: 'cancel-modal',
    styles: [`
    .modal-title{
        height:50px;
    }
    `]
})
export class CancelRejectComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    public params: any;
    private observer: any;
    public demos = '';
    public cancelChecker: any = { name: 'cancelChecker', type: 'textarea', required: false };
    constructor(private xn: XnService,
        public hwModeService: HwModeService, private er: ElementRef,) {
    }

    ngOnInit(): void {

    }






    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.svrConfigs;
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    oncancel() {
        this.modal.close();
    }
    onOk(paramString: number) {
        const actions = paramString === OperateType.REJECT ? OperateType.REJECT : OperateType.SUSPENSION
        this.modal.close();
        this.observer.next({ action: actions, demo: this.demos });
        this.observer.complete();
    }
}
