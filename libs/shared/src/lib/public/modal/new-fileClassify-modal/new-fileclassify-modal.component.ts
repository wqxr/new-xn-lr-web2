/* declarations: NzModalCustomComponent */

import {
  OnInit,
  Component,
  Input,
  TemplateRef,
  ViewContainerRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';

@Component({
  selector: 'new-fileClassify-modal',
  template: `
    <button
      nz-button
      nzType="primary"
      class="btn-extra"
      (click)="createTplModal(tplTitle, tplContent, tplFooter)"
    >
      <span>添加分类类别</span>
    </button>
    <ng-template #tplTitle>
      <span>添加分类类别</span>
    </ng-template>
    <ng-template #tplContent let-params>
      <div
        class="input-wrap"
        *ngFor="let field of formModalFields; let i = index"
      >
        <label>{{ field.label }}</label>
        <input nz-input [(ngModel)]="field.fieldValue" style="width: 40%" />
        <i nz-icon nzType="minus-circle-o" class="dynamic-delete-button"></i>
      </div>
      <div class="input-wrap">
        <label class="inputLabel inputRequire">{{
          is_generate_contract.label
        }}</label>
        <nz-radio-group [(ngModel)]="is_generate_contract.value">
          <label nz-radio nzValue="1">是</label>
          <label nz-radio nzValue="0">否</label>
        </nz-radio-group>
      </div>
      <div class="input-wrap">
        <label class="inputLabel inputRequire">{{
          file_classify_name.label
        }}</label>
        <input
          nz-input
          [(ngModel)]="file_classify_name.value"
          style="width: 40%;"
        />
      </div>
      <ng-container *ngFor="let item of indexNames; let i = index">
        <div class="input-wrap">
          <label class="inputLabel inputRequire">{{ item.label }}</label>
          <input
            nz-input
            [(ngModel)]="item.value"
            [maxlength]="item.maxLength"
            style="width: 40%;"
          />
          <i
            nz-icon
            nzType="plus-circle"
            nzTheme="twotone"
            nzTwotoneColor="#ff3d62"
            class="prefix-icon"
            *ngIf="i === 0"
            (click)="addField('indexNames')"
          ></i>
          <i
            nz-icon
            nzType="minus-circle-o"
            class="prefix-icon"
            *ngIf="i !== 0"
            (click)="delField('indexNames', i)"
          ></i>
        </div>
      </ng-container>
      <ng-container *ngFor="let item of standardNames; let i = index">
        <div class="input-wrap">
          <label class="inputLabel inputRequire">{{ item.label }}</label>
          <input
            nz-input
            [(ngModel)]="item.value"
            [maxlength]="item.maxLength"
            style="width: 40%;"
          />
          <i
            nz-icon
            nzType="plus-circle"
            nzTheme="twotone"
            nzTwotoneColor="#ff3d62"
            class="prefix-icon"
            *ngIf="i === 0"
            (click)="addField('standardNames')"
          ></i>
          <i
            nz-icon
            nzType="minus-circle-o"
            class="prefix-icon"
            *ngIf="i !== 0"
            (click)="delField('standardNames', i)"
          ></i>
        </div>
      </ng-container>
      <div class="warnLabel" *ngIf="showErr">请填写完整信息</div>
    </ng-template>
    <ng-template #tplFooter let-ref="modalRef">
      <button nz-button (click)="destroyTplModal(ref)">取消</button>
      <button
        nz-button
        nzType="primary"
        (click)="destroyTplModal(ref, true)"
        [nzLoading]="tplModalButtonLoading"
      >
        确定
      </button>
    </ng-template>
  `,
  styles: [
    `
      .btn-extra {
        margin-right: 4px;
        margin-bottom: 8px;
      }
      .input-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin: 0 0 12px 0;
        width: 100%;
      }
      .input-wrap .inputLabel {
        position: relative;
        margin-right: 4px;
        margin-bottom: 0 !important;
        color: #3b3b3b;
        font-weight: normal;
        width: 30%;
        text-align: right;
        margin-right: 12px;
      }
      .inputRequire {
        position: relative;
      }
      .inputRequire::before {
        content: '*';
        color: red;
        position: absolute;
        right: -6px;
        top: -1px;
      }
      ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
      }
      .prefix-icon {
        margin: 0 4px;
        cursor: pointer;
      }
      .warnLabel {
        color: red;
        padding-left: 34%;
      }
    `,
  ],
})
export class NewFileClassifyModalComponent implements OnInit {
  @Input() fileClassifyCfg = '';
  @Output() emitOK = new EventEmitter<any>();
  tplModalButtonLoading = false;
  disabled = false;
  showErr = false;
  is_generate_contract = {
    className: 'ant-col ant-col-md-22 ant-col-sm-24',
    key: 'is_generate_contract',
    type: 'radio',
    label: '是否拟合生成合同',
    required: true,
    options: [
      { label: '是', value: 0 },
      { label: '否', value: 1 },
    ],
    value: '',
  };
  file_classify_name = {
    key: 'file_classify_name',
    type: 'input',
    label: '分类类别名称',
    required: true,
    placeholder: '请输入分类类别名称',
    maxLength: 15,
    value: '',
  };
  indexNames = [
    {
      key: 'indexNames',
      type: 'input',
      label: '指标名称',
      required: true,
      placeholder: '请输入指标名称',
      autocomplete: 'off',
      maxLength: 15,
      value: '',
    },
  ];
  standardNames = [
    {
      className: 'ant-col ant-col-md-22 ant-col-sm-24',
      key: 'standardNames',
      type: 'input',
      label: '人工审核标准',
      required: true,
      placeholder: '请输入人工审核标准',
      maxLength: 15,
      value: '',
    },
  ];
  typeList = {
    indexNames: () => {
      return {
        key: 'indexNames',
        type: 'input',
        label: '指标名称',
        required: true,
        placeholder: '请输入指标名称',
        maxLength: 15,
        value: '',
      };
    },
    standardNames: () => {
      return {
        key: 'standardNames',
        type: 'input',
        label: '人工审核标准',
        required: true,
        placeholder: '请输入人工审核标准',
        maxLength: 15,
        value: '',
      };
    },
  };
  constructor(
    private ngModal: NzModalService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}
  ngOnInit() {
    // this.form = this.fb.group({});
    this.instanceData();
  }
  instanceData() {
    this.showErr = false;
    this.is_generate_contract = {
      className: 'ant-col ant-col-md-22 ant-col-sm-24',
      key: 'is_generate_contract',
      type: 'radio',
      label: '是否拟合生成合同',
      required: true,
      options: [
        { label: '是', value: 0 },
        { label: '否', value: 1 },
      ],
      value: '',
    };
    this.file_classify_name = {
      key: 'file_classify_name',
      type: 'input',
      label: '分类类别名称',
      required: true,
      placeholder: '请输入分类类别名称',
      maxLength: 15,
      value: '',
    };
    this.indexNames = [
      {
        key: 'indexNames',
        type: 'input',
        label: '指标名称',
        required: true,
        placeholder: '请输入指标名称',
        autocomplete: 'off',
        maxLength: 15,
        value: '',
      },
    ];
    this.standardNames = [
      {
        className: 'ant-col ant-col-md-22 ant-col-sm-24',
        key: 'standardNames',
        type: 'input',
        label: '人工审核标准',
        required: true,
        placeholder: '请输入人工审核标准',
        maxLength: 15,
        value: '',
      },
    ];
  }
  addField(itemName: string) {
    this[itemName].push(this.typeList[itemName]());
  }
  delField(itemName, i) {
    this[itemName].splice(Number(i), 1);
  }
  createTplModal(
    tplTitle: TemplateRef<{}>,
    tplContent: TemplateRef<{}>,
    tplFooter: TemplateRef<{}>
  ): void {
    if (this.fileClassifyCfg.length === 0) {
      this.ngModal.warning({
        nzTitle: '提示',
        nzContent: '请先选择文件分类类型',
      });
      return;
    }
    this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: true,
      nzComponentParams: {
        value: 'Template Context',
      },
      nzOnOk: () => {
        const data = {
          is_generate_contract: this.is_generate_contract.value,
          file_classify_name: this.file_classify_name.value,
          indexNames: this.indexNames.filter((i) => i.value),
          standardNames: this.indexNames.filter((i) => i.value),
        };
      },
    });
  }
  destroyTplModal(modelRef: NzModalRef, isEmit?: boolean): void {
    this.tplModalButtonLoading = true;
    this.showErr = false;
    const data: any = {
      is_generate_contract: this.is_generate_contract.value,
      file_classify_name: this.file_classify_name.value,
      indexNames: this.indexNames.map((i) => i.value),
      standardNames: this.standardNames.map((i) => i.value),
    };

    if (isEmit) {
      const indexEmpty = data.indexNames.some((i) => i === '');
      const standardEmpty = data.standardNames.some((i) => i === '');
      for (const [key, value] of Object.entries(data)) {
        if (value === '' || indexEmpty || standardEmpty) {
          this.showErr = true;
          this.tplModalButtonLoading = false;
          return;
        }
      }
      this.emitOK.emit(data);
    }
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      this.instanceData();
      modelRef.destroy();
    });
  }
}
