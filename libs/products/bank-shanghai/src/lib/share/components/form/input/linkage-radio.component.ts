import { Component, OnInit, ElementRef, Input, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ShEditModalComponent, EditParamInputModel } from '../../../modal/edit-modal.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { SwitchModalComponent } from '../../../modal/switch-modal.component';
import { RelationSO, RelationSOName } from 'libs/shared/src/lib/config/enum';

@Component({
  selector: 'lib-linkage-radio',
  templateUrl: './linkage-radio.component.html',
  styles: [``]
})
@DynamicForm({ type: 'linkage-radio', formModule: 'dragon-input' })
export class LinkageRadioComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  resultObj: {
    queryStatus: number | string,  // 0未查询 1已查询
    relation: number | string,  // 已选关联 0无关联 1上海银行关联企业 2万科关联企业 3 华侨城关联企业
    relationOperatorUserName: string,
    relationUpdateTime: number | string,
    overDays: string  // 0未超过180天 1超过180天
  } = {
    queryStatus: 0,
    relation: 0,
    relationOperatorUserName: '',
    relationUpdateTime: '',
    overDays: ''
  };  // 关联查询结果

  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;

  constructor(private er: ElementRef, private xn: XnService, private cdr: ChangeDetectorRef, private vcr: ViewContainerRef) {
  }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    // const val = XnUtils.parseObject(this.row.value, {});
    this.updateData();
    this.calcAlertClass();
    this.ctrl.valueChanges.subscribe(v => {
      this.calcAlertClass();
    });
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  private calcAlertClass() {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }

  updateData() {
    const param = {
      appId: this.svrConfig.debtUnitId,
    };
    this.xn.dragon.post(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/getSupplierRelation`, param).subscribe((x: any) => {
      if (x && x.ret === 0 && x.data) {
        this.resultObj = Object.assign({}, this.resultObj, {
          ...x.data,
          overDays: Tip[Number(x.data.overDays)],
          queryStatus: !XnUtils.isEmptys(x.data?.relation, [0]) ? 1 : 0
        });
        this.toValue();
      }
    });
  }

  /**
   * 编辑
   */
  onEdit() {
    const params = {
      relation: {
        title: '请选择关联类型',
        checker: [
          { title: '关联类型', checkerId: 'relation', type: 'radio', options: {
            ref: RelationSO[this.svrConfig.record.flowId.substring(0, 2).toLocaleUpperCase()]}, required: true, value: this.resultObj.relation
          },
        ] as CheckersOutputModel[],
        buttons: ['取消', '确定'],
        size: 'sm'
      } as EditParamInputModel,
      addToRuleList: {
        title: `添加到${RelationSOName[this.svrConfig.record.flowId.substring(0, 2).toLocaleUpperCase()]}禁入企业列表`,
        checker: [
          { title: '规则名称', checkerId: 'ruleId', type: 'search-select', required: true, value: ''
          },
        ] as CheckersOutputModel[],
        buttons: ['不添加', '添加'],
        size: 'sm'
      } as EditParamInputModel,
      // debtUnit: this.svrConfig.debtUnit,
      // debtUnitId: this.svrConfig.debtUnitId,
      svrConfig: this.svrConfig
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, SwitchModalComponent, params).subscribe(v => {
      this.updateData();
    });
  }

  private toValue() {
    if (!this.resultObj) {
      this.ctrl.setValue('');
    } else {
      this.ctrl.setValue(JSON.stringify(this.resultObj));
    }
    this.ctrl.markAsTouched();
    this.cdr.markForCheck();
    this.calcAlertClass();
  }

}

enum Tip {
  '查询结果已失效（180天），请重新查询' = 1,
  '' = 0,
}
