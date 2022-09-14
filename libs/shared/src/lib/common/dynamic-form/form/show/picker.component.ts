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
    `
})
@DynamicForm({ type: 'picker', formModule: 'default-show' })
export class PickerComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    label = '';


    constructor() {
    }

    ngOnInit() {
        const { data } = this.row;
        try {
            const json = JSON.parse(data.replace(/\s+/g, ''));
            if (json.label) {
                this.label = json.label;
            } else {
                this.label = data;
            }
        } catch (error) {
            this.label = data;
        }
    }
}
