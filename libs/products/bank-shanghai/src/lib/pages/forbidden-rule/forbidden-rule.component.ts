/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：forbidden-rule.component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao       提单禁入规则列表   2019-09-19
 * **********************************************************************
 */
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ButtonConfigModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { EditParamInputModel, ShEditModalComponent } from '../../share/modal/edit-modal.component';
import { ShangHaiMfilesViewModalComponent } from '../../share/modal/mfiles-view-modal.component';
import { ShangHaiPdfSignModalComponent } from '../../share/modal/pdf-sign-modal.component';

@Component({
  selector: 'lib-forbidden-rule',
  templateUrl: './forbidden-rule.component.html',
  styleUrls: ['./forbidden-rule.component.css']
})
export class ForbiddenRuleComponent implements OnInit {
  tabConfig: any;
  // 默认激活第一个标签页 {do_not,do_down}
  label = 'do_not';
  public defaultValue = 'A';  // 默认激活第一个标签页
  displayShow = true;
  // 数据
  data: any[] = [];
  // 页码配置
  pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
  };
  // 搜索项
  shows: any[] = [];
  form: FormGroup;
  searches: any[] = []; // 面板搜索配置项项
  selectedItems: any[] = []; // 选中的项

  currentTab: any; // 当前标签页

  arrObjs = {} as any; // 缓存后退的变量
  paging = 0; // 共享该变量
  timeStorage = {
    preDate: { beginTime: '', endTime: '' },
    factoringEndDate: { beginTime: '', endTime: '' },
    timeId: [],  // 时间checker项id
    preChangeTime: {
      preDate: [],
      factoringEndDate: [],
    }
  };
  public listInfo: any[] = []; // 数据

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  heads: any[];
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public subDefaultValue = 'DOING'; // 默认子标签页
  public formModule = 'dragon-input';

  constructor(private xn: XnService, private vcr: ViewContainerRef, public bankManagementService: BankManagementService,
              private router: ActivatedRoute, public hwModeService: HwModeService) {
  }

  ngOnInit(): void {
    // 其他页面返回时
    this.router.queryParams.subscribe(d => {
      this.defaultValue = d && d.defaultValue ? d.defaultValue : this.defaultValue;
      this.paging = d && d.paging ? Number(d.paging) : 1;
    });
    this.router.data.subscribe(x => {
      this.tabConfig = x;
      this.initData(this.defaultValue, true);
    });
  }

  /**
   *  判断数据类型
   * @param value
   */
  public judgeDataType(value: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === '[object Array]';
    }
  }

  /**
   *  格式化数据
   * @param data
   */
  public jsonTransForm(data) {
    return JsonTransForm(data);
  }

  /**
   *  查看文件信息
   * @param paramFile
   */
  public viewFiles(paramFile) {
    paramFile.isAvenger = true;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiMfilesViewModalComponent, [paramFile]).subscribe();
  }

  /**
   *  标签页，加载列表信息
   * @param paramTabValue
   * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
   */
  public initData(paramTabValue: string, init?: boolean) {
    if (this.defaultValue === paramTabValue && !init) {
      return;
    } else { // 重置全局变量
      this.selectedItems = [];
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.paging = 1;
      this.pageConfig = { pageSize: 10, first: 0, total: 0 };
    }
    this.defaultValue = paramTabValue;
    this.subDefaultValue = 'DOING'; // 重置子标签默认
    this.onPage({ page: this.paging });
  }

  /**
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
   * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
   */
  public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
    this.selectedItems = [];
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
    const params = this.buildParams(this.currentSubTab.params, this.currentTab.value);
    if (this.currentTab.post_url === '') {
      // 固定值
      this.listInfo = [];
      this.pageConfig.total = 0;
      return;
    }
    const postUrl = !!params.companyName ? '/shanghai_bank/sh_company_limit/queryRulesByCompany' : this.currentTab.post_url;
    this.xn.loading.open();
    // 采购融资 ：avenger,  地产abs ：api
    this.xn.dragon.post(postUrl, params).subscribe(x => {
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
    this.paging = 1;
    this.onPage({ page: this.paging, first: 0 });
  }

  /**
   * 重置
   */
  public reset() {
    this.selectedItems = [];
    // this.form.reset(); // 清空
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.buildCondition(this.searches);
    this.searchMsg(); // 清空之后自动调一次search
  }

  /**
   *  子标签tab切换，加载列表
   * @param paramSubTabValue
   */
  public handleSubTabChange(paramSubTabValue: string) {

    if (this.subDefaultValue === paramSubTabValue) {
      return;
    } else {
      this.selectedItems = [];
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.paging = 1;
      this.pageConfig = { pageSize: 10, first: 0, total: 0 };
      // 重置全局变量
    }
    this.subDefaultValue = paramSubTabValue;
    this.onPage({ page: this.paging });
  }

  /**
   *  列表头样式
   * @param paramsKey
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
   * @param sort
   */
  public onSort(sort: string) {
    if (this.sorting === sort) {
      this.naming = this.naming === 'desc' ? 'asc' : 'desc';
    } else {
      this.sorting = sort;
      this.naming = 'asc';
    }
    this.onPage({ page: 1 });
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
   * @param con
   */
  public showContract(con) {
    const params = Object.assign({}, con, { readonly: true });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiPdfSignModalComponent, params).subscribe(() => {
    });
  }

  /**
   * 构建搜索项
   * @param searches
   */
  private buildShow(searches) {
    this.shows = [];
    this.onUrlData();
    this.buildCondition(searches);
  }

  /**
   * 搜索项值格式化
   * @param searches
   */
  private buildCondition(searches) {
    const objList = [];
    this.timeStorage.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));

    searches.map((searche: any, index: number) => {
      const obj = {} as any;
      obj.title = searche.title;
      obj.checkerId = searche.checkerId;
      obj.required = false;
      obj.type = searche.type;
      obj.number = searche.number;
      obj.options = searche.options;
      if (this.timeStorage.timeId.includes(searche.checkerId)) {
        const checkIndex = this.timeStorage.timeId.findIndex((time) => time === searche.checkerId);
        const tmpTime = this.timeStorage[this.timeStorage.timeId[checkIndex]];
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arrObjs[searche.checkerId];
      }
      objList.push(obj);
    });
    this.shows = $.extend(true, [], objList.sort((a, b) => {
      return a.number - b.number;
    })); // 深拷贝，并排序;
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
    this.form.valueChanges.subscribe((v) => {
      // 时间段
      this.timeStorage.timeId.forEach((timeCheck) => {
        if (v[timeCheck] !== '' && timeCheck) {
          const paramsTime = JSON.parse(v[timeCheck]);
          // 保存每次的时间值。
          this.timeStorage.preChangeTime[timeCheck].unshift({ begin: paramsTime.beginTime, end: paramsTime.endTime });
          // 默认创建时间
          this.timeStorage[timeCheck].beginTime = paramsTime.beginTime;
          this.timeStorage[timeCheck].endTime = paramsTime.endTime;
          if (this.timeStorage.preChangeTime[timeCheck].length > 1) {
            if (this.timeStorage.preChangeTime[timeCheck][1].begin === this.timeStorage[timeCheck].beginTime &&
              this.timeStorage.preChangeTime[timeCheck][1].end === this.timeStorage[timeCheck].endTime) {
              // return;
            } else {
              this.timeStorage[timeCheck].beginTime = paramsTime.beginTime;
              this.timeStorage[timeCheck].endTime = paramsTime.endTime;
              this.paging = 1;
              this.onPage({ page: this.paging });
            }
          }
        }
      });
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
      this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
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
   * @param paramItem
   * @param index
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
  }

  /**
   * 构建参数
   */
  private buildParams(flag: number | string, type: string) {
    // 分页处理
    const params: any = {
      start: (this.paging - 1) * this.pageConfig.pageSize,
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
    return params;
  }

  /**
   * 构建checker项
   */
  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   * 回退操作
   * @param data
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.timeStorage = urlData.timeStorage || this.timeStorage;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
      this.label = urlData.data.label || this.label;
      this.subDefaultValue = urlData.data.subDefaultValue || this.subDefaultValue;
      this.defaultValue = urlData.data.defaultValue || this.defaultValue;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        pageConfig: this.pageConfig,
        timeStorage: this.timeStorage,
        arrObjs: this.arrObjs,
        label: this.label,
        subDefaultValue: this.subDefaultValue,
        defaultValue: this.defaultValue,
      });
    }
  }

  /**
   * 搜索项栏是否收缩
   */
  show() {
    this.displayShow = !this.displayShow;
  }

  /**
   * 行按钮组事件
   * @param paramItem 当前行数据
   * @param btnOperate 按钮操作配置
   * @param i 下标
   */
  public handleHeadClick(btnOperate: ButtonConfigModel) {
    // if (this.selectedItems && this.selectedItems.length > 0) {
    //   const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
    //   btnOperate.click(this.xn, mainFlowIds);
    // } else {
    //   this.xn.msgBox.open(false, '请先选择交易');
    // }
    if (btnOperate.operate === 'add_rule') {
      // 新增规则
      this.addRule();
    }
  }

  /**
   * 新增规则
   */
  addRule() {
    const params: EditParamInputModel = {
      title: '新建规则',
      checker: [
        { title: '规则名称', checkerId: 'ruleName', type: 'text', required: true, value: ''},
        { title: '简介', checkerId: 'description', type: 'text-area', options: { inputMaxLength: 50 }, required: true, value: ''},
        { title: '适用渠道', checkerId: 'channel', type: 'linkage-select', options: { ref: 'channel_sh' }, required: true, value: ''},
      ] as CheckersOutputModel[],
      buttons: ['取消', '确定'],
      size: 'xlg'
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe(v => {
      if (v) {
        // channel: "{"proxy":"2","status":"1"}"
        let channel = !!v.channel ? JSON.parse(v.channel) : {};
        const param = {
          ruleName: v.ruleName || '',
          description: v.description || '',
          channel: !!channel.proxy ? Number(channel.proxy) : null
        };
        this.xn.dragon.post('/shanghai_bank/sh_company_limit/addRule', param).subscribe(x => {
          if (x.ret === 0) {
            this.onPage({ page: this.paging });
          }
        });
      }
    });
  }

  /**
   * 行按钮组事件
   * @param item 当前行数据
   * @param btn {label:string,operate:string,value:string,value2?:string}
   * @param i 下标
   */
  public handleRowClick(item: any, btn: ButtonConfigModel, i: number) {
    if (btn.operate === 'view_fobidden_enterprise') {
      // 查看
      // const rolesArr = xn.user.roles.filter((x) => {
        //     // 仅【业务复核人】可使用此按钮
        //     return x === 'reviewer';
        // });
        // if (!(rolesArr && rolesArr.length)) {
        //     xn.msgBox.open(false, '您好，您的权限不够，仅【业务复核人】可进行操作');
        // } else {
          this.xn.router.navigate([`/bank-shanghai/forbidden/enterprise-list`], {
            queryParams: {
                paging: this.paging,
                defaultValue: this.defaultValue,
                title: '提单禁入规则列表',   // 标题
                ruleId: item.ruleId,   // 规则id
            }
          });
      // }
    } else if (btn.operate === 'edit_fobidden_enterprise') {
      // 编辑
      const params: EditParamInputModel = {
        title: '编辑规则',
        checker: [
          { title: '规则名称', checkerId: 'ruleName', type: 'text', required: true, value: item.ruleName || '', options: {readonly: true}},
          { title: '简介', checkerId: 'description', type: 'text-area', options: { inputMaxLength: 50 }, required: true, value: item.description || ''},
          { title: '适用渠道', checkerId: 'channel', type: 'linkage-select', options: { ref: 'channel_sh', readonly: true }, required: true, value: {proxy: Number(item.channel), status: ''}},
        ] as CheckersOutputModel[],
        buttons: ['取消', '确定'],
        size: 'lg'
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe(v => {
        if (v) {
          const param = {
            ruleId: item.ruleId,
            description: v.description || '',
          };
          this.xn.dragon.post('/shanghai_bank/sh_company_limit/updateRule', param).subscribe(x => {
            if (x.ret === 0) {
              this.onPage({ page: this.paging });
            }
          });
        }
      });
    } else if (btn.operate === 'isEnable_rule') {
      // 禁用/启用
      const params = {
        ruleId: item.ruleId,
        status: item.status ? 0 : 1	 // ( 0：禁用， 1：启用 )
      };
      this.xn.dragon.post('/shanghai_bank/sh_company_limit/updateRule', params).subscribe(x => {
        if (x && x.ret === 0) {
          this.onPage({ page: this.paging});
        }
      });
    } else if (btn.operate === 'delete_rule') {
      // 删除
      this.xn.msgBox.open(true, '删除规则将同时删除该规则下所有企业，确定删除？', () => {
        const params = {
          ruleId: item.ruleId
        };
        this.xn.dragon.post('/shanghai_bank/sh_company_limit/deleteRule', params).subscribe(x => {
          if (x && x.ret === 0) {
            this.onPage({ page: this.paging});
          }
        });
      }, () => {});
    } else {
      btn.click(this.xn, item);
    }
  }
}
