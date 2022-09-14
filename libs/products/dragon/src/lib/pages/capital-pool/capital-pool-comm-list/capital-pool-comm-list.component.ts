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
        filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
        -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
        opacity: 0.5; /*其他，透明度50%*/
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

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  paging = 0; // 共享该变量
  createBeginTime: any;
  createEndTime: any;
  arr = {} as any; // 缓存后退的变量

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
  // 当前页
  public currentPage: any;
  // 资产池传入数据 exp {capitalId: "CASH_POOLING_4", type: "2"}
  public formCapitalPool: any;
  // 资产池操作枚举
  public enumOperating = EnumOperating;
  // 按照资产池需要显示
  public isCapitalPool: boolean;
  // 资产池选中的项 的mainflowId集合
  public capitalSelecteds: any[];
  // 增加，移除按钮状态
  public btnStatusBool = false;
  // 是否显示合同
  public showSign: boolean;
  // 是否显示资产化平台合同签署按钮
  public isShowPbtn = this.xn.user.orgType === 77;
  // 是否显示资产池交易列表按钮
  public isShowTradingBtn = false;
  // 全选，取消全选
  public allChecked = false;
  // 是否为中介角色用户
  public isAgencyUser = false;
  public enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // 总部企业对应
  private defaultHeadquarter = HeadquartersTypeEnum[5];
  showOrhide = '隐藏';
  displayShow = true;
  searchShow: any[] = []; // 搜索项
  public ContractCreateType = ContractCreateType;
  public isProjectEnter = false;
  public fromProject: boolean; // 是否项目列表路由过来

  // 选中集合
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
            // 是否可签署合同
            this.showSign = this.formCapitalPool.isLocking === '1';
          }
          // 显示资产池
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
   *  查看单个文件
   * @param sub 文件数据
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
   *  切换页面
   * @param event
   */
  public onPage(event: { page: number; pageSize: number }): void {
    this.paging = event.page;
    this.pageSize = event.pageSize;
    this.allChecked = false; // 重置全选按钮
    // 后退按钮的处理
    this.onUrlData();

    const params = this.buildParams();
    this.onList(params);
  }

  /**
   *  列排序
   * @param sort
   */
  public onSort(sort: string): void {
    // 如果已经点击过了，就切换asc 和 desc
    if (this.sorting === sort) {
      this.naming = this.naming === 'desc' ? 'asc' : 'desc';
    } else {
      this.sorting = sort;
      this.naming = 'asc';
    }

    this.onPage({ page: this.paging, pageSize: this.pageSize });
  }

  /**
   *  列排序提示
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
   *  文本提示样式
   * @param type
   */
  public onTextClass(type) {
    return type === 'money' ? 'text-right' : '';
  }

  /**
   *  搜索查询
   */
  public onSearch(): void {
    this.onPage({ page: this.paging, pageSize: this.pageSize });
  }

  /**
   *  清楚搜索项
   */
  public clearSearch() {
    for (const key in this.arr) {
      if (this.arr.hasOwnProperty(key)) {
        delete this.arr[key];
      }
    }

    this.buildCondition(this.searches);
    this.onSearch(); // 清空之后自动调一次search
    this.paging = 1; // 回到第一页
  }

  /**
   * 行内单选框
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
    // 当数组中不具有clicked 且为false。没有找到则表示全选中。
    this.allChecked = !this.rows.some(
      (x: any) => x.checked === undefined || x.checked === false
    );
    this.selectedItems = this.rows.filter(
      (r) => r.checked && r.checked === true
    );
  }

  /**
   * 从该资产池移除交易
   */
  public removeCapital() {
    if (this.rows && this.rows.length) {
      if (this.capitalSelecteds && this.capitalSelecteds.length) {
        this.xn.msgBox.open(true, '确认移除吗?', () => {
          const params = {
            mainFlowIdList: this.capitalSelecteds,
            capitalPoolId: this.formCapitalPool.capitalId,
          };
          // 删除操作
          this.addOrRemoveCapitalPool('/pool/remove', params);
        });
      }
    }
  }

  /**
   * 全选，取消全选
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
    // 选中项
    this.selectedItems = this.rows.filter(
      (r) => r.checked && r.checked === true
    );
  }

  /**
   *  返回
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
   *  查看交易流程
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
        alert += x + '、';
      });
      this.xn.msgBox.open(
        false,
        `交易${alert}还没有完成供应商签署合同，不能发起变更发行流程`
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
   * 生成并签署合同
   */
  public generateAndSign() {
    const { selectedCompany, selectedRows } = this.doBefore();
    // 传递给组件的参数
    const param = selectedCompany[0];
    // 接口
    const urls = {
      // 致总部公司通知书（二次转让）
      ...this.dragonContracts(ContractCreateType.CodeNotice2, false),
      // 致项目公司通知书（二次转让）
      ...this.dragonContracts(ContractCreateType.CodeProjectNotice2, false),
      /** 《项目公司回执（二次转让）- 补充协议 */
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
        // 准备参数
        const params = {
          capitalPoolId: this.formCapitalPool.capitalId,
          tradeList: selectedRows.map((r) => r.mainFlowId),
          contract_type: x.generatingContract,
          storageRack: this.formCapitalPool.storageRack,
        };
        // 准备url
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
   * 批量补充
   */
  public batchModify() {
    const param = { mainList: this.selectedItems };
    this.localStorageService.setCacheValue('batchModifyMainList', param);
    this.xn.router.navigate(['/logan/capital-pool/batch-modify'], {
      queryParams: this.formCapitalPool,
    });
  }

  /**
   * 生成合同
   */
  public generate() {
    const { selectedCompany, selectedRows } = this.doBefore();
    // 传递给组件的参数
    const param = selectedCompany[0];

    // 接口
    const urls = {
      // 项目公司回执（二次转让）
      ...this.dragonContracts(ContractCreateType.CodeProjectReceipt2),
      // 总部公司回执（二次转让）
      ...this.dragonContracts(ContractCreateType.CodeReceipt2),
      // 生成《项目公司回执（一次转让）》
      ...this.dragonContracts(ContractCreateType.CodeProjectReceipt1),
      // 《付款确认书（总部致券商）》
      ...this.dragonContracts(ContractCreateType.CodeBrokerPayConfirm),
      // 《付款确认书（总部致保理商）》
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
        // 准备参数
        const params = {
          capitalPoolId: this.formCapitalPool.capitalId,
          tradeList: selectedRows.map((r) => r.mainFlowId),
          contract_type: x.generatingContract,
          storageRack: this.formCapitalPool.storageRack,
        };
        // 准备url
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
   * 下载附件
   */
  public downloadSelectedAttach() {
    const hasSelect = this.hasSelectRow();
    // 未选择列表中数据时，检查公司名称是否一致
    if (!hasSelect && this.isDifferentCompany()) {
      this.xn.msgBox.open(false, '筛选条件下，具有不同公司！');

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
            this.xn.api.dragon.save(v._body, '资产池附件.zip');
          });
      }
    });
  }

  /**
   * 导出清单
   *  hasSelect 导出选中项
   *  导出全部交易
   */
  public exportCapital() {
    const hasSelect = this.hasSelectRow();
    // 未选择列表中数据时，检查公司名称是否一致
    if (!hasSelect && this.isDifferentCompany()) {
      this.xn.msgBox.open(false, '筛选条件下，具有不同公司！');

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
          this.xn.api.dragon.save(v._body, '资产池清单.xlsx');
        },
        () => {},
        () => {
          this.xn.loading.close();
        }
      );
    });
  }

  /**
   * 上传文件
   * @param row
   * @param head
   */
  public uploadContract(row, head, type: ContractCreateType) {
    const params = {
      title: `上传${head.title}`,
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
          memo: '请上传图片、PDF',
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
   * 查看合同
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
   * 批量上传
   */
  public uploadFiles() {
    const { selectedCompany, selectedRows } = this.doBefore();
    // 传递给组件的参数
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
   * 推送企业
   */
  public doPush() {
    this.xn.loading.open();
    // 构建阐述
    const param = {
      list: this.selectedItems.map((m) => ({
        mainFlowId: m.mainFlowId,
        projectCompany: m.projectCompany,
      })),
    };
    this.xn.api.dragon.post('/pool/pushCompany', param).subscribe(
      () => {
        const html = ` <h4>推送企业成功</h4> `;
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
   * 推送企业(补充协议)
   */
  public doPushAdd() {
    this.xn.loading.open();
    // 构建阐述
    const param = {
      list: this.selectedItems.map((m) => ({
        mainFlowId: m.mainFlowId,
        projectCompany: m.projectCompany,
      })),
    };
    this.xn.api.dragon.post('/pool/pushCompanyAdd', param).subscribe(
      () => {
        const html = ` <h4>推送企业成功</h4> `;
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
   * 查看回传文件 [批量]
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

  /** 查看退回原因 */
  public viewReturnBack(row: any) {
    if (row.returnReason && row.returnReason) {
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        CapitalPoolReturnBackModalComponent,
        row.returnReason
      ).subscribe();
    } else {
      this.xn.msgBox.open(false, '没有查找到退回原因！');
    }

    // 调用接口查找退回原因
    // const params = {
    //     // mainFlowId: row.mainFlowId,
    //     mainFlowIdList: [row.mainFlowId],
    //     capitalPoolId: this.formCapitalPool.capitalId,
    // };
    // this.xn.api.dragon.post('/pool/return_back', params).subscribe(res => {
    //     if (res.data && res.data.reason) {
    //         XnModalUtils.openInViewContainer(this.xn, this.vcr, CapitalPoolReturnBackModalComponent, res.data.reason).subscribe();
    //     } else {
    //         this.xn.msgBox.open(false, '没有查找到退回原因！');
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
    ); // 深拷贝;
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
    this.searchArr = $.extend(true, [], forSearch); // 深拷贝;
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
      this.arr = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
      this.onUrlData();
    });
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      // 设置总部公司选项的类型
      if (row.checkerId === 'headquarters') {
        row.options.isProxy = this.formCapitalPool.isProxy;
      }

      XnFormUtils.convertChecker(row);
    }
  }

  /**
   *  回退操作
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
   *  加载列表信息
   * @param params
   */
  private onList(params) {
    this.xn.api.dragon.post('/pool/tradelist', params).subscribe((json) => {
      this.total = json.data.count;
      this.rows = json.data.data;
      // this.rows = json.data.data.map(c => {
      //     this.PhotoCopy[c.headquarters].forEach(v => {
      //         // 拼成类似c.need_photoCopy01
      //         c[`need_${v}`] = true;
      //     });
      //     return c;
      // });
      this.btnStatusBool = false;
      this.selectedItems = [];
    });
  }

  /**
   *  构建请求参数
   */
  private buildParams() {
    // 分页处理
    const params: any = {
      pageNo: this.paging < 0 ? 1 : this.paging,
      pageSize: this.pageSize,
      createBeginTime: this.createBeginTime,
      createEndTime: this.createEndTime,
      capitalPoolId: this.formCapitalPool.capitalId,
    };

    // 排序处理
    // if (this.sorting && this.naming) {
    //     params.order = [this.sorting + ' ' + this.naming];
    // }

    // 搜索处理
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
   * 合同弹窗--可签署或不签署
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
                tracts.config = { text: `【${this.xn.user.orgName}】` };
              } else if (parseInt(params.contract_type, 10) === 1002) {
                tracts.config = { text: `【${this.xn.user.orgName}】` };
              } else if (parseInt(params.contract_type, 10) === 1003) {
                tracts.config = { text: `【${this.xn.user.orgName}】(盖章)` };
              } else {
                tracts.config = { text: '（盖章）' };
              }

              // 不需要签合同
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
                // 更新添加到库
                if (x === 'ok') {
                  // 上一步接口返回数据，原样传递回去
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
   *  添加，删除资产池
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
   * 操作前检查
   */
  private doBefore() {
    if (!this.rows || this.rows.length === 0) {
      this.xn.msgBox.open(false, '资产池内没有数据，不能执行此操作！');
      return;
    }
    // 选择的行
    const selectedRows = this.rows.filter(
      (x: any) => x.checked && x.checked === true
    );
    // 选择的公司名称
    const selectedCompany = XnUtils.distinctArray(
      selectedRows.filter((c) => c.headquarters).map((c) => c.headquarters)
    ) || [this.defaultHeadquarter];

    if (!selectedRows || selectedRows.length === 0) {
      this.xn.msgBox.open(false, '没有选择数据，不能执行此操作！');
      return;
    }
    if (selectedCompany.length > 1) {
      this.xn.msgBox.open(false, '必须选择相同公司时，才能执行此操作！');
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
