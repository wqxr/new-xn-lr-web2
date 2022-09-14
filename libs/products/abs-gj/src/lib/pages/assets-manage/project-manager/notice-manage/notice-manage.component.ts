/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-management\dragon-project-manager\notice-manage\notice-manage.component.ts
 * @summary：notice-manage.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-25
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../../../shared/src/lib/common/xn-modal-utils';
import { CheckersOutputModel } from '../../../../../../../../shared/src/lib/config/checkers';
import {
  ButtonConfigModel,
  SubTabListOutputModel
} from '../../../../../../../../shared/src/lib/config/list-config-model';
import { FormGroup } from '@angular/forms';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import CommUtils from '../../../../../../../../shared/src/lib/public/component/comm-utils';
import {
  EditNoticeConfigModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/edit-notice-config.model';
import { XnFormUtils } from '../../../../../../../../shared/src/lib/common/xn-form-utils';
import { XnService } from '../../../../../../../../shared/src/lib/services/xn.service';
import { BankManagementService } from '../../../../../../../../console/src/lib/bank-management/bank-mangement.service';
import { XnUtils } from '../../../../../../../../shared/src/lib/common/xn-utils';
import { SubTabValue, TabValue } from 'libs/shared/src/lib/config/enum/abs-gj.enum';
import { IPageConfig } from '../../../../interfaces';
import { BrowserService } from 'libs/shared/src/lib/services/browser.service';
import NoticeManageList from './notice-manage.config';

declare const moment: any;

@Component({
  selector: 'lib-notice-manage-gj',
  templateUrl: `./notice-manage.component.html`,
  styleUrls: ['./notice-manage.component.less']
})
export class GjNoticeManageComponent implements OnInit, AfterViewInit {
  public tabConfig: any;  // 表格配置
  public currentTab: any;   // 当前标签页tabList
  public defaultValue = TabValue.First;
  public subDefaultValue = SubTabValue.DOING;

  public pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
    page: 1,
  };
  public shows: any[] = [];  // 搜索项
  public form: FormGroup;   // 搜索项表单实例
  public formModule = 'dragon-input';
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public heads: any[]; // 表头
  public searches: any[] = []; // 面板搜索配置项
  public arrObjs = {}; // 缓存后退的变量
  public listInfo: any[] = []; // 表格数据
  public displayShow = true;
  public queryParams: any; // 路由参数
  /** 浏览器滚动条宽度，默认 8px */
  scrollbarWidth = 8;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public bankManagementService: BankManagementService,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private browserService: BrowserService,
  ) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe(queryParams => {
      this.queryParams = queryParams;
    });
    this.tabConfig = new NoticeManageList().config;
    // 页面配置
    this.currentTab = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    // 子页面配置
    this.currentSubTab = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.heads = CommUtils.getListFields(this.currentSubTab.headText);
    this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
    this.buildShow(this.searches);
    setTimeout(() => {
      this.onPage();
    }, 0);
  }

  ngAfterViewInit() {
    this.scrollbarWidth = this.browserService.scrollbarWidth;
    this.cdr.markForCheck();
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}) {
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);
    this.xn.loading.open();

    const params = this.buildParams();
    this.xn.dragon.post(this.currentTab.post_url, params)
      .subscribe(x => {
        this.listInfo = x.data.data;
        this.pageConfig.total = x.data.count;
        this.xn.loading.close();
      }, () => {
        this.xn.loading.close();
      });
  }

  /**
   * 构建列表请求参数
   */
  private buildParams() {

    const params: any = {
      start: this.pageConfig.first,
      length: this.pageConfig.pageSize,
      project_manage_id: this.queryParams.project_manage_id
    };

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
   *  搜索,默认加载第一页
   */
  public searchMsg() {
    this.onPage();
  }

  /**
   * 重置
   */
  public reset() {
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.buildCondition(this.searches);
    this.searchMsg();
  }

  /**
   * 构建搜索项
   */
  private buildShow(searches: any) {
    this.shows = [];
    this.buildCondition(searches);
  }

  /**
   * 搜索项值格式化
   */
  private buildCondition(searches: any) {
    const objList = [];
    for (const item of searches) {
      const obj: any = {};
      obj.title = item.title;
      obj.checkerId = item.checkerId;
      obj.required = false;
      obj.type = item.type;
      obj.options = item.options;
      obj.value = this.arrObjs[item.checkerId];
      objList.push(obj);
    }
    this.shows = XnUtils.deepClone(objList);
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
    this.form.valueChanges.subscribe((v) => {
      const arrObj = {};
      for (const item in v) {
        if (v.hasOwnProperty(item) && v[item] !== '') {
          arrObj[item] = v[item];
        }
      }
      this.arrObjs = XnUtils.deepClone(arrObj);
    });
  }

  /**
   *  列按钮
   */
  public handleRowClick(item: any, btn: ButtonConfigModel) {
    if (btn.operate === 'edit-config') { // 修改配置
      const noticeInfo = {
        project_manage_id: this.queryParams.project_manage_id,
        remindId: item.remindId,
        title: item.title,
        content: item.content,
        isOpen: item.isOpen,
        isSystemRemind: item.isSystemRemind,
        isEmailRemind: item.isEmailRemind,
        userList: item.userList,
        paramConfig: JSON.parse(item.paramConfig),
        paramDesc: item.paramDesc
      };

      const noticeType: any = [1];              // 提醒类型 默认系统提醒开启
      if (noticeInfo.isEmailRemind === 1) {  // 邮件提醒是否开启 0=关闭 1=开启
        noticeType.push(2);
      }

      const checkers = [
        {
          checkerId: 'title',
          required: 0,
          type: 'text',
          title: '提醒事项名称',
          options: {
            readonly: true
          },
          value: noticeInfo.title
        },
        {
          checkerId: 'noticeContent',
          required: 0,
          type: 'textarea',
          title: '提醒内容',
          options: {
            readonly: true
          },
          value: noticeInfo.content
        },
        {
          checkerId: 'paramConfig',
          required: 0,
          type: 'config-params-input',
          title: '参数项',
          options: {
            helpMsg: item.paramType // paramType 参数类型 0=无 1=数值 2=日期
          },
          selectOptions: this.paramConfigPip(item),
          value: item.paramConfig
        },
        {
          checkerId: 'userList',
          required: 1,
          type: 'agency-picker',
          title: '提醒目标用户',
          options: {
            helpMsg: this.queryParams.project_manage_id,
          },
          value: noticeInfo.userList.length > 0 ? JSON.stringify(noticeInfo.userList) : ''
        },
        {
          checkerId: 'noticeType',
          required: 1,
          type: 'checkbox',
          title: '提醒方式',
          options: {ref: 'noticeType'},
          value: noticeType.toString()
        },
        {
          checkerId: 'isOpen',
          required: 1,
          type: 'radio',
          title: '是否启用',
          options: {ref: 'isOpen'},
          value: noticeInfo.isOpen
        },
      ] as CheckersOutputModel[];
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        EditNoticeConfigModalComponent,
        {
          checkers,
          title: '修改配置',
          type: 'edit',
          noticeInfo,

        }
      ).subscribe(x => {
        if (x.action === 'ok') {
          this.xn.msgBox.open(false, '修改配置成功',
            () => {
              this.onPage(this.pageConfig);
            });
        }
      });
    }
  }

  /**
   *  查看提醒事项
   * @param item 行数据
   */
  public viewNotice(item: any) {

    const noticeInfo = {
      project_manage_id: this.queryParams.project_manage_id,
      remindId: item.remindId,
      title: item.title,
      content: item.content,
      isOpen: item.isOpen,
      isSystemRemind: item.isSystemRemind,
      isEmailRemind: item.isEmailRemind,
      userList: item.userList,
      paramConfig: JSON.parse(item.paramConfig),
      paramDesc: item.paramDesc
    };
    const noticeType: any = [];              // 系统提醒类型
    if (noticeInfo.isSystemRemind === 1) { // 系统提醒是否开启 0=关闭 1=开启
      noticeType.push(1);
    }
    if (noticeInfo.isEmailRemind === 1) {  // 邮件提醒是否开启 0=关闭 1=开启
      noticeType.push(2);
    }

    const checkers = [
      {
        checkerId: 'title',
        required: 0,
        type: 'text',
        title: '提醒事项名称',
        options: {
          readonly: true
        },
        value: noticeInfo.title
      },
      {
        checkerId: 'noticeContent',
        required: 0,
        type: 'textarea',
        title: '提醒内容',
        options: {
          readonly: true
        },
        value: noticeInfo.content
      },
      {
        checkerId: 'paramConfig',
        required: 0,
        type: 'config-params-input',
        title: '参数项',
        options: {
          readonly: true,
          helpMsg: item.paramType // paramType 参数类型 0=无 1=数值 2=日期
        },
        selectOptions: JSON.parse(item.paramConfig),
        value: item.paramConfig
      },
      {
        checkerId: 'userList',
        required: 1,
        type: 'agency-picker',
        title: '提醒目标用户',
        options: {
          helpMsg: this.queryParams.project_manage_id,
          readonly: true
        },
        value: JSON.stringify(noticeInfo.userList)
      },
      {
        checkerId: 'noticeType',
        required: 1,
        type: 'checkbox',
        title: '提醒方式',
        options: {ref: 'noticeType', readonly: true},
        value: noticeType.toString()
      },
      {
        checkerId: 'isOpen',
        required: 1,
        type: 'radio',
        title: '是否启用',
        options: {ref: 'isOpen', readonly: true},
        value: noticeInfo.isOpen
      },
    ] as CheckersOutputModel[];
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditNoticeConfigModalComponent,
      {
        checkers,
        title: '查看配置',
        type: 'view',
        noticeInfo,
      }
    ).subscribe();

  }

  /**
   * 构建表单check项
   */
  private buildChecker(stepRows: any) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   * 参数项过滤处理
   */
  private paramConfigPip(item: any) {
    if (typeof item.paramConfig === 'string') {
      // paramType 参数类型 1 数值，2日期
      if (item.paramType === 2) {
        const config = JSON.parse(item.paramConfig);
        config.forEach(x => { x.value = x.value > 0 ? moment(x.value).format('YYYY-MM-DD') : 0; });
        return config;
      }
      return JSON.parse(item.paramConfig);
    }
    if (typeof item.paramConfig === 'object') {
      return item.paramConfig;
    }
    return [];
  }

  /**
   * 返回
   */
  navBack() {
    history.go(-1);
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

  show() {
    this.displayShow = !this.displayShow;
  }
}
