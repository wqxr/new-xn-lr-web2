/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\pages\puhui-company-list\puhui-company-list.component.ts
* @summary：平台审核查看发票信息
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 wangqing          init           2022-02-18
***************************************************************************/

import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { Column, ColumnButton, TableChange, TableData } from '@lr/ngx-table';
import { SearchFormComponent } from '@lr/ngx-shared';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChangeDetectorRef } from '@angular/core';
import { OrgTypeEnum, RetCodeEnum, ShEAccountUpdateType } from 'libs/shared/src/lib/config/enum';
declare const $: any;
declare const moment: any;

@Component({
  templateUrl: `./view-invoice.component.html`,
  styles: [
    `
        [nz-button] {
            margin-right: 8px;
            margin-bottom: 12px;
          }
        `
  ]
})
export class InvoiceViewPlatComponent implements OnInit {
  @ViewChild('reviewTable') reviewTable: XnTableComponent;
  @ViewChild('searchForm') searchForm: SearchFormComponent;
  // 表头配置
  public columns: Column[] = [
    // { title: '选择', index: 'id', width: 50, type: 'checkbox' },
    { title: '序号', index: 'no', width: 50, format: (item: TableData, col: Column, index: number): string => (index + 1).toString() },
    { title: '发票号码', index: 'number' },
    { title: '发票代码', index: 'code', },
    { title: '产值号', index: 'outputNumber',  },
    { title: '合同号', index: 'contractNumber' },
    { title: '币种', index: 'currency' },
    { title: '发票金额(含税)', index: 'invoiceAmt' },
    { title: '发票金额(不含税)', index: 'invNoTaxAmt' },
    { title: '税率', index: 'taxRate' },
    { title: '税额', index: 'invoiceTax' },
    { title: '开票日期', index: 'invoiceDate' },
    { title: '发票类型', index: 'invoiceType' },
    { title: 'ICP项目公司', index: 'icpCompany' },
]

  // 页码配置
  pageConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };
  // 表格数据
  public listInfo: any[] = [];
  public listData=[]
  // 选中项
  public loading: boolean = true;
  public mainFlowId:string=''

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private vcr: ViewContainerRef,
    private router: ActivatedRoute,
    private message: NzMessageService) { }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.mainFlowId = params.id;
      this.onPage({ pageIndex: 1 });
    });

  }

  /**
   * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
   * @param searchModel  搜索项
   * @summary
   */
  public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }) {
    this.loading = true
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    this.xn.dragon.post2('/sub_system/vanke_system/query_vanke_invoice', {mainFlowId:this.mainFlowId}).subscribe(x => {
      this.loading = false
      if (x.ret === RetCodeEnum.OK) {
        this.listData = x.data.data;
        this.pageConfig.total = x.data.count;
      } else {
        this.listData = [];
        this.pageConfig.total = 0;
      }
      this.listInfo=XnUtils.deepClone(this.listData);
      this.listData=this.listInfo.slice(this.pageConfig.pageSize*(this.pageConfig.pageIndex-1),this.pageConfig.pageIndex*this.pageConfig.pageSize);
     }, () => {
      this.loading = false
    });


  }

  /**
   * 搜索条件查询
   */
  onSearch(data: any) {
    this.pageConfig.pageIndex = 1;
    this.onPage(this.pageConfig);
  }
/**
   * 构建列表请求参数
   * @param searchModel
   */
  private buildParams() {
    const params: any = {
      pageNo: this.pageConfig.pageIndex,
      pageSize: this.pageConfig.pageSize,
    };
    return params;
  }
  /**
  * 数据导出
  * @param
  */
  exportData() {
    const params = this.buildParams();
    delete params.pageNo
    delete params.pageSize
    this.xn.loading.open()
    this.xn.dragon.download('/sub_system/vanke_system/vanke_invoice_excel', {mainFlowId:this.mainFlowId})
      .subscribe(x => {
        this.xn.loading.close();
        this.xn.dragon.save(x._body, '发票清单.xlsx');
      }, () => {
        this.xn.loading.close();
      })
  }

  /**
 * table事件处理
 * @param e 分页参数
 * @param searchForm 搜索项
 */
  handleTableChange(e: TableChange) {
    console.log(e)
    switch (e.type) {
      case 'pageIndex':
      case 'pageSize' :
        this.listData=this.listInfo.slice(e.pageSize*(e.pageIndex-1),e.pageIndex*e.pageSize);
        break;
      default:
        break;
    }
  }

}
