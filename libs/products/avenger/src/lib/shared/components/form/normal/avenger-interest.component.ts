import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <div style='width:100%'>
    <table class="table-hover table table-bordered file-row-table">
    <tr>
        <td>实收费用</td>
        <td>{{item.realPrice}}</td>
    </tr>
    <tr>
        <td>实收保理使用费</td>
        <td>{{item.realFactoringFee}}</td>
    </tr>
    <tr>
        <td>实收保理服务费</td>
        <td>{{item.realFactoringServerFee}}</td>
    </tr>
    <tr>
    <td>实收平台服务费</td>
    <td>{{item.realPlatformFee}}</td>
    </tr>

  </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'interestRate', formModule: 'avenger-input' })
export class AvengerInterestComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    public items: any[] = [];
    public Tabconfig: any;
    item: any;

    constructor() {
    }

    ngOnInit() {
        this.item = this.row.value;
    }
}
