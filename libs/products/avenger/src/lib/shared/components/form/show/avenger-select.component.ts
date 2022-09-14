import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
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
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'select', formModule: 'avenger-show', default: true })
export class AvengerSelectComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    label = '';
    ref = '';

    constructor() {
    }

    ngOnInit() {
        console.log(this.row.options);
        this.ref = this.row.options.ref;   // 当前所取得 ref 类型
        const selectOption = SelectOptions.get(this.ref);
        for (const i of selectOption) {
            if (this.row.data.toString() === i.value.toString()) {
                this.label = i.label;
            }
        }
    }
}
