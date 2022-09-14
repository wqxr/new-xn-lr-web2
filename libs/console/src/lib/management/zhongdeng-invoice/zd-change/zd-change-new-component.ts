/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：new.component.ts
 * @summary：新创建流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          代码规范         2021-01-15
 * **********************************************************************
 */

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewContainerRef,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import {
  FormGroup,
  FormControlName,
  FormControl,
  Validators,
} from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DataTablePicker } from 'libs/shared/src/lib/common/data-table-picker';
import { isNullOrUndefined } from 'util';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import {
  SelectOptions,
  applyFactoringTtype,
} from 'libs/shared/src/lib/config/select-options';
import { FlowCustom, IFlowCustom } from '../../../record/flow.custom';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'zd-new',
  templateUrl: './zd-change-new-component.html',
  styleUrls: ['./zd-change-new-component.less'],
})
export class ZdChangeNewComponent implements OnInit {
  flowId: string;
  mainForm: FormGroup;
  svrConfig: any;
  rows: any[] = [];
  pageTitle = '发起新流程';
  pageDesc = '';
  flowCustom: IFlowCustom;
  loadingback = false;
  params = {
    registerDate: '',
    registerDueDate: '',
    registerNo: '',
  };
  invoiceList: any;
  contractList: any;
  debtorList: any;
  zhondengOptions = SelectOptions.get('zhongDengInvoiceType');
  @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();

  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    public hwModeService: HwModeService,
    private loading: LoadingService,
    private cdr: ChangeDetectorRef,
    private publicCommunicateService: PublicCommunicateService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.params.registerNo = params.registerNo;
      this.params.registerDate = params.registerDate;
      this.params.registerDueDate = params.registerDueDate;
    });
    this.mainForm = new FormGroup({
      classify: new FormControl('', Validators.required),
      innvoiceInfo: new FormGroup(
        {
          invoiceList: new FormControl(''),
          contractList: new FormControl(''),
          debtorList: new FormControl(''),
        },
        Validators.required
      ),
    });
    this.publicCommunicateService.change.subscribe((x) => {
      let contractList = x.contractList;
      let debtorList = x.debtorList;
      let invoiceList = x.invoiceList;
      contractList = x.contractList.filter(
        (i) => i.contractName !== '' || i.contractId !== ''
      );
      debtorList = x.debtorList.filter((j) => j.debtor !== '');
      invoiceList = x.invoiceList.filter(
        (k) =>
          k.invoiceCode !== '' ||
          k.invoiceMoney !== '' ||
          k.invoicechangePrice !== ''
      );
      this.contractList = JSON.stringify(contractList);
      this.debtorList = JSON.stringify(debtorList);
      this.invoiceList = JSON.stringify(invoiceList);
      // this.mainForm.get('innvoiceInfo').setValue(x);
    });
  }

  /**
   *  提交
   */
  public onSubmit() {
    XnUtils.checkLoading(this);
    this.xn.api
      .post('/custom/zhongdeng/zd/modify_category_submit', {
        classify: this.mainForm.value.classify,
        invoiceList: this.invoiceList,
        contractList: this.contractList,
        debtorList: this.debtorList,
        ...this.params,
      })
      .subscribe((x) => {
        this.xn.router.navigate([
          `/console/manage/invoice-search/record/zd_modify_category`,
        ]);
      });
  }

  /**
   *  取消并返回
   */
  public onCancel() {
    this.xn.user.navigateBack();
  }
}
