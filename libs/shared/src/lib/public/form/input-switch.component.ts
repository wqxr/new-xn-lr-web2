import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';

/**
 *  开关公用组件
 */
@Component({
    selector: 'app-xn-input-switch',
    templateUrl: './input-switch.component.html',
    styles: [`
        .btn-active {
            background-color: #31a660;
            border-color: #31a660;
            color: #ffffff;
        }

        .btn-resert {
            padding: 0 10px;
            height: 20px;
            font-size: 12px;
        }

        .btn-group .btn-color {
            background-color: #dddddd;
            border-color: #dddddd;
            color: #434848;
        }
    `]
})
export class InputSwitchComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public alert = '';
    public myClass = '';
    // 当前选中的项
    public activeCode: number;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    // 开关项默认配置
    public switchOptions = [{label: '是', value: 1}, {label: '否', value: 0}];

    public constructor() {
    }

    public ngOnInit() {
        // 默认选中的
        console.log('开关项获取的数据：', this.row);
        this.ctrl = this.form.get(this.row.name);
        // 如果value属性且value值不为空
        if (!!this.row.value && this.row.value !== '') {
            this.activeCode = parseInt(this.row.value, 0);
        } else {
            this.activeCode = 0;
        }
        // 如果没有改变默认设置value值为0
        this.ctrl.setValue(JSON.stringify(this.activeCode));
    }

    public changeClick(val) {
        this.activeCode = val.value;
        console.log('操作之后:', val);
        // 设置选择的值
        this.ctrl.setValue(JSON.stringify(this.activeCode));
    }

    // private calcAlertClass() {
    //     this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    // }
}
