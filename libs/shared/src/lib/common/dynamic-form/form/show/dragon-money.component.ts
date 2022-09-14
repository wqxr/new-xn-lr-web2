import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';

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
})

@DynamicForm({ type: 'money', formModule: 'default-show' })
export class DragonShowMoneyComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    label: any;

    constructor() {
    }

    ngOnInit() {
        this.label = this.row.data;
    }
}
