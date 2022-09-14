import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from '../../dynamic.decorators';


@Component({
    template: `
   <div>
   <input #input class="form-control xn-input-font xn-input-border-radius"  style='display:inline;width:99%' [ngClass]="myClass" type="text"
   [placeholder]="row.placeholder" [(ngModel)]="row.value" (input)="inputChange(row.value)"
   autocomplete="off">
  <span style='display: block;
  width: 1%;float: right;font-weight:200;padding-top:5px'>%</span>
</div>
<span class="xn-input-alert">{{alert}}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// 百分比输入框
@DynamicForm({ type: 'rate-input', formModule: 'default-input' })
export class RateInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;
    public myClass = ''; // 控件样式
    public alert = ''; // 错误提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;

    constructor(private er: ElementRef, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.valueChanges.subscribe(() => {
            this.cdr.markForCheck();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public inputChange(value): void {
        console.log(value);
        if (value === '') { this.ctrl.setValue(''); this.alert = '请输入数字'; return }
        this.alert = this.calcAlertClass(value)
    }

    calcAlertClass(value): string {
        // 匹配[0-100]之间正小数,小数位数最多2位
        let tempValue = value.replace(/,/g, '');
        if (isNaN(tempValue)) { this.ctrl.setValue(''); return '请输入数字' }
        tempValue = Number(parseFloat(tempValue));
        const y = String(tempValue).indexOf('.') + 1; // 获取小数点的位置
        const count = String(tempValue).length - y; // 获取小数点后的个数
        if (0 > tempValue) { this.ctrl.setValue(''); return `您输入的数字应该大于0` }
        if (100 < tempValue) { this.ctrl.setValue(''); return `您输入的数字应该小于100` }
        if (y > 0 && count > 2) { this.ctrl.setValue(''); return `格式错误，请输入两位小数` }
        this.ctrl.setValue(Number(value))
        return ''
    }

}
