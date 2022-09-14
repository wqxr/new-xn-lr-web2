import { Component, OnInit, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';


@Component({
    selector: 'dragon-text-qd',
    template: `
    <div style='width:100%'>
        <div class="form-control xn-input-font xn-input-border-radius readonlystyle">
            <div class="label-line">
                {{label | xnSelectDeepTransform:selectOption}}
            </div>
        </div>
    </div>
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
// 查看二维码checker项
@DynamicForm({ type: 'text-qd', formModule: 'dragon-input' })
export class VanketextQdInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    label: any;
    readonly = false;
    selectOption: string;

    constructor() {
    }

    ngOnInit() {
        if (!!this.row.value) {
            this.label = JSON.parse(this.row.value);
        }
        this.readonly = this.row.options && this.row.options.readonly && (this.row.options.readonly === 1 || this.row.options.readonly === true)
            ? true : false;
        this.selectOption = this.row.options && this.row.options.ref ? this.row.options.ref : '';
    }
}
