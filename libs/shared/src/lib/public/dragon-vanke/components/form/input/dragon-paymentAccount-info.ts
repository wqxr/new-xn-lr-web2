import { Component, Input, OnInit, ElementRef, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { DragonChoseAccountinfoComponent } from '../../../modal/dragon-chose-accountinfo.modal';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';


@Component({
    templateUrl: './dragon-paymentAccount-info.html',
    styleUrls: ['../../show-dragon-input.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@DynamicForm({ type: 'account-info', formModule: 'dragon-input' })
export class DragonPaymentAccountComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public items = {
        accountName: '',
        cardCode: '',
        bankName: '',
        bankId: '',
    };
    public Tabconfig: any;
    item: any;
    public ctrl: AbstractControl;
    public alert = ''; // 提示
    xnOptions: XnInputOptions;
    myClass = '';

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(v => {
            this.calcAlertClass();

        });
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }
    private fromValue() {
        const data = XnUtils.parseObject(this.ctrl.value, {});
        if (!XnUtils.isEmptyObject(data)) {
            this.items = data;
        }
        this.toValue();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    onBlur() {
        this.toValue();
    }
    public inputChange(e?, key?) {
        this.items[key] = e.target.value;

    }
    // 上传完后取回值
    private toValue() {
        if (this.items.accountName === '' || this.items.cardCode === '' || this.items.bankName === '') {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.items));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    // 选择收款账户
    handleAdd() {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonChoseAccountinfoComponent, {})
            .subscribe(v => {
                if (v === null) {
                    return;
                } else {
                    this.items.accountName = v[0].accountName;
                    this.items.cardCode = v[0].cardCode;
                    this.items.bankName = v[0].bankName;
                    this.items.bankId = v[0].bankCode;
                    this.toValue();
                    this.cdr.markForCheck();


                }
            });
    }
}
