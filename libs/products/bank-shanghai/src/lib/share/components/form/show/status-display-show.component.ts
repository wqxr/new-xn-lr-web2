/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：status-display-input.ts
 * @summary：状态展示
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianabo          新增         2019-04-22
 * **********************************************************************
 */

import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
  selector: 'lib-status-display-show',
  templateUrl: './status-display-show.component.html',
  styles: [``]
})
@DynamicForm({ type: ['status-display', 'businessRelated'], formModule: 'dragon-show' })
export class StatusDisplayShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  items: any[] = [];
  ctrVal = [];
  myClass = '';
  public label = '';
  linkOption: any = {};
  queryParams: any = {};

  get tipClickLink() {
    return !!this.svrConfig?.record?.flowId?.substring(0, 2)?.toUpperCase() ?
      `/${FlowType[this.svrConfig.record.flowId?.substring(0, 2)?.toUpperCase()]}/view-business` : '';
  }
  constructor(private er: ElementRef, private xn: XnService) { }

  ngOnInit(): void {
    this.linkOption = {
      label: TipLabel[this.row.checkerId],
      value: this.row.checkerId,
      appId: this.svrConfig?.debtUnitId
    };
    this.queryParams = {
      recordId: this.svrConfig?.record?.recordId || '',
      appId: this.linkOption.appId
    };
    this.ctrVal = XnUtils.parseObject(this.row.data, []) || [];
    const vals = this.ctrVal.map((x: number, index: number) => {
      return {
        idx: index,
        value: Number(x)
      };
    }).filter((y: { idx: number, value: number }) => !!y.value).map((z: { idx: number, value: number }) => z.idx);
    this.items = vals.map((x: number, index: number) => {
      const obj = this.row.selectOptions.find((y: any) => y.value.toString() === x.toString()) || '';
      const type = btnArr[this.row.checkerId][x] || 'success';
      return {
        label: obj ? obj.label : '',
        class: BtnStatus[type]
      };
    });
  }

  /**
   * 提示点击事件
   */
  onTipClick() {
    if (['businessRelated'].includes(this.row.checkerId)) {
      this.xn.router.navigate(['/bank-shanghai/view-business'], {
        queryParams: {
          recordId: this.svrConfig?.record?.recordId || '',
          appId: this.linkOption.appId
        }
      });
    }
  }

}

enum BtnStatus {
  'success' = 'btn btn-success btn-flat no-margin btn-sm',
  'warning' = 'btn btn-warning btn-flat no-margin btn-sm',
  'info' = 'btn btn-info btn-flat no-margin btn-sm',
  'danger' = 'btn btn-danger btn-flat no-margin btn-sm',
}
const btnArr: {[key: string]: any[]} = {
  // checkerId: 状态数组
  businessRelated: ['success', 'danger', 'warning', 'danger']
};
enum TipLabel {
  // checkerId: 链接标题
  'businessRelated' = '查看详情'
}

enum FlowType {
  /** 上海银行 */
  SH = 'bank-shanghai',
  /** 华侨城-上海银行 */
  SO = 'oct-shanghai',
}