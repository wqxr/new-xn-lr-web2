/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\project-company-supplierInfo\company-add-info.component.ts
 * @summary：company-add-info.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-26
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from '../../../../../../shared/src/lib/public/pipe/xn-json.pipe';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  DragonInvoiceDataViewModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/invoice-data-view-modal.component';
import { ActivatedRoute } from '@angular/router';
import {
  DragonMfilesViewModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import {
  DragonPdfSignModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { XnUtils } from '../../../../../../shared/src/lib/common/xn-utils';
import { EditModalComponent } from '../../../../../../shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import {
  CompanyAppId,
  IsProxyDef,
  NodeNumberForCdr,
  PageTypes,
  SortType,
  RetreatType,
  TradeStatus, RetCodeEnum
} from 'libs/shared/src/lib/config/enum';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IPageConfig } from '../../interfaces';
import CompanyAddInfoConfig from './company-add-info.config';

@Component({
  selector: 'lib-company-add-info-gj',
  templateUrl: './company-add-info.component.html',
  styleUrls: ['./company-add-info.component.less']
})
export class GjCompanyAddInfoComponent implements OnInit {
  rows: any[] = [];

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  heads: any[];
  listType: ListType = ListType.Wait;
  /** 缓存上一个 tab Type */
  prevType: ListType = ListType.Wait;
  titleArr = ['上传', '替换'];
  selectedItems: any[] = []; // 选中的项

  /** 枚举 */
  ListType = ListType;
  /** 查询条件 */
  searchModel: any = {};
  showFields: FormlyFieldConfig[];
  /** 页码配置 */
  pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0, total: 0};
  /** 页面类型 */
  type: PageTypes = PageTypes.List;
  /** 中止类型 */
  RetreatType = RetreatType;
  /** 业务状态 */
  TradeStatus = TradeStatus;

  refreshDataAfterAttachComponent = () => this.onPage();

  constructor(
    public xn: XnService,
    public vcr: ViewContainerRef,
    public route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const config = new CompanyAddInfoConfig();
    this.heads = config.heads;
    this.showFields = config.fieldConfig;
    setTimeout(() => this.onPage(), 0);
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

  getList(type: ListType) {
    this.prevType = this.listType;
    this.listType = type;
    this.onPage();
  }

  viewFiles(item) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [item])
      .subscribe();
  }

  viewProcess(mainFloId: string) {
    this.xn.router.navigate([`abs-gj/main-list/detail/${mainFloId}`]);
  }

  /**
   *  查看合同，只读
   * @param paramContractInfo any
   */
  showContract(paramContractInfo) {
    const params = Object.assign({}, paramContractInfo, {readonly: true});
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params)
      .subscribe();
  }

  // 判断数组
  arrayLength(value: any) {
    if (!value) {
      return false;
    }
    const obj =
            typeof value === 'string'
              ? JSON.parse(value)
              : JSON.parse(JSON.stringify(value));
    return !!obj && obj.length > 2;
  }

  /** 查看更多发票 */
  viewMore(item) {
    if (typeof item === 'string') {
      item = JSON.parse(item);
    }
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonInvoiceDataViewModalComponent,
      item
    ).subscribe();
  }


  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}): void {
    this.xn.loading.open();
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);

    // 后退按钮的处理
    this.onUrlData();
    const params = this.buildParams();
    this.xn.dragon.post('/project_add_file/list', params)
      .subscribe(
        res => {
          if (res.ret === RetCodeEnum.OK) {
            this.pageConfig.total = res.data.count;
            this.rows = res.data.data.map(c => {
              try {
                c.addFile = JSON.parse(c.addFile);
              } catch (ex) {
                c.addFile = '';
              }
              return c;
            });
          } else {
            this.listType = this.prevType;
          }
          this.xn.loading.close();
        });
  }

  onSort(sort: string): void {
    if (this.sorting === sort) {
      this.naming = this.naming === SortType.DESC ? SortType.ASC : SortType.DESC;
    } else {
      this.sorting = sort;
      this.naming = SortType.ASC;
    }

    this.onPage();
  }

  onSortClass(checkerId: string): string {
    if (checkerId === this.sorting) {
      return 'sorting_' + this.naming;
    } else {
      return 'sorting';
    }
  }

  /**
   *  上传/替换履约证明
   */
  replaceFile(row) {
    if (this.listType === ListType.Done) {
      if (row.tradeStatus > NodeNumberForCdr.PlatformVerify) {
        this.xn.msgBox.open(false, '仅【平台审核】经办提交之前的交易，可被替换履约证明文件');
        return;
      } else if (row.tradeStatus === NodeNumberForCdr.Abort) {
        this.xn.msgBox.open(false, '此流程已被中止，不可被替换履约证明文件');
        return;
      }
    }
    const fileValue = row.performanceFile === '' ? '' : JSON.parse(row.performanceFile);
    const tit = this.titleArr[this.listType];
    const params = {
      title: `${tit}履约证明`,
      checker: [
        {
          title: `${tit}履约证明`, checkerId: 'proveImg', type: 'dragonMfile',
          options: {
            filename: `${tit}履约证明`,
            fileext: 'jpg, jpeg, png, pdf',
            picSize: '500'
          },
          value: fileValue
        },
      ]
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
      this.xn.loading.open();
      if (v === null) {
        this.xn.loading.close();
        return;
      }
      this.xn.dragon.post('/project_add_file/uploadPerformance', {mainFlowId: row.mainFlowId, fileInfo: v.proveImg})
        .subscribe(() => {
          this.getList(this.listType);
          this.xn.loading.close();
        });
    });
  }

  /**
   *  构建参数
   */
  private buildParams() {
    const params: any = {
      start: this.pageConfig.first,
      length: this.pageConfig.pageSize,
      flag: this.listType,
      isProxy: IsProxyDef.CDR,
      factoringAppId: CompanyAppId.BLH,
    };

    // flag 换成 status
    if (this.listType === ListType.Comp) {
      params.status = ListType.Comp;
      delete params.flag;
    }

    // 搜索处理
    for (const key of Object.keys(this.searchModel)) {
      if (!XnUtils.isEmpty(this.searchModel[key])) {
        params[key] = this.searchModel[key];
      }
    }

    console.log('项目公司补充资料交易列表查询 - buildParams', params);

    return params;
  }

  /**
   * 判断数据类型
   */
  public judgeDataType(paramValue: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(paramValue);
    } else {
      return Object.prototype.toString.call(paramValue) === '[object Array]';
    }
  }

  /**
   *  格式化数据
   * @param paramData any
   */
  public jsonTransForm(paramData) {
    return JsonTransForm(paramData);
  }

  // 回退操作
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.sorting = urlData.data.sorting || this.sorting;
      this.naming = urlData.data.naming || this.naming;
      this.listType = urlData.data.listType || this.listType;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        sorting: this.sorting,
        naming: this.naming,
        listType: this.listType,
        pageConfig: this.pageConfig,
      });
    }
  }

}

/** TAB 页 list */
enum ListType {
  /** 待补充信息 */
  Wait = 0,
  /** 已上传信息 */
  Done = 1,
  /** 已付款 */
  Comp = 3,
}
