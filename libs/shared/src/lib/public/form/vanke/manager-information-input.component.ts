import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

/**
 *  管理人信息 期数 买卖协议编号，服务协议编号 资产管理计划编号
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
export class ManagerInformationInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    ctrl: AbstractControl;
    data: any;
    dataObj: any;

    public constructor() {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.fromValue();
    }

    handleEdit(e, label) {
        this.data[label] = e.target.value;
        this.toValue();
        this.isErr(e, label);
    }
    isErr(e, label){
        if (label === 'capitalManageNum'){
            const pattern = /^\d*$/;
            if (pattern.test(e.target.value)) {
                this.data.err = '';
                // this.observer.next(e.target.value);
            } else {
                this.data.err = '请输入整数！';
                this.form.setErrors({ error: this.data.err });
            }
        }
    }

    private fromValue() {
        this.data = XnUtils.parseObject(this.ctrl.value, []);
        this.dataObj = Object.assign({}, this.data); // 拷贝对象，
        this.toValue();
    }

    private toValue() {
        if (!!this.row.required && this.row.required === true) {
            const {payConfirmId, periods, salesAgreementNumber, serviceAgreementNumber} = this.data;
            if ([payConfirmId, periods, salesAgreementNumber, serviceAgreementNumber].includes('')) {
                this.ctrl.setValue('');
            } else {
                this.ctrl.setValue(this.data);
            }
        } else {
            this.ctrl.setValue(this.data);
        }

    }
}
