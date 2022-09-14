import { Component, OnInit, Input, ElementRef, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { AmountControlCommService } from 'libs/console/src/lib/risk-control/transaction-control/amount/amount-control-comm.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DateCommunicateService } from 'libs/shared/src/lib/services/date-communicate.service';

declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'xn-date-input',
    templateUrl: './date-input.component.html',
    styles: [
        `.enable-input {
            background-color: #ffffff
        }

        .input-group-addon {
            border-bottom-right-radius: 3px;
            border-top-right-radius: 3px;
        }

        .input-group > .bg {
            background-color: #eee;
            opacity: 1;
        }
        `
    ]
})
@DynamicForm({ type: 'date', formModule: 'default-input' })

export class DateInputComponent implements OnInit, OnChanges, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    input: any;

    constructor(private er: ElementRef, private dateCommunicateService: DateCommunicateService,
        private amountControlCommService: AmountControlCommService) {
    }

    ngOnChanges() {
        this.amountControlCommService.change.subscribe(x => {
            if (this.row.flowId === 'financing_enterprise_m' && this.row.checkerId === 'validityDate') {
                this.ctrl.setValue(x.validityDate);
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        this.ctrl = this.form.get(this.row.name);
        // 日期组件的默认配置在AppComponent里配置
        this.input = $(this.er.nativeElement).find('input');

        if (!this.ctrl.value) {
            this.input.val('');
            this.ctrl.setValue('');
        } else {
            this.input.val(this.ctrl.value);
        }

        this.input.on('change', (e) => {
            e.preventDefault();
            if (this.ctrl.disabled) {
                this.input.val(this.ctrl.value);
            } else {
                const val = this.input.val();
                if (val !== this.ctrl.value) {
                    this.input.focus();
                    this.input.blur();
                }
            }
        });

        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngOnDestroy() {
        if (this.input) {
            this.input.off();
        }
    }

    onBlur(): void {
        if (this.ctrl.disabled) {
            this.input.val(this.ctrl.value);
        } else {
            const val = this.input.val();
            if (val !== this.ctrl.value) {
                this.ctrl.markAsTouched();
                this.ctrl.setValue(val);
                if (this.row.checkerId === 'actualPayBackDate' && this.row.flowId === 'financing13') {
                    this.dateCommunicateService.change.emit(val);
                }
            }

            this.calcAlertClass();
        }
    }

    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
