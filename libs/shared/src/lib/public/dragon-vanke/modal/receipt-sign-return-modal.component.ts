import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';

/**
 *  项目公司回执退回
 */
@Component({
    templateUrl: './receipt-sign-return-modal.component.html',
    styles: [`
        .xn-input-textarea {
            resize: none;
        }

        .other-reason {
            padding-top: 4px;
        }
    `]
})
export class ReceiptSignReturnModalComponent implements OnInit {
    public params: any;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;

    public alert = '';

    public reason = '';

    public reasons = [
        {
            value: '《项目公司回执（一次转让）》有误',
            label: '《项目公司回执（一次转让）》有误',
            checked: false,
            params: 1,
        },
        {
            value: '《项目公司回执（二次转让）》有误',
            label: '《项目公司回执（二次转让）》有误',
            checked: false,
            params: 3,
        },
        {
            value: '',
            label: '其他',
            checked: false,
            params: 4,
        },
    ];


    get isFormInvalid() {
        const otherReason = this.reasons.find(x => this.isOtherReason(x));
        const otherReasonInvalid = otherReason.checked && !otherReason.value;

        const contractInvalid = this.reasons
            .filter((x: any) => x.label !== otherReason.value)
            .every(x => !x.checked);

        return contractInvalid || otherReasonInvalid;
    }

    public constructor() {
    }

    open(params: any): Observable<string> {
        this.params = params.hasSign;
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {
    }

    public onSubmit() {
        const otherReason = this.reasons[2];
        if (otherReason.checked && !otherReason.value) {
            this.alert = '请输入其他退回原因';
            return;
        }

        this.reason = this.reasons
            .filter((x: any) => x.checked)
            .map(x => `${this.isOtherReason(x) ? '其他:' : ''}${x.value}`)
            .join(',');

        this.close(this.reason);
    }

    public onCancel() {
        this.close('');
    }

    public reasonChange(reason) {
        reason.checked = !reason.checked;

        if (this.isOtherReason(reason) && !reason.checked) {
            reason.value = '';
        }
    }

    private isOtherReason(reason) {
        return reason.label === '其他';
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
