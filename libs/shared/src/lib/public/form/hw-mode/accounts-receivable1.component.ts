import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {SupplementFileModalComponent} from './modal/supplement-file.modal.component';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnInputOptions} from '../xn-input.options';
import {AccountInputModel} from './accounts-receivable.component';

/**
 *  应收账款证明展示- 不可编辑
 */
@Component({
    selector: 'app-xn-accounts-receivable1',
    templateUrl: `./accounts-receivable1.component.html`
})
export class AccountsReceivable1Component implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public items: AccountInputModel[] = [];
    public ctrl: AbstractControl;
    public alert = '';
    xnOptions: XnInputOptions;

    public constructor(private xn: XnService,
                       private er: ElementRef,
                       private vcr: ViewContainerRef) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        // 取值
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    // 查看,只可查看，不可编辑
    public onView(item: any, view: string) {
        const params = {
            title: '补录应收账款证明',
            checker: [
                {
                    title: '预计到期日',
                    checkerId: 'actualPayBackDate',
                    type: 'date',
                    required: true,
                    value: item.actualPayBackDate,
                    options: {readonly: true}
                }, {
                    title: '保理融资到期日',
                    checkerId: 'factoringDueDate',
                    type: 'date',
                    required: true,
                    memo: '预计到期日+1天，遇假期顺延',
                    value: item.factoringDueDate,
                    options: {readonly: true}
                }, {
                    title: '本批次金额',
                    checkerId: 'currentAmount',
                    type: 'money',
                    required: true,
                    value: item.currentAmount,
                    options: {readonly: true}
                }, {
                    title: '宽限日期',
                    checkerId: 'graceDate',
                    type: 'text',
                    required: true,
                    memo: '保理融资到期日+30天自然日',
                    value: item.graceDate,
                    options: {readonly: true}
                },
            ],
            data: item,
            operating: view
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SupplementFileModalComponent, params).subscribe();
    }
}
