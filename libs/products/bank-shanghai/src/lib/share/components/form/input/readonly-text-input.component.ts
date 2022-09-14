/**
 * 只读输入框--解决表单控件设置只读后无法提交
 */
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'readonly-text-input',
  template: `
    <div [formGroup]="form">
      <ng-container [ngSwitch]="row.name">
        <ng-container *ngSwitchCase="'drawalAmount'">
          <div [ngClass]="{ 'input-group': row.options?.unit }">
            <span
              class="form-control xn-input-font xn-input-border-radius readonly-style text-break"
              [ngClass]="myClass"
            >
              {{ val | number: '1.2-2' | xnMoney }}
            </span>
            <span
              class="input-group-addon readonlystyle"
              *ngIf="row.options?.unit"
              [attr.id]="row.name"
              >{{ row.options?.unit }}</span
            >
          </div>
        </ng-container>
        <ng-container *ngSwitchCase="'eAccountStatus'">
          <span
            class="form-control xn-input-font xn-input-border-radius readonly-style text-break"
            [ngClass]="myClass"
            [ngStyle]="{
              color: ['0', '2', 0, 2].includes(val) ? '#ff5500' : '#555'
            }"
          >
            <ng-container *ngIf="!!val || ['0', 0].includes(val)">
              {{ val | xnSelectTransform: 'eAccountStatus' }}
            </ng-container>
          </span>
        </ng-container>
        <!--默认-->
        <ng-container *ngSwitchDefault>
          <span
            class="form-control xn-input-font xn-input-border-radius text-break"
            [ngClass]="myClass"
          >
            {{ val }}
          </span>
        </ng-container>
      </ng-container>
    </div>
    <span class="xn-input-alert" *ngIf="!!alert">{{ alert }}</span>
  `,
  styles: [
    `
      .readonlys-tyle {
        background: #eee;
        pointer-events: none;
        cursor: not-allowed;
      }
      .text-red {
        color: #ff5500;
      }
      .text-break {
        overflow-y: auto;
      }
    `,
  ],
})
@DynamicForm({ type: 'readonly-text', formModule: 'dragon-input' })
export class ReadonlyTextInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  val = '';
  label = '';

  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  inMemo = '';
  constructor(
    private er: ElementRef,
    private cdr: ChangeDetectorRef,
    private xn: XnService,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    if (!this.row.placeholder) {
      this.row.placeholder = '';
      if (this.row.type === 'text' && this.row.value === 0) {
        this.row.placeholder = 0;
      }
    }
    this.inMemo =
      (!!this.row.options &&
        this.row.options !== '' &&
        this.row.options.inMemo) ||
      '';
    this.ctrl = this.form.get(this.row.name);
    if (
      ['eAccountStatus'].includes(this.row.checkerId) &&
      ['sh_vanke_bank_verify', 'so_bank_verify'].includes(this.row.flowId)
    ) {
      this.alert = `普惠开户状态查询中，请稍后...`;
      this.eAccountStatusInit();
    } else {
      this.val = this.ctrl.value || '';
    }
    this.calcAlertClass();
    this.ctrl.valueChanges.subscribe((v) => {
      this.calcAlertClass();
    });
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
  }

  /**
   * @description: 普惠app开户状态获取
   */
  eAccountStatusInit() {
    this.xn.dragon
      .post2(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_bank_gateway/checkEAccountStatus`, {
        appId: this.svrConfig.debtUnitId,
      })
      .subscribe({
        next: (x: any) => {
          if (x && x.ret === 0) {
            this.val = x.data;
          } else {
            this.val = '2';
          }
          this.toValue(this.val.toString());
        },
        error: (err: any) => {
          console.error('err', err);
          this.alert = '开户状态查询异常';
        },
        complete: () => {},
      });
  }

  /**
   * @description: 表单组件set值
   */
  private toValue(val: string = '') {
    this.ctrl.setValue(val);
    this.cdr.markForCheck();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }

  calcAlertClass(): void {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
}
