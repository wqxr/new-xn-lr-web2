import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';

@Component({
    template: `
    <div style='width:100%'>
        <div class="form-control xn-input-font xn-input-border-radius">
            <div class="label-line">
                {{label}}
            </div>
        </div>
    </div>
    `
})
@DynamicForm({ type: 'select', formModule: 'default-show' })
export class SelectComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    label = '';
    ref = '';

    constructor() {
    }

    ngOnInit() {
        this.ref = this.row.options.ref;   // 当前所取得 ref 类型
        const selectOption = SelectOptions.get(this.ref);

        const obj = [].concat(selectOption).find((x: any) => x.value.toString() === this.row.data.toString());
        this.label = obj ? obj.label : '';
    }
}
