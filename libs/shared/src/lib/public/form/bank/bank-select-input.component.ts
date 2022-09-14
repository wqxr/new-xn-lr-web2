import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnInputOptions } from './../xn-input.options';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'xn-bank-select-input',
    templateUrl: './bank-select-input.component.html'
})
export class BankSelectInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    public selectValue = '';
    private originOptions = [];

    constructor(
        private er: ElementRef,
        private xn: XnService,
        private publicCommunicateService: PublicCommunicateService
    ) {}

    ngOnInit() {
        // if (!!this.row.value) {
        //     this.selectValue = this.row.value;
        // }
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(v => {
            this.ctrl.markAsTouched();
            this.calcAlertClass();
        });

        this.initOptions();
    }

    onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private initOptions() {
        this.xn.api.post('/llz/financing/promise_bank', {}).subscribe(res => {
            if (res.data && res.data.bankList) {
                this.originOptions = [].concat(res.data.bankList);
                this.row.selectOptions = this.originOptions.map(item => {
                    const label = `${item.cardCode}(${item.bankName})`;
                    return {
                        label,
                        value: JSON.stringify(Object.assign(item, { label }))
                    };
                });
            }
        });
    }
}
