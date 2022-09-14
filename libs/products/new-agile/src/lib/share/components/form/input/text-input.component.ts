import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    templateUrl: './text-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `.inMemo {
            padding: 5px 0px;
            color: #f20000
        }`
    ]
})
@DynamicForm({ type: 'text', formModule: 'new-agile-input' })
export class TextInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    inMemo = '';

    constructor() {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }

        this.inMemo = !!this.row.options && this.row.options !== '' && this.row.options.inMemo || '';
        this.ctrl = this.form.get(this.row.name);

        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
            this.validation(v);
        });
    }

    onBlur(event: any): void {
        this.validation(event.target.value);
    }
    validation(value) {
        const { regex } = this.row.options;
        if (regex) {
            if (regex.rule.test(value)) {
                this.alert = '';
            } else {
                this.alert = regex.errMsg || '请输入正确格式的值';
            }
        } else {
            this.calcAlertClass();

        }
    }
    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
