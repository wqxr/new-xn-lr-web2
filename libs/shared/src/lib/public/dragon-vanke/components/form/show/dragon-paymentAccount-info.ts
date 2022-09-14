import { Component, Input, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';


// 龙光供应商上传资料收款账户信息的checker项
@Component({
  templateUrl: './dragon-paymentAccount-info.html',
  styleUrls: ['../../show-dragon-input.component.css']
})
@DynamicForm({ type: 'account-info', formModule: 'dragon-show' })
export class DragonShowPaymentAccountComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  public items: any;
  public Tabconfig: any;
  item: any;

  constructor() {
  }

  ngOnInit() {
    this.item = JSON.parse(this.row.data);
  }
  // 选择收款账户

}
