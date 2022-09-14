/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\push-receipt-list\push-receipt-list.component.ts
 * @summary：push-receipt-list.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2022-12-28
 ***************************************************************************/

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ActivatedRoute } from '@angular/router';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { SignTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import {
  DragonFinancingContractModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { IPageConfig } from '../../interfaces';
import { CompanyAppId, IsProxyDef, SortType, TabValue } from '../../../../../../shared/src/lib/config/enum';
import TabConfig from './push-receipt-list.config';
import { ToolKitService } from '../../services/tool-kit.service';
import { BrowserService } from 'libs/shared/src/lib/services/browser.service';

@Component({
  templateUrl: `./push-receipt-list.component.html`,
  styleUrls: ['./push-receipt-list.component.less']
})
export class GjPushReceiptListComponent implements OnInit, AfterViewInit {

  /** 是否处于 ‘已签署’ tab页，true -> 是 */
  get onSignedTab() {
    return this.label === TabValue.Second;
  }

  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    private vcr: ViewContainerRef,
    public toolKitSrv: ToolKitService,
    private browserService: BrowserService,
  ) {}

  tabConfig: any;
  label = TabValue.First;
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

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  displayShow = true;
  headLeft: number;
  public scrollX = 0;   // 滚动条滚动距离
  /** 浏览器滚动条宽度，默认 8px */
  scrollbarWidth = 8;
  /** 判断是否数组 */
  judgeDataType = XnUtils.isArray;
  @ViewChild('tdFix') tdFix: ElementRef;
  @ViewChild('thFix') thFix: ElementRef;

  private static buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  ngOnInit(): void {
    this.tabConfig = new TabConfig().config;
    this.initData(this.label);
  }

  ngAfterViewInit() {
    this.scrollbarWidth = this.browserService.scrollbarWidth;
  }

  /**
   *  查看文件信息
   */
  public viewFiles(paramFile) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
  }

  public initData(val: TabValue) {
    this.label = val;
    this.selectedItems = []; // 切换标签页是清空选中的项
    this.naming = '';
    this.sorting = '';
    this.pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};
    // 页面配置
    this.currentTab = this.tabConfig.tabList.find((x: any) => x.value === this.label); // 当前标签页
    this.searches = this.currentTab.searches; // 当前标签页的搜索项
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.buildShow(this.searches);

    this.onPage();
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}) {
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);
    this.selectedItems = [];
    this.onUrlData();

    // 构建参数
    const params = this.buildParams();

    this.xn.loading.open();
    this.xn.dragon.post(this.currentTab.get_url, params)
      .subscribe(
        x => {
          if (x.data && x.data.data) {
            this.data = x.data.data || [];
            this.pageConfig.total = x.data.count;
          }
          this.xn.loading.close();
        },
        () => {
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

  public reset() {
    this.selectedItems = [];
    this.form.reset(); // 清空
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.buildCondition(this.searches);
    this.searchMsg();
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

  show() {
    this.displayShow = !this.displayShow;
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
   *  发票字符串转数组格式
   */
  public arrayLength(invoiceValue: string | null | undefined): any[] {
    if (!invoiceValue) {
      return [];
    } else {
      return invoiceValue.split(',');
    }
  }

  /**
   *  查看更多发票
   */
  public viewMore(item) {
    if (typeof item === 'string') {
      item = JSON.parse(item);
    }
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceDataViewModalComponent,
      item
    ).subscribe();
  }

  /**
   * 构建搜索项
   */
  private buildShow(searches) {
    this.shows = [];
    this.onUrlData();
    this.buildCondition(searches);
  }

  /**
   * 搜索项值格式化
   */
  private buildCondition(searches) {
    const objList = [];
    for (const item of searches) {
      const obj = {} as any;
      obj.required = !!item.required;
      obj.title = item.title;
      obj.checkerId = item.checkerId;
      obj.type = item.type;
      obj.number = item.number;
      obj.options = item.options;
      obj.value = this.arrObjs[item.checkerId];

      objList.push(obj);
    }
    this.shows = XnUtils.deepClone(objList.sort((a, b) => a.number - b.number));
    XnFormUtils.buildSelectOptions(this.shows);
    GjPushReceiptListComponent.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
    this.form.valueChanges.subscribe((v) => {
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
   * 构建参数
   */
  private buildParams() {
    // 分页处理
    const params: any = {
      pageNo: this.pageConfig.page,
      pageSize: this.pageConfig.pageSize,
      factoringAppId: `${CompanyAppId.BLH}`,
      ...this.currentTab.params,
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
   * 回退操作
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
      this.label = urlData.data.label || this.label;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageConfig: this.pageConfig,
        arrObjs: this.arrObjs,
        label: this.label
      });
    }
  }

  onScroll($event: Event) {
    const el = $event.currentTarget as HTMLDivElement;
    this.headLeft = el.scrollLeft * -1;

    if (el.scrollLeft !== this.scrollX) {
      this.scrollX = el.scrollLeft;

      [this.tdFix.nativeElement, this.thFix.nativeElement].forEach((c) => {
        c.style.transform = 'translateX(' + (this.scrollX) + 'px)';
        c.style.backgroundColor = '#fff';
      });
    }
  }

  /**
   *  格式化数据
   */
  public jsonTransForm(data) {
    return JsonTransForm(data);
  }

  /**
   *  查看合同，只读
   */
  public showContract(con, readonly?: boolean) {
    const params = Object.assign({}, con, {readonly: this.onSignedTab || readonly});
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
    });
  }

  /** 已签署， true -> 已签署 */
  isSign(head: any, item: any): boolean {
    // head 里存在 bodyContractYyj 字段 && 合同“已”签署
    return head.bodyContractYyj && item[head.bodyContractYyj] === ContractSignStatus.Signed;
  }

  /** 未签署， true -> 未签署 */
  noSign(head: any, item: any) {
    // head 里存在 bodyContractYyj 字段 && 合同“未”签署
    return head.bodyContractYyj && item[head.bodyContractYyj] === ContractSignStatus.NoSign;
  }

  /**
   *  判读列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(this.data.some(x => !x.checked || x.checked && x.checked === false) || this.data.length === 0);
  }

  public checkAll() {
    if (!this.isAllChecked()) {
      this.data.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], 'mainFlowId');
    } else {
      this.data.forEach(item => item.checked = false);
      this.selectedItems = [];
    }
  }

  /**
   * 单选
   */
  public singelChecked(e, item) {
    if (!!item.checked) {
      item.checked = false;
      this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== item.mainFlowId);
    } else {
      item.checked = true;
      this.selectedItems.push(item);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
    }
  }

  /**
   *  表头按钮组
   */
  public handleHeadClick(btn) {
    switch (btn.operate) {
      // 批量签署
      case 'batchSign':
        const contracts = this.formatContracts();
        this.signContract(contracts);
        break;
      case 'download':
        this.download();
        break;
      default:
        break;
    }
  }

  /** 下载附件 */
  download() {
    const params = this.selectedItems.map((c) => {
      // 下载如下字段的文件
      // second_cdr_202_contract
      // second_cdr_203_contract
      // second_cdr_205_contract

      let item = [];
      try {
        const contract202 = JSON.parse(c.second_cdr_202_contract);
        const contract203 = JSON.parse(c.second_cdr_203_contract);
        const contract205 = JSON.parse(c.second_cdr_205_contract);

        item = item.concat(contract202, contract203, contract205);
        return item;
      } catch (e) {
        this.xn.msgBox.open(false, `解析交易 ${c.mainFlowId} 中的文件信息出错！`);
        throw Error(c);
      }
    });

    const files = Array.prototype.concat.apply([], params);

    if (!files.length) {
      this.xn.msgBox.open(false, '未找到合同文件！');
      return;
    }

    this.xn.api.dragon.download('/file/downFile', {files})
      .subscribe((v: any) => {
        this.xn.dragon.save(v._body, `合同附件.zip`);
      });

  }

  /**
   * 单个签署操作
   * @param contract 合同
   * @param tableName table的字段名
   * @param item table行数据，用来获取mainFlowId
   */
  clickContract(contract: any, tableName: string, item: any) {
    const contracts = [
      {
        ...contract,
        mainFlowId: item.mainFlowId,
        yyjTableName: tableName,
        caSignType: SignTypeEnum.cfcaSignType,
        isNoSignTitle: false,
        readonly: false,
      }
    ];
    this.signContract(contracts);
  }

  /**
   * 批量签署数据整理
   * @return contract any[]
   */
  formatContracts() {
    return this.selectedItems
      .map((c: any) => {
        return [
          this.jsonTransForm(c.second_cdr_202_contract)
            .map((d: any) => ({
              ...d,
              yyjTableName: 'second_cdr_202_contract',
              mainFlowId: c.mainFlowId,
              isSign: this.isSign({bodyContractYyj: 'second_cdr_202_contractStatus'}, c)
            })),
          this.jsonTransForm(c.second_cdr_203_contract)
            .map((d: any) => ({
              ...d,
              yyjTableName: 'second_cdr_203_contract',
              mainFlowId: c.mainFlowId,
              isSign: this.isSign({bodyContractYyj: 'second_cdr_203_contractStatus'}, c)
            })),
          this.jsonTransForm(c.second_cdr_205_contract)
            .map((d: any) => ({
              ...d,
              yyjTableName: 'second_cdr_205_contract',
              mainFlowId: c.mainFlowId,
              isSign: this.isSign({bodyContractYyj: 'second_cdr_205_contractStatus'}, c)
            })),
        ];
      })
      .reduce((p: any[], c: any[]) => {
        return Array.prototype.concat.apply(p, c);
      }, [])
      .filter((c: any) => !c.isSign)
      .map((c: any) => {
        return {
          ...c,
          caSignType: SignTypeEnum.cfcaSignType,
          isNoSignTitle: false,
          readonly: false,
        };
      });
  }

  /**
   *  打开签署弹框
   */
  signContract(contracts: any[]) {
    contracts.forEach(element => {
      if (!element.config) {
        element.config = {
          text: ''
        };
      }
    });
    contracts.forEach(x => {
      if (x.label === '应收账款转让合同') {
        x.config.text = '保理商(盖章)';
      } else if (x.label === '应收账款转让登记协议') {
        x.config.text = '乙方公章';
      } else {
        x.config.text = '（盖章）';
      }
    });
    // @ts-ignore
    // 以前数据格式，在数组外挂个属性
    contracts.isProxy = IsProxyDef.CDR;

    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonFinancingContractModalComponent, contracts)
      .subscribe(x => {
        if (x === 'ok') {
          this.onPage(this.pageConfig);
        }
      });
  }
}

enum ContractSignStatus {
  /** 未签署 */
  NoSign = 1,
  /** 已签署 */
  Signed = 2,
}
