import {
    Component, OnInit, ElementRef, Input, ViewChildren, QueryList, AfterViewInit, enableProdMode
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from '../../../../public/form/xn-input.options';
import { XnFormUtils } from '../../../xn-form-utils';

// enableProdMode();  //在Component中连续多次修改一个属性值，F12页面有报这个错，开启enableProdMode()模式即可。

@Component({
    selector: 'xn-checkbox-show',
    template: `
    <div class="xn-radio-row">
        <label class="xn-input-font" *ngFor="let option of row.selectOptions; let i = index" [hidden]="option.disable">
            <input type="checkbox" class="flat-red" [checked]="isChecked(option.value)" [attr.disabled]="disabled">
            &nbsp;&nbsp;{{option.label}}
        </label>
    </div>
    `,
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
@DynamicForm({ type: 'checkbox', formModule: 'default-show' })
export class CheckboxShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    selected: string[] = [];
    disabled = true;
    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        const data = this.row.data;
        this.selected = data.split(',').filter((x: any) => x);
    }

    isChecked(value) {
        return this.selected.indexOf(value.toString()) >= 0;
    }
}
