/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\public\modal\cfca-valid-modal.component.ts
* @summary：注册流程-企业信息实名校验结果弹窗
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying        CFCA注册         2021-06-09
***************************************************************************/

import { Component } from "@angular/core";
import { Observable } from "rxjs";
@Component({
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      nzTitle="提示"
      [nzWidth]="900"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()"
    >
      <ng-container *nzModalContent>
        <h4 style="text-align: center;">
          您填写的信息无法通过实名校验，您将在注册“上传资料”步骤补充以下文件用于注册审核
        </h4>
        <nz-table
          #borderedTable
          nzBordered
          [nzShowPagination]="false"
          [nzData]="dataSet"
        >
          <thead>
            <tr>
              <th>序号</th>
              <th>文件名称</th>
              <th>资料要求</th>
              <th>是否需要上传扫描件</th>
              <th>是否需要邮寄原件</th>
              <th>模板</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of dataSet; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ data.fileName }}</td>
              <td>{{ data.dataLimt }}</td>
              <td>{{ data.isNeedUpload === 1 ? '√' : '×' }}</td>
              <td>{{ data.isNeedPost === 1 ? '√' : '×' }}</td>
              <td>
                <ng-container *ngIf="data.template; else na">
                  <a href="/assets/lr/doc/register/法人代表证明书.docx" download>{{ data.template }}</a>
                </ng-container>
                <ng-template #na>×</ng-template>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </ng-container>
      <div style="display:flex; justify-content: space-between;" *nzModalFooter>
        <button nz-button nzType="default" (click)="handleCancel()">
          取消
        </button>
        <button nz-button nzType="primary" (click)="handleOk()">确定</button>
      </div>
    </nz-modal>
  `,
  styles: [
    `
      ::ng-deep .ant-modal-close-x {
        padding-top: 15px;
      }
      ::ng-deep .ant-table table {
        text-align: center;
      }
      ::ng-deep .ant-table-thead > tr > th {
        text-align: center;
      }
      ::ng-deep .ant-modal-footer {
        border-top: 1px solid #f0f0f0;
        padding-bottom: 10px;
        padding-top: 10px;
      }
    `,
  ],
})
export class CfcaValidModalComponent {
  public isVisible: boolean = false;
  public observer: any;
  public dataSet = [
    {
      fileName: '法定代表人有效证件',
      dataLimt: '原件照片',
      isNeedUpload: 1,
      isNeedPost: 0,
      template: '',
    },
    {
      fileName: '法定代表人证明书',
      dataLimt: '原件盖企业公章',
      isNeedUpload: 1,
      isNeedPost: 1,
      template: '法人代表证明书.docx',
    },
  ];

  constructor() { }

  open(params: any) {
    console.log(params);
    this.isVisible = true;
    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  /**
   * 确定
   */
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.close({ ok: true, value: '' });
  }

  /**
   * 取消
   */
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.close({ ok: false, value: '' });
  }

  /**
   * close
   */
  close(params: { ok: boolean, value: any }): void {
    this.isVisible = false;
    this.observer.next(params);
    this.observer.complete();
  }
}
