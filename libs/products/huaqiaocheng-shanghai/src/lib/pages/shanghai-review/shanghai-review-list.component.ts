import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { Column, ColumnButton, TableChange, TableData } from '@lr/ngx-table';
import { format, getTime, startOfDay, endOfDay } from 'date-fns';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { SearchFormComponent } from '@lr/ngx-shared';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ButtonConfigs, ButtonGroup } from '../../logic/table-button.interface';
import ReviewListConfig from '../../logic/review-list';
import { FileAdapterService } from 'libs/shared/src/lib/services/file-adapter.service';
import { SelectOptions, EnumShBankExtStatus, EnumShBankTradeStatus, extStatusToStatus, HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import * as _ from 'lodash';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { Router } from '@angular/router';
import { SelectItemsModel } from 'libs/shared/src/lib/config/checkers';
import { MFileViewerService } from 'libs/products/bank-shanghai/src/lib/share/components/mfile-viewer';
import { AntResultModalComponent } from 'libs/products/bank-shanghai/src/lib/share/components/result-modal/ant-result-modal.component';
import { AntEditModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/ant-edit-modal.component';
import { ShangHaiMfilesViewModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/mfiles-view-modal.component';
import { ShowModalService } from 'libs/products/bank-shanghai/src/lib/share/services/show-modal.service';
import { IsProxyDef } from 'libs/shared/src/lib/config/enum';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SoCustomSearch } from '../../logic/public-enum';

@Component({
  selector: 'oct-shanghai-review-list',
  templateUrl: './shanghai-review-list.component.html',
  styleUrls: ['./shanghai-review-list.component.css']
})
export class OctShanghaiReviewListComponent implements OnInit {
  @ViewChild('searchForm') searchForm: SearchFormComponent;
  @ViewChild('reviewTable') reviewTable: XnTableComponent;
  defaultFields: FormlyFieldConfig[] = ReviewListConfig.getConfig('defaultFields');
  showFields: FormlyFieldConfig[] = [];  // ...this.defaultFields

  defaultColumns: Column[] = [
    ...ReviewListConfig.getConfig('defaultColumns'),
    {  // 55
      title: '操作', index: 'rowBtn', width: 60, fixed: 'right', buttons: [
        {
          text: '审核', type: 'link', iif: (item: TableData, btn: ColumnButton, column: Column) =>
            [EnumShBankTradeStatus.bank_verify].includes(Number(item.tradeStatus)),
          iifBehavior: 'hide', // disabled
          click: (e: any) => {
            console.log('审核 click', e);
            this.verify(e);
          },
        },
        {
          text: '查看', type: 'link', iif: (item: TableData, btn: ColumnButton, column: Column) =>
            [EnumShBankTradeStatus.bank_finish].includes(Number(item.tradeStatus)),
          iifBehavior: 'hide',
          click: (e: any) => {
            console.log('查看 click', e);
            this.viewRecord(e);
          },
        }
      ],
    },
  ];
  columns: Column[] = [...this.defaultColumns];

  // 表格头部按钮配置
  tableHeadBtn: ButtonConfigs = ReviewListConfig.getConfig('tableHeadBtn');
  get tableHeadBtnConfig() {
    return Object.keys(this.tableHeadBtn) || [];
  }
  // 自定义搜索项 表头
  customSearchFields: any[] = [];
  customTableColumns: any[] = [];
  // 表格数据
  data = [];
  pageConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };
  selectedList: any[] = [];

  loading = true;
  searchModels: { [key: string]: any } = {};
  sortModels: { [key: string]: any } = {};

  constructor(
    private fileAdapter: FileAdapterService,
    private xn: XnService,
    private vcr: ViewContainerRef,
    private router: Router,
    private showModalService: ShowModalService,
    private msg: NzMessageService,
    private mFileViewerService: MFileViewerService) { }

  ngOnInit(): void {
    this.getCustomSearchList({});
  }


  /**
   * 获取自定义搜索项、表头 [字段名1, ....]
   * @searchModel 搜索项
   */
  getCustomSearchList(searchModel: { [key: string]: any }) {
    const params = {
      statusList: SoCustomSearch.reviewList
    };
    this.xn.dragon.postMapCatch('/trade/get_column', params).subscribe({
      next: (res) => {
        if (res && res.ret !== 0) {
          this.showPostError(res);
        } else if (res && res.ret === 0 && res.data) {
          const customSearches = res.data.data.find((x: any) => x.status.toString() === '77');
          const customTableHeads = res.data.data.find((x: any) => x.status.toString() === '78');
          const searchesArr = this.customMatch(customSearches, 'key', 'defaultFields') as FormlyFieldConfig[];
          const tableHeadsArr = this.customMatch(customTableHeads, 'index', 'columns') as Column[];
          this.customSearchFields = ReviewListConfig.setConfigValue(searchesArr.map(x => x.key) as string[], 'key', 'defaultFields', []);
          this.customTableColumns = ReviewListConfig.setConfigValue(tableHeadsArr.map(x => x.index) as string[], 'index', 'defaultColumns', ['id', 'no']);
          // 重置搜索项 展开搜索项
          this.searchForm.resetFields(searchesArr);
          this.searchForm.toggleCollapse();
          // this.columns = [...tableHeadsArr];
          this.columns = this.defaultColumns.filter((x: any) =>
            [...tableHeadsArr.map((y: any) => y.index) as string[], 'rowBtn', ...['id', 'no']].includes(x.index));
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.onPage({ pageIndex: 1, pageSize: 10 }, searchModel);
      }
    });
  }

  /**
   * 处理自定义搜索项和表头配置数据
   * @param customRes 接口返回自定义字段列
   * @param fieldsKey 配置源数据
   * @param key 配置项标识
   */
  customMatch(customRes: { column: string | string[], lockCount?: string | number, status?: string | number }, fieldsKey: string,
    key: string): Column[] | FormlyFieldConfig[] {
    const defaultArr = this[key] || [];
    let customArr = [];
    if (customRes && customRes.column) {
      const columnArr = XnUtils.parseObject(customRes.column, []);
      columnArr.map((x: any) => {
        const targetObj: any = defaultArr.find((y: any) => x === y[fieldsKey]);
        if (targetObj) {
          customArr.push(targetObj);
        }
      });
    } else {
      customArr = [...defaultArr];
    }
    return customArr;
  }

  /**
   * 获取接口数据
   * @param pageConfig pageIndex 页码 pageSize 每页数量 total 数据总数
   * @searchModel 搜索项
   */
  onPage(pageConfig: { pageIndex: number, pageSize: number, total?: number }, searchModel: { [key: string]: any }) {
    this.pageConfig = Object.assign({}, this.pageConfig, pageConfig);
    this.searchModels = searchModel;
    const params = this.buildParams(searchModel);
    this.xn.dragon.postMapCatch('/so_bank_trade/list', params).subscribe({
      next: (res) => {
        if (res && res.ret !== 0) {
          this.showPostError(res);
        } else if (res && res.ret === 0 && res.data) {
          this.data = res.data.data || [];
          this.pageConfig.total = res.data.count;
        }
        this.selectedList = [];
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /**
   * 自定义搜索项
   */
  searchFormResetFields(searchForm: any, fields: FormlyFieldConfig[]) {
    const column = fields.map((x: any) => x.key);
    // 后台存储自定义搜索项
    const params = {
      column: JSON.stringify(column),
      lockCount: 0,
      status: 77,
    };
    this.xn.dragon.postMapCatch('/trade/set_column', params).subscribe({
      next: (res) => {
        if (res && res.ret !== 0) {
          this.showPostError(res);
        } else if (res && res.ret === 0) {
          this.customSearchFields = ReviewListConfig.setConfigValue(fields.map(x => x.key) as string[], 'key', 'defaultFields', []);
          searchForm.resetFields(fields);
          searchForm.form.reset();
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        // this.getCustomSearchList(searchForm.model);
        this.onPage({ pageIndex: 1, pageSize: 10 }, {});
      }
    });
  }

  /**
   * @description: 自定义表头 选择,序号,操作列除外
   * @param {Column} columns
   * @return {*}
   */
  tableResetColumns(columns: Column[]) {
    const column = columns.map((x: any) => x.index);
    // 后台存储自定义表头
    const params = {
      column: JSON.stringify(column.filter((x: string) => !['id', 'no'].includes(x))),
      lockCount: 0,
      status: 78,
    };
    this.xn.dragon.postMapCatch('/trade/set_column', params).subscribe({
      next: (res) => {
        if (res && res.ret !== 0) {
          this.showPostError(res);
        } else if (res && res.ret === 0) {
          this.customTableColumns = ReviewListConfig.setConfigValue(columns.map((y: any) => y.index) as string[], 'index', 'defaultColumns', ['id', 'no']);
          this.columns = this.defaultColumns.filter((x: any) => [...column, 'rowBtn', ...['id', 'no']].includes(x.index));
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
      }
    });
  }

  /**
   * 表格头部按钮事件处理
   * @param btn 按钮配置
   */
  handleHeadClick(btn: ButtonGroup) {
    if (btn.btnKey === 'export_manifest') {
      if(!this.data.length) {
        this.msg.error('没有要导出的数据！');
        return ;
      }
      const mainIds = this.selectedList.map((x: any) => x.mainFlowId);
      const options = [
        { label: '当前列表所有交易', value: 'all' },
        { label: '勾选交易', value: 'selected' },
      ];
      const params = {
        title: '导出清单',
        nzWrapClassName: 'vertical-center-modal',
        showTipIcon: false,
        layout: 'horizontal',
        width: 450,
        formModalFields: [
          {
            className: 'ant-col ant-col-md-24 ant-col-sm-24',
            wrappers: ['form-field-horizontal'],
            key: 'exportRange',
            type: 'radio',
            templateOptions: {
              label: '导出清单范围',
              required: true,
              options: !!mainIds.length ? options : [options[0]],
              labelSpan: 8,
              controlSpan: 16,
            },
          },
        ],
      };
      this.showModalService.openModal(this.xn, this.vcr, AntEditModalComponent, params).subscribe(v => {
        if (v && v.action === 'ok' && v.params) {
          // 导出清单
          const param = {
            headquarters: HeadquartersTypeEnum[10],
            isProxy: IsProxyDef.OCT_SH,
            status: 3,
            mainFlowIdList: v.params?.exportRange === 'selected' ? mainIds : [],
            type: v.params.exportRange,
          };
          const paramsTotal = Object.assign({}, this.buildParams(this.searchModels), param);
          this.xn.dragon.download(btn.postUrl, paramsTotal).subscribe({
            next: (res: any) => {
              if (!!res && !!res.ret && res.ret !== 0) {
                this.showPostError(res);
              } else if (!!res && !!res._body){
                this.xn.api.save(res._body, `上海银行复核列表清单.xlsx`);
              }
            },
            error: (err: any) => {
              console.error('err', err);
            },
            complete: () => {
            }
          });
        }
      });
    } else if (btn.click) {
      btn.click(btn);
    }
  }

  /**
   * 搜索条件查询
   */
  onSearch(data: any) {
    this.pageConfig.pageIndex = 1;
    this.selectedList = [];
    this.onPage(this.pageConfig, data);
  }

  /**
   * 重置搜索项表单
   */
  onReset(searchForm: any) {
    console.log('reset :>> ', searchForm);
    this.selectedList = [];
    this.sortModels = {};
    searchForm.form.reset();
    this.reviewTable.clearStatus();
    this.onSearch({});
  }

  /**
   * 构建参数
   */
  private buildParams(searchModel: { [key: string]: any }) {
    // 分页处理
    const params: any = {
      pageNo: this.pageConfig.pageIndex,
      pageSize: this.pageConfig.pageSize,
    };
    // 排序处理
    for (const sortKey of Object.keys(this.sortModels)) {
      params.order = [
        { name: SortFieldsEnum[XnUtils.string2FirstUpper(sortKey)], asc: Number(this.sortModels[sortKey]) }
      ];
    }

    // 搜索处理
    for (const key of Object.keys(searchModel)) {
      if (!XnUtils.isEmptys(searchModel[key], [0])) {
        if (key === 'factoringStartDate') {
          // params.valueDateBegin = format(searchModel[key][0], 'yyyy-MM-dd');
          // params.valueDateEnd = format(searchModel[key][1], 'yyyy-MM-dd');
          params.valueDateBegin = startOfDay(searchModel[key][0]).getTime();
          params.valueDateEnd = endOfDay(searchModel[key][1]).getTime();
        } else if (key === 'factoringEndDate') {
          params.factoringEndDateBegin = startOfDay(searchModel[key][0]).getTime();
          params.factoringEndDateEnd = endOfDay(searchModel[key][1]).getTime();
        } else if (key === 'ccsAduitDatetime') {
          // params.ccsAduitDatetimeBegin = format(searchModel[key][0], 'yyyy-MM-dd HH:mm:ss');
          // params.ccsAduitDatetimeEnd = format(searchModel[key][1], 'yyyy-MM-dd HH:mm:ss');
          params.ccsAduitDatetimeBegin = getTime(searchModel[key][0]);
          params.ccsAduitDatetimeEnd = getTime(searchModel[key][1]);
        } else if (key === 'ccsApproveTime') {
          params.ccsApproveTimeBegin = getTime(searchModel[key][0]);
          params.ccsApproveTimeEnd = getTime(searchModel[key][1]);
        } else if (key === 'ccsZauditDate') {
          params.ccsZauditDateBegin = getTime(searchModel[key][0]);
          params.ccsZauditDateEnd = getTime(searchModel[key][1]);
        } else if (['reviewStatus', 'isFactoringEndDate'].includes(key)) {
          params[key] = Number(searchModel[key]);
        } else if (key === 'tradeStatus') {
          // 交易状态
          const tradeStatusKey = searchModel[key];
          const mainStatus = EnumShBankTradeStatus[tradeStatusKey];
          const subStatus = EnumShBankExtStatus[tradeStatusKey];
          if (!!mainStatus){
            params['tradeStatus'] = Number(mainStatus);
            params['statusEx'] = SelectOptions.get('tradeStatus_sh').find((x: any) => x.value === tradeStatusKey)?.extValue || [];
          }
          if (!XnUtils.isEmptys(subStatus, [0])){
            const extToStatus = extStatusToStatus[tradeStatusKey];
            params['tradeStatus'] = Number(extToStatus);
            params['statusEx'] = SelectOptions.get('tradeStatus_sh').find((x: any) => x.value === tradeStatusKey)?.extValue || [];
          }
        } else {
          params[key] = searchModel[key]?.toString()?.trim();
        }
      }
    }
    return params;
  }

  /**
   * table事件处理
   * @param e 分页参数
   * @param searchForm 搜索项
   */
  handleTableChange(e: TableChange, searchForm: { [key: string]: any }) {
    switch (e.type) {
      case 'pageIndex':
      case 'pageSize':
        this.onPage(e, searchForm.model);
        break;
      case 'checkbox':
        this.selectedList = e.checkbox || [];
        break;
      case 'sort':
        this.sortModels = e.sort.map || {};
        this.onPage(e, searchForm.model);
        break;
      default:
        break;
    }
  }

  // 查看文件-图片、pdf
  AntViewFiles(files: any) {
    // console.log('viewFiles-----------', files);
    const filesArrs = XnUtils.parseObject(files, []);
    const filesArr = filesArrs.map((x: any) => {
      return {
        ...x,
        url: this.fileAdapter.XnFilesView(x, 'dragon')
      };
    });
    const param = {
      nzTitle: '文件查看',
      nzWidth: 1100,
      nzFooter: true,
      nzMaskClosable: false,
      nzClosable: true,
      filesList: {
        files: !!filesArr.length ? filesArr : [{ fileId: '', fileName: '', filePath: '', url: '' }],
        showTools: true,
        width: '100%'
      },
      buttons: {
        left: [],
        right: [
          { label: '关闭', btnKey: 'cancel', type: 'normal' }
        ]
      }
    };
    this.mFileViewerService.openModal(param).subscribe((x: any) => { });
  }

  /**
   * @description: 审核
   * @param {any} row
   * @return {*}
   */
  verify(row: any) {
    if (!row.recordId){
      this.showPostError({ret: -1, msg: '参数错误，recordId不能为空'});
    } else {
      this.xn.router.navigate(['/oct-shanghai/record/bank-review'], {
        queryParams: {
          recordId: row.recordId
        }
      });
    }
  }

  /**
   * @description: 查看处理
   * @param {any} row
   * @return {*}
   */
  viewRecord(row: any) {
    this.xn.router.navigate(['/oct-shanghai/record/bank-view'], {
      queryParams: {
        flowId: "so_bank_verify",
        mainFlowId: row.mainFlowId,
        recordId: row.shBankVerifyRecordId,
      }
    });
  }

  /**
   *  查看文件信息
   * @param paramFile
   */
  public viewFiles(paramFile) {
    // 此处根据实际情况修改
    paramFile.isAvenger = false;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiMfilesViewModalComponent, [paramFile]).subscribe();
  }

  showPostError(json: { ret: number, msg: string }) {
    const param = {
      nzTitle: '',
      nzWidth: 480,
      nzFooter: true,
      nzMaskClosable: true,
      nzClosable: true,
      message: {
        nzType: 'close-circle',
        nzColor: '#ff4d4f',
        nzTitle: '错误',
        nzContent: `错误码[${json.ret}]，${json.msg}`,
      },
      buttons: {
        left: [],
        right: [
          { label: '确定', btnKey: 'ok', type: 'normal' }
        ]
      }
    };
    this.showModalService.openModal(this.xn, this.vcr, AntResultModalComponent, param).subscribe((x: any) => {
      if ([99902, 20001].includes(json.ret)) {
        // 用户没有登录，跳转到登录界面
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   *  上海银行状态--当前交易状态匹配
   * @param paramsCurrentStep
   * @param paramsKey
   */
  formatMainFlowStatus(tradeStatus: number, statusEx: number = 0): string {
    let targetMainStatus = SelectOptions.get('tradeStatus_sh').find((x: SelectItemsModel) => x.value === EnumShBankTradeStatus[Number(tradeStatus)]);
    let targetExtStatus = SelectOptions.get('tradeStatus_sh').find((x: SelectItemsModel) => (x.extValue as number[]).includes(Number(statusEx)));
    let statusLabel = !!targetMainStatus ? targetMainStatus?.label : !!targetExtStatus ? targetExtStatus?.label : '';
    return statusLabel;
  }

  /**
   *  上海银行审核状态--根据当前交易状态匹配
   * @param paramsCurrentStep
   * @param paramsKey
   */
  formatShFlowStatus(tradeStatus: number, statusEx: number = 0): string {
    const mainStatus = EnumShBankTradeStatus[Number(tradeStatus)];
    const subStatus = EnumShBankExtStatus[Number(statusEx)];
    if (!XnUtils.isEmptys(mainStatus)) {
      if ([EnumShBankTradeStatus.bank_verify].includes(Number(tradeStatus))) {
        return ReviewStatus.WaitReview;
      } else if ([EnumShBankTradeStatus.bank_finish].includes(Number(tradeStatus))) {
        return ReviewStatus.Reviewed;
      } else if ([EnumShBankTradeStatus.chargeback].includes(Number(tradeStatus))) {
        return ReviewStatus.ReturnBack;
      }
    }
    let statusStr = '';
    if (!XnUtils.isEmptys(subStatus) && !XnUtils.isEmptys(statusEx)) {
      if (reviewStatusArr.includes(Number(statusEx))) {
        statusStr = ReviewStatus.Reviewed;
      } else if ([EnumShBankExtStatus.withdrawaled].includes(Number(statusEx))) {
        statusStr = ReviewStatus.WithDraw;
      }
    }
    return statusStr;
  }

}

enum ReviewStatus {
  WaitReview = '待复核',
  Reviewed = '已复核',
  WithDraw = '已提现',
  ReturnBack = '已退单',
}

enum SortFieldsEnum {
  Receive = 1,
  ChangePrice = 2,
  ServiceRate = 3,
  DiscountRate = 4,
  PayConfirmId = 5,
  FactoringStartDate = 6,
  FactoringEndDate = 7
}

const reviewStatusArr = [
  EnumShBankExtStatus.none,
  /** 发起融资申请 bank_finish */
  EnumShBankExtStatus.financing_apply,
  /** 发起融资申请成功 bank_finish */
  EnumShBankExtStatus.financing_apply_success,
  /** 发起融资申请失败 bank_finish */
  EnumShBankExtStatus.financing_apply_fail,
  /** 发起融资申请超时 bank_finish */
  EnumShBankExtStatus.financing_apply_timeout,

  /** 融资申请状态查询 bank_finish */
  EnumShBankExtStatus.financing_apply_status_query,
  /** 融资申请成功 bank_finish */
  EnumShBankExtStatus.financing_apply_status_success,
  /** 融资申请失败 bank_finish */
  EnumShBankExtStatus.financing_apply_status_fail,
  /** 融资申请超时 bank_finish */
  EnumShBankExtStatus.financing_apply_status_timeout,

  /** 应收账款导入 bank_finish */
  EnumShBankExtStatus.receive_import,
  /** 应收账款导入成功 bank_finish */
  EnumShBankExtStatus.receive_import_success,
  /** 应收账款导入失败 bank_finish */
  EnumShBankExtStatus.receive_import_fail,
  /** 应收账款导入超时 bank_finish */
  EnumShBankExtStatus.receive_import_timeout,
  /** 发票核验查询 bank_finish */
  EnumShBankExtStatus.invoice_query,
  /** 发票核验查询成功 bank_finish */
  EnumShBankExtStatus.invoice_query_success,
  /** 发票核验查询失败 bank_finish */
  EnumShBankExtStatus.invoice_query_fail,
  /** 发票核验查询超时 bank_finish */
  EnumShBankExtStatus.invoice_query_timeout,

  /** 业务资料文件推送通知 bank_finish */
  EnumShBankExtStatus.business_file_push_notice,
  /** 业务资料文件推送通知成功 bank_finish */
  EnumShBankExtStatus.business_file_push_notice_success,
  /** 业务资料文件推送通知失败 bank_finish */
  EnumShBankExtStatus.business_file_push_notice_fail,
  /** 业务资料文件推送通知超时 bank_finish */
  EnumShBankExtStatus.business_file_push_notice_timeout,

  /** 应收账款转让状态查询 bank_finish */
  EnumShBankExtStatus.receivable_transfer,
  /** 应收账款转让成功 bank_finish */
  EnumShBankExtStatus.receivable_transfer_success,
  /** 应收账款转让失败 bank_finish */
  EnumShBankExtStatus.receivable_transfer_fail,
  /** 应收账款转让超时 bank_finish */
  EnumShBankExtStatus.receivable_transfer_timeout,

  /** 生成融资协议合同 bank_finish */
  EnumShBankExtStatus.generate_financing_contract,
  /** 生成融资协议合同成功 bank_finish */
  EnumShBankExtStatus.generate_financing_contract_success,
  /** 生成融资协议合同失败 bank_finish */
  EnumShBankExtStatus.generate_financing_contract_fail,
  /** 生成融资协议合同超时 bank_finish */
  EnumShBankExtStatus.generate_financing_contract_timeout,

  /** 供应商在普惠签署融资协议合同 bank_finish */
  EnumShBankExtStatus.sign_financing_contract,
  /** 供应商在普惠签署融资协议合同成功 bank_finish */
  EnumShBankExtStatus.sign_financing_contract_success,
  /** 供应商在普惠签署融资协议合同失败 bank_finish */
  EnumShBankExtStatus.sign_financing_contract_fail,
  /** 供应商在普惠签署融资协议合同超时 bank_finish */
  EnumShBankExtStatus.sign_financing_contract_timeout,

  /** 待补充信息 */
  EnumShBankExtStatus.input_contract_info,

  /** 供应商在平台签署服务协议 bank_finish */
  EnumShBankExtStatus.sign_service_agreement,

  /** 平台签署服务协议 待签署 bank_finish */
  EnumShBankExtStatus.platform_sign_service_agreement,

  /** 代扣协议文件推送通知 bank_finish */
  EnumShBankExtStatus.service_agreemen_push_notice,
  /** 代扣协议文件推送通知成功 bank_finish */
  EnumShBankExtStatus.service_agreemen_push_notice_success,
  /** 代扣协议文件推送通知失败 bank_finish */
  EnumShBankExtStatus.service_agreemen_push_notice_fail,
  /** 代扣协议文件推送通知超时 bank_finish */
  EnumShBankExtStatus.service_agreemen_push_notice_timeout,

  /** 发起放款申请 bank_finish */
  EnumShBankExtStatus.loan_apply,
  /** 发起放款申请成功 bank_finish */
  EnumShBankExtStatus.loan_apply_success,
  /** 发起放款申请失败 bank_finish */
  EnumShBankExtStatus.loan_apply_fail,
  /** 发起放款申请超时 bank_finish */
  EnumShBankExtStatus.loan_apply_timeout,

  /** 放款申请状态 bank_finish */
  EnumShBankExtStatus.loan_apply_result_query,
  /** 放款申请状态--成功 bank_finish */
  EnumShBankExtStatus.loan_apply_result_success,
  /** 放款申请状态--失败 bank_finish */
  EnumShBankExtStatus.loan_apply_result_fail,
  /** 放款申请状态--超时 bank_finish */
  EnumShBankExtStatus.loan_apply_result_timeout,

  /** 代扣申请 bank_finish */
  EnumShBankExtStatus.withhold_apply,
  /** 代扣申请成功 bank_finish */
  EnumShBankExtStatus.withhold_apply_success,
  /** 代扣申请失败 bank_finish */
  EnumShBankExtStatus.withhold_apply_fail,
  /** 代扣申请超时 bank_finish */
  EnumShBankExtStatus.withhold_apply_timeout,

  /** 待提现 bank_finish */
  EnumShBankExtStatus.withdrawal,

  /** 已提现 bank_finish */
  EnumShBankExtStatus.withdrawaled,
];
