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
      title: '??????', index: 'rowBtn', width: 60, fixed: 'right', buttons: [
        {
          text: '??????', type: 'link', iif: (item: TableData, btn: ColumnButton, column: Column) =>
            [EnumShBankTradeStatus.bank_verify].includes(Number(item.tradeStatus)),
          iifBehavior: 'hide', // disabled
          click: (e: any) => {
            console.log('?????? click', e);
            this.verify(e);
          },
        },
        {
          text: '??????', type: 'link', iif: (item: TableData, btn: ColumnButton, column: Column) =>
            [EnumShBankTradeStatus.bank_finish].includes(Number(item.tradeStatus)),
          iifBehavior: 'hide',
          click: (e: any) => {
            console.log('?????? click', e);
            this.viewRecord(e);
          },
        }
      ],
    },
  ];
  columns: Column[] = [...this.defaultColumns];

  // ????????????????????????
  tableHeadBtn: ButtonConfigs = ReviewListConfig.getConfig('tableHeadBtn');
  get tableHeadBtnConfig() {
    return Object.keys(this.tableHeadBtn) || [];
  }
  // ?????????????????? ??????
  customSearchFields: any[] = [];
  customTableColumns: any[] = [];
  // ????????????
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
   * ????????????????????????????????? [?????????1, ....]
   * @searchModel ?????????
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
          // ??????????????? ???????????????
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
   * ?????????????????????????????????????????????
   * @param customRes ??????????????????????????????
   * @param fieldsKey ???????????????
   * @param key ???????????????
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
   * ??????????????????
   * @param pageConfig pageIndex ?????? pageSize ???????????? total ????????????
   * @searchModel ?????????
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
   * ??????????????????
   */
  searchFormResetFields(searchForm: any, fields: FormlyFieldConfig[]) {
    const column = fields.map((x: any) => x.key);
    // ??????????????????????????????
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
   * @description: ??????????????? ??????,??????,???????????????
   * @param {Column} columns
   * @return {*}
   */
  tableResetColumns(columns: Column[]) {
    const column = columns.map((x: any) => x.index);
    // ???????????????????????????
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
   * ??????????????????????????????
   * @param btn ????????????
   */
  handleHeadClick(btn: ButtonGroup) {
    if (btn.btnKey === 'export_manifest') {
      if(!this.data.length) {
        this.msg.error('???????????????????????????');
        return ;
      }
      const mainIds = this.selectedList.map((x: any) => x.mainFlowId);
      const options = [
        { label: '????????????????????????', value: 'all' },
        { label: '????????????', value: 'selected' },
      ];
      const params = {
        title: '????????????',
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
              label: '??????????????????',
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
          // ????????????
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
                this.xn.api.save(res._body, `??????????????????????????????.xlsx`);
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
   * ??????????????????
   */
  onSearch(data: any) {
    this.pageConfig.pageIndex = 1;
    this.selectedList = [];
    this.onPage(this.pageConfig, data);
  }

  /**
   * ?????????????????????
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
   * ????????????
   */
  private buildParams(searchModel: { [key: string]: any }) {
    // ????????????
    const params: any = {
      pageNo: this.pageConfig.pageIndex,
      pageSize: this.pageConfig.pageSize,
    };
    // ????????????
    for (const sortKey of Object.keys(this.sortModels)) {
      params.order = [
        { name: SortFieldsEnum[XnUtils.string2FirstUpper(sortKey)], asc: Number(this.sortModels[sortKey]) }
      ];
    }

    // ????????????
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
          // ????????????
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
   * table????????????
   * @param e ????????????
   * @param searchForm ?????????
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

  // ????????????-?????????pdf
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
      nzTitle: '????????????',
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
          { label: '??????', btnKey: 'cancel', type: 'normal' }
        ]
      }
    };
    this.mFileViewerService.openModal(param).subscribe((x: any) => { });
  }

  /**
   * @description: ??????
   * @param {any} row
   * @return {*}
   */
  verify(row: any) {
    if (!row.recordId){
      this.showPostError({ret: -1, msg: '???????????????recordId????????????'});
    } else {
      this.xn.router.navigate(['/oct-shanghai/record/bank-review'], {
        queryParams: {
          recordId: row.recordId
        }
      });
    }
  }

  /**
   * @description: ????????????
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
   *  ??????????????????
   * @param paramFile
   */
  public viewFiles(paramFile) {
    // ??????????????????????????????
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
        nzTitle: '??????',
        nzContent: `?????????[${json.ret}]???${json.msg}`,
      },
      buttons: {
        left: [],
        right: [
          { label: '??????', btnKey: 'ok', type: 'normal' }
        ]
      }
    };
    this.showModalService.openModal(this.xn, this.vcr, AntResultModalComponent, param).subscribe((x: any) => {
      if ([99902, 20001].includes(json.ret)) {
        // ??????????????????????????????????????????
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   *  ??????????????????--????????????????????????
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
   *  ????????????????????????--??????????????????????????????
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
  WaitReview = '?????????',
  Reviewed = '?????????',
  WithDraw = '?????????',
  ReturnBack = '?????????',
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
  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.financing_apply,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.financing_apply_success,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.financing_apply_fail,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.financing_apply_timeout,

  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.financing_apply_status_query,
  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.financing_apply_status_success,
  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.financing_apply_status_fail,
  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.financing_apply_status_timeout,

  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.receive_import,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.receive_import_success,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.receive_import_fail,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.receive_import_timeout,
  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.invoice_query,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.invoice_query_success,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.invoice_query_fail,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.invoice_query_timeout,

  /** ?????????????????????????????? bank_finish */
  EnumShBankExtStatus.business_file_push_notice,
  /** ???????????????????????????????????? bank_finish */
  EnumShBankExtStatus.business_file_push_notice_success,
  /** ???????????????????????????????????? bank_finish */
  EnumShBankExtStatus.business_file_push_notice_fail,
  /** ???????????????????????????????????? bank_finish */
  EnumShBankExtStatus.business_file_push_notice_timeout,

  /** ?????????????????????????????? bank_finish */
  EnumShBankExtStatus.receivable_transfer,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.receivable_transfer_success,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.receivable_transfer_fail,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.receivable_transfer_timeout,

  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.generate_financing_contract,
  /** ?????????????????????????????? bank_finish */
  EnumShBankExtStatus.generate_financing_contract_success,
  /** ?????????????????????????????? bank_finish */
  EnumShBankExtStatus.generate_financing_contract_fail,
  /** ?????????????????????????????? bank_finish */
  EnumShBankExtStatus.generate_financing_contract_timeout,

  /** ?????????????????????????????????????????? bank_finish */
  EnumShBankExtStatus.sign_financing_contract,
  /** ???????????????????????????????????????????????? bank_finish */
  EnumShBankExtStatus.sign_financing_contract_success,
  /** ???????????????????????????????????????????????? bank_finish */
  EnumShBankExtStatus.sign_financing_contract_fail,
  /** ???????????????????????????????????????????????? bank_finish */
  EnumShBankExtStatus.sign_financing_contract_timeout,

  /** ??????????????? */
  EnumShBankExtStatus.input_contract_info,

  /** ???????????????????????????????????? bank_finish */
  EnumShBankExtStatus.sign_service_agreement,

  /** ???????????????????????? ????????? bank_finish */
  EnumShBankExtStatus.platform_sign_service_agreement,

  /** ?????????????????????????????? bank_finish */
  EnumShBankExtStatus.service_agreemen_push_notice,
  /** ???????????????????????????????????? bank_finish */
  EnumShBankExtStatus.service_agreemen_push_notice_success,
  /** ???????????????????????????????????? bank_finish */
  EnumShBankExtStatus.service_agreemen_push_notice_fail,
  /** ???????????????????????????????????? bank_finish */
  EnumShBankExtStatus.service_agreemen_push_notice_timeout,

  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.loan_apply,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.loan_apply_success,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.loan_apply_fail,
  /** ???????????????????????? bank_finish */
  EnumShBankExtStatus.loan_apply_timeout,

  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.loan_apply_result_query,
  /** ??????????????????--?????? bank_finish */
  EnumShBankExtStatus.loan_apply_result_success,
  /** ??????????????????--?????? bank_finish */
  EnumShBankExtStatus.loan_apply_result_fail,
  /** ??????????????????--?????? bank_finish */
  EnumShBankExtStatus.loan_apply_result_timeout,

  /** ???????????? bank_finish */
  EnumShBankExtStatus.withhold_apply,
  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.withhold_apply_success,
  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.withhold_apply_fail,
  /** ?????????????????? bank_finish */
  EnumShBankExtStatus.withhold_apply_timeout,

  /** ????????? bank_finish */
  EnumShBankExtStatus.withdrawal,

  /** ????????? bank_finish */
  EnumShBankExtStatus.withdrawaled,
];
