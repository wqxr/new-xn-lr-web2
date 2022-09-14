import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';

@Component({
  template: `

    <table class="table table-bordered table-hover text-center file-row-table pre-table">
      <thead>
        <tr>
          <th>发票号码</th>
          <th>是否已上传</th>
        </tr>
      </thead>
    </table>
    <div class="scroll-height">
      <table class="table table-bordered table-hover text-center file-row-table pre-table">
        <tr *ngFor="let x of item?.list">
          <td>{{x.invoiceNum}}</td>
          <td [ngClass]="{'red':x.status !== 1}">{{x.status===1?'√':'X'}}</td>
        </tr>
      </table>
    </div>
    <table class="table table-bordered table-hover text-center file-row-table pre-table"  *ngIf='item?.amountAll!==undefined'>
      <tr>
        <td>合计</td>
        <td>{{item?.amountAll}}</td>
      </tr>
    </table>

    `,
  styles: [`
    table {
      table-layout: fixed;
      margin: 0;
  }

  table tr td:first-child {
      width: 300px;
  }

  .scroll-height {
      max-height: 300px;
      overflow-y: auto;
  }

  .scroll-height > table {
      border-bottom: none;
      border-top: none;
  }

  .scroll-height > table tr:first-child td {
      border-top: 0;
  }

  .scroll-height > table tr:last-child td {
      border-bottom: 0;
  }
`]
})
@DynamicForm({ type: 'pre-invoice', formModule: 'default-show' })
export class PreInvoiceComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  public item: any;

  constructor() {
  }

  ngOnInit() {
    const data = this.row.data;
    if (!!data) {
      this.item = JSON.parse(data);
      // this.items = data;
    }
  }
}
