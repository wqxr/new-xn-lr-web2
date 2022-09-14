import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <div style='width:100%'>
    <table class="table table-bordered table-hover file-row-table" width="100%">
    <thead>
    <tr>
      <th>{{label}}</th>
    </tr>
    </thead>
  </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'date1', formModule: 'avenger-show' })
export class AvengerDate1Component implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    public items: any[] = [];
    public Tabconfig: any;
    label: any;

    constructor() {
    }

    ngOnInit() {
        const data = this.row.data;
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
