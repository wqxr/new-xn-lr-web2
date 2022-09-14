/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file
 * @summary：根据zd-search-data.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   wangqing         中登查询        2021-06-15
 * **********************************************************************
 */
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { SearchFormComponent } from '@lr/ngx-shared';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import {
  SubTabListOutputModel,
  TabListOutputModel,
  ButtonConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DescEditModalComponent } from 'libs/shared/src/lib/public/modal/desc-edit-modal.component';
import { EnterZdType } from 'libs/shared/src/lib/config/enum/common-enum';
declare var $: any;

@Component({
  // selector: 'zd-search',
  templateUrl: `./zd-search-component.html`,
  styleUrls: ['./zd-record.css'],
})
export class ZdSearchComponent implements OnInit {
  @ViewChild('searchForm') searchForm: SearchFormComponent;
  tabConfig: any;
  // 默认激活第一个标签页 {do_not,do_down}
  label = 'do_not';
  public defaultValue = 'A'; // 默认激活第一个标签页
  // 数据
  data: any[] = [];
  // 页码配置
  pageConfig = {
    pageSize: 100,
    first: 0,
    total: 0,
  };
  // 搜索项
  shows: any[] = [];
  form: FormGroup;
  currentTab: any; // 当前标签页
  lastUpdateDate: '';
  arrObjs = {} as any; // 缓存后退的变量
  paging = 1; // 共享该变量
  beginTime: any;
  endTime: any;
  timeId = [];
  nowTimeCheckId = '';
  transferor = '';
  public showFields: any[] = []; // 搜索项

  // 上次搜索时间段
  preChangeTime: any[] = [];
  public listInfo: any[] = []; // 数据
  displayShow = true;
  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  heads: any[];
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public subDefaultValue = 'DOING'; // 默认子标签页
  public formModule = 'dragon-input';
  allArr: any[];
  diferenceTime: number;
  public isCheck = false;
  firstCheck = true;
  serialInvoiceList: string[] = [];
  constructor(
    private xn: XnService,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe((x) => {
      window.setTimeout(() => {
        this.searchForm.model = JSON.parse(JSON.stringify(x));
        this.onPage({ page: this.paging, first: 0 });
      }, 500);
    });

    this.router.data.subscribe((x) => {
      this.tabConfig = x;
      this.initData(this.defaultValue, true);
    });
  }
  pageIndexChange(e) {
    this.onPage({ page: e, first: 0 });
  }
  pageSizeChange(e) {
    this.pageConfig.pageSize = e;
    this.onPage({ page: this.paging, first: 0 });
  }
  checkSingle() {
    this.isCheck = !this.isCheck;
    this.changeList();
    this.firstCheck = true;
  }
  changeList() {
    if (this.isCheck) {
      // 判断是否 勾选不显示命中信息的类型与中登类型不一致搜索结果的checkbox
      const invoiceInfo = this.listInfo.filter(
        (x) => x.classify === 'invoiceNo' && x.invoiceInfo !== ''
      );
      this.data = this.listInfo.filter((x) =>
        ['specialType', 'other'].includes(x.classify)
      ); // 过滤出中登类别为特殊类型和无法识别的业务
      const otherInfo = this.listInfo.filter(
        (x) =>
          x[x.classify] !== '' &&
          !['invoiceNo', 'specialType', 'other'].includes(x.classify)
      ); // 过滤出中登类别为合同编号，合同名字，债务人，且命中的业务
      this.listInfo = [...invoiceInfo, ...this.data, ...otherInfo];
      this.cdr.markForCheck();
    } else if (!this.isCheck && this.firstCheck) {
      this.firstCheck = false;
      this.onPage({ page: this.paging });
    }
  }

  /**
   *  标签页，加载列表信息
   * @param paramTabValue paramTabValue
   * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
   */
  public jsonTransForm(data: any) {
    return JsonTransForm(data);
  }

  /**
   *  标签页，加载列表信息
   * @param paramTabValue paramTabValue
   * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
   */
  public initData(paramTabValue: string, init?: boolean) {
    if (this.defaultValue === paramTabValue && !init) {
      return;
    } else {
      // 重置全局变量
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.paging = 1;
      this.pageConfig = { pageSize: 100, first: 0, total: 0 };
    }
    this.defaultValue = paramTabValue;
    this.subDefaultValue = 'DOING'; // 重置子标签默认
    // 切换标签页面
    if (!init) {
      this.searchForm.form.reset();
      this.searchForm.resetFields(this.showFields);
    }

    this.onPage({ page: this.paging });
  }

  /**
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
   *
   */
  public onPage(
    e?: { page: number; first?: number; pageSize?: number; pageCount?: number },
    searchModel?: { [key: string]: any }
  ) {
    this.paging = e.page || 1;
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    // 页面配置
    const find = this.tabConfig.tabList.find(
      (tab) => tab.value === this.defaultValue
    );
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(
      (sub) => sub.value === this.subDefaultValue
    );
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.showFields = this.currentSubTab.searches;
    this.cdr.detectChanges();
    this.onUrlData(); // 导航回退取值
    if (!this.searchForm) {
      return;
    }
    const params = this.buildParams(this.searchForm, this.searchForm.model);
    if (!params?.transferor) {
      return;
    }
    if (this.currentTab.post_url === '') {
      this.listInfo = [];
      this.pageConfig.total = 0;
      return;
    }
    this.xn.loading.open();
    this.requestInterface(params);
  }

  /**
   * 请求接口
   */
  public requestInterface(params) {
    this.xn.api.post(this.currentTab.post_url, params).subscribe(
      (x) => {
        if (x.data && x.data.list && x.data.list.length) {
          this.listInfo = x.data.list;
          this.pageConfig.total = x.data.total;
          if(x.data.parsingCount>0){
            this.xn.msgBox.open(false,`还有${x.data.parsingCount}条中登数据正在解析中，预计还需${x.data.parsingTime},查询结果可能不完整，建议解析完成后再查！`);
          }
          this.lastUpdateDate = x.data.lastUpdateDate;
          const transferor = x.data.transferor;
          const date1 = moment(this.lastUpdateDate, 'YYYY-MM-DD HH:mm:ss');
          const date2 = moment(
            moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          );
          this.diferenceTime = date2.diff(date1, 'minute');
          this.allArr = [];
          this.listInfo.forEach((v) => {
            if (!!v.invoiceInfo) {
              const datainfo = v.invoiceInfo.split(',');
              const newArray = [];
              this.serialInvoiceList = [];
              datainfo.forEach((y) => {
                this.allArr.push(y.split('-')[0]);
                newArray.push({
                  invoiceNum: y.split('-')[0],
                  transferMoney: y.split('-')[1],
                });
              });
              v.invoiceStyle = newArray;
              this.serialInvoiceList = this.getInvoicekey(
                v.transferAssetDesc,
                newArray
              );
            }
            v.contractName =
              v.contractName === '' ? [] : v.contractName.split(',');
            v.contractNo = v.contractNo === '' ? [] : v.contractNo.split(',');
            v.debtor = v.debtor === '' ? [] : v.debtor.split(',');
            v.specialType =
              v.specialType === '' ? [] : v.specialType.split('#');
            // transferor 合并数组
            v.allArr = this.allArr.concat(
              v.contractName,
              v.contractNo,
              v.debtor,
              transferor,
              v.specialType,
              this.serialInvoiceList
            );
          });
          this.changeList();
        } else {
          // 固定值
          this.listInfo = [];
          this.pageConfig.total = 0;
        }
      },
      () => {
        // 固定值
        this.listInfo = [];
        this.lastUpdateDate = '';
        this.pageConfig.total = 0;
      },
      () => {
        this.xn.loading.close();
      }
    );
  }
  // 高亮显示发票号是否在一个区间内
  getInvoicekey(serialNumberText: string, invoiceList) {
    const serialNumberList = [];
    const invoiceRange = serialNumberText.match(
      /(\d{8}|\d{10})-(\d{8}|\d{10})/g
    );
    const invoice = invoiceList.map((x) => x.invoiceNum);
    if (invoiceRange) {
      invoice.forEach((x) => {
        invoiceRange.forEach((y) => {
          if (x >= y.split('-')[0] && x <= y.split('-')[1]) {
            serialNumberList.push(y);
          }
        });
      });
    }
    return Array.from(new Set(serialNumberList));
  }
  // 查询中登网
  public updateInvoice() {
    this.xn.api
      .post('/custom/zhongdeng/invoice/get_invoicemain', {
        company: this.transferor,
      })
      .subscribe((json) => {
        if (json.data.errcode !== 0) {
          this.xn.msgBox.open(true, json.data.errmsg);
          return;
        } else {
          this.xn.msgBox.open(true, '查询中，请等待');
          const record_id = json.data.record_id;
          const timed = window.setInterval(() => {
            this.xn.api
              .post('/custom/zhongdeng/invoice/get_invoicestatus', {
                record_id,
              })
              .subscribe((data) => {
                if (data.data.status === 2 || data.data.status === 3) {
                  if ($(document).find('.modal-body span').length === 0) {
                    this.xn.msgBox.open(true, data.data.status_info);
                  } else {
                    $(document)
                      .find('.modal-body span')
                      .text(data.data.status_info);
                  }
                  clearInterval(timed);
                } else {
                }
              });
          }, 5000);
        }
      });
  }

  /**
   *
   * @param value 公司名称 批量查询记录
   */
  searchList() {
    this.xn.router.navigate([`console/manage/invoice-search/record`], {
      queryParams: { records: EnterZdType.ZD_SEARCH },
    });
  }
  /**
   *  查看合同，只读
   * @param con con
   */
  public preview(con) {
    this.xn.loading.open();
    this.xn.api
      .post('/custom/zhongdeng/zd/attachment_preview', {
        registerNo: con.registerNo,
      })
      .subscribe((x) => {
        this.xn.loading.close();
        const base64Str = x.data.attachment;
        const blobObj = XnUtils.base64ToBlob(base64Str, 'application/pdf');
        const dataUrl = URL.createObjectURL(blobObj);
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blobObj);
        } else {
          window.open(dataUrl);
        }
      });
  }

  /**
   *  搜索,默认加载第一页
   */
  public onSearch() {
    this.allArr = [];
    this.paging = 1;
    this.onPage({ page: this.paging, first: 0 });
  }

  // 修改备注
  public changeDemo(paramsItem) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DescEditModalComponent,
      { desc: paramsItem.remark }
    ).subscribe((v) => {
      if (v === '') {
        return;
      } else {
        const remarks = `${this.xn.user.userName}  ${moment(
          new Date().getTime()
        ).format('YYYY-MM-DD HH:mm:ss')}\n${v}`;

        if (remarks.length > 4000) {
          this.xn.msgBox.open(false, '备注字数超过4000,不可修改');
          return;
        }
        this.xn.api
          .post('/custom/zhongdeng/invoice/invoice_remark', {
            subject_id: paramsItem.id,
            remark: `${this.xn.user.userName}  ${moment(
              new Date().getTime()
            ).format('YYYY-MM-DD HH:mm:ss')}\n${v}`,
          })
          .subscribe((x) => {
            if (x.data.errcode === 0) {
              paramsItem.remark = `${this.xn.user.userName}  ${moment(
                new Date().getTime()
              ).format('YYYY-MM-DD HH:mm:ss')}\n${v}`;

              this.xn.msgBox.open(false, '修改备注成功', () => {});
            }
          });
      }
    });
  }

  /**
   *  修改类别
   */
  changeType(paramItem) {
    this.xn.router.navigate(['/console/manage/invoice-search/new/change-zd'], {
      queryParams: {
        registerNo: paramItem.registerNo,
        registerDate: paramItem.registerDate,
        registerDueDate: paramItem.registerDueDate,
      },
    });
  }

  /**
   * 重置
   */
  public onReset(searchForm) {
    this.listInfo = [];
    this.paging = 1;
    searchForm.form.reset();
    // this.buildCondition(this.searches);
    this.onSearch();
  }

  /**
   *  判读列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(
      this.listInfo.some(
        (x) => !x.checked || (x.checked && x.checked === false)
      ) || this.listInfo.length === 0
    );
  }

  /**
   * 搜索项值格式化
   * @param searches searches
   */
  /**
   * 构建参数
   */
  private buildParams(searchForm: any, searchModel: { [key: string]: any }) {
    console.log('pageSize==>', this.pageConfig.pageSize);
    // 分页处理
    const params: any = {
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
    };
    // 排序处理

    // 搜索处理
    for (const key of Object.keys(searchModel)) {
      if (!XnUtils.isEmptys(searchModel[key], [0])) {
        if (key === 'invoicebetween') {
          const obj = JSON.parse(searchModel[key]);
          params.invoiceStart = obj.invoiceStart;
          params.invoiceEnd = obj.invoiceEnd;
        } else if (key === 'registerTime') {
          params.registerTimeStart = moment(searchModel[key][0]).valueOf();
          params.registerTimeEnd = moment(searchModel[key][1]).valueOf();
        } else if (key === 'registerDueDate') {
          params.registerDueTimeStart = moment(searchModel[key][0]).valueOf();
          params.registerDueTimeEnd = moment(searchModel[key][1]).valueOf();
        } else {
          params[key] = searchModel[key];
        }
        searchForm.form.get(key).setValue(searchModel[key]);
        this.cdr.markForCheck();
      }
    }
    if (!params.transferor) {
      return;
    } else {
      this.transferor = params.transferor;
      // this.allArr.push(params.transferor);
    }
    // this.allArr = Array.from(new Set(this.allArr));
    return params;
  }

  /**
   * 回退操作
   * @param data data
   */
  private onUrlData(data?) {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.beginTime = urlData.data.beginTime || this.beginTime;
      this.endTime = urlData.data.endTime || this.endTime;
      this.searchForm = urlData.data.searchForm || this.searchForm;
      this.label = urlData.data.label || this.label;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        pageConfig: this.pageConfig,
        beginTime: this.beginTime,
        endTime: this.endTime,
        searchForm: this.searchForm,
        label: this.label,
      });
    }
  }
}
