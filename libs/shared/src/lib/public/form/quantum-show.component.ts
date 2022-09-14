/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\public\form\quantum-show.component.ts
* @summary：quantum日期范围shoe组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-20
***************************************************************************/
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnService } from '../../services/xn.service';

import { XnModalUtils } from '../../common/xn-modal-utils';
import { OrgRightModalComponent } from '../modal/org-right-modal.component';
import { SelectOptions } from '../../config/select-options';
import { TreeviewConfig } from '../component/treeview/models/treeview-config';
import { XnUtils } from '../../common/xn-utils';
import { TreeviewItem } from '../component/treeview/models/treeview-item';
import { DynamicForm } from '../../common/dynamic-form/dynamic.decorators';
declare const moment: any;
@Component({
  selector: 'xn-quantum-show',
  template: `
    <div class="form-control xn-input-font xn-input-border-radius">
      <div class="label-line">
        {{ label }}
      </div>
    </div>
  `,
})
@DynamicForm({ type: 'quantum1', formModule: 'dragon-show' })
export class XnQuantumShowComponent implements OnInit {
  @Input() row: any;
  @Input() form?: FormGroup;
  @Input() svrConfig?: any;

  public label: string = '';
  constructor() { }

  ngOnInit() {
    if (this.row.data) {
      const beginTime = JSON.parse(this.row.data).beginTime;
      const endTime = JSON.parse(this.row.data).endTime;
      this.label =
        moment(Number(beginTime)).format('YYYY-MM-DD') +
        ' - ' +
        moment(Number(endTime)).format('YYYY-MM-DD');
    }
  }
}
