import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';

/**
 *  多级联动选择: 一次转让合同合同组组件
 */
@Component({
    selector: 'xn-linkage-selectinput',
    templateUrl: './linkage-selectinput.component.html',
    styles: [`
    .xn-dselect-first {
        padding-right: 2px;
    }
    .xn-dselect-second {
        padding-left: 2px;
    }
    `]
})
@DynamicForm({ type: 'link-selectInput', formModule: 'dragon-input' })
export class LinkageSelectInputOnceComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    alert = '';
    myClass = '';
    isSecondShow = false;
    readonly = false;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    selectValue = '';
    inputValue = '';

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.readonly = this.row.flowId === 'sub_first_contract_delete' ? true : false;
        this.ctrl.valueChanges.subscribe(v => {
            this.ctrl.markAsTouched();
            this.calcAlertClass();
        });
        // 设置初始值
        if (!!this.ctrl.value) {
            const value = XnUtils.parseObject(this.ctrl.value, []);
            if (this.judgeDataType(value) && value.length > 0) {
                this.selectValue = value[0] === '通用' ? value[0] : '非通用';
                this.inputValue = value[0] !== '通用' ? value[0] : '';
                this.isSecondShow = this.selectValue === '非通用' ? true : false;
            }
        }
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    selectChange(event) {
        this.selectValue = event.target.value;
        this.toValue();
    }

    inputChange(event) {
        this.inputValue = event.target.value;
        this.toValue();
    }

    onBlur(event) {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private toValue() {
        this.isSecondShow = this.selectValue === '非通用' ? true : false;
        if (this.selectValue === '通用') {
            this.ctrl.setValue(JSON.stringify([this.selectValue]));
        } else if (this.selectValue === '非通用' && this.inputValue !== '') {
            this.ctrl.setValue(JSON.stringify([this.inputValue]));
        } else {
            this.ctrl.setValue('');
        }
        // console.log("val",this.ctrl.value);
    }

    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }
}
