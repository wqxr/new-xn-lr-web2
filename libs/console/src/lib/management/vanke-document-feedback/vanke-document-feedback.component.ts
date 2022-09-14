/*************************************************************************
* Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\console\src\lib\management\vanke-document-feedback\vanke-document-feedback.component.ts
* @init init VankeDocumentFeedbackComponent
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2022-03-11
***************************************************************************/
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Params } from '@angular/router';
import {
  VankeCompleteReasons,
  VankeContratReasons,
  VankeInvoiceReasons,
  VankeOutputReasons,
  VankePaymentReasons
} from 'libs/shared/src/lib/config/options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

@Component({
  templateUrl: './vanke-document-feedback.component.html',
  styles: [
    `
      .page-title {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 20px;
      }
      .search-content {
        min-height: 80px;
        padding-top: 40px;
      }
      .feedback-content {
        margin-top: 15px;
      }
      nz-select {
        width:100%;
        min-width: 600px;
      }
      nz-divider {
        margin: 4px 0;
      }
      .container {
        max-width: 600px;
        display: flex;
        flex-wrap: nowrap;
        padding: 8px;
      }
      .add-item {
        flex: 0 0 auto;
        padding: 8px;
        display: block;
      }
      label {
        margin-bottom: 0px;
      }
      .feedback-form {
        margin-top: 20px;
      }
    `,
  ],
})
export class VankeDocumentFeedbackComponent implements OnInit {
  // 搜索项
  searchFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-16 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'mainFlowId',
      type: 'input',
      templateOptions: {
        label: '交易id',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
  ];
  // searchModel
  searchModel = {} as any;
  form = new FormGroup({});
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  // formModel
  formFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'contract',
      type: 'select',
      templateOptions: {
        label: '合同退回原因',
        labelSpan: 6,
        controlSpan: 14,
        nzPlaceHolder: '请选择原因',
        required: false,
        multiple: true,
        nzShowSearch: true,
        nzAllowClear: true,
        options: VankeContratReasons,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'payment',
      type: 'select',
      templateOptions: {
        label: '付款申请退回原因',
        labelSpan: 6,
        controlSpan: 14,
        nzPlaceHolder: '请选择原因',
        required: false,
        multiple: true,
        nzShowSearch: true,
        nzAllowClear: true,
        options: VankePaymentReasons,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'output',
      type: 'select',
      templateOptions: {
        label: '产值确认单退回原因',
        labelSpan: 6,
        controlSpan: 14,
        nzPlaceHolder: '请选择原因',
        required: false,
        multiple: true,
        nzShowSearch: true,
        nzAllowClear: true,
        options: VankeOutputReasons,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'complete',
      type: 'select',
      templateOptions: {
        label: '竣工协议退回原因',
        labelSpan: 6,
        controlSpan: 14,
        nzPlaceHolder: '请选择原因',
        required: false,
        multiple: true,
        nzShowSearch: true,
        nzAllowClear: true,
        options: VankeCompleteReasons,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'invoiceList',
      type: 'vanke-invoice-feedback',
      templateOptions: {
        label: '发票退回原因',
        labelSpan: 6,
        controlSpan: 14,
        required: false,
        options: VankeInvoiceReasons,
      },
    },
  ];
  // 万科反馈信息
  feedbackData = {} as any;
  showFeedback = false;
  mainFlowId = '';

  constructor(
    private xn: XnService,
    private msg: NzMessageService,
    private router: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.formModel = {};
    this.router.queryParams.subscribe((params: Params) => {
      if (params?.mainFlowId) {
        this.mainFlowId = params.mainFlowId;
        this.searchModel = {
          mainFlowId: this.mainFlowId
        };
        this.onSearch();
      }
    });
  }

  /**
   * 获取万科反馈信息
   * @param mainFlowId 交易id
   */
  fetchFeedbackData(mainFlowId: string) {
    this.showFeedback = false;
    this.xn.loading.open();
    this.xn.dragon.post2('/sub_system/vanke_feedback/getFeedbackData', { mainFlowId })
      .subscribe({
        next: (res: any) => {
          if (res.ret === RetCodeEnum.OK) {
            this.xn.loading.close();
            this.showFeedback = true;
            this.mainFlowId = mainFlowId;
            this.feedbackData = res.data;
            const {
              contract,
              payment,
              output,
              complete,
              invoiceList
            } = res.data;
            this.formModel = {
              contract: contract ? JSON.parse(contract.reason) : undefined,
              payment: payment ? JSON.parse(payment.reason) : undefined,
              output: output ? JSON.parse(output.reason) : undefined,
              complete: complete ? JSON.parse(complete.reason) : undefined,
              invoiceList
            };
          } else {
            this.clearStatus();
          }
        },
        error: () => {
          this.clearStatus();
          this.xn.loading.close();
        }
      })
  }

  /**
   * 搜索条件查询
   */
  onSearch() {
    let { mainFlowId } = this.searchModel;
    if (!mainFlowId) {
      return this.msg.warning('请输入需要查询的交易id');
    }
    mainFlowId = mainFlowId.replace(/\n/g, '').replace(/\s/g, '');
    if (mainFlowId) {
      this.fetchFeedbackData(mainFlowId);
    }
  }

  /**
   * 重置搜索项表单
   */
  onReset() {
    this.clearStatus();
  }

  /**
   * 提交
   */
  submitForm() {
    const params: any = {
      mainFlowId: this.mainFlowId
    };
    const formValue = XnUtils.deepClone(this.formModel);
    Object.keys(formValue).forEach((key: string) => {
      if (key === 'invoiceList') {
        // 发票
        params.invoiceList = formValue[key] ? formValue[key] : undefined;
      } else {
        params[key] =
        XnUtils.isEmptys(formValue[key]) ? undefined : { reason: JSON.stringify(formValue[key]) };
      }
    });
    this.xn.loading.open();
    this.xn.dragon.post2('/sub_system/vanke_feedback/setFeedbackData', params)
      .subscribe({
        next: (res: any) => {
          this.xn.loading.close();
          if (res.ret === RetCodeEnum.OK) {
            this.msg.success('提交成功！');
            if (window.history.length > 1) {
              this.clearStatus();
            } else {
              setTimeout(() => {
                window.close();
              }, 1500);
            }
          }
        },
        error: () => {
          this.xn.loading.close();
        }
      })
  }

  /**
   * 清空数据
   */
  clearStatus() {
    this.searchModel = {} as any;
    this.mainFlowId = '';
    this.showFeedback = false;
  }

}
