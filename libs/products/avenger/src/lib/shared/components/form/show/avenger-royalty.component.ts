import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
  template: `
    <table class="table-hover table table-bordered file-row-table">
      <tr>
        <th style="width: 130px">保理使用费支付方
        <td class='readonlystyle'>{{items.factoringUser | xnSelectTransform:'payCompany'}}</td>
        <th style="width: 130px">保理服务费支付方
        <td class='readonlystyle'>{{items.factoringServicer | xnSelectTransform:'payCompany'}}</td>
        <th style="width: 130px">平台服务费支付方
        <td class='readonlystyle'>{{items.platformServicer | xnSelectTransform:'payCompany'}}</td>
      </tr>
    </table>
    `,
  styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'royalty', formModule: 'avenger-show' })
export class AvengerRoyaltyComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  // TO DO: 确认 items 是数组还是对象？
  public items = {
    factoringUser: '',
    platformServicer: '',
    factoringServicer: '',
  };

  constructor() {
  }

  ngOnInit() {
    const data = this.row.data;
    if (data !== '') {
      this.items = JSON.parse(data);
    }
  }
}
