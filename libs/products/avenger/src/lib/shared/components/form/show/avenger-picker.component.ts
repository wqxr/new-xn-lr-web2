import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <span  class="form-control xn-input-font xn-input-border-radius"
    style="display: inline-table">
    <div style="line-height: 24px;">
    <span>{{items.label}}</span>
    </div>
    </span>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'picker', formModule: 'avenger-show' })
export class AvengerPickerComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    // TO DO: 确认 items 是数组还是对象？
    public items = { label: '' };

    constructor() {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.items = JSON.parse(data);
        }
    }
}
