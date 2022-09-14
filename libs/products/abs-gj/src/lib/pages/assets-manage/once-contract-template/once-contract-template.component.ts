/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-manage\once-contract-template\once-contract-template.component.ts
 * @summary：once-contract-template.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-14
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../../shared/src/lib/common/xn-modal-utils';
import {
  ButtonConfigModel,
  SubTabListOutputModel,
  TabListOutputModel
} from '../../../../../../../shared/src/lib/config/list-config-model';
import { JsonTransForm } from '../../../../../../../shared/src/lib/public/pipe/xn-json.pipe';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import CommUtils from '../../../../../../../shared/src/lib/public/component/comm-utils';
import {
  DragonMfilesViewModalComponent
} from '../../../../../../../shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import {
  DragonPdfSignModalComponent
} from '../../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnFormUtils } from '../../../../../../../shared/src/lib/common/xn-form-utils';
import { XnService } from '../../../../../../../shared/src/lib/services/xn.service';
import { BankManagementService } from '../../../../../../../console/src/lib/bank-management/bank-mangement.service';
import { XnUtils } from '../../../../../../../shared/src/lib/common/xn-utils';
import {
  CompanyAppId,
  CompanyName,
  IsProxyDef,
  SortType,
  SubTabValue,
  TabValue
} from '../../../../../../../shared/src/lib/config/enum';
import { IPageConfig } from '../../../interfaces';
import { ToolKitService } from '../../../services/tool-kit.service';

@Component({
  selector: 'lib-once-contract-manage-gj',
  templateUrl: `./once-contract-template.component.html`,
  styleUrls: ['once-contract-template.component.less']
})
export class GjOnceContractManageComponent implements OnInit {
  tabConfig: any;
  public defaultValue = TabValue.First;  // 默认激活第一个标签页
  // 数据
  data: any[] = [];
  // 页码配置
  pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
    page: 1,
  };
  // 搜索项
  shows: any[] = [];
  form: FormGroup;
  searches: any[] = []; // 面板搜索配置项项
  selectedItems: any[] = []; // 选中的项
  currentTab: any; // 当前标签页

  arrObjs = {} as any; // 缓存后退的变量
  beginTime: any;
  endTime: any;
  timeId = [];
  nowTimeCheckId = '';
  // 上次搜索时间段
  preChangeTime: any[] = [];
  public listInfo: any[] = []; // 数据
  displayShow = true;
  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  heads: any[];
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public subDefaultValue = SubTabValue.DOING; // 默认子标签页
  public formModule = 'dragon-input';
  /** 判断是否数组 */
  judgeDataType = XnUtils.isArray;
  /** 一次转让合同类型 */
  FIRST_CONTRACT_MANAGE = 0;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public bankManagementService: BankManagementService,
    private router: ActivatedRoute,
    public toolKitSrv: ToolKitService,
  ) {}

  ngOnInit(): void {
    this.router.data.subscribe(x => {
      this.tabConfig = x;
      this.initData();
    });
  }

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

  public initData(tabValue?: TabValue) {
    if (tabValue) {
      this.defaultValue = tabValue;
    }
    this.selectedItems = [];
    this.listInfo = [];
    this.naming = '';
    this.sorting = '';
    this.pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};
    this.onPage();
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}) {
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);
    this.onUrlData();
    // 页面配置
    const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.heads = CommUtils.getListFields(this.currentSubTab.headText);
    this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
    this.buildShow(this.searches);
    // 构建参数
    const params = this.buildParams();
    if (this.currentTab.post_url === '') {
      // 固定值
      this.listInfo = [];
      this.pageConfig.total = 0;
      return;
    }
    this.xn.loading.open();
    if (this.tabConfig.value === 'once_contract_manage' && this.defaultValue === TabValue.Second
      || this.tabConfig.value === 'second_contract_manage' && this.defaultValue === TabValue.First) {
      const initUrl = 'once_contract_manage' && this.defaultValue === TabValue.Second
        ? '/contract/first_contract_info/init_first_template'
        : '/contract/second_contract_info/init_second_template';
      this.xn.dragon.post(initUrl, {}).subscribe(() => {
        this.requestInterface(params);
      });
    } else {
      this.requestInterface(params);
    }
  }

  /**
   * 请求接口
   */
  public requestInterface(params) {
    this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
      if (x.data && x.data.data && x.data.data.length) {
        this.listInfo = x.data.data;
        if (x.data.recordsTotal === undefined) {
          this.pageConfig.total = x.data.count;
        } else {
          this.pageConfig.total = x.data.recordsTotal;
        }
      } else if (x.data && x.data.lists && x.data.lists.length) {
        this.listInfo = x.data.lists;
        this.pageConfig.total = x.data.count;
      } else {
        // 固定值
        this.listInfo = [];
        this.pageConfig.total = 0;
      }
    }, () => {
      // 固定值
      this.listInfo = [];
      this.pageConfig.total = 0;
    }, () => {
      this.xn.loading.close();
    });
  }

  /**
   *  搜索,默认加载第一页
   */
  public searchMsg() {
    this.selectedItems = [];
    this.onPage();
  }

  /**
   * 重置
   */
  public reset() {
    this.selectedItems = [];
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.buildCondition(this.searches);
    this.searchMsg();
  }

  /**
   *  子标签tab切换，加载列表
   * @param paramSubTabValue string
   */
  public handleSubTabChange(paramSubTabValue: SubTabValue) {
    if (this.subDefaultValue !== paramSubTabValue) {
      this.selectedItems = [];
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};
      this.subDefaultValue = paramSubTabValue;
      this.onPage();
    }
  }

  /**
   *  列表头样式
   * @param paramsKey string
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
   * @param sort string
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
   */
  public showContract(con, paramId: string) {
    const contractId = con.contractId ? con.contractId : paramId; // 获取合同编号
    this.xn.loading.open();
    this.xn.dragon.post('/contract/first_contract_info/get_first_temlate_file',
      {id: contractId, type: this.FIRST_CONTRACT_MANAGE}
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
   * 构建搜索项
   * @param searches any
   */
  private buildShow(searches) {
    this.shows = [];
    this.onUrlData();
    this.buildCondition(searches);
  }

  /**
   * 搜索项值格式化
   * @param searches any
   */
  private buildCondition(searches) {
    const tmpTime = {
      beginTime: this.beginTime,
      endTime: this.endTime
    };
    const objList = [];
    this.timeId = XnUtils.deepClone(this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
    for (const item of searches) {
      const obj = {} as any;
      obj.title = item.title;
      obj.checkerId = item.checkerId;
      obj.required = false;
      obj.type = item.type;
      obj.number = item.number;
      obj.options = item.options;
      if (item.checkerId === this.timeId[0]) {
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arrObjs[item.checkerId];
      }
      objList.push(obj);
    }
    this.shows = XnUtils.deepClone(objList.sort((a, b) => a.number - b.number));
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
    const time = this.searches.filter(v => v.type === 'quantum');
    const timeCheckId = time[0] && time[0].checkerId;
    this.nowTimeCheckId = timeCheckId;
    this.form.valueChanges.subscribe((v) => {
      // 时间段
      const changeId = v[timeCheckId];
      if (changeId !== '' && this.nowTimeCheckId) {
        const paramsTime = JSON.parse(changeId);
        const beginTime = paramsTime.beginTime;
        const endTime = paramsTime.endTime;
        // 保存每次的时间值。
        this.preChangeTime.unshift({begin: beginTime, end: endTime});
        // 默认创建时间
        this.beginTime = beginTime;
        this.endTime = endTime;
        if (this.preChangeTime.length > 1) {
          if (this.preChangeTime[1].begin === this.beginTime &&
            this.preChangeTime[1].end === this.endTime) {
            // return;
          } else {
            this.beginTime = beginTime;
            this.endTime = endTime;
            this.onPage();
          }
        }
      }
      const arrObj = {} as any;
      for (const item in v) {
        if (v.hasOwnProperty(item) && v[item] !== '') {
          const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number').map(c => c.checkerId);
          if (searchFilter.indexOf(item) >= 0) {
            arrObj[item] = Number(v[item]);
          } else {
            arrObj[item] = v[item];
          }
        }
      }
      this.arrObjs = XnUtils.deepClone(arrObj);
      this.onUrlData();
    });
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
  }

  /**
   * 单选
   * @param paramItem any
   * @param index any
   */
  public singleChecked(paramItem, index) {
    if (paramItem.checked && paramItem.checked === true) {
      paramItem.checked = false;
      this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== paramItem.mainFlowId);
    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
    }

  }

  /**
   * 构建参数
   */
  private buildParams() {
    // 分页处理
    const params: any = {
      start: this.pageConfig.first,
      length: this.pageConfig.pageSize,
    };
    // 排序处理
    if (this.sorting && this.naming) {
      params.order = [this.sorting + ' ' + this.naming];
    }
    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          params[search.checkerId] = this.arrObjs[search.checkerId];
        }
      }
    }
    params.headquarters = CompanyName.CDR;
    params.isProxy = IsProxyDef.CDR;
    params.factoringAppId = CompanyAppId.BLH;
    return params;
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   * 回退操作
   * @param data any
   */
  private onUrlData(data?) {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.beginTime = urlData.data.beginTime || this.beginTime;
      this.endTime = urlData.data.endTime || this.endTime;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageConfig: this.pageConfig,
        beginTime: this.beginTime,
        endTime: this.endTime,
        arrObjs: this.arrObjs,
      });
    }
  }

  show() {
    this.displayShow = !this.displayShow;
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
