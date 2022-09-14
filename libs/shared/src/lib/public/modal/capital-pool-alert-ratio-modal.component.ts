import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnService } from '../../services/xn.service';

/**
 *  添加/修改资产池警戒比例
 */
@Component({
    templateUrl: './capital-pool-alert-ratio-modal.component.html'
})
export class CapitalPoolAlertRatioModalComponent implements OnInit {
    // 传入的数据
    public params: any;
    public shows: any;
    public form: FormGroup;
    public modalType: string;
    public errorMsg: string;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;

    public constructor(private xn: XnService) {}

    open(params: any): Observable<string> {
        this.params = params;
        // 构造row
        this.shows = this.params.checkers;
        this.modalType = this.params.id ? '修改' : '添加';
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {}

    public onSubmit() {
        const pattern = /^\d+$/;
        if (pattern.test(this.form.value.supplierRatio) && pattern.test(this.form.value.enterpriseRatio)) {
            this.close(this.form.value);
        } else {
            this.errorMsg = '请输入整数！';
            this.form.setErrors({ error: this.errorMsg });
        }
    }

    public onCancel() {
        this.close('');
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
