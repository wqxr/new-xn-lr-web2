/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-management\contract-template\contract-template.component.ts
 * @summary：contract-template.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-25
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../../shared/src/lib/common/xn-modal-utils';
import {
  ButtonConfigModel,
} from '../../../../../../../shared/src/lib/config/list-config-model';
import { JsonTransForm } from '../../../../../../../shared/src/lib/public/pipe/xn-json.pipe';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  DragonMfilesViewModalComponent
} from '../../../../../../../shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import {
  DragonPdfSignModalComponent
} from '../../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnService } from '../../../../../../../shared/src/lib/services/xn.service';
import { BankManagementService } from '../../../../../../../console/src/lib/bank-management/bank-mangement.service';
import { XnUtils } from '../../../../../../../shared/src/lib/common/xn-utils';
import {
  CompanyAppId,
  CompanyName,
  IsProxyDef,
  SubTabValue,
  TabValue
} from '../../../../../../../shared/src/lib/config/enum';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IPageConfig } from '../../../interfaces';
import ContractTemplateConfig from './contract-template.config';
import { ToolKitService } from '../../../services/tool-kit.service';

@Component({
  selector: 'lib-contract-manage-gj',
  templateUrl: `./contract-template.component.html`,
  styleUrls: ['contract-template.component.less']
})
export class GjContractManageComponent implements OnInit {
  tabConfig: any;
  defaultValue = TabValue.First;
  subDefaultValue = SubTabValue.DOING;
  // 数据
  data: any[] = [];
  // 页码配置
  pageConfig: IPageConfig = {
    page: 1,
    pageSize: 10,
    first: 0,
    total: 0,
  };
  currentTab: any;
  currentSubTab: any;

  public listInfo: any[] = []; // 数据
  heads: any[];

  /** 二次转让合同类型 */
  SECOND_CONTRACT_MANAGE = 1;

  /** 查询条件 */
  searchModel: any = {};
  showFields: FormlyFieldConfig[];
  /** 判断是否数组 */
  judgeDataType = XnUtils.isArray;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public bankManagementService: BankManagementService,
    public toolKitSrv: ToolKitService,
  ) {}

  ngOnInit(): void {
    const {fieldConfig, config} = new ContractTemplateConfig();

    this.tabConfig = config;
    this.showFields = fieldConfig;
    // 页面配置
    this.currentTab = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    // 子页面配置
    this.currentSubTab = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.heads = this.currentSubTab.headText;

    setTimeout(() => {
      this.onPage();
    });
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
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe();
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}) {
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);
    this.onUrlData(); // 导航回退取值
    // 构建参数
    const params = this.buildParams();

    this.xn.loading.open();
    this.xn.dragon.post('/contract/second_contract_info/init_second_template', {})
      .subscribe(() => {
        this.requestInterface(params);
      });
  }

  /**
   * 请求接口
   */
  public requestInterface(params) {
    this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
      if (x.data && x.data.data && x.data.data.length) {
        this.listInfo = x.data.data;
        this.pageConfig.total = x.data.count;
      } else {
        this.listInfo = [];
        this.pageConfig.total = 0;
      }
      this.xn.loading.close();
    }, () => {
      this.xn.loading.close();
    });
  }

  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  public calcAttrColspan(): number {
    if (this.currentSubTab) {
      let nums: number = this.currentSubTab.headText.length + 1;
      const boolArray = [this.currentSubTab.canChecked,
        this.currentSubTab.edit && this.currentSubTab.edit.rowButtons && this.currentSubTab.edit.rowButtons.length > 0];
      nums += boolArray.filter(arr => arr === true).length;
      return nums;
    }
  }

  /**
   *  查看合同，只读
   */
  public showContract(con, paramId: string) {
    const contractId = con.contractId ? con.contractId : paramId; // 获取合同编号
    this.xn.loading.open();
    this.xn.dragon.post('/contract/first_contract_info/get_first_temlate_file',
      {id: contractId, type: this.SECOND_CONTRACT_MANAGE}
    )
      .subscribe(x => {
        if (x.ret === 0) {
          this.xn.loading.close();
          const data = JSON.parse(x.data)[0];
          const params = Object.assign({}, data, {readonly: true});
          XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe();
        }
      });
  }

  /**
   * 构建参数
   */
  private buildParams() {
    // 分页处理
    const params: any = {
      start: this.pageConfig.first,
      length: this.pageConfig.pageSize,
      headquarters: CompanyName.CDR,
      isProxy: IsProxyDef.CDR,
      factoringAppId: CompanyAppId.BLH,
    };

    // 搜索处理
    for (const key of Object.keys(this.searchModel)) {
      if (!XnUtils.isEmpty(this.searchModel[key])) {
        params[key] = this.searchModel[key];
      }
    }

    console.log('二次转让合同管理 - buildParams', params);

    return params;
  }

  /**
   * 回退操作
   * @param data any
   */
  private onUrlData(data?) {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageConfig: this.pageConfig,
      });
    }
  }

  /**
   * 头按钮组事件
   * @param paramBtnOperate 按钮操作配置
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    paramBtnOperate.click(this.xn, []);
  }

  /**
   * 行按钮组事件
   * @param item 当前行数据
   * @param btn ButtonConfigModel
   * @param i 下标
   */
  public handleRowClick(item, btn: ButtonConfigModel, i: number) {
    const mainFlowIds = item.id;
    switch (btn.operate) {
      // 修改
      case 'sub_first_contract_modify':
        btn.click(this.xn, mainFlowIds);
        break;
      // 删除
      case 'sub_first_contract_delete':
        btn.click(this.xn, mainFlowIds);
        break;
      default:
        break;
    }
  }
}
