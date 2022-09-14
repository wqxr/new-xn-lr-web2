import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';

/**
 *  添加/修改资产池名称
 */
@Component({
    templateUrl: './capital-pool-name-modal.component.html'
})
export class CapitalPoolNameModalComponent implements OnInit {
    // 传入的数据
    public params: any;
    public shows: any;
    public form: FormGroup;
    public modalType: string;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public formModule = 'dragon-input';
    public errorMsg: string;

    public constructor(private xn: XnService) {}

    open(params: any): Observable<string> {
        this.params = params;
        // 构造row
        this.shows = this.params.checkers;
        this.modalType = this.params.id ? '重命名' : '添加';
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
        const capitalPoolName = (this.form.value.capitalPoolName || '' ).trim();
        if (capitalPoolName.length > 0  && capitalPoolName.length <= 100) {
            this.close(this.form.value);
        } else {
            this.errorMsg = '请输入长度为 1 至 100 字符的资产池名称！';
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
