import {Component, OnInit, ElementRef, Input, ChangeDetectionStrategy} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


@Component({
    template: `
    <div class="inMemo" *ngIf="inMemo !== ''">{{ inMemo }}</div>
    <div [formGroup]="form">
        <ng-container *ngIf="row.flowId === 'vanke_platform_verify';else block">
            <input #input class="form-control xn-input-font xn-input-border-radius" [ngClass]="myClass"
                type="text" [formControlName]="row.name" [placeholder]="row.placeholder" (blur)="onBlur()" autocomplete="off"/>
        </ng-container>
        <ng-template #block>
            <input #input class="form-control xn-input-font xn-input-border-radius" style='display:inline;' [ngClass]="myClass"
                type="text" [formControlName]="row.name" [placeholder]="row.placeholder" (blur)="onBlur()" autocomplete="off"/>
        </ng-template>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../../show-dragon-input.component.css']
})
// 获取移动端图片checker项
@DynamicForm({ type: 'text-pic', formModule: 'dragon-input' })
export class DragonGetpicComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';

    constructor(private er: ElementRef) {
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

        this.ctrl.valueChanges.subscribe(() => {
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur(): void {
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    uploadQr() {
        console.error('未实现');
    }
}
