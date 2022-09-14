import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewChild, AfterViewChecked } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from '../../dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';


@Component({
    template: `
    <div [formGroup]="form" style="display: flex;">
        <input 
        #input 
        class="form-control xn-input-font xn-input-border-radius" 
        [ngClass]="myClass" type="text"
        style="border-top-right-radius: 0; border-bottom-right-radius: 0;"[placeholder]="row.placeholder" 
        [formControlName]="row.checkerId" 
        (blur)="onBlur()" 
        autocomplete="off">
        <div class="input-group-addon" style="width: 39px;background-color: #fff;padding: 8px">%</div>
    </div>
    <span class="xn-input-alert">{{alert}}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// 查看二维码checker项
@DynamicForm({ type: 'text-rate', formModule: 'default-input' })
export class VankeTextRateComponent implements AfterViewChecked, OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;
    @ViewChild('moneyAlertRef', { static: true }) moneyAlertRef: ElementRef;
    public myClass = ''; // 控件样式
    public alert = ''; // 错误提示
    public moneyAlert = ''; // 金额提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public ctrlWith = false; // 特殊属性

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        this.ctrl = this.form.get(this.row.name);
        this.ctrlWith = this.row.options && this.row.options.with === 'picker';
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.ctrl.valueChanges.subscribe(() => {
            this.moneyFormat(); // 将拉取到的数据进行money格式化
            this.calcAlertClass();
        });
    }
    ngAfterViewChecked() {
        if (this.ctrl && !!this.ctrl.value && !this.input.nativeElement.value) {
            const a = setTimeout(() => {
                clearTimeout(a);
                this.fromValue();
                this.calcAlertClass();
                // console.log("run");
                return;
            }, 0);
        }

        if (this.ctrlWith) {
            if (this.input.nativeElement.value === '') {
                setTimeout(() => {
                    if (this.input.nativeElement.value === '') {
                        this.moneyAlert = '';
                    }
                }, 0);
                return;
            }
            if (isNaN(parseInt(this.ctrl.value, 0)) && this.input.nativeElement.value !== '') {
                this.input.nativeElement.value = 0;
                const ret = XnUtils.convertCurrency(this.input.nativeElement.value);
                const a = setTimeout(() => {
                    this.moneyAlert = ret[1];
                    clearTimeout(a);
                    return;
                });
                return;
            }

            if (parseInt(this.ctrl.value, 0) !== parseInt(this.input.nativeElement.value.replace(/,/g, ''), 0)) {
                const a = setTimeout(() => {
                    clearTimeout(a);
                    this.fromValue();
                    this.calcAlertClass();
                    return;
                }, 0);
            }
        }
    }
    /**
       *  失去焦点时处理金额值
       */
    public onBlur(): void {
        this.toValue();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
 *  初始值
 */
    private fromValue() {
        if (!this.input.nativeElement.value && this.input.nativeElement.value !== '') {
            return;
        }
        this.input.nativeElement.value = this.ctrl.value;
        this.moneyFormat(); // 将拉取到的数据进行money格式化
        this.calcAlertClass();
        this.toValue();
    }

    /**
     *  格式化数据
     */
    private toValue() {
        if (!this.input.nativeElement.value) {
            this.ctrl.setValue('');
            this.moneyAlert = '';
        } else {
            const tempValue = this.input.nativeElement.value;
            this.ctrl.setValue(tempValue.toString());
        }
        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }
    /**
   *  金额显示格式化，加千分位
   */
    private moneyFormat() {
        this.input.nativeElement.value = XnUtils.formatMoney(this.input.nativeElement.value);

    }
}
