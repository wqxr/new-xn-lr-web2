import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <table class="table-hover table table-bordered file-row-table">
      <tr>
        <th style="width: 130px">保理使用费支付方</th>
        <td class='readonlystyle'>{{items.factoringUser | xnSelectTransform:'payCompany'}}</td>
        <th style="width: 130px">保理服务费支付方</th>
        <td class='readonlystyle'>{{items.factoringServicer | xnSelectTransform:'payCompany'}}</td>
      </tr>
    </table>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'payer', formModule: 'avenger-show' })
export class AvengerPayerComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    // TO DO: 确认 items 是数组还是对象？
    public items: any;

    constructor() {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.items = JSON.parse(data);
        }
    }
}
