import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';

@Component({
  template: `
    <div style="width:100%">
      <p>原收款信息</p>
      <table
        class="table-hover table table-bordered file-row-table"
        style="border:0;cellspacing:0;cellpadding:0"
      >
        <tr>
          <th style="width: 20%">收款单位户名</th>
          <td>{{ items.old.receiveOrg }}</td>
        </tr>
        <tr>
          <th>收款单位账号</th>
          <td>{{ items.old.receiveAccount }}</td>
        </tr>
        <tr>
          <th>收款单位开户行</th>
          <td>{{ items.old.receiveBank }}</td>
        </tr>
        <tr>
          <th>变更原因</th>
          <td>{{ items.changeReason | xnSelectTransform: changeReason }}</td>
        </tr>
      </table>
      <p style="margin-top:10px">新收款信息</p>
      <table
        class="table-hover table table-bordered file-row-table"
        style="border:0;cellspacing:0;cellpadding:0"
      >
        <tr>
          <th style="width: 20%">收款单位户名</th>
          <td>{{ items.new.receiveOrg }}</td>
        </tr>
        <tr>
          <th>收款单位账号</th>
          <td>{{ items.new.receiveAccount }}</td>
        </tr>
        <tr>
          <th>收款单位开户行</th>
          <td>{{ items.new.receiveBank }}</td>
        </tr>
      </table>
    </div>
  `,
})
@DynamicForm({ type: 'compare-info', formModule: 'dragon-show' })
export class VankeChangeAccountShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  // TO DO: 确认 items 是数组还是对象？
  public items: any = {} as any;
  // 审批放款中账号变更原因,默认是通用的 ‘changeReason’
  public changeReason: string = 'changeReason';
  // 记录流程ID
  public flowId: string;

  constructor() {}

  ngOnInit() {
    this.flowId = this.row.flowId;
    const data = this.row.data;
    if (!!data) {
      this.items = JSON.parse(data);
      // 金地账号变更流程原因特殊处理
      this.changeReason = this.isInJdFlow()
        ? 'changeReasonGemdal'
        : 'changeReason';
    }
  }

  /**
   * 金地账号变更流程涉及的flowId
   * @returns
   */
  private isInJdFlow() {
    return (
      this.flowId === 'sub_jd_change' ||
      this.flowId === 'sub_jd_change_verification' ||
      this.flowId === 'sub_factoring_change_jd_520' ||
      this.flowId === 'sub_financing_sign_jd_520' ||
      this.flowId === 'sub_customer_verify_jd_520' ||
      this.flowId === 'sub_financing_verify_jd_520'
    );
  }
}
