import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table-hover table table-bordered file-row-table">
          <tr>
            <th style="width: 130px">保理使用费</th>
            <td class='readonlystyle'>{{items[0].factoringroyalties}}%</td>
            <th style="width: 130px">保理服务率</th>
            <td class='readonlystyle'>{{items[0].factoringServiceFee}}%</td>
            <th style="width: 130px">期限</th>
            <td class='readonlystyle'>{{items[0].term}}天</td>
          </tr>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'royalty1', formModule: 'avenger-show' })
export class AvengerRoyalty1Component implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    public items: any[] = [];

    constructor() {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.items = JSON.parse(data);
        }
    }
}
