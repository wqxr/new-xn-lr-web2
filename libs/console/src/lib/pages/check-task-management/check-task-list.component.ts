/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\pages\check-task-management\check-task-list.component.ts
 * @summary：审核任务管理列表（分单）
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-09-10
 ***************************************************************************/
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { TaskStatus, TradeStatus } from 'libs/shared/src/lib/config/options';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SearchFormComponent } from '@lr/ngx-shared';
import { TableChange } from '@lr/ngx-table';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuditorTypeEnum, RetCodeEnum, SubTabListEnum, TabListIndexEnum, TaskStatusEnum } from 'libs/shared/src/lib/config/enum';
import { FormGroup } from '@angular/forms';
import { SubTabListOutputModel, TabConfigModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import CheckTaskConfigList from './check-task-list-config';
import { DragongetCustomFiledComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-field-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { MachineCustomFieldService } from 'libs/shared/src/lib/services/machine-custom-search-field.service';
import { CustomSearchNumber } from 'libs/shared/src/lib/config/select-options';
import { DragongetCustomListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-list-modal.component';

@Component({
  templateUrl: './check-task-list.component.html',
  styles: []
})
export class CheckTaskManagementListComponent implements OnInit, AfterViewChecked {
  @ViewChild('reviewTable') reviewTable: XnTableComponent;
  @ViewChild('searchForm') searchForm: SearchFormComponent;
  // 页码配置
  pageConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };
  public paging = 1;
  // 表格数据
  public listInfo: any[] = [];
  // 选中项
  public selectedItems: any[] = [];
  public loading = true;
  // 排序
  public sortModels: { [key: string]: any } = {};
  // 页面配置
  public tabConfig: TabConfigModel;
  // 当前子标签页
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel();
  // 当前标签页
  public currentTab: any;
  // 默认激活第一个标签页
  public defaultValue: string = TabListIndexEnum.NO_ASSIGN;
  // 默认子标签页
  public subDefaultValue = SubTabListEnum.DOING;
  public searches: any[] = [];
  public heads: any[] = [];
  // 自定义筛选条件status传值范围定义
  public customSearchNumber: number = CustomSearchNumber.CHECK_TASK;
  // 固定表格列数量
  public FixedHeadNubmer = 0;

  // 表头
  public columns: any[] = [];
  // 搜索项
  public showFields: FormlyFieldConfig[] = [];
  // 搜索项value
  public showModel: any = {};

  // modal
  public isVisible: boolean = false;
  public isLoading: boolean = false;
  public modelForm: FormGroup = new FormGroup({});
  public formModalFields: FormlyFieldConfig[] = []
  public model: any = {} as any;

  // 任务状态
  get taskStatus() {
    return TaskStatus
  }

  // 交易状态
  get tradeStatus() {
    return TradeStatus
  }

  constructor(
    private xn: XnService,
    public hwModeService: HwModeService,
    private message: NzMessageService,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    public MachineCustomFieldService: MachineCustomFieldService
  ) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges()
  }

  ngOnInit(): void {
    this.tabConfig = CheckTaskConfigList.tabConfig;
    this.initData(this.defaultValue, true);
  }

  /**
   *  标签页，加载列表信息
   * @param paramTabValue paramTabValue
   * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
   * paramTabValue: string, init?: boolean
   */
  public initData(paramTabValue: string, init?: boolean) {
    this.defaultValue = paramTabValue;
    // 页面配置
    const find = this.tabConfig.tabList.find(
      (tab: any) => tab.value === this.defaultValue
    );
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(
      (sub: any) => sub.value === this.subDefaultValue
    );
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.columns = this.currentSubTab.headText;
    this.heads = this.formatHeadField(this.currentSubTab.headText)
    this.showFields = this.currentSubTab.showFields;
    this.showModel = { taskStatus: TaskStatusEnum.WAIT_ALLOCATION }
    this.searches = this.formatShowField(this.currentSubTab.showFields);

    this.cdr.detectChanges();
    this.onPage({ pageIndex: 1, pageSize: 10 }, { taskStatus: TaskStatusEnum.WAIT_ALLOCATION }, true);
  }

  /**
   * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
   * @param searchModel  搜索项
   * @param getSortColumn 是否需要拉取自定义列表字段
   * @summary
   */
  public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }, searchModel?: { [key: string]: any }, getSortColumn?: boolean) {
    this.loading = true;
    this.selectedItems = [];
    this.paging = e?.pageIndex || 1;
    this.onUrlData(); // 导航回退取值
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    const params = this.buildParams(searchModel);
    this.xn.dragon.post('/split/list', params).subscribe(x => {
      this.loading = false;
      if (x.ret === RetCodeEnum.OK) {
        this.listInfo = x.data.data;
        this.pageConfig.total = x.data.count;
        if (getSortColumn) {
          this.getColumn(JSON.parse(x.data.column), x.data.lockCount)
        }
      }
    }, (err: any) => {
      this.loading = false;
    }, () => {
      this.loading = false;
    });

  }

  /**
   * 搜索条件查询
   */
  onSearch(data: any) {
    this.pageConfig.pageIndex = 1;
    this.selectedItems = [];
    this.onPage(this.pageConfig, data);
  }

  /**
   * 重置搜索项表单
   */
  onReset(searchForm: any) {
    this.selectedItems = [];
    this.sortModels = {};
    searchForm.form.reset();
    this.reviewTable.clearStatus();
    this.showModel = { taskStatus: TaskStatusEnum.WAIT_ALLOCATION };
    this.onSearch({ taskStatus: TaskStatusEnum.WAIT_ALLOCATION });
  }

  /**
   * 构建列表请求参数
   * @param searchModel 原始数据
   */
  private buildParams(searchModel: { [key: string]: any }) {
    const params: any = {
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
    };

    // 排序处理
    for (const sortKey in this.sortModels) {
      params.order = [
        { name: sortKey, order: this.sortModels[sortKey] }
      ];
    }

    // 搜索处理
    for (const key of Object.keys(searchModel)) {
      if (!XnUtils.isEmptys(searchModel[key], [0])) {
        switch (key) {
          case 'checkTime':
            params.ccsAduitDatetimeStart = searchModel[key][0].getTime()
            params.ccsAduitDatetimeEnd = searchModel[key][1].getTime()
            break;
          case 'centerCheckTime':
            params.ccsZauditDateStart = searchModel[key][0].getTime()
            params.ccsZauditDateEnd = searchModel[key][1].getTime()
            break;
          // 产品名称
          case 'productType':
            const type = searchModel[key]['first']
            const selectBank = searchModel[key]['second']
            params.type = Number(type)
            params.selectBank = selectBank ? Number(selectBank) : undefined
            break;

          default:
            params[key] = searchModel[key];
            break;
        }
      }
    }
    return params;
  }

  /**
   * 自定义筛选条件
   */
  getCustomSearch() {
    // 所有筛选字段
    const headText = this.formatShowField(this.currentSubTab.showFields)
    // 当前页面的筛选字段
    const selectHead = this.formatShowField(this.showFields)
    const params = {
      title: '自定义筛选条件',
      label: 'checkerId',
      type: 1,
      headText: JSON.stringify(headText),
      selectHead: JSON.stringify(selectHead),
      selectField: this.heads,
      status: this.customSearchNumber
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomFiledComponent, params).subscribe(async v => {
      if (v && v.action === ModalCloseStatusEnum.OK) {
        // 重置搜索项值
        this.selectedItems = [];
        // 自定义搜索项
        const newSearches = await this.MachineCustomFieldService.getCustomField(this.customSearchNumber, headText);
        this.searches = XnUtils.deepClone(newSearches)
        // 过滤出搜索配置项
        this.showFields = []
        this.searches.map(search => {
          this.currentSubTab.showFields.map(show => {
            if (show.key === search.checkerId) {
              this.showFields.push(show)
            }
          })
        })
        this.searchForm.form.reset();
        this.searchForm.resetFields(this.showFields);
        this.showModel = { taskStatus: TaskStatusEnum.WAIT_ALLOCATION };
      }
    });
  }

  // 自定义列表
  getCustomlist() {
    // 所有列表字段
    const headText = this.formatHeadField(this.currentSubTab.headText.slice(2))
    // 当前页面的列表字段
    const selectHead = this.formatHeadField(this.columns.slice(2))
    const params = {
      FixedNumber: this.FixedHeadNubmer,
      headText: JSON.stringify(headText),
      selectHead: JSON.stringify(selectHead),
      status: 1
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomListComponent, params).
      subscribe((x: any) => {
        if (x.action === ModalCloseStatusEnum.OK) {
          this.onPage(this.pageConfig, this.searchForm.model, true);
        }
      });
  }

  /**
   * 列表字段配置过滤
   * @param column 自定义列表字段
   * @param lockCount 需要固定的列
   */
  getColumn(column: string[], lockCount: number) {
    this.FixedHeadNubmer = lockCount;
    // 过滤出列表配置项
    const columns = []
    column.map(key => {
      this.currentSubTab.headText.map((head: any) => {
        if (key === head.index) {
          columns.push(head)
        }
      })
    })
    const topHead = this.currentSubTab.headText.slice(0, 2)
    this.columns = topHead.concat(columns)
    // 需要固定的列
    this.columns.forEach((t, index) => {
      if (index + 1 <= this.FixedHeadNubmer + 2) {
        t['fixed'] = 'left'
      } else {
        t['fixed'] = ''
      }
    })
    this.cdr.markForCheck()
  }

  /**
   * 搜索项配置格式转换
   * @param showFields
   * @returns
   */
  formatShowField(showFields: FormlyFieldConfig[]): any[] {
    const searchs = showFields.map(show => {
      return {
        title: show.templateOptions.label,
        checkerId: show.key,
      }
    })
    return searchs
  }

  /**
   * 列表字段配置格式转换
   * @param headConfigs
   * @returns
   */
  formatHeadField(headConfigs: any[]): any[] {
    const heads = headConfigs.map(head => {
      return {
        label: head.title,
        value: head.index,
      }
    })
    return heads
  }

  /**
   * 设置审单人员
   */
  public async setChecker() {
    // 经办人员
    const operatorList = await this.getUserList(AuditorTypeEnum.OPERATOR)
    // 复核人员
    const reviewerList = await this.getUserList(AuditorTypeEnum.REVIEWER)
    this.formModalFields = [
      {
        className: 'ant-col ant-col-md-24 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'operators',
        type: 'select',
        templateOptions: {
          label: '审单经办',
          nzPlaceHolder: '输入关键字搜索',
          multiple: true,
          nzShowSearch: false,
          nzMaxMultipleCount: 3,
          labelSpan: 4,
          controlSpan: 20,
          nzAllowClear: true,
          required: true,
          options: operatorList,
        },
      },
      {
        className: 'ant-col ant-col-md-24 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'reviewers',
        type: 'select',
        templateOptions: {
          label: '审单复核',
          nzPlaceHolder: '输入关键字搜索',
          multiple: true,
          nzShowSearch: false,
          nzMaxMultipleCount: 3,
          labelSpan: 4,
          controlSpan: 20,
          nzAllowClear: true,
          required: true,
          options: reviewerList,
        },
      },
    ] as FormlyFieldConfig[];
    // 展示上一次的复核人员，默认只展示第一条数据已设置的复核人员
    const reviewers = this.selectedItems[0]['reviewerUserInfo'].map(userInfo => userInfo.userId).slice(0, 3);
    this.model = { reviewers };
    this.isVisible = true;
  }

  /**
   * 提交审单人员信息
   */
  modalOK() {
    this.isLoading = true;
    const modelValue = this.modelForm.value;
    const { operators, reviewers } = modelValue;
    const mainFlowIds = this.selectedItems.map((i) => i.mainFlowId); // 交易id列表
    this.xn.dragon
      .post('/split/add_split', {
        mainFlowIds,
        operators,
        reviewers
      })
      .subscribe(
        (x) => {
          this.isLoading = false;
          if (x.ret === RetCodeEnum.OK) {
            this.isVisible = false
            this.modelForm.reset()
            this.message.success('设置成功');
            this.onPage(this.pageConfig, this.searchForm.model);
          }
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  modalCancel() {
    this.isVisible = false
    this.modelForm.reset()
  }

  /**
   * 获取用户列表
   * @param roleId
   */
  getUserList(roleId: string) {
    return new Promise((resolve, reject) => {
      this.xn.loading.open()
      this.xn.dragon.post('/sub_system/docking_people/user_list', { roleId }).subscribe(x => {
        this.xn.loading.close()
        if (x.ret === RetCodeEnum.OK) {
          const userList = x.data.data.map(item => {
            return {
              label: item.userName,
              value: item.userId
            }
          })
          resolve(userList)
        } else {
          resolve([])
        }
      }, (err: any) => {
        this.xn.loading.close()
        reject(err)
      }, () => { });
    })
  }

  /**
   * 数据导出
   * @param
   */
  exportData() {
    const params = this.buildParams(this.searchForm.model);
    delete params.pageNo;
    delete params.pageSize;
    this.xn.loading.open();
    this.xn.dragon.download('/split/down_task_list', params).subscribe(
      (x) => {
        this.xn.loading.close();
        this.xn.dragon.save(x._body, '审单任务数据清单.xlsx');
      },
      () => {
        this.xn.loading.close();
      }
    );
  }

  /**
   * table事件处理
   * @param e 分页参数
   * @param searchForm 搜索项
   */
  handleTableChange(e: TableChange, searchForm: { [key: string]: any }) {
    switch (e.type) {
      case 'pageIndex':
        this.onPage(e, searchForm.model);
        break;
      case 'pageSize':
        this.onPage(e, searchForm.model);
        break;
      case 'checkbox':
        this.selectedItems = e.checkbox || [];
        break;
      case 'sort':
        this.sortModels = e?.sort?.map || {};
        this.onPage(e, searchForm.model);
        break;
      default:
        break;
    }
  }

  /**
   * 回退操作，路由存储
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        pageConfig: this.pageConfig,
      });
    }
  }
}

/** modal关闭时状态枚举 */
export enum ModalCloseStatusEnum {
  /** 确定 */
  OK = "ok",
  /** 取消 */
  CANCEL = "cancel"
}
