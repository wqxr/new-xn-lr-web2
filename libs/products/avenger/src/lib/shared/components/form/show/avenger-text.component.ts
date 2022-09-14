import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

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
@DynamicForm({ type: 'text', formModule: 'avenger-show', default: true })
export class AvengerTextComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    label = '未填写';

    constructor() {
    }

    ngOnInit() {
        this.label = this.row.data;
    }
}
