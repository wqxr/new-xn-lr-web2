/**
 * 只读输入框--解决表单控件设置只读后无法提交
 */
import { Component, ElementRef, Input, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


@Component({
    selector: 'dragon-special-input',
    template: `
    <div [formGroup]="form">
        <ng-container [ngSwitch]="row.name">
            <!--默认-->
            <ng-container *ngSwitchDefault>
                <input #input class="form-control xn-input-font xn-input-border-radius readonlystyle" [ngClass]="myClass" 
                type="text" [ngStyle]="{'color':row?.options?.class}"
                [formControlName]="row.name" [placeholder]="row.placeholder" autocomplete="off">
            </ng-container>
        </ng-container>
    </div>
    <span class="xn-input-alert">{{alert}}</span>
    `,
    styles: [
        `
        .readonlystyle {
            background:#eee;
            pointer-events: none;
            cursor: not-allowed;
        }
        `
    ]
})
@DynamicForm({ type: 'special-text', formModule: 'dragon-input' })
export class DragonSpecialTextInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input') input: ElementRef;
    myClass = '';
    alert = '';
    ctrl_orgName: AbstractControl;
    ctrl_userName: AbstractControl;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';
    constructor(private er: ElementRef,private cdr: ChangeDetectorRef,) {
    }

    ngOnInit() {
        console.log(this.row);
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }
        this.inMemo = !!this.row.options && this.row.options !== '' && this.row.options.inMemo || '';
        this.ctrl = this.form.get(this.row.name);

        if(this.row.flowId === 'sub_intermediary_add' || this.row.flowId === 'sub_intermediary_modify'){
            this.ctrl_orgName = this.form.get('orgName');
            this.ctrl_userName = this.form.get('userName');
            this.ctrl_orgName.valueChanges.subscribe(t=>{
                this.ctrl.setValue(String(this.ctrl_orgName.value + this.ctrl_userName.value));
            });
            this.ctrl_userName.valueChanges.subscribe(n=>{
                this.ctrl.setValue(String(this.ctrl_orgName.value + this.ctrl_userName.value));
            });
        }
        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
