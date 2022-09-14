/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\view-contract\contract.component.ts
 * @summary：contract.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/
import {
  Component, Input, OnInit,
  ViewContainerRef
} from '@angular/core';
import { XnModalUtils } from '../../../../../../shared/src/lib/common/xn-modal-utils';
import { DragonPdfSignModalComponent } from '../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { HwModeService } from '../../../../../../shared/src/lib/services/hw-mode.service';
import { XnUtils } from '../../../../../../shared/src/lib/common/xn-utils';

@Component({
  selector: 'lib-contract-gj',
  templateUrl: './contract.component.html',
  styles: [
    `.control-label {
      font-size: 12px;
      font-weight: bold
    }

    .control-desc {
      font-size: 12px;
      padding-top: 7px;
      margin-bottom: 0;
      color: #999
    }

    .row {
      margin-bottom: 15px;
    }
    `
  ]
})
export class GjContractComponent implements OnInit {
  @Input() set contracts(value) {
    if (XnUtils.isEmpty(value)) {
      this.rows = [];
    } else {
      this.rows = typeof value === 'string' ? JSON.parse(value) : value;
    }
  }

  rows: any[] = [];

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private hwModeService: HwModeService
  ) {}

  ngOnInit() {}

  // 显示合同
  showContract(id, secret, label) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, {
      id,
      secret,
      label,
      readonly: true
    }).subscribe(() => {});
  }

  // 下载合同
  downContract(val: any) {
    this.hwModeService.downContract(val.id, val.secret, val.label);
  }
}
