/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：EditModalComponent
 * @summary：新增文件模态框  配置参数  EditParamInputModel
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          资产池移除交易         2019-05-21
 * **********************************************************************
 */

import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CheckersOutputModel } from '../../../config/checkers';
import { ModalSize, ModalComponent } from '../../../common/modal/components/modal';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { XnService } from '../../../services/xn.service';


/**
 *  参数默认
 */
export class ParamInputModel {
  /** 标题 */
  public id = '';
  /** 其他配置 */
  public mainFlowId = '';
  public deBuit = '';
  /** 应收账款金额*/
  public receive = '';
  /** 原资产池名称 */
  public capitalPoolName = '';
}
@Component({
  template: `
    <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
    <form class="form-horizontal" (ngSubmit)="handleSubmit()">
      <modal-header [showClose]="false">
        <h6 class="modal-title">{{paramType}}</h6>
      </modal-header>
      <modal-body>
      <div style='min-height: 100px;
      max-height: 450px;
      overflow-y: auto;'>
      <table class="table table-bordered table-hover file-row-table text-center" width="100%" >
      <thead>
      <tr>
        <td>
          <span class="span-line">序号</span>
        </td>
        <td>
          <span class="span-line">交易id</span>
        </td>
        <td>
          <span class="span-line">收款单位</span>
        </td>
        <td>
          <span class="span-line">应收账款金额</span>
        </td>
        <td>
        <span class="span-line">原资产池</span>
        </td>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let sub of params;let i=index">
        <td>{{i+1}}</td>
        <td>
        <a [innerHTML]="sub.mainFlowId" href="javaScript:void (0)"
                          (click)="viewProcess(sub.mainFlowId)"></a>
        </td>
        <td>{{sub.debtUnit}}</td>
        <td>{{sub.receive}}</td>
        <td>{{sub.capitalPoolName}}</td>
      </tr>

      </tbody>
    </table>
    </div>
      </modal-body>
      <modal-footer>
        <button type="button" class="btn btn-default" (click)="handleCancel()">
          取消
        </button>
        <button type="button" class="btn btn-success" (click)='enterCapital()'>
          {{paramButton}}
        </button>
      </modal-footer>
    </form>
  </modal>
    `
})
export class DeletematerialEditModalComponent {
  @ViewChild('modal') modal: ModalComponent;
  public params: any;
  private observer: any;
  public mainForm: FormGroup;
  paramType: string;
  paramButton: string;
  capitalPoolId: any;
  type: number;

  constructor(
    public xn: XnService,
  ) {
  }
  open(params): Observable<any> {
    this.params = params.selectedItems;
    this.capitalPoolId = params.capitalPoolId;
    this.type = params.type;
    this.paramType = params.type === 1 ? `是否要将以下交易移入资产池：${params.capitalName}资产池 ？（共${this.params.length}笔）` :
      `是否要移除以下交易？（共${this.params.length}笔）`;
    this.paramButton = params.type === 1 ? '移入' : '移除';
    this.modal.open(ModalSize.XLarge);
    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  /**
   *  提交
   */
  public handleSubmit() {
    const val = this.mainForm && this.mainForm.value ? this.mainForm.value : null;
    this.close(val);
  }

  /**
   *  取消
   */
  public handleCancel() {
    this.close(null);
  }
  enterCapital() {
    if (this.type === 1) {
      this.xn.dragon.post('/pool/add',
        { mainFlowIdList: this.params.map((x: any) => x.mainFlowId), capitalPoolId: this.capitalPoolId }).subscribe(x => {
          if (x.ret === 0) {
            this.xn.msgBox.open(false, '移入资产池成功');
            this.close({ action: 'ok' });
          }
        });
    } else {
      this.xn.dragon.post('/pool/remove',
        { mainFlowIdList: this.params.map((x: any) => x.mainFlowId), capitalPoolId: this.capitalPoolId }).subscribe(x => {
          if (x.ret === 0) {
            this.xn.msgBox.open(false, '移除资产池成功');
            this.close({ action: 'ok' });
          }
        });
    }

  }
  private close(value) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }
  // 查看交易流程
  public viewProcess(item: any) {
    this.xn.router.navigate([`logan/main-list/detail/${item}`]);
  }
}
