/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-management\dragon-project-manager\project-manage.component.ts
 * @summary：project-manage.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import {
  ButtonConfigModel,
  SubTabListOutputModel,
  TabConfigModel,
  TabListOutputModel
} from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import {
  DragonMfilesViewModalComponent
} from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import {
  CapitalPoolIntermediaryAgencyModalComponent
} from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-intermediary-agency-modal.component';
import {
  CapitalPoolAlertRatioModalComponent
} from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-alert-ratio-modal.component';
import {
  VankechoseTemplateModalComponent
} from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-chose-contractTemplate-modal.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import {
  DragonOcrEditModalComponent
} from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-ocr-edit-modal.component';
import ProjectManagerList from './project-manage.config';
import {
  CompanyName, GjAgencyType,
  OrgTypeEnum,
  ProjectType, SortType,
  SubTabValue,
  TabValue
} from '../../../../../../../shared/src/lib/config/enum';

declare const moment: any;

/**
 *  参数默认
 */
export class EditParamInputModel {
  /** 标题 */
  public title?: string;
  /** 输入项 */
  public checker: CheckersOutputModel[];
  /** 其他配置 */
  public options?: any;
  /** 按钮 */
  public buttons?: string[];
  /** 弹框大小配置 */
  public size?: any;
  public type?: number;
  public mainFlowId?: string;

  constructor() {
    this.options = {tips: '', capitalPoolId: ''};
    this.buttons = ['取消', '确定'];
    this.size = ModalSize.Large;
  }
}

@Component({
  selector: 'lib-project-manage-gj',
  templateUrl: `./project-manage.component.html`,
  styleUrls: ['./project-manage.component.less']
})
export class GjProjectManageComponent implements OnInit {
  /** tab页配置 */
  tabConfig: any;
  /** 激活的标签页，默认激活第一个标签页 */
  defaultValue = TabValue.First;
  /** 列表数据 */
  data: any[] = [];
  /** 页码配置 */
  pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
  };
  /** 搜索项 */
  shows: any[] = [];
  form: FormGroup;
  searches: any[] = []; // 面板搜索配置项
  selectedItems: any[] = []; // 选中的项
  currentTab: any; // 当前标签页
  displayShow = true;

  arrObjs = {}; // 缓存后退的变量
  paging = 0; // 共享该变量
  beginTime: any;
  endTime: any;
  timeId = [];
  nowTimeCheckId = '';
  // 上次搜索时间段
  preChangeTime: any[] = [];
  public listInfo: any[] = []; // 数据

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  heads: any[];
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public subDefaultValue = SubTabValue.DOING; // 默认子标签页
  public formModule = 'dragon-input';
  public isShowByOrgType = true;  // 中介角色隐藏操作按钮
  /** 第一次进来 判断是否从其他页面路由过来 */
  isFirst = true;
  /** queryPaging 路由参数里的页码 */
  queryPaging = 0;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public bankManagementService: BankManagementService,
    private router: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe(d => {
      this.isFirst = Object.keys(d).length <= 0;
      if (!this.isFirst) {
        this.defaultValue = d ? d.defaultValue : this.defaultValue;
        this.queryPaging = d ? d.first : this.pageConfig.first;
      }
    });

    this.router.data.subscribe(() => {
      const tabConfig = ProjectManagerList.getTabConfig(this.localStorageService, this.xn);
      this.tabConfig = !!tabConfig ? tabConfig : new TabConfigModel();
      this.initData(this.defaultValue);
    });
    this.isShowByOrgType = this.xn.user.orgType !== OrgTypeEnum.AGENCY;
  }

  /** 判断是否数组 */
  public judgeDataType(value: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === '[object Array]';
    }
  }

  /** 格式化数据 */
  public jsonTransForm(data) {
    return JsonTransForm(data);
  }

  show() {
    this.displayShow = !this.displayShow;
  }

  getPlan(item) {
    const title = this.tabConfig.tabList.filter(x => x.value === this.defaultValue)[0].label;
    this.xn.router.navigate(['/abs-gj/assets-management/projectPlan-management'], {
      queryParams: {
        title,
        projectId: Number(item.project_manage_id),
        headquarters: item.headquarters,
        projectName: item.projectName,
        storageRack: item.storageRack,
        paging: this.paging,
        defaultValue: this.defaultValue,
        projectNum: item.projectNum,
      }
    });
  }

  /** 列按钮 */
  public handleRowClick(item: any, btn: ButtonConfigModel, i: number) {
    switch (btn.operate) {
      case 'confirm_receivable':
        this.getPlan(item); // 基础资产
        break;
      case 'change_info':
        this.changeInfo(item); // 修改基本信息
        break;
      case 'intermediary_agencyForm':
        this.intermediaryAgencyForm({value: item.project_manage_id, type: item.type}); // 添加参与机构
        break;
      case 'chose_fileComplate':
        this.choseFileComplate(item); // 选择交易文件
        break;
      case 'alert_ratioForm':
        this.alertRatioForm({
          project_manage_id: item.project_manage_id,
          value: item
        }); // 设置警戒比例
        break;
      case 'notice_manage':  // 提醒管理
        this.xn.router.navigate(['/abs-gj/assets-management/notice-manage'], {
          queryParams: {
            project_manage_id: item.project_manage_id,
            projectName: item.projectName
          }
        });
        break;
      case 'delete_project':
        this.deleteProject(i, item.project_manage_id, item.projectName); // 删除项目
        break;
      default:
        break;
    }
  }

  /** 回传文件 */
  turnaroundFile() {
    const params: EditParamInputModel = {
      title: '回传文件',
      checker: [{
        title: '文件',
        checkerId: 'returnFile',
        type: 'mfile-return',
        required: 1,
        options: {fileext: 'jpg,jpeg,png,pdf,zip'},
        value: '',
      }] as CheckersOutputModel[],
      options: {capitalPoolId: ''},
      buttons: ['取消', '上传']
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonOcrEditModalComponent, params)
      .subscribe(() => {
        this.onPage({page: this.paging});
      });
  }

  /** 查看文件信息 */
  viewFiles(paramFile) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile])
      .subscribe();
  }

  /** 设置中介机构 */
  intermediaryAgencyForm(params?: { value: number, type: number }) {
    let agencyList: any[] = [];
    this.xn.dragon.post('/project_manage/agency/project_agency_user_list ', {project_manage_id: params ? params.value : null})
      .subscribe(x => {
        if (x.ret === 0) {
          agencyList = x.data.rows;
        }
        const checkers = [
          {
            checkerId: 'OriginalOrder',
            name: 'OriginalOrder',
            required: 0,
            type: 'text',
            title: '原始权益人 ',
            memo: '',
            value: this.xn.user.orgName,
            options: {
              readonly: true
            }
          },
          {
            checkerId: 'palnManager',
            name: 'palnManager',
            required: 0,
            type: 'agency-picker',
            title: '计划管理人 ',
            memo: '',
            options: {
              helpType: GjAgencyType.PALNMANAGER,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.PALNMANAGER))
          },
          {
            checkerId: 'rateOrg',
            name: 'rateOrg',
            required: 0,
            type: 'agency-picker',
            title: '评级机构 ',
            memo: '',
            options: {
              helpType: GjAgencyType.RATEORG,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.RATEORG))
          },
          {
            checkerId: 'assetServiceOrg',
            name: 'assetServiceOrg',
            required: 0,
            type: 'agency-picker',
            title: '资产服务机构',
            memo: '',
            options: {
              helpType: GjAgencyType.ASSETSERVICEORG,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.ASSETSERVICEORG))
          },
          {
            checkerId: 'investor',
            name: 'investor',
            required: 0,
            type: 'agency-picker',
            title: '投资者',
            memo: '',
            options: {
              helpType: GjAgencyType.INVESTOR,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.INVESTOR))
          },
          {
            checkerId: 'accountingFirm',
            name: 'accountingFirm',
            required: 0,
            type: 'agency-picker',
            title: '会计师事务所',
            memo: '',
            options: {
              helpType: GjAgencyType.ACCOUNTINGFIRM,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.ACCOUNTINGFIRM))
          },
          {
            checkerId: 'lawFirm',
            name: 'lawFirm',
            required: 0,
            type: 'agency-picker',
            title: '律师事务所',
            memo: '',
            options: {
              helpType: GjAgencyType.LAWFIRM,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.LAWFIRM))
          },
          {
            checkerId: 'hostServiceOrg',
            name: 'hostServiceOrg',
            required: 0,
            type: 'agency-picker',
            title: '托管服务机构',
            memo: '',
            options: {
              helpType: GjAgencyType.HOSTSERVICEORG,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.HOSTSERVICEORG))

          }, {
            checkerId: 'caseServiceOrg',
            name: 'caseServiceOrg',
            required: 0,
            type: 'agency-picker',
            title: '资金服务机构',
            memo: '',
            options: {
              helpType: GjAgencyType.CASESERVICEORG,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.CASESERVICEORG))
          },
          {
            checkerId: 'mainSaleOrg',
            name: 'mainSaleOrg',
            required: 0,
            type: 'agency-picker',
            title: '主要销售机构',
            memo: '',
            options: {
              helpType: GjAgencyType.MAINSALEORG,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.MAINSALEORG))
          },
          {
            checkerId: 'unionSaleOrg',
            name: 'unionSaleOrg',
            required: 0,
            type: 'agency-picker',
            title: '联合销售机构',
            memo: '',
            options: {
              helpType: GjAgencyType.UNIONSALEORG,
              helpMsg: String(params ? params.value : null)
            },
            value: JSON.stringify(this.getAgencyList(agencyList, 'agencyType', GjAgencyType.UNIONSALEORG))
          },
        ];

        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          CapitalPoolIntermediaryAgencyModalComponent,
          {project_manage_id: params ? params.value : null, checkers}
        ).subscribe((data: any) => {
          if (!!data) {
            const list: any[] = [];
            for (const key in data) { // 不同中介机构用户列表数据处理
              if (!!data[key]) {
                data[key] = JSON.parse(data[key].substr(0, data[key].length));
                if (data[key] && data[key].length > 0) {
                  list.push(...data[key]);
                }
              }
            }
            // 新增中介机构
            this.xn.dragon.post('/project_manage/agency/add_agency',
              {project_manage_id: params ? params.value : null, agencyList: list})
              .subscribe(() => {
                this.onPage({page: this.paging});
              });
          }
        });
      });

  }

  /**
   * 中介机构数据过滤
   * @param list 原始数据
   * @param checkerId 过滤字段
   * @param value 过滤值
   */
  getAgencyList(list: any[], checkerId: string, value: number): any[] {
    if (list.length < 1) {
      return [];
    } else {
      return list.filter(x => x[checkerId] === value);
    }
  }

  // 查看中介机构
  viewMachine(param?: { id: string }) {
    const checkers = [{
      title: '查看中介机构',
      checkerId: 'projectName',
      type: 'picker',
      required: 0,
      value: param ? param.id : null,
    }
    ];
    const params = {
      checker: checkers,
      title: '查看中介机构',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe();
  }

  /**
   *  标签页，加载列表信息
   * @param activeTab string
   */
  public initData(activeTab: TabValue) {
    this.selectedItems = [];
    this.listInfo = [];
    this.naming = '';
    this.sorting = '';
    this.pageConfig = {pageSize: 10, first: 0, total: 0};
    this.defaultValue = activeTab;
    this.subDefaultValue = SubTabValue.DOING; // 重置子标签默认
    this.paging = this.isFirst ? 0 : this.queryPaging; // 路由参数查询
    this.pageConfig.first = this.isFirst ? 0 : (this.queryPaging - 1) * this.pageConfig.pageSize; // 设置当前页码
    this.onPage({page: this.paging});
    this.isFirst = true;
  }

  /**
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
   * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
   */
  public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
    this.paging = e.page || 1;
    this.onUrlData(); // 导航回退取值
    this.pageConfig = Object.assign({}, this.pageConfig, e);
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
    // 采购融资 ：avenger,  地产abs ：api
    this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
      if (x.data && x.data.rows && x.data.rows.length) {
        this.listInfo = x.data.rows;
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

  // 修改项目基本信息
  changeInfo(row) {
    this.setUpProject(row);
  }

  /**
   * 设置警戒比例
   */
  public alertRatioForm(params?: { project_manage_id: string; value: any }) {
    const projectManageId = params ? params.project_manage_id : null;
    const checkers = [
      {
        checkerId: 'debtUnitRatio',
        name: 'debtUnitRatio',
        required: 1,
        type: 'rate-input',
        options: {size: {min: 0, max: 100}},
        title: '供应商警戒比例 ',
        memo: '',
        value: params ? params.value.debtUnitRatio : null
      },
      {
        checkerId: 'projectCompanyRatio',
        name: 'projectCompanyRatio',
        required: 1,
        type: 'rate-input',
        options: {size: {min: 0, max: 100}},
        title: '项目公司警戒比例 ',
        memo: '',
        value: params ? params.value.projectCompanyRatio : null
      },
    ];

    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      CapitalPoolAlertRatioModalComponent,
      {id: projectManageId, checkers, type: 1}
    ).subscribe(data => {
      if (data && data.debtUnitRatio && data.projectCompanyRatio) {
        this.xn.api.dragon
          .post(
            `/project_manage/project/project_alter_info  `,
            Object.assign({projectManageId}, data)
          )
          .subscribe((v) => {
            if (v.ret === 0) {
              this.xn.msgBox.open(false, '设置成功');
              this.onPage({page: this.paging});
            }
          });
      }
    });
  }

  /**
   *  搜索,默认加载第一页
   */
  public searchMsg() {
    this.selectedItems = [];
    this.paging = 1;
    this.onPage({page: this.paging});
  }

  /**
   * 选择交易文件
   *
   */
  choseFileComplate(paramInfo) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      VankechoseTemplateModalComponent,
      paramInfo
    ).subscribe(v => {
      if (v && v.action === 'ok') {
        this.onPage({page: this.paging});
      }
    });
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
   * @param subTabActive SubTabValue
   */
  public handleSubTabChange(subTabActive: SubTabValue) {
    if (this.subDefaultValue !== subTabActive) {
      this.selectedItems = [];
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.paging = 1;
      this.pageConfig = {pageSize: 10, first: 0, total: 0};
      this.subDefaultValue = subTabActive;
      this.onPage({page: this.paging});
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
    this.onPage({page: 1});
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
   * 单选
   * @param e any
   * @param item any
   * @param index any
   */
  public singelChecked(e, item, index) {
    if (item.checked && item.checked === true) {
      item.checked = false;
      this.selectedItems = this.selectedItems.filter(x => x.mainFlowId !== item.mainFlowId);
    } else {
      item.checked = true;
      this.selectedItems.push(item);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
    }

  }

  /**
   * 查看合同，只读
   * @param con any
   */
  public showContract(con) {
    const params = Object.assign({}, con, {readonly: true});
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
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
      const obj: any = {};
      obj.title = item.title;
      obj.checkerId = item.checkerId;
      obj.required = false;
      obj.type = item.type;
      obj.number = item.number;
      obj.options = item.options;
      obj.selectOptions = item.selectOptions;
      if (item.checkerId === this.timeId[0]) {
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arrObjs[item.checkerId];
      }
      objList.push(obj);
    }

    this.shows = XnUtils.deepClone(objList.sort((a, b) => a.number - b.number)); // 深拷贝，并排序;
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
    const time = this.searches.filter(v => v.type === 'quantum');
    const timeCheckId = time[0] && time[0].checkerId;
    this.nowTimeCheckId = timeCheckId;
    this.form.valueChanges.subscribe((v) => {
      // 时间段
      const changeId = v[timeCheckId];
      // delete v[timeCheckId];
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
            this.paging = 1;
            this.onPage({page: this.paging});
          }
        }
      }
      const arrObj = {};
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
      this.arrObjs = XnUtils.deepClone(arrObj); // 深拷贝;要进行搜索的变量
      this.onUrlData();
    });
  }

  /**
   * 全选
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
      this.selectedItems = this.selectedItems.filter(x => x.mainFlowId !== paramItem.mainFlowId);
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
      start: (this.paging - 1) * this.pageConfig.pageSize,
      length: this.pageConfig.pageSize,
      type: this.currentTab.params
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
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.beginTime = urlData.data.beginTime || this.beginTime;
      this.endTime = urlData.data.endTime || this.endTime;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        pageConfig: this.pageConfig,
        beginTime: this.beginTime,
        endTime: this.endTime,
        arrObjs: this.arrObjs,
      });
    }
  }

  /**
   * 行按钮组事件
   * @param paramBtnOperate 按钮操作配置
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    // 设立项目
    if (paramBtnOperate.operate === 'set-up-project') {
      this.setUpProject();
    }
    // 回传文件
    if (paramBtnOperate.operate === 'return_file') {
      this.turnaroundFile();
    }
  }

  // 设立项目
  setUpProject(paramsInfo?: any) {
    const checkers = [
      {
        title: '项目名称',
        checkerId: 'projectName',
        type: 'text',
        required: 1,
        value: paramsInfo ? paramsInfo.projectName : '',
      },
      {
        title: '项目规模',
        checkerId: 'publishSum',
        type: 'number-control',
        options: {size: {min: 0, max: 1000000000000}},
        required: 0,
        value: paramsInfo ? paramsInfo.publishSum : '',
      },
      {
        title: '获批时间',
        checkerId: 'passTime',
        type: 'date',
        required: false,
        value: paramsInfo && paramsInfo.passTime ? moment(paramsInfo.passTime).format('YYYY-MM-DD') : undefined
      },
      {
        title: '交易场所',
        checkerId: 'dealSite',
        type: 'text',
        required: false,
        value: paramsInfo ? paramsInfo.dealSite : ''
      },
      {
        title: '总部公司',
        checkerId: 'headquarters',
        type: 'text',
        required: 1,
        options: {readonly: true},
        value: CompanyName.CDR,
      },
      {
        title: '项目类型',
        checkerId: 'projectType',
        type: 'select',
        required: false,
        options: {ref: 'projectTypeset'},
        value: paramsInfo ? paramsInfo.projectType : ''
      },
    ];
    const params = {
      checker: checkers,
      title: paramsInfo ? '修改项目基本信息' : '设立项目',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (v === null) {
          return;
        } else {
          v.projectType = v.projectType ? Number(v.projectType) : undefined;
          v.publishSum = v.publishSum ? Number(v.publishSum) : undefined;
          v.headquarters = CompanyName.CDR;

          if (paramsInfo) { // 修改
            v.passTime = new Date(v.passTime).valueOf();
            v.project_manage_id = paramsInfo.project_manage_id;
            this.xn.dragon.post('/project_manage/project/project_alter_info', v)
              .subscribe(() => {
                this.xn.msgBox.open(false, '修改成功');
                this.onPage({page: this.paging});
              });
          } else { // 设立
            v.type = ProjectType.ABS;
            v.passTime = new Date(v.passTime).valueOf();
            this.xn.dragon.post('/project_manage/project/project_add', v)
              .subscribe(() => {
                this.onPage({page: this.paging});
              });
          }
        }
      });
  }

  deleteProject(paramIndex: number, Id: string, projectName: string) {
    this.xn.msgBox.open(true, '是否删除此项目:' + projectName, () => {
      this.xn.dragon.post('/project_manage/project/project_delete', {project_manage_id: Id})
        .subscribe(() => {
          this.onPage({page: this.paging});
        });
    });
  }
}
