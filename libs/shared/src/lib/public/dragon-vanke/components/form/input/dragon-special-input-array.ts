/**
 * 只读输入框组--解决表单控件设置只读后无法提交
 */
import { Component, ElementRef, Input, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


@Component({
    selector: 'dragon-special-input-array',
    template: `
    <div [formGroup]="form">
        <div [formGroupName]="row.checkerId">
            <ng-container *ngFor="let childRow of row.childChecker;let i = index">
                <div style="padding-right: 0px;" [ngClass]="[
                    'item-box',
                    !!childRow.options?.others?.itemSpan ? childRow.options?.others?.itemSpan : 'col-sm-6'
                ]">
                    <div style="padding-right: 0;text-align: right;" [ngClass]="[
                        'item-label',
                        !!childRow.options?.others?.labelSpan ? childRow.options?.others?.labelSpan : 'col-sm-5'
                    ]">
                        <label>{{childRow.title}}</label>
                    </div>
                    <div style="padding-left: 0;" [ngClass]="[
                        'item-control',
                        !!childRow.options?.others?.controlSpan ? childRow.options?.others?.controlSpan : 'col-sm-5'
                    ]">
                        <app-dynamic-input
                        [row]="childRow"
                        [form]="form.get(row.name)"
                        [formModule]="formModule"
                        [svrConfig]="svrConfig">
                        </app-dynamic-input>
                    </div>
                </div>
            </ng-container>

        </div>
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
        .item-box {
            position: relative;
            display: flex;
            margin-bottom: 10px;
        }
        .item-label label {
            min-width: 40px;
            padding-right: 10px;
            font-weight: normal;
            line-height: 34px;
            text-align:right;
        }
        .item-control {
            flex: 1;
        }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@DynamicForm({ type: 'special-text-array', formModule: 'dragon-input' })
export class DragonSpecialTextInputArrayComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    @ViewChild('input') input: ElementRef;
    formModule = 'dragon-input';
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';
    constructor(private er: ElementRef, private cdr: ChangeDetectorRef, ) {
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
