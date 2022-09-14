/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\record-dragon\record-gj.component.ts
 * @summary：record-gj.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import {
  EditNewVankeModalComponent
} from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-new-vanke-modal.component';
import {
  SingleListParamInputModel,
  SingleSearchListModalComponent
} from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import {
  GjChannelOptions, CompanyNameOptions,
  RecordStatusOptions
} from '../../../../../../shared/src/lib/config/options';
import { Channel, CompanyName, FlowId, RecordStatus } from '../../../../../../shared/src/lib/config/enum';
import { DEFAULT_DATE_TIME_OPTIONS } from '../../../../../../shared/src/lib/config/constants';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { endOfDay, startOfDay } from 'date-fns';
import { IPageConfig } from '../../interfaces';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'lib-record-gj',
  templateUrl: './record-gj.component.html',
  styleUrls: ['./record-gj.component.css']
})
export class GjRecordComponent implements OnInit {
  /** 流程ID */
  flowId = FlowId.GjFinancingPre;
  /** 列表数据 */
  data: any[] = [];
  /** 页码配置 */
  pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0, total: 0};

  searchModel: any = {
    createTime: this.defaultCreateTime(),
  };
  showFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'recordId',
      type: 'input',
      templateOptions: {
        label: '流程记录ID',
        placeholder: '请输入',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'createTime',
      type: 'date-range-picker',
      templateOptions: {
        ...DEFAULT_DATE_TIME_OPTIONS,
        nzFormat: 'yyyy-MM-dd',
        nzShowTime: false,
        label: '创建时间',
        placeholder: '请输入',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'status',
      type: 'select',
      templateOptions: {
        label: '状态',
        nzPlaceHolder: '请选择',
        labelSpan: 6,
        controlSpan: 18,
        options: RecordStatusOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'type',
      type: 'select',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: '渠道',
        nzPlaceHolder: '请选择',
        labelSpan: 6,
        controlSpan: 18,
        options: GjChannelOptions,
      },
    },
  ];

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private msg: NzMessageService,
  ) {}

  ngOnInit() {
    this.onPage();
  }

  defaultCreateTime() {
    return [
      startOfDay(new Date().setFullYear(new Date().getFullYear() - 1)),
      endOfDay(new Date())
    ];
  }

  /** 搜索条件查询 */
  onSearch(data: any) {
    this.searchModel = data;
    this.pageConfig.page = 1;
    this.pageConfig.first = 0;
    this.onPage(this.pageConfig);
  }

  /** 重置搜索项表单 */
  onReset() {
    this.onSearch({
      createTime: this.defaultCreateTime()
    });
  }

  /** 构建查询参数 */
  private buildParams() {
    // 分页处理
    const params: any = {
      /** 真实含义是查询数据的起始索引 */
      pageNo: this.pageConfig.first,
      pageSize: this.pageConfig.pageSize,
      headquarters: CompanyName.CDR,
    };
    // 搜索处理
    for (const key of Object.keys(this.searchModel)) {
      if (!XnUtils.isEmpty(this.searchModel[key])) {
        if (key === 'createTime') {
          const createTime = this.searchModel[key] as Date[];
          params.startTime = createTime[0].getTime().toString();
          params.endTime = createTime[1].getTime().toString();
        } else {
          params[key] = this.searchModel[key];
        }
      }
    }

    console.log('提单查询 - buildParams', params);
    return params;
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}) {
    this.pageConfig = Object.assign({}, this.pageConfig, pageConfig);
    const params = this.buildParams();

    this.xn.loading.open();
    this.xn.api.dragon.post('/pay_plan/list', params)
      .subscribe({
        next: x => {
          if (x.data && x.data.data) {
            this.data = x.data.data || [];
            this.pageConfig.total = x.data.count;
          }
          this.xn.loading.close();
        },
        error: err => {
          this.xn.loading.close();
          this.msg.error(err.msg || '列表查询失败');
        },
      });
  }

  doProcess(record: any) {
    // 流程已完成 或者账号没有权限查看流程
    if ((record.status !== RecordStatus.Progress && record.status !== RecordStatus.Draft)
      || !XnUtils.getRoleExist(record.nowRoleId, this.xn.user.roles, record.proxyType)) {
      this.xn.router.navigate([`/abs-gj/record/${this.flowId}/view/${record.recordId}`]);
    } else {
      this.xn.router.navigate([`/abs-gj/record/${this.flowId}/edit/${record.recordId}`]);
    }
  }

  viewProcess(record: any) {
    if ((record.status !== RecordStatus.Progress && record.status !== RecordStatus.Draft)
      || this.xn.user.roles.indexOf(record.nowRoleId) < 0) {
      this.xn.router.navigate([`/abs-gj/record/${this.flowId}/view/${record.recordId}`]);
    } else {
      this.xn.router.navigate([`/abs-gj/record/${this.flowId}/edit/${record.recordId}`]);
    }
  }

  newProcess() {
    const params = {
      title: '发起交易申请',
      checker: [
        {
          title: '总部公司', checkerId: 'headquarters', type: 'select', required: true,
          selectOptions: CompanyNameOptions, value: CompanyName.CDR, options: {readonly: true}
        },
        {
          title: '渠道', checkerId: 'productType', type: 'select', required: true,
          selectOptions: GjChannelOptions,
          value: Channel.ABS,
          options: {readonly: true}
        },
        {
          title: '合同组', checkerId: 'fitProject', type: 'contract-select-gj', required: 1,
        },
      ],
      info: { flowId: FlowId.GjFinancingPre, headquarters: CompanyName.CDR}
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditNewVankeModalComponent, params)
      .subscribe(x => {
        if (!!x) {
          this.xn.router.navigate([`/abs-gj/record/new/${this.flowId}`],
            {
              queryParams: {
                productType: Channel.ABS,
                selectBank: '0', // 渠道固定 ABS，设置为固定值 0
                fitProject: x.fitProject,
                headquarters: CompanyName.CDR,
              }
            });
        }
      });
  }

  viewZdList(item) {
    const params: SingleListParamInputModel = {
      title: '查看登记编码/修改码',
      get_url: '/pay_plan/zd_code_list',
      get_type: 'dragon',
      multiple: null,
      heads: [
        {label: '交易ID', value: 'mainFlowId', type: 'mainFlowId'},
        {label: '收款单位', value: 'debtUnit', type: 'text'},
        {label: '申请付款单位', value: 'projectCompany', type: 'text'},
        {label: '应收账款金额', value: 'receive', type: 'text'},
        {label: '登记编码', value: 'registerNum', type: 'text'},
        {label: '修改码', value: 'modifiedCode', type: 'text'},
      ],
      searches: [],
      key: 'mainFlowId',
      data: [],
      total: 0,
      inputParam: {recordId: item.recordId},
      options: {paramsType: 1},
      rightButtons: [{label: '确定', value: 'submit'}]
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params)
      .subscribe(() => {});
  }
}
