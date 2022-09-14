import {
    Component, OnInit, ElementRef, Input, ViewChildren, QueryList, AfterViewInit, enableProdMode
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

// enableProdMode();  //在Component中连续多次修改一个属性值，F12页面有报这个错，开启enableProdMode()模式即可。

@Component({
    selector: 'xn-checkbox-input',
    templateUrl: './checkbox-input.component.html',
    styles: [
        `.xn-radio-row {
            padding-top: 7px;
        }`,
        `.xn-radio-row label {
            font-weight: normal;
            margin: 0 10px;
        }`,
        `.xn-radio-row button:focus {
            outline: none
        }`, // 去掉点击后产生的边框
    ]
})
@DynamicForm({ type: 'checkbox', formModule: 'default-input' })
export class CheckboxInputComponent implements OnInit, AfterViewInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChildren('checkbox') checkbox: QueryList<ElementRef>;  // 因为有多个checkbox，所以需要用到ViewChildren

    myClass = '';
    alert = '';
    showClearBtn = false;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    selected: string[] = [];
    selectedArr: any[] = [];
    selectedBooleanArr: any[] = [];


    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        // 初始化的时候保证新建的数组的长度和checkbox的长度是一样的
        for (let i = 0; i < this.row.selectOptions.length; i++) {
            this.selectedBooleanArr.push(false);
        }
        this.selected.length = this.row.selectOptions.length;
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    // 因为checkbox的值在ngOnInit的时候还读不出来，在页面渲染完成后可以读出
    ngAfterViewInit() {
        setTimeout(() => {
            this.fromValue();
        }, 0);
    }


    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onClear() {
        this.showClearBtn = false;
        this.selected = [];
        this.ctrl.setValue(null);
        for (let i = 0; i < this.row.selectOptions.length; i++) {
            if (!this.row.selectOptions[i]['disable']) {
                this.selectedArr[i].nativeElement.checked = false;
            } else {
                // 有默认禁用的选项不清空状态
                this.selected[i] = this.row.selectOptions[i].value;
            }
        }
        if (this.selected.length === 0) {
            this.ctrl.setValue(null);
        } else {
            this.ctrl.setValue(this.selected.filter(x => x).toString());
        }
    }

    // 读取来自后台或编辑之后的checkboxValue
    fromValue() {
        const ctrlValueArr = this.ctrl.value.split(',');
        const ctrlValueArrTemp = [];

        for (let i = 0; i < this.row.selectOptions.length; i++) {

            if (ctrlValueArr.includes(String(this.row.selectOptions[i].value))) {
                ctrlValueArrTemp[i] = true;
            } else {
                ctrlValueArrTemp[i] = false;
            }
            // if (this.row.selectOptions[i].value === ctrlValueArr[i]) {
            //     ctrlValueArrTemp[i] = true;
            // } else {
            //     ctrlValueArrTemp[i] = false;
            // }
        }
        // for (let i = 0; i < ctrlValueArr.length; i++) {
        //     if()
        // }
        this.selectedBooleanArr = ctrlValueArrTemp;

        for (let i = 0; i < this.selectedBooleanArr.length; i++) {
            if (this.selectedBooleanArr[i] === true) {
                this.selected[i] = this.row.selectOptions[i].value;
            }
        }
        this.selectedArr = this.checkbox.toArray();
        for (let i = 0; i < ctrlValueArrTemp.length; i++) {
            this.selectedArr[i].nativeElement.checked = ctrlValueArrTemp[i];
        }

        // 控件checkbox不能点击
        for (let i = 0; i < this.row.selectOptions.length; i++) {
            if (this.row.selectOptions[i].disabled) {
                this.selectedArr[i].nativeElement.disabled = 'disabled';
            }
        }

        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    // 将数据从UI传递到control
    toValue() {
        if (this.selected.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(this.selected.filter(x => x).toString());
        }
        // console.log("ctrlValue: ", this.ctrl.value);
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    isChecked(value) {
        return this.selected.indexOf(value) >= 0;
    }

    // 更新checkbox的值，原理：传值的时候，同时匹配一个boolean数组，true的时候将checked置为true
    updateSelection(event, value, i) {

        let checkbox = event.target;
        let checked = checkbox.checked;
        if (checked) {
            this.selectedBooleanArr[i] = true;
            this.selected[i] = value;
        } else {
            this.selectedBooleanArr[i] = false;
            this.selected[i] = '';
        }
        if (this.selected.length !== 0) {
            this.showClearBtn = true;
            this.calcAlertClass();
        }

        // 如果为空，将整个数组清空
        if (this.selectedBooleanArr.indexOf(true) === -1) {
            this.onClear();
            this.selected = [];
        }

        this.toValue();
    }
}
