import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';

@Component({
    template: `
    <span class="form-control xn-input-font xn-input-border-radius" style="display: inline-table">
    {{label}}
  </span>
    `
})
@DynamicForm({ type: 'radio', formModule: 'default-show' })
export class RadioInputShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    type: string;

    label = '';


    constructor() {
    }

    ngOnInit() {
        this.type = this.row.type;
        const data = this.row.data;
        if (['sub_cfca_financing_sign', 'sub_cfca_sign_pre'].includes(this.row.flowId)) {
            this.label = SelectOptions.getConfLabel(this.row.options.ref, data.toString()) || data;
        } else {
            if (data === 'false') {
                this.label = '否';
            } else if (data === 'true') {
                this.label = '是';
            } else if (this.row.options && this.row.options.ref) { // 兼容radio
                this.label = SelectOptions.getConfLabel(this.row.options.ref, data.toString()) || data;
            } else {
                this.label = data;
            }
        }

    }
}
