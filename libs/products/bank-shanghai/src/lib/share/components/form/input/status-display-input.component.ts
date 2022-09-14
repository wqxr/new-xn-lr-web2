/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：status-display-input.ts
 * @summary：状态展示
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianabo          新增         2019-04-22
 * **********************************************************************
 */

import { Component, OnInit, ElementRef, Input, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { ShowModalService } from '../../../services/show-modal.service';
import { AntResultModalComponent } from '../../result-modal/ant-result-modal.component';

@Component({
  selector: 'lib-status-display-input',
  templateUrl: './status-display-input.component.html',
  styles: [`
  `]
})
@DynamicForm({ type: ['status-display', 'businessRelated'], formModule: 'dragon-input' })
export class StatusDisplayInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  items: any[] = [];
  ctrVal = [];
  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  public label = '';
  linkOption: any = {};
  queryParams: any = {};

  get tipClickLink() {
    return !!this.svrConfig?.record?.flowId?.substring(0, 2)?.toUpperCase() ?
      `/${FlowType[this.svrConfig.record.flowId?.substring(0, 2)?.toUpperCase()]}/view-business` : '';
  }
  constructor(private er: ElementRef, private xn: XnService, private vcr: ViewContainerRef, private showModalService: ShowModalService) { }

  ngOnInit(): void {
    this.ctrl = this.form.get(this.row.name);
    this.linkOption = {
      label: TipLabel[this.row.checkerId],
      checkerId: this.row.checkerId,
      appId: this.svrConfig?.debtUnitId
    };
    this.queryParams = {
      recordId: this.svrConfig?.record?.recordId || '',
      appId: this.linkOption.appId
    };
    const params = {
      appId: this.svrConfig?.debtUnitId
    };
    this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/businessStatus', params).subscribe({
      next: x => {
        if (x && x.ret === 0 && x.data) {
          this.ctrVal = XnUtils.parseObject(x.data, []) || [];
        }
      },
      error: errors => {
        console.log('error', errors);
      },
      complete: () => {
        const vals = this.ctrVal.map((x: number, index: number) => {
          return {
            idx: index,
            value: Number(x)
          };
        }).filter((y: { idx: number, value: number }) => !!y.value).map((z: { idx: number, value: number }) => z.idx);
        this.items = vals.map((x: number, index: number) => {
          const obj = this.row.selectOptions.find((y: any) => y.value.toString() === x.toString()) || '';
          const type = btnArr[this.row.checkerId][x] || 'success';
          return {
            label: obj ? obj.label : '',
            class: BtnStatus[type]
          };
        });
        this.toValue();
        this.calcAlertClass();
      }
    });
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  /**
   * 提示点击事件
   */
  onTipClick() {
    if (['businessRelated'].includes(this.row.checkerId)) {
      this.xn.router.navigate([`/${FlowType[this.svrConfig.record.flowId?.substring(0, 2)?.toUpperCase()]}/view-business`], {
        queryParams: {
          recordId: this.svrConfig?.record?.recordId || '',
          appId: this.linkOption.appId
        }
      });
      // const params = {
      //   nzTitle: '',
      //   nzWidth: '90%',
      //   nzStyle: { top: '15px'},
      //   nzFooter: false,
      //   components: {
      //     componentRef: 'lib-business-state-list',
      //     inputParams: this.queryParams,
      //     height: '550px'  // lib-business-state-list组件样式#article-nav {/* right: -15px; */}
      //   }
      // };
      // this.showModalService.openModal(this.xn, this.vcr, AntResultModalComponent, params).subscribe((x: any) => {});
    }
  }

  public onBlur() {
    this.calcAlertClass();
  }

  private calcAlertClass() {
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }

  private toValue() {
    if (!this.ctrVal.length) {
      this.ctrl.setValue('');
    } else {
      this.ctrl.setValue(JSON.stringify(this.ctrVal));
    }
    console.log('ctrl', this.ctrl.value);
    this.ctrl.markAsTouched();
    this.calcAlertClass();
  }
}

enum BtnStatus {
  'success' = 'btn btn-success btn-flat no-margin btn-sm',
  'warning' = 'btn btn-warning btn-flat no-margin btn-sm',
  'info' = 'btn btn-info btn-flat no-margin btn-sm',
  'danger' = 'btn btn-danger btn-flat no-margin btn-sm',
}
const btnArr: { [key: string]: any[] } = {
  // checkerId: 状态数组
  businessRelated: ['success', 'danger', 'warning', 'danger']
};
enum TipLabel {
  // checkerId: 链接标题
  'businessRelated' = '查看详情'
}
enum FlowType {
  /** 上海银行 */
  SH = 'bank-shanghai',
  /** 华侨城-上海银行 */
  SO = 'oct-shanghai',
}
