import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <div style='width:100%'>
        <div class="form-control xn-input-font xn-input-border-radius" style='display:inline-block;width:99%'>
            <div class="label-line">
                {{label}}
            </div>
        </div>
        <span style='display: block;width: 1%;float: right;font-weight:200;padding-top:5px'>%</span>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'rate-input', formModule: 'avenger-show' })
export class AvengerRateShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    label = '';

    constructor() {
    }

    ngOnInit() {
        this.label = this.row.data;
    }
}
