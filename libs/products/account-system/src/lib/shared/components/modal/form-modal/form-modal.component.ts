/*************************************************************************
 * Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\modal\form-modal\form-modal.component.ts
 * @summary：init xnAccountFormModalComponent
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2022-01-06
 ***************************************************************************/
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@lr/ngx-formly';

@Component({
  selector: 'xn-account-form-modal',
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      [nzTitle]="title"
      [nzWidth]="width"
      [nzFooter]="footer"
      [nzWrapClassName]="nzWrapClassName"
      [nzMaskClosable]="maskClosable"
      (nzOnCancel)="handleCancel()"
      [nzBodyStyle]="{ padding: '24px' }"
    >
      <form
        nz-form
        [nzNoColon]="noColon"
        [nzLayout]="layout"
        [formGroup]="form"
      >
        <div nz-row>
          <div nz-col nzSm="2" nzMd="2" nzSpan="2" #icons class="icon-align">
            <i
              *ngIf="showTipIcon"
              nz-icon
              [nzType]="tipIconType"
              nzTheme="fill"
              [ngClass]="{
                'icon-error': tipIconNzType === 'err',
                'icon-pass': tipIconNzType === 'pass',
                'icon-warn': tipIconNzType === 'warn',
                'icon-info': tipIconNzType === 'info'
              }"
            >
            </i>
          </div>
          <div nz-col nzSm="20" nzMd="20" nzSpan="20">
            <xn-formly
              [form]="form"
              [options]="options"
              [model]="model"
              [fields]="fields"
            >
            </xn-formly>
          </div>
          <div nz-col nzSm="2" nzMd="2" nzSpan="2" class="desc"></div>
        </div>
      </form>

      <ng-template #footer>
        <ng-container *ngIf="modalFooter; else defaultFooter">
          <ng-template
            #customFooter
            [ngTemplateOutlet]="modalFooter"
            [ngTemplateOutletContext]="{ $implicit: model, form: form }"
          ></ng-template>
        </ng-container>

        <ng-template #defaultFooter>
          <button nz-button nzType="default" (click)="handleCancel()">
            取消
          </button>
          <button
            nz-button
            nzType="primary"
            [disabled]="!form.valid"
            (click)="handleOk()"
          >
            确定
          </button>
        </ng-template>
      </ng-template>
    </nz-modal>
  `,
  styles: [
    `
      ::ng-deep .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      ::ng-deep .vertical-center-modal .ant-modal {
        top: 0;
      }
      ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
      }
      .text-right {
        text-align: right;
      }
      .icon-align {
        margin: 5px auto;
      }
      .icon-align i {
        font-size: 24px;
      }
      .icon-error {
        color: #ff4d4f;
      }
      .icon-pass {
        color: #52c41a;
      }
      .icon-warn {
        color: #faad14;
      }
      .icon-info {
        color: #2db7f5;
      }
      ::ng-deep .ant-modal-footer {
        text-align: center;
        border: none;
      }
    `,
  ],
})
export class xnAccountFormModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() width = 680;
  @Input() title = '标题';
  @Input() nzWrapClassName = 'vertical-center-modal';
  @Input() showTipIcon = false;
  @Input() tipIconType = 'exclamation-circle';
  @Input() tipIconNzType = 'info';
  @Input() maskClosable = false;
  @Input() modalFooter: TemplateRef<{
    $implicit: { model: any };
  }>;
  @Input() noColon = true;
  @Input() layout: 'horizontal' | 'vertical' | 'inline' = 'horizontal';
  @Input() form = new FormGroup({});
  @Input() fields: FormlyFieldConfig[] = [];
  @Input() model: any = {};
  @Input() options: FormlyFormOptions = {};
  @Output() ok = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.resetModel();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isVisible.currentValue === false) {
      this.resetModel();
    }
  }

  handleOk(): void {
    if (this.form.valid) {
      this.ok.emit(this.model);
    }
  }

  handleCancel(): void {
    this.cancel.emit();
  }

  private resetModel() {
    this.model = {};
  }
}
