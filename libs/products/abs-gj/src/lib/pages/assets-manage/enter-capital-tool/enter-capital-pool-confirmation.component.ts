/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-management\enter-capital-tool\enter-capital-pool-confirmation.component.ts
 * @summary：enter-capital-pool-confirmation.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-25
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../../shared/src/lib/common/xn-modal-utils';
import {
  DeletematerialEditModalComponent
} from '../../../../../../../shared/src/lib/public/dragon-vanke/modal/delete-material-modal.component';
import { JsonTransForm } from '../../../../../../../shared/src/lib/public/pipe/xn-json.pipe';
import {
  CapitalPoolExportListModalComponent
} from '../../../../../../../shared/src/lib/public/dragon-vanke/modal/capital-pool-export-list-modal.component';
import {
  DragonChoseCapitalinfoComponent
} from '../../../../../../../shared/src/lib/public/dragon-vanke/modal/chose-capitalPool-modal.component';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ButtonConfigModel } from '../../../../../../../shared/src/lib/config/list-config-model';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../../../../../../shared/src/lib/services/local-storage.service';
import { XnService } from '../../../../../../../shared/src/lib/services/xn.service';
import { XnUtils } from '../../../../../../../shared/src/lib/common/xn-utils';
import { PdfSignModalComponent } from '../../../../../../../shared/src/lib/public/modal/pdf-sign-modal.component';
import { EditModalComponent } from '../../../../../../../shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import {
  FileViewModalComponent
} from '../../../../../../../shared/src/lib/public/dragon-vanke/modal/file-view-modal.component';
import {
  CompanyName,
  IsProxyDef,
  SortType,
  TabValue,
  SelectRange,
  DownloadRange
} from '../../../../../../../shared/src/lib/config/enum';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IPageConfig } from '../../../interfaces';
import GjEnterPoolConfig from './enter-pool-capital.config';
import {
  GjDownloadModalComponent
} from '../../../components/download-modal/download-modal.component';
import { ToolKitService } from '../../../services/tool-kit.service';

@Component({
  selector: 'lib-capital-pool-confirmation-gj',
  templateUrl: `./enter-capital-pool-confirmation.component.html`,
  styleUrls: ['./enter-capital-pool-confirmation.component.less']
})
export class GjEnterCapitalPoolComponent implements OnInit {
  tabConfig: any;
  /** 默认激活第一个标签页 */
  label = TabValue.First;
  // 数据
  data: any[] = [];
  // 页码配置
  pageConfig: IPageConfig = {
    page: 1,
    pageSize: 10,
    first: 0,
    total: 0,
  };
  selectedItems: any[] = []; // 选中的项
  currentTab: any; // 当前标签页

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  fitProject = '';
  capitalPoolId: string;
  capitalPoolName: string;
  public selectedReceivables = 0; // 所选交易的应收账款金额汇总
  public selectedPayableAmounts = 0; // 所选交易的转让价款汇总
  public allReceivables = 0; // 所有交易的应收账款金额汇总
  public allPayableAmounts = 0; // 所有交易的转让价款汇总

  /** 查询条件 */
  searchModel: any = {};
  showFields: FormlyFieldConfig[];
  /** 判断是否数组 */
  judgeDataType = XnUtils.isArray;
  /** 总部公司定义 */
  headquarters = CompanyName.CDR;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private router: ActivatedRoute,
    private localStorageService: LocalStorageService,
    public toolKitSrv: ToolKitService,
  ) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe(x => {
      if (x.projectName !== undefined) {
        this.fitProject = x.projectName + '>';
        this.capitalPoolId = x.capitalPoolId;
        this.capitalPoolName = x.capitalPoolName;
        this.headquarters = x.headquarters;
      }
    });

    const {config, fieldConfig} = new GjEnterPoolConfig();
    this.showFields = fieldConfig;
    this.tabConfig = config;
    this.onPage();
  }

  /** 搜索条件查询 */
  onSearch(data: any) {
    this.searchModel = data;
    this.pageConfig.page = 1;
    this.pageConfig.first = 0;
    this.resetSelectInfo();
    this.resetTradeInfo();
    this.onPage(this.pageConfig);
  }

  /** 重置搜索项表单 */
  onReset() {
    this.onSearch({});
  }

  /** 重置选择信息 */
  resetSelectInfo() {
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.selectedPayableAmounts = 0;
  }

  /** 重置交易金额信息 */
  resetTradeInfo() {
    this.allReceivables = 0;
    this.allPayableAmounts = 0;
  }

  /**
   *  格式化数据
   */
  public jsonTransForm(data) {
    return JsonTransForm(data);
  }

  /**
   *  查看文件信息
   */
  public viewFiles(paramFile) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
  }

  /**
   * 行按钮组事件
   * @param paramBtnOperate 按钮操作配置
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    if (paramBtnOperate.operate === 'enter-capitalpool') { // 移入资产池
      if (this.selectedItems.length === 0) {
        this.xn.msgBox.open(false, '请选择交易');
        return;
      }
      this.enterCapitalPool();
    } else if (paramBtnOperate.operate === 'batch-information') { // 批量补充信息
      if (this.selectedItems.length === 0) {
        this.xn.msgBox.open(false, '请选择交易');
        return;
      }
      this.batchModify();
    } else if (paramBtnOperate.operate === 'download-file') { // 下载附件
      this.downloadSelectedAttach();
    } else if (paramBtnOperate.operate === 'export-file') { // 导出清单
      this.exportCapital();
    }
  }

  private hasSelectRow() {
    const selectedRows = this.data.filter((x: any) => x.checked && x.checked === true);
    return !!selectedRows && selectedRows.length > 0;
  }

  public stringLength(paramsString: string) {
    return paramsString.length;
  }

  viewMemo(paramMemo: string) {
    const checkers = [{
      title: '备注',
      checkerId: 'memo',
      type: 'textarea',
      options: {readonly: true},
      value: paramMemo,
      required: 0
    }];
    const params = {
      checker: checkers,
      title: '查看备注',
      buttons: ['确定'],
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe();
  }

  /**
   * 下载附件
   */
  public downloadSelectedAttach() {
    if (this.selectedItems.length === 0) {
      this.xn.msgBox.open(false, '请选择交易');
      return;
    }

    const hasSelect = this.hasSelectRow();
    const params = {hasSelect};

    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      GjDownloadModalComponent,
      params
    ).subscribe(x => {
      if (!!x) {
        this.xn.loading.open();
        const param = {
          fileTypeKey: {},
          isClassify: x.isClassify,
          mainFlowIdList: [],
        } as any;
        if (x.downloadRange === DownloadRange.All) {
          param.mainFlowIdList = this.data.map(y => y.mainFlowId);
        } else {
          param.mainFlowIdList = this.selectedItems.map(y => y.mainFlowId);
        }
        x.chooseFile.split(',').forEach(y => param.fileTypeKey[y] = true);
        this.xn.api.dragon.download('/list/main/download_deal_flies', param).subscribe((v: any) => {
          this.xn.loading.close();
          this.xn.api.dragon.save(v._body, '资产池附件.zip');
        });
      }
    });
  }

  public exportCapital() {
    if (this.selectedItems.length === 0) {
      this.xn.msgBox.open(false, '请选择交易');
      return;
    }

    const params = this.selectRowCompany();
    XnModalUtils.openInViewContainer(this.xn, this.vcr, CapitalPoolExportListModalComponent, params).subscribe(x => {
      if (x === '') {
        return;
      }
      const param = {
        mainFlowIdList: +x.scope === SelectRange.All
          ? undefined
          : this.selectedItems.filter(c => c.headquarters === this.headquarters).map(y => y.mainFlowId),
        capitalPoolId: '',
        scope: x.scope,
        headquarters: this.headquarters
      };

      this.xn.loading.open();
      this.xn.api.dragon.download('/project_manage/file_contract/down_excel', param).subscribe((v: any) => {
        this.xn.api.dragon.save(v._body, `总部公司为${this.headquarters}的资产池清单.xlsx`);
        this.xn.loading.close();
      }, () => {
        this.xn.loading.close();
      });
    });
  }

  private selectRowCompany() {
    const selectedRows = this.data.filter(
      x => x.checked && x.checked === true
    );
    return {hasSelect: !!selectedRows && selectedRows.length > 0, selectedCompany: this.headquarters};
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}) {
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);

    this.resetSelectInfo();
    this.resetTradeInfo();
    this.onUrlData(); // 导航回退取值
    // 页面配置
    this.currentTab = this.tabConfig.tabList.find((x: any) => x.value === this.label); // 当前标签页
    // 构建参数
    const params = this.buildParams();

    this.xn.loading.open();
    this.xn.dragon.post(this.currentTab.get_url, params).subscribe(x => {
      if (x.data && x.data.rows) {
        this.allPayableAmounts = x.data.sumChangePrice || 0;
        this.allReceivables = x.data.sumReceive || 0;
        this.pageConfig.total = x.data.count;
        this.data = x.data.rows || [];
        this.data.forEach(item => item.receive = item.receive.toFixed(2));
      }

      this.xn.loading.close();
    }, err => {
      this.xn.msgBox.open(false, err.msg || '查询失败');
    });
  }

  enterCapitalPool() {
    if (this.fitProject !== '') {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, DeletematerialEditModalComponent,
        {
          selectedItems: this.selectedItems,
          type: MovePoolType.MoveIn,
          capitalName: this.capitalPoolName,
          capitalPoolId: this.capitalPoolId
        }).subscribe((x) => {
        if (!!x) {
          this.onPage(this.pageConfig);
        }
      });
    } else {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonChoseCapitalinfoComponent,
        {selectedItems: this.selectedItems, type: MovePoolType.MoveIn, headquarters: this.headquarters})
        .subscribe((x) => {
          if (!!x) {
            this.onPage(this.pageConfig);
          }
        });
    }
  }

  /**
   * 批量补充
   */
  public batchModify() {
    if (this.selectedItems.length < 1) {
      this.xn.msgBox.open(false, '请选择交易');
      return false;
    }
    this.localStorageService.setCacheValue('batchModifyMainList', {mainList: this.selectedItems});
    this.xn.router.navigate(['/abs-gj/capital-pool/batch-modify'], {
      queryParams: {isEnterPoor: true}
    });
  }

  /**
   *  列表头样式
   */
  public onSortClass(paramsKey: string): string {
    if (paramsKey === this.sorting) {
      return 'sorting_' + this.naming;
    } else {
      return 'sorting';
    }
  }

  /**
   *  按当前列排序
   */
  public onSort(sort: string) {
    if (this.sorting === sort) {
      this.naming = this.naming === SortType.DESC ? SortType.ASC : SortType.DESC;
    } else {
      this.sorting = sort;
      this.naming = SortType.ASC;
    }
    this.onPage();
  }

  /**
   *  判读列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(this.data.some(x => !x.checked || x.checked && x.checked === false) || this.data.length === 0);
  }

  /**
   *  全选
   */
  public checkAll() {
    if (!this.isAllChecked()) {
      this.data.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], 'mainFlowId');
    } else {
      this.data.forEach(item => item.checked = false);
      this.selectedItems = [];
    }
    this.selectedReceivables = this.selectedItems
      .reduce((accumulator, currentValue) => accumulator + Number(currentValue.receive ? currentValue.receive : 0), 0)
      .toFixed(2);
    this.selectedPayableAmounts = this.selectedItems
      .reduce((accumulator, currentValue) => accumulator + Number(currentValue.changePrice ? currentValue.changePrice : 0), 0)
      .toFixed(2);
  }

  /**
   * 单选
   */
  public singelChecked(e, item) {
    if (item.checked && item.checked === true) {
      item.checked = false;
      this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== item.mainFlowId);
    } else {
      item.checked = true;
      this.selectedItems.push(item);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
    }
    this.selectedReceivables = this.selectedItems
      .reduce((accumulator, currentValue) => accumulator + Number(currentValue.receive ? currentValue.receive : 0), 0)
      .toFixed(2);
    this.selectedPayableAmounts = this.selectedItems
      .reduce((accumulator, currentValue) => accumulator + Number(currentValue.changePrice ? currentValue.changePrice : 0), 0)
      .toFixed(2);
  }

  /**
   *  查看合同，只读
   */
  public showContract(con) {
    const params = Object.assign({}, con, {readonly: true});
    XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, params).subscribe();
  }

  /**
   * 构建参数
   */
  private buildParams() {
    // 分页处理
    const params: any = {
      start: this.pageConfig.first,
      length: this.pageConfig.pageSize,
      isProxy: IsProxyDef.CDR,
    };
    // 排序处理
    if (this.sorting && this.naming) {
      params.order = [this.sorting + ' ' + this.naming];
    }

    // 搜索处理
    for (const key of Object.keys(this.searchModel)) {
      if (!XnUtils.isEmpty(this.searchModel[key])) {
        if (key === 'preDate') {
          const date = this.searchModel[key] as Date[];
          params.headPreDateStart = date[0].getTime().toString();
          params.headPreDateEnd = date[1].getTime().toString();
        } else {
          params[key] = this.searchModel[key];
        }
      }
    }

    console.log('拟入池交易列表查询 - buildParams', params);

    return params;
  }

  goBack() {
    this.xn.user.navigateBack();
  }

  /** 回退操作 */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.label = urlData.data.label || this.label;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageConfig: this.pageConfig,
        label: this.label
      });
    }
  }
}

enum MovePoolType {
  /** 移入资产池 */
  MoveIn  = 1,
  /** 移除资产池 */
  MoveOut = 2,
}
