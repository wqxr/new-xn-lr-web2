import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';

@Component({
  template: `
    <div style='width:100%'>
    <table class="table table-bordered table-hover file-row-table" width="100%">
    <thead>
    <tr>
      <td>{{label}}</td>
    </tr>
    </thead>
  </table>
    </div>
    `,
})

@DynamicForm({
  type: [
    'money',
    'search-select',
    'number-control'
  ], formModule: 'dragon-show'
})
export class DragonShowMoneyComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  label: any;

  constructor() {
  }

  ngOnInit() {
    this.label = this.row.data;
  }
}
