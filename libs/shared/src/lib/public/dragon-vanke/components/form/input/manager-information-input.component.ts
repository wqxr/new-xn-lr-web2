import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnUtils } from '../../../../../common/xn-utils';


/**
 *  管理人信息 期数 买卖协议编号，服务协议编号
 */
@Component({
    selector: 'xn-manager-information-input',
    templateUrl: './manager-information-input.component.html',
    styles: [`
        .title {
            padding: 10px 0;
            font-weight: bold;
        }

        .title-text:after {
            content: '*';
            color: #df0000;
        }

        .form-group {
            height: 30px;
        }
    `]
})
@DynamicForm({ type: 'manager-info', formModule: 'dragon-input' })
export class ManagerInformationInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    ctrl: AbstractControl;
    data: any;
    dataObj: any;
    factoringProcedureRateAlet: string;
    succeededRateAlet: string;

    public constructor() {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.fromValue();
    }

    handleEdit(e, label) {
        this.data[label] = e.target.value;
        if (['factoringProcedureRate'].includes(label)) {
            const ok = /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/.test(e.target.value) || !e.target.value
            this.factoringProcedureRateAlet = ok? '' : '请输入0-100之间的数字'
        }
        if (['succeededRate'].includes(label)) {
            const ok = /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/.test(e.target.value) || !e.target.value
            this.succeededRateAlet = ok ? '' : '请输入0-100之间的数字'
        }
        this.toValue();
    }

    private fromValue() {
        this.data = XnUtils.parseObject(this.ctrl.value, []);
        this.dataObj = Object.assign({}, this.data); // 拷贝对象，
        this.toValue();
    }

    private toValue() {
        if (!!this.row.required && this.row.required === true) {
            const { periods, salesAgreementNumber, serviceAgreementNumber, capitalPeriodNum, capitalManageNum, applyExpires, factoringProcedureRate, succeededRate } = this.data;
            if ([periods, salesAgreementNumber, serviceAgreementNumber, capitalPeriodNum, capitalManageNum, applyExpires, factoringProcedureRate, succeededRate].includes('')) {
                this.ctrl.setValue('');
            } else {
                this.ctrl.setValue(this.data);
            }
        } else {
            this.ctrl.setValue(this.data);
        }

    }
}
