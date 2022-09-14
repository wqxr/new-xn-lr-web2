/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：BusinessMatchmakerListComponent
 * @summary：金地-还款管理
 * @version: 1.0
 * **********************************************************************
 * revision             author              reason                date
 * 1.0                hucongying         金地数据对接          2020-12-08
 * **********************************************************************
 */

import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import {
  SubTabListOutputModel,
  TabListOutputModel,
  TabConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import RepaymentConfigList from './zs-gemdale-repayment';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { TableChange } from '@lr/ngx-table';
import { SearchFormComponent } from '@lr/ngx-shared';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { getTime, startOfDay, endOfDay } from 'date-fns';
import { ShowModalService } from '../../share/services/show-modal.service';
import { JdAntEditModalComponent } from '../../share/modal/ant-edit-modal.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChangeDetectorRef } from '@angular/core';
declare const $: any;

@Component({
  templateUrl: `./zs-gemdale-repayment.component.html`,
  styles: [
    `
      [nz-button] {
        margin-right: 8px;
        margin-bottom: 12px;
      }
    `,
  ],
})
export class ZsGemdaleRepaymentComponent implements OnInit {
  @ViewChild('reviewTable') reviewTable: XnTableComponent;
  @ViewChild('searchForm') searchForm: SearchFormComponent;
  public tabConfig: TabConfigModel;
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public currentTab: any; // 当前标签页
  public subDefaultValue = 'DOING'; // 默认子标签页
  public defaultValue = 'A'; // 默认激活第一个标签页
  public showFields: FormlyFieldConfig[] = []; // 搜索项
  public columns: any[]; // 表头
  // 页码配置
  pageConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  };
  public pageIndex = 1;
  public listInfo: any[] = []; // 表格数据
  public selectedItems: any[] = []; // 选中项
  public loading = true;
  public selectedReceivables = 0; // 所选交易的应收账款金额汇总
  public allReceivables = 0; // 所有交易的应收账款金额汇总
  public sortModels: { [key: string]: any } = {}; // 排序
  public bankInfo: any[] = []; // 银行信息

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private vcr: ViewContainerRef,
    private showModalService: ShowModalService,
    private router: ActivatedRoute,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.router.data.subscribe((v) => {
      this.tabConfig = RepaymentConfigList.getConfig('machineAccount');
      this.initData(this.defaultValue, true);
    });
  }

  /**
   *  标签页，加载列表信息
   * @param paramTabValue paramTabValue
   * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
   */
  public initData(paramTabValue: string, init?: boolean) {
    this.defaultValue = paramTabValue;
    this.subDefaultValue = 'DOING'; // 重置子标签默认
    // 页面配置
    const find = this.tabConfig.tabList.find(
      (tab) => tab.value === this.defaultValue
    );
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(
      (sub) => sub.value === this.subDefaultValue
    );
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.columns = this.currentSubTab.headText;
    this.showFields = this.currentSubTab.showFields;

    this.cdr.detectChanges();
    if (!init) {
      // 切换标签页面
      this.searchForm.form.reset();
      this.searchForm.resetFields(this.showFields);
      this.reviewTable.clearStatus();
    }
    this.onPage({ pageIndex: 1, pageSize: 10 }, {});
  }

  /**
   * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
   * @param searchModel  搜索项
   * @summary
   */
  public onPage(
    e?: { pageIndex: number; pageSize?: number; total?: number },
    searchModel?: { [key: string]: any }
  ) {
    this.loading = true;
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.allReceivables = 0;
    this.pageIndex = e.pageIndex || 1;
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    const params = this.buildParams(searchModel);
    this.xn.dragon.post(this.currentTab.post_url, params).subscribe(
      (x) => {
        this.loading = false;
        if (x.ret === 0) {
          this.listInfo = x.data.data;
          this.pageConfig.total = x.data.count;
          this.allReceivables = x.data.sumFinancingAmount;
        }
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * 搜索条件查询
   */
  onSearch(data: any) {
    console.log('search data :>> ', data);
    this.pageConfig.pageIndex = 1;
    this.selectedItems = [];
    this.onPage(this.pageConfig, data);
  }

  /**
   * 重置搜索项表单
   */
  onReset(searchForm: any) {
    console.log('reset :>> ', searchForm);
    this.selectedItems = [];
    this.sortModels = {};
    searchForm.form.reset();
    this.reviewTable.clearStatus();
    this.onSearch({});
  }

  /**
   * 构建列表请求参数
   * @param searchModel 搜索项
   */
  private buildParams(searchModel: { [key: string]: any }) {
    const params: any = {
      pageNo: this.pageIndex,
      pageSize: this.pageConfig.pageSize,
      jdAccountStatus: this.currentTab.params,
    };

    // 排序处理
    for (const sortKey in this.sortModels) {
      if (Object.prototype.hasOwnProperty(sortKey)) {
        params.order = [
          {
            name: RepaymentListOrderEnum[sortKey],
            asc: Number(this.sortModels[sortKey]),
          },
        ];
      }
    }

    // 搜索处理
    for (const key of Object.keys(searchModel)) {
      if (!XnUtils.isEmptys(searchModel[key], [0])) {
        if (key === 'factoringEndDate') {
          // 保理融资到期日
          params.endDateStartTime = startOfDay(searchModel[key][0]).getTime();
          params.endDateEndTime = endOfDay(searchModel[key][1]).getTime();
        } else if (key === 'jdPayTime') {
          // 打款时间
          params.jdPayStartTime = getTime(searchModel[key][0]);
          params.jdPayEndTime = getTime(searchModel[key][1]);
        } else if (key === 'jdPaybackTime') {
          // 金地还款时间
          params.jdBackStartTime = getTime(searchModel[key][0]);
          params.jdBackEndTime = getTime(searchModel[key][1]);
        } else if (key === 'isPool') {
          // 是否已入池
          params[key] = Number(searchModel[key]);
        } else {
          params[key] = searchModel[key]?.toString()?.trim();
        }
      }
    }
    return params;
  }

  /**
   * 批量操作
   * @param btn btn
   */
  private handleHeadClick(btn: any) {
    switch (btn.operate) {
      // 确认回款账号
      case 'confirm_repayNumber':
        this.confirmRepayNumber();
        break;
      // 数据导出
      case 'export_data':
        this.exportData(btn);
        break;

      default:
        break;
    }
  }

  /**
   * 确认回款账号
   */
  public async confirmRepayNumber() {
    if (!this.selectedItems.length) {
      return this.message.error('请勾选交易');
    }
    // 根据资产池id 判断所选交易是否来自相同的资产池
    const isSameCapital = this.selectedItems
      .map((x) => x.capitalPoolId)
      .every((v) => v === this.selectedItems[0].capitalPoolId);
    if (!isSameCapital) {
      return this.message.error(
        '勾选交易中存在来自不同资产池的交易,不能批量发起确认回款账号操作！'
      );
    }

    // managerAccountName: 托管行户名 managerAccountNo：托管行账号 managerBankName：managerAccountNo：托管行开户行
    const { managerAccountName, managerAccountNo, managerBankName } =
      this.selectedItems[0];
    // 托管行信息是否有效
    const hasBankInfo: boolean =
      managerAccountName && managerAccountNo && managerBankName;
    // 开户行下拉项 默认第一项为托管行信息
    const bankOptions = hasBankInfo
      ? await this.getBankInfo({
          accountName: managerAccountName,
          bankName: managerBankName,
          cardCode: managerAccountNo,
        })
      : await this.getBankInfo();
    // 融资单号列表
    const billNumberList = this.selectedItems.map((x) => x.billNumber);
    const params = {
      title: '确认回款账号',
      width: 660,
      formModalFields: [
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'billNumber',
          type: 'textarea',
          defaultValue: billNumberList.join(','),
          templateOptions: {
            label: '融资单号',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 6,
            controlSpan: 18,
            readonly: true,
            nzAutosize: {
              minRows: 2,
              maxRows: 3,
            },
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24 hcy-date-class',
          key: 'payTime',
          type: 'date-picker',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: '打款时间',
            nzShowTime: false,
            nzAllowClear: true,
            required: true,
            nzFormat: 'yyyy-MM-dd',
            labelSpan: 6,
            controlSpan: 18,
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'bankName',
          type: 'select',
          templateOptions: {
            label: '收款账户开户行',
            nzPlaceHolder: '请选择',
            autocomplete: 'off',
            labelSpan: 6,
            controlSpan: 18,
            nzAllowClear: true,
            required: true,
            options: bankOptions,
          },
          hooks: {
            onInit: (field: any) => {
              if (hasBankInfo) {
                field?.formControl?.setValue(managerBankName);
              }
            },
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'bankAccountName',
          type: 'input',
          templateOptions: {
            label: '收款账户名称',
            autocomplete: 'off',
            labelSpan: 6,
            controlSpan: 18,
            readonly: true,
            disabled: true,
          },
          hooks: {
            onInit: (field: any) => {
              if (hasBankInfo) {
                field?.formControl?.setValue(managerAccountName);
              }
              field.form.get('bankName')?.valueChanges.subscribe((val) => {
                if (val) {
                  const accountName = this.bankInfo.find(
                    (x) => x.bankName === val
                  ).accountName;
                  field?.formControl?.setValue(accountName);
                }
              });
            },
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'bankAccountNumber',
          type: 'input',
          templateOptions: {
            label: '收款账号',
            autocomplete: 'off',
            labelSpan: 6,
            controlSpan: 18,
            readonly: true,
            disabled: true,
          },
          hooks: {
            onInit: (field: any) => {
              if (hasBankInfo) {
                field?.formControl?.setValue(managerAccountNo);
              }
              field.form.get('bankName')?.valueChanges.subscribe((val) => {
                if (val) {
                  const cardCode = this.bankInfo.find(
                    (x) => x.bankName === val
                  ).cardCode;
                  field?.formControl?.setValue(cardCode);
                }
              });
            },
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'remark',
          type: 'textarea-count',
          templateOptions: {
            label: '打款备注',
            placeholder: '请输入',
            labelSpan: 6,
            controlSpan: 18,
            nzMaxCharacterCount: 200,
            maxLength: 200,
          },
        },
      ] as FormlyFieldConfig[],
    };

    this.showModalService
      .openModal(this.xn, this.vcr, JdAntEditModalComponent, params)
      .subscribe((v) => {
        if (v && v.action === 'ok') {
          const {
            payTime,
            bankAccountName,
            bankName,
            bankAccountNumber,
            remark,
          } = v.params;
          const mainFlowIdList = this.selectedItems.map((i) => i.mainFlowId); // 交易id列表
          this.xn.loading.open();
          this.xn.dragon
            .post('/sub_system/jd_system/report_payment_info', {
              mainFlowIdList,
              payTime: payTime.getTime(),
              bankAccountName,
              bankName,
              bankAccountNumber,
              remark,
            })
            .subscribe(
              (x) => {
                this.xn.loading.close();
                if (x.ret === 0) {
                  this.message.success('操作成功');
                  this.onPage(this.pageConfig, this.searchForm.model);
                }
              },
              () => {
                this.xn.loading.close();
              }
            );
        }
      });
  }

  /**
   * 获取银行账号信息
   * @param managerBankInfo 托管行信息 { accountName:收款账户开户行 , bankName: 收款账户名称 , cardCode: 收款账号 }
   */
  public getBankInfo(managerBankInfo?: {
    accountName: string;
    bankName: string;
    cardCode: string;
  }) {
    return new Promise((resolve, reject) => {
      this.xn.dragon.post('/pool/funding_channel_list', {}).subscribe((x) => {
        if (x.ret === 0) {
          this.bankInfo = x.data; // 银行信息
          if (managerBankInfo) {
            this.bankInfo.unshift(managerBankInfo);
          }
          // 开户行下拉选项
          const bankOptions = this.bankInfo.map((i) => {
            return {
              label: i.bankName,
              value: i.bankName,
            };
          });
          resolve(bankOptions);
        } else {
          reject([]);
        }
      });
    });
  }

  /**
   * 数据导出
   * @param btn btn
   */
  exportData(btn: any) {
    if (this.selectedItems.length > 10) {
      return this.message.error('一次最多支持下载10笔交易');
    }
    const params = this.buildParams(this.searchForm.model);
    delete params.pageNo;
    delete params.pageSize;
    if (this.selectedItems.length > 0) {
      const mainFlowIdList = this.selectedItems.map((v) => v.mainFlowId); // 交易id列表
      params.mainFlowIdList = mainFlowIdList;
    }
    this.xn.loading.open();
    this.xn.dragon.download(btn.post_url, params).subscribe(
      (x) => {
        this.xn.loading.close();
        this.xn.dragon.save(x._body, '金地还款数据清单.xlsx');
      },
      () => {
        this.xn.loading.close();
      }
    );
  }

  /**
   * table事件处理
   * @param e 分页参数
   * @param searchForm 搜索项
   */
  handleTableChange(e: TableChange, searchForm: { [key: string]: any }) {
    // console.log('handleTableChange', e, searchForm);
    switch (e.type) {
      case 'pageIndex':
        this.onPage(e, searchForm.model);
        break;
      case 'pageSize':
        this.onPage(e, searchForm.model);
        break;
      case 'checkbox':
        this.selectedItems = e.checkbox || [];
        this.getSelReceivables();
        break;
      case 'sort':
        this.sortModels = e?.sort?.map || {};
        this.onPage(e, searchForm.model);
        break;
    }
  }

  /**
   * 计算勾选交易的应收账款金额
   */
  getSelReceivables() {
    if (!this.selectedItems.length) {
      this.selectedReceivables = 0;
    }
    this.selectedReceivables = 0;
    this.selectedItems.forEach((item) => {
      this.selectedReceivables = Number(
        (this.selectedReceivables + item.receive).toFixed(2)
      ); // 勾选交易总额
    });
  }
}

// 排序名
enum RepaymentListOrderEnum {
  /** 交易金额 */
  receive = 1,
  /** 打款时间 */
  jdPayTime = 2,
  /** 保理融资到期日 */
  factoringEndDate = 3,
  /** 交易ID */
  mainFlowId = 4,
  /** 金地还款时间 */
  jdPaybackTime = 5,
  /** 金地还款金额 */
  jdPaybackAmount = 6,
}
