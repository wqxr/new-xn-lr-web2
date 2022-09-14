/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\upload-payment-confirmation\upload-payment-confirmation.component.ts
 * @summary：upload-payment-confirmation.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-26
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../shared/src/lib/common/xn-modal-utils';
import { ButtonConfigModel, SubTabListOutputModel } from '../../../../../../shared/src/lib/config/list-config-model';
import { JsonTransForm } from '../../../../../../shared/src/lib/public/pipe/xn-json.pipe';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import CommUtils from '../../../../../../shared/src/lib/public/component/comm-utils';
import { DragonMfilesViewModalComponent } from '../../../../../../shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from '../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { BankManagementService } from '../../../../../../console/src/lib/bank-management/bank-mangement.service';
import { XnUtils } from '../../../../../../shared/src/lib/common/xn-utils';
import { FormlyFieldConfig } from '@ngx-formly/core';
import UploadPaymentBillConfig from './upload-payment-bill.config';
import { IPageConfig } from '../../interfaces';
import { AuditorTypeEnum, SubTabValue, TabValue } from '../../../../../../shared/src/lib/config/enum';
import { ACLService, ACLType } from '@lr/ngx-acl';
import { ToolKitService } from '../../services/tool-kit.service';

@Component({
  selector: 'lib-upload-payment-bill-gj',
  templateUrl: `./upload-payment-bill.component.html`,
  styleUrls: ['./upload-payment-bill.component.less']
})
export class GjUploadPaymentBillComponent implements OnInit {
  tabConfig: any;
  /** 标签页，默认激活第一个 */
  defaultValue = TabValue.First;
  /** 子标签页 */
  subDefaultValue = SubTabValue.DOING;
  /** 页码配置 */
  pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0, total: 0};
  selectedItems: any[] = []; // 选中的项
  /** 当前标签页 */
  currentTab: any;
  /** 当前子标签页 */
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel();
  public listInfo: any[] = []; // 数据
  heads: any[];
  sumReceive = 0;
  sumChangePrice = 0;
  selectSumReceive = 0;
  selectSumChangePrice = 0;
  /** 权限设置 */
  aclType: ACLType = {
    role: [AuditorTypeEnum.FINANCE_OPERATOR, AuditorTypeEnum.FINANCE_REVIEWER],
    mode: 'oneOf',
  };

  /** 查询条件 */
  searchModel: any = {};
  showFields: FormlyFieldConfig[];
  /** 判断是否数组 */
  judgeDataType = XnUtils.isArray;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public bankManagementService: BankManagementService,
    private router: ActivatedRoute,
    public toolKitSrv: ToolKitService,
    private aclService: ACLService,
  ) {}

  ngOnInit(): void {
    const {config, fieldConfig} = new UploadPaymentBillConfig();
    this.showFields = fieldConfig;
    this.tabConfig = config;

    this.aclService.setRole(this.xn.user.roles);
    this.initData(this.defaultValue);
  }

  /** 搜索条件查询 */
  onSearch(data: any) {
    this.searchModel = data;
    this.pageConfig.page = 1;
    this.pageConfig.first = 0;
    this.resetSelectInfo();
    this.onPage(this.pageConfig);
  }

  /** 重置搜索项表单 */
  onReset() {
    this.onSearch({});
  }

  /**
   *  格式化数据
   * @param data any
   */
  public jsonTransForm(data) {
    return JsonTransForm(data);
  }

  /**
   *  查看文件信息
   * @param paramFile any
   */
  public viewFiles(paramFile) {
    paramFile.isAvenger = true;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile])
      .subscribe();
  }

  /** 标签页，加载列表信息 */
  initData(tabValue: TabValue) {
    this.resetSelectInfo();
    this.listInfo = [];
    this.pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};
    this.defaultValue = tabValue;
    this.subDefaultValue = SubTabValue.DOING;
    this.onPage();
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}) {
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);

    this.resetSelectInfo();
    this.onUrlData(); // 导航回退取值
    // tab页配置
    this.currentTab = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    // 子tab页配置
    this.currentSubTab = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.heads = CommUtils.getListFields(this.currentSubTab.headText);
    // 构建参数
    const params = this.buildParams();

    this.xn.loading.open();
    this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
      if (x.data && x.data.data) {
        this.listInfo = x.data.data || [];
        this.sumReceive = x.data.sumReceive || 0;
        this.sumChangePrice = x.data.sumChangePrice || 0;
        this.pageConfig.total = x.data.recordsTotal ? x.data.recordsTotal : x.data.count;
      } else {
        this.listInfo = [];
        this.pageConfig.total = 0;
        this.sumReceive = 0;
        this.sumChangePrice = 0;
      }

      this.xn.loading.close();
    }, () => {
      this.xn.loading.close();
    });
  }

  /** 重置选择信息 */
  resetSelectInfo() {
    this.selectedItems = [];
    this.selectSumReceive = 0;
    this.selectSumChangePrice = 0;
  }

  /** 子标签tab切换，加载列表 */
  handleSubTabChange(subTabValue: SubTabValue) {
    if (this.subDefaultValue !== subTabValue) {
      this.resetSelectInfo();
      this.listInfo = [];
      this.pageConfig = {first: 0, page: 1};
      this.subDefaultValue = subTabValue;
      this.onPage();
    }
  }

  /**
   *  判读列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(this.listInfo.some(x => !x.checked || x.checked && x.checked === false) || this.listInfo.length === 0);
  }

  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  public calcAttrColspan(): number {
    let nums: number = this.currentSubTab.headText.length + 1;
    const boolArray = [this.currentSubTab.canChecked,
      this.currentSubTab.edit && this.currentSubTab.edit.rowButtons && this.currentSubTab.edit.rowButtons.length > 0];
    nums += boolArray.filter(arr => arr === true).length;
    return nums;
  }

  /**
   *  查看合同，只读
   * @param con any
   */
  public showContract(con) {
    const params = Object.assign({}, con, {readonly: true});
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params)
      .subscribe();
  }

  /**
   *  全选
   */
  public checkAll() {
    if (!this.isAllChecked()) {
      this.listInfo.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'mainFlowId');
    } else {
      this.listInfo.forEach(item => item.checked = false);
      this.selectedItems = [];
    }
    this.calcSelectInfo();
  }

  /**
   * 单选
   * @param paramItem any
   */
  public singleChecked(paramItem) {
    if (paramItem.checked && paramItem.checked === true) {
      paramItem.checked = false;
      this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== paramItem.mainFlowId);
    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
    }
    this.calcSelectInfo();
  }

  /** 计算所选的信息 */
  calcSelectInfo() {
    this.selectSumReceive = this.selectedItems
      .reduce((accumulator, curr) => accumulator + Number(curr.receive ? curr.receive : 0), 0)
      .toFixed(2);
    this.selectSumChangePrice = this.selectedItems
      .reduce((accumulator, curr) => accumulator + Number(curr.changePrice ? curr.changePrice : 0), 0)
      .toFixed(2);
  }

  /**
   * 构建参数
   */
  private buildParams() {
    // 分页处理
    const params: any = {
      start: this.pageConfig.first,
      length: this.pageConfig.pageSize,
      /** 【已上传】子标签传 1，【未上传】子标签传 0 */
      flag: Number(this.subDefaultValue === SubTabValue.DONE),
      modelType: ModelType.CDR
    };

    // 搜索处理
    for (const key of Object.keys(this.searchModel)) {
      if (!XnUtils.isEmpty(this.searchModel[key])) {
        if (key === 'factoringEndDate' || key === 'preDate') {
          const date = this.searchModel[key] as Date[];
          params[key] = JSON.stringify({
            beginTime: date[0].getTime().toString(),
            endTime: date[1].getTime().toString(),
          });
        } else {
          params[key] = this.searchModel[key];
        }
      }
    }

    console.log('上传付款确认书查询 - buildParams', params);

    return params;
  }

  /**
   * 回退操作
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.searchModel = urlData.data.searchModel || this.searchModel;
      this.subDefaultValue = urlData.data.subDefaultValue || this.subDefaultValue;
      this.defaultValue = urlData.data.defaultValue || this.defaultValue;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageConfig: this.pageConfig,
        searchModel: this.searchModel,
        subDefaultValue: this.subDefaultValue,
        defaultValue: this.defaultValue,
      });
    }
  }

  /**
   * 行按钮组事件
   * @param paramBtnOperate 按钮操作配置
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    if (this.selectedItems && this.selectedItems.length) {

      if (this.aclService.can(this.aclType)) {
        const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
        paramBtnOperate.click(this.xn, mainFlowIds);
      } else {
        this.xn.msgBox.open(false, '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作');
      }

    } else {
      this.xn.msgBox.open(false, '请先选择交易');
    }
  }
}

/** 列表查询条件，模式类型 8=成都轨交 */
enum ModelType {
  /** 成都轨交 */
  CDR = 8,
}
