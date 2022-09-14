import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { isNullOrUndefined } from 'util';

@Component({
    template: `
    <div style='width:100%'>
    <textarea rows="5" class="form-control xn-show-input-textarea xn-input-font xn-input-border-radius"
        readonly>{{label}}</textarea>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'textarea', formModule: 'avenger-show' })
export class AvengerTextareaComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() memo: string;

    public type = '';
    public label = '';
    public items: any[] = [];

    constructor() {
    }

    ngOnInit() {
        if (!isNullOrUndefined(this.memo)) {
            this.type = 'textarea';
            this.label = this.memo;
        }
    }
}
