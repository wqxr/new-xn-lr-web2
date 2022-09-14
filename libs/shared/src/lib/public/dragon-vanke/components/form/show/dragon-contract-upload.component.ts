/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光供应商上传资料复核交易合同控件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2019-08-29
 * **********************************************************************
 */

import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import DragonInfos from '../../bean/checkers.tab';

import { DragonViewContractModalComponent } from '../../../modal/dragon-mfile-detail.modal';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { UploadPicService } from '../../../../../services/upload-pic.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';

@Component({
  selector: 'dragon-contract-show',
  template: `
    <table class="table table-bordered text-center" style="float:left">
      <thead>
        <tr class="table-head">
          <!-- 全选按钮 -->
          <!-- title -->
          <th>序号</th>
          <th>合同扫描件</th>
          <!-- 行操作 -->
        </tr>
      </thead>

      <tbody>
        <ng-container *ngIf="items.length > 0">
          <tr *ngFor="let sub of items; let i = index">
            <ng-container>
              <td>
                <span>{{ i + 1 }}</span>
              </td>
              <td>
                <a href="javascript:void(0)" (click)="fileView(sub)">
                  {{
                    (sub | xnJson).length > 1
                      ? (sub | xnJson)[0].fileName + '，...'
                      : (sub | xnJson)[0].fileName
                  }}</a
                >
              </td>
            </ng-container>
          </tr>
        </ng-container>
      </tbody>
    </table>
  `,
  styles: [
    `
      .button-reset-style {
        font-size: 12px;
        padding: 5px 35px;
        color: #3c8dbc;
      }

      .tip-memo {
        color: #9a9a9a;
      }
      .tag-color {
        color: #f20000;
      }
    `,
  ],
})
@DynamicForm({ type: 'deal-contract', formModule: 'dragon-show' })
export class DragonContractShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  public items: any[] = [];
  public Tabconfig: any;
  // public amountAll: number;// 合同总金额

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private uploadPicService: UploadPicService
  ) { }

  ngOnInit() {
    if (!!this.row.data) {
      this.items = JSON.parse(this.row.data);
    }
  }
  fileView(paramsItem) {
    if (!!this.row.stepId) {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, JSON.parse(paramsItem)).subscribe(x => { });
    } else {
      this.xn.dragon
        .post('/contract_temporary/view', {
          mainFlowId: this.svrConfig.record.mainFlowId,
        })
        .subscribe((x) => {
          if (x.ret === 0) {
            let datainfo = { contractFile: '' };
            if (x.data.data.contractType === undefined) {
              datainfo.contractFile = paramsItem;
            } else {
              datainfo = { ...x.data.data, contractFile: paramsItem };
            }
            this.uploadPicService.viewDetail(
              datainfo,
              this.vcr,
              DragonViewContractModalComponent
            );
          }
        });

    }

  }
}
