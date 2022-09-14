/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\dragon-vanke\modal\rule-engine-result-modal\rule-engine-result-modal.component.ts
 * @summary：规则引擎审核标准弹窗
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-09-07
 ***************************************************************************/

import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ModalComponent,
  ModalSize,
} from 'libs/shared/src/lib/common/modal/components/modal';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { Observable } from 'rxjs';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { RuleOperateTypeEnum } from 'libs/shared/src/lib/config/enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

/**
 *  规则引擎弹窗参数配置
 */
export class RuleEngineModalParams {
  // 标题
  public title?: string;
  // 输入项
  public checker: CheckersOutputModel[];
  // 其他配置
  public options?: any;
  // 按钮
  public buttons?: string[];
  // 弹框大小配置
  public size?: any;
  public type?: number;
  // mainFlowId 交易id
  public mainFlowId: string;
  // svrConfig 流程信息
  public svrConfig: any;
  constructor() {
    this.options = { tips: '' };
    this.buttons = ['取消', '确定'];
    this.size = ModalSize.XXLarge;
  }
}
@Component({
  template: `
    <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
      <form
        class="form-horizontal"
        (ngSubmit)="handleSubmit()"
        [formGroup]="mainForm"
        *ngIf="!!mainForm"
      >
        <modal-header [showClose]="true">
          <h4 class="modal-title">{{ params.title }}</h4>
        </modal-header>
        <modal-body>
          <div
            class="clearfix"
            style="max-height: calc( 100vh - 250px);overflow-y: auto;overflow-x:hidden;"
            #block
          >
            <div class="form-group" *ngFor="let row of params.checker">
              <div class="col-sm-12">
                <app-dynamic-input
                  [row]="row"
                  [form]="mainForm"
                  [svrConfig]="svrConfig"
                  formModule="dragon-input"
                >
                </app-dynamic-input>
              </div>
            </div>
          </div>
        </modal-body>
        <modal-footer>
          <button
            nz-button
            nzType="primary"
            style="margin-right: 5px;"
            (click)="toFileClass($event)"
          >
            补充信息
          </button>
          <button
            type="submit"
            nz-button
            nzType="primary"
            [disabled]="!mainForm.valid"
          >
            确定
          </button>
        </modal-footer>
      </form>
    </modal>
  `,
})
export class RuleEngineResultModalComponent implements AfterViewChecked {
  @ViewChild('modal') modal: ModalComponent;
  public params: RuleEngineModalParams = new RuleEngineModalParams();
  private observer: any;
  public mainForm: FormGroup;
  public svrConfig: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private publicCommunicateService: PublicCommunicateService,
    private xn: XnService
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
    this.publicCommunicateService.change.subscribe((x: any) => {
      if(x?.formValue){
        this.close({ ruleResult: x.formValue, type: RuleOperateTypeEnum.SAVE });
      }
    });
  }
  open(params: RuleEngineModalParams): Observable<any> {
    this.params = Object.assign({}, this.params, params);
    this.buildChecker(this.params.checker);
    this.mainForm = XnFormUtils.buildFormGroup(this.params.checker);
    this.svrConfig = this.params.svrConfig;
    this.modal.open(this.params.size);
    this.modal.instance.hidden.subscribe(() => {
      this.modal.instance.destroy().subscribe();
    });
    return Observable.create((observer) => {
      this.observer = observer;
    });
  }

  /**
   * 补充信息
   */
  toFileClass(e: Event) {
    e.preventDefault();
    const queryParams = {
      recordId: this.svrConfig.record.recordId,
      flowId: this.svrConfig.record.flowId,
      procedureId: this.svrConfig.procedure.procedureId,
    };
    const url = `${window.location.origin}/logan/record/file-classification/${this.params.mainFlowId}`;
    const params = Object.keys(queryParams).reduce((prev, curr) => `${prev}${prev ? '&' : '?'}${curr}=${queryParams[curr]}`, '');
    window.open(`${url}${params}`);
  }

  /**
   *  提交
   */
  public handleSubmit() {
    this.close(this.mainForm.value);
  }

  /**
   *  取消
   */
  public handleCancel() {
    this.close(null);
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  private close(value) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }
}
