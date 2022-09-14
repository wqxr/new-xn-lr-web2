/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\record\business-related.component.ts
 * @summary：business-related.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/
import {
  Component, Input, OnInit,
} from '@angular/core';
import CommUtils from '../../../../../../shared/src/lib/public/component/comm-utils';
import BusinessDataTabConfig from '../../common/vanke-business-related';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';

@Component({
  selector: 'lib-business-related-gj',
  templateUrl: './business-related.component.html',
  styles: [
    `
      .table {
        font-size: 13px;
      }

      .table-head .sorting,
      .table-head .sorting_asc,
      .table-head .sorting_desc {
        position: relative;
        cursor: pointer;
      }

      .table-head .sorting:after,
      .table-head .sorting_asc:after,
      .table-head .sorting_desc:after {
        position: absolute;
        bottom: 8px;
        right: 8px;
        display: block;
        font-family: 'Glyphicons Halflings';
        opacity: 0.5;
      }

      .table-head .sorting:after {
        content: '\\e150';
        opacity: 0.2;
      }

      .table-head .sorting_asc:after {
        content: '\\e155';
      }

      .table-head .sorting_desc:after {
        content: '\\e156';
      }

      .tab-heads {
        margin-bottom: 10px;
        display: flex;
      }

      tbody tr:hover {
        background-color: #e6f7ff;
        transition: all 0.1s linear;
      }
    `
  ]
})
export class GjBusinessComponent implements OnInit {
  /** 列表数据 */
  data: any[] = [];
  heads: any[];
  @Input() mainFlowId: string;

  /** 页码配置 */
  pageConfig = {
    pageSize: 10,
    first: 1,
    total: 0,
  };
  tabConfig: any;
  /** 部分公司选项 */
  options = [];
  paging = 0; // 共享该变量

  constructor(
    private xn: XnService,
  ) {}

  ngOnInit() {
    this.tabConfig = BusinessDataTabConfig.businessRelated;
    this.onPage({page: this.paging});
  }

  viewRecord(record: string) {
    this.xn.router.navigate([`/abs-gj/record/todo/view/${record}`]);
  }

  public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
    this.paging = e.page || 0;
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    // 页面配置

    this.heads = CommUtils.getListFields(this.tabConfig.heads);

    this.xn.loading.open();
    // 采购融资 ：avenger,  地产abs ：api
    this.xn.dragon.post('/list/main/flow_relate_info',
      {mainFlowId: this.mainFlowId, start: this.paging, length: this.pageConfig.pageSize}).subscribe(x => {
      if (x.data && x.data.data.length) {
        this.data = x.data.data;
        this.pageConfig.total = x.data.count;
      } else {
        // 固定值
        this.data = [];
        this.pageConfig.total = 0;
      }
      this.xn.loading.close();
    }, () => {
      // 固定值
      this.data = [];
      this.pageConfig.total = 0;
      this.xn.loading.close();
    });
  }

  /**
   *  返回
   */
  public onCancel(): void {
    this.xn.user.navigateBack();
  }
}
