import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';

@Component({
  selector: 'lib-ant-text-input',
  template: `
    <div [formGroup]="form">
      <ng-container [ngSwitch]="row.checkerId">
        <ng-container *ngSwitchCase="'linkageRadio'">
          <span class="xn-span input-text" [ngClass]="myClass">
            {{ label }}
          </span>
        </ng-container>
        <ng-container *ngSwitchCase="'productType'">
          <span class="xn-span input-text" [ngClass]="myClass">
            {{ label | xnSelectDeepTransform: 'productType_sh' }}
          </span>
        </ng-container>
        <ng-container *ngSwitchCase="'receive'">
          <span class="xn-span input-text" [ngClass]="myClass">
            {{ val | number: '1.2-2' | xnMoney }}
          </span>
        </ng-container>
        <ng-container *ngSwitchCase="'discountRate'">
          <ng-container *ngTemplateOutlet="rate"></ng-container>
        </ng-container>
        <ng-container *ngSwitchCase="'serviceRate'">
          <ng-container *ngTemplateOutlet="rate"></ng-container>
        </ng-container>
        <ng-container *ngSwitchDefault>
          <span class="xn-span input-text" [ngClass]="myClass">
            {{ val }}
          </span>
        </ng-container>
      </ng-container>
      <ng-template #rate>
        <span class="xn-span input-text" [ngClass]="myClass">
          {{ val | number: '1.2-2' }}%
          <!-- | number:'1.2-2' | xnPercentage:'0.00%' -->
        </span>
      </ng-template>
    </div>
    <span class="xn-input-alert">{{ alert }}</span>
  `,
  styles: [
    `
      .input-text {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #1f2b38;
        font-weight: bold;
      }
    `,
  ],
})
@DynamicForm({ type: 'ant-text', formModule: 'dragon-input' })
export class AntTextInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  // @ViewChild('input') input: ElementRef;

  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  val = '';
  label: any;
  constructor(private er: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // console.log(this.row);
    this.ctrl = this.form.get(this.row.name);
    this.val = this.row.value || '';
    if (
      ['sh_vanke_bank_verify', 'so_bank_verify'].includes(this.row.flowId)
    ) {
      switch (this.row.name) {
        case 'linkageRadio':
          const val = XnUtils.parseObject(this.row.value, {}) || {};
          const relation = Relation[val.relation] || '';
          this.label = !!relation
            ? `该企业与${relation}有关联`
            : `该企业与${Relation[1]}、${Relation[2]}、${Relation[3]}无关联`;
          break;
        case 'productType':
          const { type, selectBank } =
            XnUtils.parseObject(this.row.value, {}) || {};
          this.label = { type, selectBank };
          break;
        default:
          this.label = this.val;
          break;
      }
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

  calcAlertClass(): void {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
}
export enum Relation {
  '' = 0,
  '上海银行股份有限公司' = 1,
  '万科企业股份有限公司' = 2,
  '深圳华侨城股份有限公司' = 3,
}
