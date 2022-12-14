import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import {
  CommonPage,
  PageTypes,
} from 'libs/shared/src/lib/public/component/comm-page';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { FormGroup } from '@angular/forms';
import { EnumOperating } from 'libs/console/src/lib/capital-pool/capital-pool-index.component';
import {
  SelectOptions,
  HeadquartersTypeEnum,
} from 'libs/shared/src/lib/config/select-options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { CapitalPoolGeneratingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-generating-contract-modal.component';
// tslint:disable-next-line:max-line-length
import { CapitalPoolGeneratingContractStampModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-generating-contract-stamp-modal.component';
import { ContractCreateType, SelectRange, CapitalType } from '../emus';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { CapitalPoolBulkUploadModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-bulk-upload-modal.component';
import { CapitalPoolExportListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-export-list-modal.component';
import { CapitalPoolDownloadAttachmentsModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-download-attachmentsmodal.component';
import { CapitalPoolReturnBackModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-return-back-modal.component';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/file-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { NewFileModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/new-file-modal.component';
import { CapitalChangeProcessModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-change-process-modal.component';
import * as _ from 'lodash';

@Component({
  templateUrl: './capital-pool-comm-list.component.html',
  styles: [
    `
      .table {
        font-size: 13px;
      }

      .table-head .sorting,
      .table-head .sorting_asc,
      .table-head .sorting_desc {
        position: relative;
        cursor: pointer;
      }

      .table-head .sorting:after,
      .table-head .sorting_asc:after,
      .table-head .sorting_desc:after {
        position: absolute;
        bottom: 8px;
        right: 8px;
        display: block;
        font-family: 'Glyphicons Halflings';
        opacity: 0.5;
      }

      .table-head .sorting:after {
        content: '\\e150';
        opacity: 0.2;
      }

      .table-head .sorting_asc:after {
        content: '\\e155';
      }

      .table-head .sorting_desc:after {
        content: '\\e156';
      }

      .tab-heads {
        margin-bottom: 10px;
        display: flex;
      }

      .tab-buttons {
        flex: 1;
      }

      .tab-search {
        text-align: right;
      }

      .form-control {
        display: inline-block;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        width: 200px;
      }

      .btn {
        vertical-align: top;
      }

      .small-font {
        font-size: 12px;
      }

      .item-box {
        position: relative;
        display: flex;
        margin-bottom: 10px;
      }

      .item-box i {
        position: absolute;
        top: 11px;
        right: 23px;
        opacity: 0.5;
        cursor: pointer;
      }

      .plege {
        color: #3c8dbc;
      }

      .plege.active {
        color: #ff3000;
      }

      tbody tr:hover {
        background-color: #e6f7ff;
        transition: all 0.1s linear;
      }

      .item-label label {
        min-width: 150px;
        padding-right: 8px;
        font-weight: normal;
        line-height: 34px;
        text-align: right;
      }

      .item-control {
        flex: 1;
      }

      .item-control select {
        width: 100%;
      }

      .fr {
        float: right;
      }

      .money-control {
        display: flex;
        line-height: 35px;
      }

      .text-right {
        text-align: right;
      }

      ul li {
        list-style-type: none;
      }

      .item-list {
        position: absolute;
        max-height: 200px;
        width: 375px;
        padding: 0px;
        z-index: 1;
        background: #fff;
        overflow-y: auto;
        border: 1px solid #ddd;
      }

      .item-list li {
        padding: 2px 12px;
      }

      .item-list li:hover {
        background-color: #ccc;
      }

      .btn-label {
        margin-bottom: 10px;
      }

      .btn-more {
        margin-top: 10px;
      }

      .btn-more-a {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }

      .btn-cus {
        border: 0;
        margin: 0;
        padding: 0;
      }

      .capital-pool-check {
        position: relative;
        top: 2px;
      }

      .a-block {
        display: block;
      }

      .ml {
        margin-left: 30px;
      }
      .disabled {
        pointer-events: none;
        filter: alpha(opacity=50); /*IE??????????????????50%*/
        -moz-opacity: 0.5; /*Firefox??????????????????50%*/
        opacity: 0.5; /*??????????????????50%*/
      }
      .table-head table,
      .table-body table {
        width: 100%;
        border-collapse: collapse;
      }
      .table-head {
        background-color: white;
      }
      .table-body {
        width: 100%;
        max-height: 600px;
        overflow-y: auto;
        min-height: 50px;
      }
      .table-body table tr:nth-child(2n + 1) {
        background-color: #f2f2f2;
      }
      .headstyle tr th {
        border: 1px solid #cccccc30;
        text-align: center;
      }
      table thead,
      tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }
      .table-body table tr td {
        border: 1px solid #cccccc30;
        text-align: center;
      }
      .center-block {
        clear: both;
        border-bottom: 1px solid #ccc;
        width: 43.9%;
        height: 1px;
      }
      .showClass {
        width: 12.5%;
        margin: 0 auto;
        border: 1px solid #ccc;
        text-align: center;
        border-top: 0px;
        clear: both;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    `,
  ],
})
export class CapitalPoolCommListComponent extends CommonPage implements OnInit {
  total = 0;
  pageSize = 10;
  first = 0;
  rows: any[] = [];
  words = '';

  sorting = ''; // ???????????????
  naming = ''; // ???????????????
  paging = 0; // ???????????????
  createBeginTime: any;
  createEndTime: any;
  arr = {} as any; // ?????????????????????

  heads: any[];
  searches: any[];
  shows: any[];
  base: CommBase;
  mainForm: FormGroup;
  timeId = [];
  tolerance = [];
  nowTimeCheckId = '';
  searchArr = [];
  start: 0;
  showBtn: false;
  title: string;
  formModule = 'dragon-input';
  // ?????????
  public currentPage: any;
  // ????????????????????? exp {capitalId: "CASH_POOLING_4", type: "2"}
  public formCapitalPool: any;
  // ?????????????????????
  public enumOperating = EnumOperating;
  // ???????????????????????????
  public isCapitalPool: boolean;
  // ????????????????????? ???mainflowId??????
  public capitalSelecteds: any[];
  // ???????????????????????????
  public btnStatusBool = false;
  // ??????????????????
  public showSign: boolean;
  // ?????????????????????????????????????????????
  public isShowPbtn = this.xn.user.orgType === 77;
  // ???????????????????????????????????????
  public isShowTradingBtn = false;
  // ?????????????????????
  public allChecked = false;
  // ???????????????????????????
  public isAgencyUser = false;
  public enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // ??????????????????
  private defaultHeadquarter = HeadquartersTypeEnum[5];
  showOrhide = '??????';
  displayShow = true;
  searchShow: any[] = []; // ?????????
  public ContractCreateType = ContractCreateType;
  public isProjectEnter = false;
  public fromProject: boolean; // ??????????????????????????????

  // ????????????
  public selectedItems: any[] = [];
  refreshDataAfterAttachComponent = () => {
    this.onPage({ page: this.paging, pageSize: this.pageSize });
  };

  constructor(
    public xn: XnService,
    public vcr: ViewContainerRef,
    public route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    super(PageTypes.List);

    this.isAgencyUser = this.xn.user.orgType === 102;
  }

  ngOnInit() {
    const initPage = ((params: { queryParams: any; data: any }) => {
      const superConfig = params.data;

      this.base = new CommBase(this, superConfig);
      this.heads = CommUtils.getListFields(superConfig.fields);
      if (params.queryParams.storageRack === 'lg-3') {
        this.heads = this.heads.filter((x) => {
          return x.checkerId !== 'notice2' && x.checkerId !== 'receipt2';
        });
      }
      this.searches = CommUtils.getSearchFields(superConfig.fields);

      this.title = this.base.superConfig.showName.replace(
        '$',
        params.queryParams.capitalPoolName ||
          this.route.snapshot.queryParams.capitalPoolName ||
          ''
      );
      this.buildShow(this.searches);
      this.pageSize =
        (superConfig.list && superConfig.list.pageSize) || this.pageSize;
    }).bind(this);

    this.route.queryParams
      .pipe(
        map((x) => {
          this.formCapitalPool = x;

          this.currentPage = this.formCapitalPool.currentPage;
          this.fromProject = this.formCapitalPool.fromProject
            ? this.formCapitalPool.fromProject
            : false;
          if (this.formCapitalPool.isLocking) {
            // ?????????????????????
            this.showSign = this.formCapitalPool.isLocking === '1';
          }
          // ???????????????
          this.isCapitalPool =
            this.formCapitalPool &&
            (this.formCapitalPool.type === '2' ||
              this.formCapitalPool.type === '3');
          this.isShowTradingBtn =
            this.formCapitalPool && this.formCapitalPool.type === '1';

          return x;
        }),
        switchMap(
          () => {
            return this.route.data;
          },
          (outerValue, innerValue) => {
            return { queryParams: outerValue, data: innerValue };
          }
        )
      )
      .subscribe(initPage);
    this.onPage({ page: this.paging, pageSize: this.pageSize });
  }

  /**
   *  ??????????????????
   * @param sub ????????????
   */
  public viewFile(sub) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      FileViewModalComponent,
      sub
    ).subscribe(() => {});
  }
  show() {
    this.displayShow = !this.displayShow;
  }

  /**
   *  ????????????
   * @param event
   */
  public onPage(event: { page: number; pageSize: number }): void {
    this.paging = event.page;
    this.pageSize = event.pageSize;
    this.allChecked = false; // ??????????????????
    // ?????????????????????
    this.onUrlData();

    const params = this.buildParams();
    this.onList(params);
  }

  /**
   *  ?????????
   * @param sort
   */
  public onSort(sort: string): void {
    // ????????????????????????????????????asc ??? desc
    if (this.sorting === sort) {
      this.naming = this.naming === 'desc' ? 'asc' : 'desc';
    } else {
      this.sorting = sort;
      this.naming = 'asc';
    }

    this.onPage({ page: this.paging, pageSize: this.pageSize });
  }

  /**
   *  ???????????????
   * @param checkerId
   */
  public onSortClass(checkerId: string): string {
    if (checkerId === this.sorting) {
      return 'sorting_' + this.naming;
    } else {
      return 'sorting';
    }
  }

  /**
   *  ??????????????????
   * @param type
   */
  public onTextClass(type) {
    return type === 'money' ? 'text-right' : '';
  }

  /**
   *  ????????????
   */
  public onSearch(): void {
    this.onPage({ page: this.paging, pageSize: this.pageSize });
  }

  /**
   *  ???????????????
   */
  public clearSearch() {
    for (const key in this.arr) {
      if (this.arr.hasOwnProperty(key)) {
        delete this.arr[key];
      }
    }

    this.buildCondition(this.searches);
    this.onSearch(); // ???????????????????????????search
    this.paging = 1; // ???????????????
  }

  /**
   * ???????????????
   * @param val
   * @param index
   */
  public inputChange(val: any) {
    if (val.checked && val.checked === true) {
      val.checked = false;
    } else {
      val.checked = true;
    }
    this.capitalSelecteds = this.rows
      .filter((item) => item.checked && item.checked === true)
      .map((x: any) => x.mainFlowId);
    this.btnStatusBool =
      this.capitalSelecteds && this.capitalSelecteds.length > 0;
    // ?????????????????????clicked ??????false????????????????????????????????????
    this.allChecked = !this.rows.some(
      (x: any) => x.checked === undefined || x.checked === false
    );
    this.selectedItems = this.rows.filter(
      (r) => r.checked && r.checked === true
    );
  }

  /**
   * ???????????????????????????
   */
  public removeCapital() {
    if (this.rows && this.rows.length) {
      if (this.capitalSelecteds && this.capitalSelecteds.length) {
        this.xn.msgBox.open(true, '????????????????', () => {
          const params = {
            mainFlowIdList: this.capitalSelecteds,
            capitalPoolId: this.formCapitalPool.capitalId,
          };
          // ????????????
          this.addOrRemoveCapitalPool('/pool/remove', params);
        });
      }
    }
  }

  /**
   * ?????????????????????
   */
  public handleAllSelect() {
    this.allChecked = !this.allChecked;
    if (this.allChecked) {
      this.rows.map((item) => (item.checked = true));
    } else {
      this.rows.map((item) => (item.checked = false));
    }
    this.capitalSelecteds = this.rows
      .filter((item) => item.checked && item.checked === true)
      .map((x: any) => x.mainFlowId);
    this.btnStatusBool =
      this.capitalSelecteds && this.capitalSelecteds.length > 0;
    // ?????????
    this.selectedItems = this.rows.filter(
      (r) => r.checked && r.checked === true
    );
  }

  /**
   *  ??????
   */
  public goBack() {
    if (this.fromProject) {
      window.history.back();
      // this.xn.router.navigate(['/logan/vanke/projectPlan-management'], {
      //     queryParams: {
      //         title: this.formCapitalPool.title,
      //         projectId: this.formCapitalPool.projectId,
      //         headquarters: this.formCapitalPool.headquarters,
      //         paging: this.formCapitalPool.backPageNumber,
      //         defaultValue: this.formCapitalPool.backDefaultValue
      //     }
      // });
    } else {
      this.xn.router.navigate(
        ['/console/capital-pool/dragon/capital-pool/capital-pool-main-list'],
        {
          queryParams: { currentPage: this.currentPage },
        }
      );
    }
  }

  /**
   *  ??????????????????
   * @param item mainFlowId
   */
  public viewProcess(item: any) {
    this.xn.router.navigate([`logan/main-list/detail/${item}`]);
  }
  /**
   *
   * @param item mainFlowId
   */
  public changeProcess(item: any) {
    const tradeStatus = this.selectedItems.map((x) => ({
      tradeStatus: x.tradeStatus,
      mainFlowId: x.mainFlowId,
    }));
    // let commonStatus = _.difference([101, 102, 103, 104, 99], tradeStatus);
    // if (commonStatus.length !== 4 && commonStatus.includes(104)) {

    // }
    const commonMainFlowId = [];
    let isOk = true;
    tradeStatus.forEach((x) => {
      if (x.tradeStatus !== 104) {
        commonMainFlowId.push(x.mainFlowId);
        isOk = false;
        return;
      }
    });
    if (!isOk) {
      let alert = '';
      commonMainFlowId.forEach((x) => {
        alert += x + '???';
      });
      this.xn.msgBox.open(
        false,
        `??????${alert}?????????????????????????????????????????????????????????????????????`
      );
      return;
    }

    const hasSelect = this.hasSelectRow();
    const params = { hasSelect, selectedCompany: this.defaultHeadquarter };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      CapitalChangeProcessModalComponent,
      params
    ).subscribe((x) => {
      if (x === '') {
        return;
      } else if (x.scope === '1') {
        this.xn.router.navigate([`/logan/record/new/`], {
          queryParams: {
            id: 'sub_change_start',
            relate: 'mainIds',
            relateValue: this.capitalSelecteds,
          },
        });
      } else {
        this.xn.router.navigate([`/logan/record/new/`], {
          queryParams: {
            id: 'sub_change_capital',
            relate: 'mainIds',
            relateValue: this.capitalSelecteds,
          },
        });
      }
    });
  }
  /**
   * ?????????????????????
   */
  public generateAndSign() {
    const { selectedCompany, selectedRows } = this.doBefore();
    // ????????????????????????
    const param = selectedCompany[0];
    // ??????
    const urls = {
      // ??????????????????????????????????????????
      ...this.dragonContracts(ContractCreateType.CodeNotice2, false),
      // ??????????????????????????????????????????
      ...this.dragonContracts(ContractCreateType.CodeProjectNotice2, false),
      /** ???????????????????????????????????????- ???????????? */
      ...this.dragonContracts(ContractCreateType.CodeChangeNoticeAdd, false),
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      CapitalPoolGeneratingContractStampModalComponent,
      param
    ).subscribe((x) => {
      if (x !== '') {
        this.xn.loading.open();
        // ????????????
        const params = {
          capitalPoolId: this.formCapitalPool.capitalId,
          tradeList: selectedRows.map((r) => r.mainFlowId),
          contract_type: x.generatingContract,
          storageRack: this.formCapitalPool.storageRack,
        };
        // ??????url
        const url = {
          generate: urls[+x.generatingContract],
          update: urls[`${this.updateContractKey(+x.generatingContract)}`],
          exp: urls[`${this.expContractKey(+x.generatingContract)}`],
        };
        this.doGenerateOrSign(url, params);
      }
    });
  }

  /**
   * ????????????
   */
  public batchModify() {
    const param = { mainList: this.selectedItems };
    this.localStorageService.setCacheValue('batchModifyMainList', param);
    this.xn.router.navigate(['/logan/capital-pool/batch-modify'], {
      queryParams: this.formCapitalPool,
    });
  }

  /**
   * ????????????
   */
  public generate() {
    const { selectedCompany, selectedRows } = this.doBefore();
    // ????????????????????????
    const param = selectedCompany[0];

    // ??????
    const urls = {
      // ????????????????????????????????????
      ...this.dragonContracts(ContractCreateType.CodeProjectReceipt2),
      // ????????????????????????????????????
      ...this.dragonContracts(ContractCreateType.CodeReceipt2),
      // ????????????????????????????????????????????????
      ...this.dragonContracts(ContractCreateType.CodeProjectReceipt1),
      // ??????????????????????????????????????????
      ...this.dragonContracts(ContractCreateType.CodeBrokerPayConfirm),
      // ?????????????????????????????????????????????
      ...this.dragonContracts(ContractCreateType.CodeFactoringPayConfirm),
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      CapitalPoolGeneratingContractModalComponent,
      param
    ).subscribe((x) => {
      if (x !== '') {
        this.xn.loading.open();
        // ????????????
        const params = {
          capitalPoolId: this.formCapitalPool.capitalId,
          tradeList: selectedRows.map((r) => r.mainFlowId),
          contract_type: x.generatingContract,
          storageRack: this.formCapitalPool.storageRack,
        };
        // ??????url
        const url = {
          generate: urls[+x.generatingContract],
          update: urls[`${this.updateContractKey(+x.generatingContract)}`],
          exp: urls[`${this.expContractKey(+x.generatingContract)}`],
        };
        this.doGenerateOrSign(url, params);
      }
    });
  }

  /**
   * ????????????
   */
  public downloadSelectedAttach() {
    const hasSelect = this.hasSelectRow();
    // ????????????????????????????????????????????????????????????
    if (!hasSelect && this.isDifferentCompany()) {
      this.xn.msgBox.open(false, '???????????????????????????????????????');

      return;
    }
    const params = {
      hasSelect,
      selectedCompany: this.defaultHeadquarter,
      capitalType: CapitalType.Old,
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      CapitalPoolDownloadAttachmentsModalComponent,
      params
    ).subscribe((x) => {
      if (x !== '') {
        this.xn.loading.open();
        const param = {
          mainFlowIdList:
            +x.scope === SelectRange.All
              ? this.rows.map((c) => c.mainFlowId)
              : this.capitalSelecteds,
          fileTypeKey: x.contentType
            .split(',')
            .filter((c) => c !== '')
            .map((c) => +c),
          isClassify: x.downloadType,
        };
        const rObj = {};
        x.contentType.split(',').forEach((x) => {
          rObj[x] = true;
        });
        param.fileTypeKey = rObj;

        this.xn.api.dragon
          .download('/list/main/download_deal_flies', param)
          .subscribe((v: any) => {
            this.xn.loading.close();
            this.xn.api.dragon.save(v._body, '???????????????.zip');
          });
      }
    });
  }

  /**
   * ????????????
   *  hasSelect ???????????????
   *  ??????????????????
   */
  public exportCapital() {
    const hasSelect = this.hasSelectRow();
    // ????????????????????????????????????????????????????????????
    if (!hasSelect && this.isDifferentCompany()) {
      this.xn.msgBox.open(false, '???????????????????????????????????????');

      return;
    }
    const params = {
      hasSelect,
      selectedCompany: this.defaultHeadquarter,
      capitalType: CapitalType.Old,
    };

    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      CapitalPoolExportListModalComponent,
      params
    ).subscribe((x) => {
      if (x === '') {
        return;
      }
      this.xn.loading.open();
      const param = {
        mainFlowIdList:
          +x.scope === SelectRange.All ? undefined : this.capitalSelecteds,
        capitalPoolId: this.formCapitalPool.capitalId,
        scope: x.scope,
      };
      this.xn.api.dragon.download('/pool/list_excel', param).subscribe(
        (v: any) => {
          this.xn.api.dragon.save(v._body, '???????????????.xlsx');
        },
        () => {},
        () => {
          this.xn.loading.close();
        }
      );
    });
  }

  /**
   * ????????????
   * @param row
   * @param head
   */
  public uploadContract(row, head, type: ContractCreateType) {
    const params = {
      title: `??????${head.title}`,
      checker: [
        {
          title: `${head.title}`,
          checkerId: 'proveImg',
          type: 'mfile',
          options: {
            filename: `${head.title}`,
            fileext: 'jpg, jpeg, png, pdf',
            picSize: '500',
          },
          memo: '??????????????????PDF',
        },
      ],
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      NewFileModalComponent,
      params
    ).subscribe((v) => {
      this.xn.loading.open();
      if (v === null) {
        this.xn.loading.close();
        return;
      }
      const param = {
        fileList: v.files,
        content: type,
        mainFlowIdList: [row.mainFlowId],
        capitalPoolId: this.formCapitalPool.capitalId,
        scope: SelectRange.Select,
      };
      this.xn.api.dragon.post('/pool/upload_files', param).subscribe(() => {
        this.xn.loading.close();
        this.onPage({
          page: this.paging,
          pageSize: this.pageSize,
        });
      });
    });
  }

  /**
   * ????????????
   * @param row
   */
  public viewContract(row: any) {
    let params = row;

    if (typeof row === 'string') {
      const obj = JSON.parse(row);
      params = Array.isArray(obj) ? obj[0] : obj;
    }

    params.readonly = true;
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonPdfSignModalComponent,
      params
    ).subscribe(() => {
      // do nothing
    });
  }

  /**
   * ????????????
   */
  public uploadFiles() {
    const { selectedCompany, selectedRows } = this.doBefore();
    // ????????????????????????
    const param = selectedCompany[0];

    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      CapitalPoolBulkUploadModalComponent,
      param
    ).subscribe((x) => {
      if (x !== '') {
        this.xn.loading.open();
        const params = {
          fileList: JSON.parse(x.fileList),
          content: x.content,
          mainFlowIdList:
            +x.scope === SelectRange.All
              ? this.rows.map((c) => c.mainFlowId)
              : selectedRows.map((c) => c.mainFlowId),
          capitalPoolId: this.formCapitalPool.capitalId,
          scope: x.scope,
        };
        this.xn.api.dragon.post('/pool/upload_files', params).subscribe(() => {
          this.xn.loading.close();
          this.onPage({
            page: this.paging,
            pageSize: this.pageSize,
          });
        });
      }
    });
  }

  /**
   * ????????????
   */
  public doPush() {
    this.xn.loading.open();
    // ????????????
    const param = {
      list: this.selectedItems.map((m) => ({
        mainFlowId: m.mainFlowId,
        projectCompany: m.projectCompany,
      })),
    };
    this.xn.api.dragon.post('/pool/pushCompany', param).subscribe(
      () => {
        const html = ` <h4>??????????????????</h4> `;
        this.xn.msgBox.open(false, [html], () => {
          this.onPage({
            page: this.paging,
            pageSize: this.pageSize,
          });
          this.selectedItems = [];
        });
      },
      () => {},
      () => {
        this.xn.loading.close();
      }
    );
  }

  /**
   * ????????????(????????????)
   */
  public doPushAdd() {
    this.xn.loading.open();
    // ????????????
    const param = {
      list: this.selectedItems.map((m) => ({
        mainFlowId: m.mainFlowId,
        projectCompany: m.projectCompany,
      })),
    };
    this.xn.api.dragon.post('/pool/pushCompanyAdd', param).subscribe(
      () => {
        const html = ` <h4>??????????????????</h4> `;
        this.xn.msgBox.open(false, [html], () => {
          this.onPage({
            page: this.paging,
            pageSize: this.pageSize,
          });
          this.selectedItems = [];
        });
      },
      () => {},
      () => {
        this.xn.loading.close();
      }
    );
  }

  /**
   * ?????????????????? [??????]
   * @param paramFiles
   */
  public fileView(paramFiles) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      JsonTransForm(paramFiles)
    ).subscribe(() => {});
  }

  /** ?????????????????? */
  public viewReturnBack(row: any) {
    if (row.returnReason && row.returnReason) {
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        CapitalPoolReturnBackModalComponent,
        row.returnReason
      ).subscribe();
    } else {
      this.xn.msgBox.open(false, '??????????????????????????????');
    }

    // ??????????????????????????????
    // const params = {
    //     // mainFlowId: row.mainFlowId,
    //     mainFlowIdList: [row.mainFlowId],
    //     capitalPoolId: this.formCapitalPool.capitalId,
    // };
    // this.xn.api.dragon.post('/pool/return_back', params).subscribe(res => {
    //     if (res.data && res.data.reason) {
    //         XnModalUtils.openInViewContainer(this.xn, this.vcr, CapitalPoolReturnBackModalComponent, res.data.reason).subscribe();
    //     } else {
    //         this.xn.msgBox.open(false, '??????????????????????????????');
    //     }
    // });
  }

  private buildShow(searches) {
    this.shows = [];
    this.onUrlData();
    this.buildCondition(searches);
  }

  private buildCondition(searches) {
    const tmpTime = {
      beginTime: this.createBeginTime,
      endTime: this.createEndTime,
    };
    const objList = [];
    this.timeId = $.extend(
      true,
      [],
      this.searches.filter((v) => v.type === 'quantum').map((v) => v.checkerId)
    );
    for (let i = 0; i < searches.length; i++) {
      const obj = {} as any;
      obj.title = searches[i].title;
      obj.checkerId = searches[i].checkerId;
      obj.required = false;
      obj.type = searches[i].type;
      obj.number = searches[i].number;
      obj.options = { ref: searches[i].selectOptions };
      if (searches[i].checkerId === this.timeId[0]) {
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arr[searches[i].checkerId];
      }
      objList.push(obj);
    }
    this.shows = $.extend(
      true,
      [],
      objList.sort(function (a, b) {
        return a.number - b.number;
      })
    ); // ?????????;
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.mainForm = XnFormUtils.buildFormGroup(this.shows);

    const time = this.searches.filter((v) => v.type === 'quantum');
    this.tolerance = $.extend(
      true,
      [],
      this.searches
        .filter((v) => v.type === 'tolerance')
        .map((v) => v.checkerId)
    );

    const forSearch = this.searches
      .filter((v) => v.type !== 'quantum')
      .map((v) => v && v.checkerId);
    this.searchArr = $.extend(true, [], forSearch); // ?????????;
    const timeCheckId = time[0] && time[0].checkerId;
    this.nowTimeCheckId = timeCheckId;

    this.mainForm.valueChanges.subscribe((v) => {
      const changeId = v[timeCheckId];
      delete v[timeCheckId];
      if (changeId !== '' && this.nowTimeCheckId) {
        const paramsTime = JSON.parse(changeId);
        const beginTime = paramsTime.beginTime;
        const endTime = paramsTime.endTime;

        if (
          beginTime === this.createBeginTime &&
          endTime === this.createEndTime
        ) {
          // return;
        } else {
          this.createBeginTime = beginTime;
          this.createEndTime = endTime;
          this.paging = 1;
          this.rows.splice(0, this.rows.length);
          const params = this.buildParams();
          this.onList(params);
        }
      }
      const arrObj = {} as any;
      for (const item in v) {
        if (v.hasOwnProperty(item) && v[item] !== '') {
          const searchFilter = this.searches
            .filter((vv) => vv && vv.base === 'number')
            .map((c) => c.checkerId);
          if (searchFilter.indexOf(item) >= 0) {
            arrObj[item] = Number(v[item]);
          } else {
            if (item === 'returnBack' || item === 'isFactoringEndDate') {
              arrObj[item] = Number(v[item]);
            } else {
              arrObj[item] = v[item];
            }
          }
        }
      }
      console.log(arrObj);
      this.arr = $.extend(true, {}, arrObj); // ?????????;????????????????????????
      this.onUrlData();
    });
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      // ?????????????????????????????????
      if (row.checkerId === 'headquarters') {
        row.options.isProxy = this.formCapitalPool.isProxy;
      }

      XnFormUtils.convertChecker(row);
    }
  }

  /**
   *  ????????????
   * @param data
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.sorting = urlData.data.sorting || this.sorting;
      this.naming = urlData.data.naming || this.naming;
      this.words = urlData.data.words || this.words;
      this.createBeginTime = urlData.data.beginTime || this.createBeginTime;
      this.createEndTime = urlData.data.endTime || this.createEndTime;
      this.arr = urlData.data.arrObjs || this.arr;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        sorting: this.sorting,
        naming: this.naming,
        words: this.words,
        beginTime: this.createBeginTime,
        endTime: this.createEndTime,
        arrObjs: this.arr,
      });
    }
  }

  /**
   *  ??????????????????
   * @param params
   */
  private onList(params) {
    this.xn.api.dragon.post('/pool/tradelist', params).subscribe((json) => {
      this.total = json.data.count;
      this.rows = json.data.data;
      // this.rows = json.data.data.map(c => {
      //     this.PhotoCopy[c.headquarters].forEach(v => {
      //         // ????????????c.need_photoCopy01
      //         c[`need_${v}`] = true;
      //     });
      //     return c;
      // });
      this.btnStatusBool = false;
      this.selectedItems = [];
    });
  }

  /**
   *  ??????????????????
   */
  private buildParams() {
    // ????????????
    const params: any = {
      pageNo: this.paging < 0 ? 1 : this.paging,
      pageSize: this.pageSize,
      createBeginTime: this.createBeginTime,
      createEndTime: this.createEndTime,
      capitalPoolId: this.formCapitalPool.capitalId,
    };

    // ????????????
    // if (this.sorting && this.naming) {
    //     params.order = [this.sorting + ' ' + this.naming];
    // }

    // ????????????
    const a = this.searches.filter(
      (x) => !XnUtils.isEmpty(this.arr[x.checkerId])
    );
    this.searches
      .filter((x) => !XnUtils.isEmpty(this.arr[x.checkerId]))
      .forEach((search) => {
        switch (search.checkerId) {
          case 'realLoanDate':
            const realLoanDate = JSON.parse(this.arr[search.checkerId]);
            params.loanBeginTime = realLoanDate.beginTime;
            params.loanEndTime = realLoanDate.endTime;
            break;

          case 'isPriorityLoanDate':
            const priorityLoanDate = JSON.parse(this.arr[search.checkerId]);
            if (priorityLoanDate.isPriorityLoanDate <= 0) {
              params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
            } else {
              params.priorityLoanDateStart =
                priorityLoanDate.priorityLoanDateStart;
              params.priorityLoanDateEnd = priorityLoanDate.priorityLoanDateEnd;
              params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
            }
            break;
          case 'createTime':
            const date = JSON.parse(this.arr[search.checkerId]);
            params.createBeginTime = date.beginTime;
            params.createEndTime = date.endTime;
            break;
          default:
            params[search.checkerId] = this.arr[search.checkerId];
            break;
        }
      });

    return params;
  }

  /**
   * ????????????--?????????????????????
   * @param url
   * @param params
   */
  private doGenerateOrSign(url, params) {
    this.xn.api.dragon
      .post(url.generate, params)
      .pipe(
        map((con) => {
          this.xn.loading.close();
          const contract =
            con.data.contract ||
            [].concat(con.data.list).reduce((prev, curr) => {
              [].concat(curr.contract).forEach((item) => {
                item.mainFlowId = curr.mainFlowId;
              });
              return [...prev].concat(curr.contract);
            }, []);
          let result = JSON.parse(JSON.stringify(contract));
          result.isProxy = 52;
          const contracts = result;
          if (result.length) {
            result.forEach((tracts) => {
              if (parseInt(params.contract_type, 10) === 1001) {
                tracts.config = { text: `???${this.xn.user.orgName}???` };
              } else if (parseInt(params.contract_type, 10) === 1002) {
                tracts.config = { text: `???${this.xn.user.orgName}???` };
              } else if (parseInt(params.contract_type, 10) === 1003) {
                tracts.config = { text: `???${this.xn.user.orgName}???(??????)` };
              } else {
                tracts.config = { text: '????????????' };
              }

              // ??????????????????
              if (url.exp.noStamp) {
                tracts.readonly = true;
                tracts.isNoSignTitle = true;
                tracts.caSignType = 1;
              }
            });
            if (url.exp.noStamp) {
              XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                DragonPdfSignModalComponent,
                result
              ).subscribe((x) => {});
            } else {
              XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                DragonFinancingContractModalComponent,
                contracts
              ).subscribe((x) => {
                this.xn.loading.open();
                // ??????????????????
                if (x === 'ok') {
                  // ????????????????????????????????????????????????
                  const p = con.data;
                  this.xn.api.dragon.post(url.update, p).subscribe(() => {
                    this.onPage({
                      page: this.paging,
                      pageSize: this.pageSize,
                    });
                  });
                }
                this.xn.loading.close();
              });
            }
          }
        })
      )
      .subscribe();
  }

  /**
   *  ????????????????????????
   * @param url
   * @param params
   */
  private addOrRemoveCapitalPool(
    url: string,
    params: { mainFlowIdList: any[]; capitalPoolId: any }
  ) {
    this.xn.api.dragon.post(url, params).subscribe(() => {
      this.onPage({
        page: this.paging,
        pageSize: this.pageSize,
      });
      this.allChecked = false;
    });
  }

  /**
   * ???????????????
   */
  private doBefore() {
    if (!this.rows || this.rows.length === 0) {
      this.xn.msgBox.open(false, '???????????????????????????????????????????????????');
      return;
    }
    // ????????????
    const selectedRows = this.rows.filter(
      (x: any) => x.checked && x.checked === true
    );
    // ?????????????????????
    const selectedCompany = XnUtils.distinctArray(
      selectedRows.filter((c) => c.headquarters).map((c) => c.headquarters)
    ) || [this.defaultHeadquarter];

    if (!selectedRows || selectedRows.length === 0) {
      this.xn.msgBox.open(false, '?????????????????????????????????????????????');
      return;
    }
    if (selectedCompany.length > 1) {
      this.xn.msgBox.open(false, '??????????????????????????????????????????????????????');
      return;
    }
    return {
      selectedCompany,
      selectedRows,
    };
  }

  private get dragonContractCreateUrl() {
    return '/pool/dragon_contract_create';
  }

  private get dragonContractSaveUrl() {
    return '/pool/dragon_contract_save';
  }

  private dragonContracts(
    contractCreateType: ContractCreateType,
    noStamp = true
  ) {
    return {
      [contractCreateType]: this.dragonContractCreateUrl,
      [`${this.updateContractKey(contractCreateType)}`]:
        this.dragonContractSaveUrl,
      [`${this.expContractKey(contractCreateType)}`]: { noStamp },
    };
  }

  private updateContractKey(type: ContractCreateType) {
    return `update_${type}`;
  }

  private expContractKey(type: ContractCreateType) {
    return `exp_${type}`;
  }

  private isDifferentCompany() {
    const company =
      XnUtils.distinctArray(
        this.rows.filter((x: any) => x.headquarters).map((c) => c.headquarters)
      ) || [];

    return company.length > 1;
  }

  private hasSelectRow() {
    const selectedRows = this.rows.filter(
      (x: any) => x.checked && x.checked === true
    );

    return !!selectedRows && selectedRows.length > 0;
  }
}
