import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
  template: `
    <table class="table-hover table table-bordered file-row-table">
        <tr>
          <th style="width: 60px">收款单位户名
          <td>{{items.accountName}}</td>
        </tr>
        <tr>
          <th style="width: 60px;">收款单位账号</th>
          <td>{{items.accountNumber}}</td>
        </tr>
        <tr>
          <th style="width: 60px">收款单位开户行</th>
          <td>{{items.bankName}}</td>
        </tr>
      </table>
    `,
  styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'bank-single1', formModule: 'avenger-show' })
export class AvengerBankSingle1Component implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  // TO DO: 确认 items 是数组还是对象？
  public items: any = {} as any;

  constructor() {
  }

  ngOnInit() {
    const data = this.row.data;
    if (data !== '') {
      this.items = JSON.parse(data);
    }
  }
}
