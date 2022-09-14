import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
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
@DynamicForm({ type: 'input-search', formModule: 'default-show' })
export class InputSearchComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;

    label = '';

    constructor(private er: ElementRef, ) {
    }

    ngOnInit() {
        this.label = this.row.data;
    }
}
