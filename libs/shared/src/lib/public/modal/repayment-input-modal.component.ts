
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：repayment-input-modal.component.ts
 * @summary：基础模式-确认收款登记
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-04-08
 * **********************************************************************
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

@Component({
    templateUrl: './repayment-input-modal.component.html',
    styles: []
})
export class RepaymentInputModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;

    private observer: any;
    rows: any[] = [];
    mainForm: FormGroup;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(): Observable<any> {
        this.rows = [
            {
                title: '商票号码', checkerId: 'honourNum',
            },
            {
                title: '收款日期', checkerId: 'repaymentDate', type: 'date'
            }
        ];

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

    private close(value: any) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onCancel() {
        this.close({
            action: 'navigate-back'
        });
    }

    onSubmit() {
        this.xn.api.post('/honour?method=get', this.mainForm.value).subscribe(json => {
            this.close({
                action: 'const-params',
                data: json.data
            });
        });
    }
}
