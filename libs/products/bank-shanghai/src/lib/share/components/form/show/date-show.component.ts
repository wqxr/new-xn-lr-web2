import {Component, OnInit, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'lib-sh-date-input',
    template: `
    <div class="xn-date-row">
        <div class="input-group">
            <input type="text" class="form-control" [value]="label" readonly="true">
            <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>
        </div>
    </div>
    `,
    styles: [ `
    `]
    // [attr.disabled]="disabled"
})
@DynamicForm({ type: 'sh-date', formModule: 'dragon-show' })
export class ShDateShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    label: any;

    constructor() {
    }

    ngOnInit() {
        const data = this.row.data || 0;
        if ((typeof data) === 'string') {
            if (data.length === 0 || data.indexOf('-') >= 0) {
                this.label = data;
            } else if (XnUtils.toDateFromString(data)) {
                this.label = XnUtils.formatDate(XnUtils.toDate(data));
            } else {
                this.label = XnUtils.formatDate(parseInt(data, 10));
            }
        } else {
            this.label = XnUtils.formatDate(data);
        }
    }
}
