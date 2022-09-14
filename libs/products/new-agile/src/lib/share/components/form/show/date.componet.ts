import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';


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
@DynamicForm({ type: 'date', formModule: 'new-agile-show' })
export class XnDateShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    label = '';

    constructor() {
    }

    ngOnInit(): void {
        const { data } = this.row;
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
