/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：银行账号选择
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-08-28
 * **********************************************************************
 */

import {
  Component,
  OnInit,
  ViewContainerRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  ModalComponent,
  ModalSize,
} from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { BankCardAddComponent } from './bank-card-add.component';
import { Observable, of } from 'rxjs';
import { IsPreTrade } from 'libs/shared/src/lib/config/enum';

@Component({
  templateUrl: `./dragon-chose-accountinfo.modal.html`,
  selector: 'dragon-chose-accountinfo',
  styles: [
    `
      .modal-title {
        height: 50px;
      }
      .title {
        font-weight: bold;
      }
      ul > li {
        list-style: none;
        font-weight: bold;
      }
      .label {
        font-weight: normal;
        flex: 1;
        color: black;
      }

      .flex {
        display: flex;
      }

      .input-check {
        width: 100px;
      }

      .table-head .sorting,
      .table-head .sorting_asc,
      .table-head .sorting_desc {
        /*position: relative;*/
        cursor: pointer;
      }

      .table-head .sorting:after,
      .table-head .sorting_asc:after,
      .table-head .sorting_desc:after {
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
    `,
  ],
})
export class DragonChoseAccountinfoComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  // 数据
  // tslint:disable-next-line: no-use-before-declare
  label: string;
  // 数组字段
  heads: any[] = [];
  private observer: any;
  datalist01: any[] = [];
  orgName = '';
  appId = '';
  selectedItems: any[] = [];
  public params: any;
  first = 0;
  paging = 0; // 共享该变量
  pageSize = 5;
  beginTime: any;
  endTime: any;
  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  total = 0;
  isPreTrade = 0;
  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private er: ElementRef
  ) {}

  ngOnInit(): void {}

  /**
   * 单选
   * @param paramItem
   * @param index
   */
  public singleChecked(paramItem, index) {
    this.selectedItems = [];
    if (paramItem.checked && paramItem.checked === true) {
      paramItem.checked = false;
      this.selectedItems = this.selectedItems.filter(
        (x: any) => x.cardCode !== paramItem.cardCode
      );
    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      // this.datalist01.push(paramItem);
    }
  }
  addCard() {
    this.modal.close();
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      BankCardAddComponent,
      {}
    ).subscribe((v) => {
      if (v === null) {
        return;
      } else {
        this.modal.open(ModalSize.XLarge);
        this.datalist01.push(v.value);
        this.total = this.datalist01.length;
      }
    });
  }
  /**
   *  打开模态框
   * @param params
   */
  open(params: any): Observable<any> {
    this.onPage(1);
    this.modal.open(ModalSize.XLarge);
    console.log('open', params);
    this.isPreTrade = params.isPreTrade;
    return Observable.create((observer) => {
      this.observer = observer;
    });
  }

  /**
   *  @param event
   *       event.page: 新页码
   *       event.pageSize: 页面显示行数
   *       event.first: 新页面之前的总行数,下一页开始下标
   *       event.pageCount : 页码总数
   */
  onPage(event: any): void {
    this.paging = event.page || 1;
    this.pageSize = event.pageSize || this.pageSize;
    // 后退按钮的处理
    this.first = (this.paging - 1) * this.pageSize;
    const params = this.buildParams();
    this.xn.api.post('/bank_card?method=get', params).subscribe((x) => {
      if (x.ret === 0) {
        const data = x.data.data;
        if (this.isPreTrade == IsPreTrade.YES) {
          this.datalist01 = data.filter((item, index) => {
            // console.log(item);
            if (item.desc === '链融电子账本') {
              this.singleChecked(item, index);
              return item;
            }
          });
        } else {
          this.datalist01 = data;
        }

        this.total = x.data.recordsTotal;
      }
    });
  }

  oncancel() {
    this.modal.close();
  }
  onOk() {
    this.modal.close();
    this.observer.next(this.selectedItems);
    this.observer.complete();
  }
  private buildParams() {
    // 分页处理
    const params: any = {
      start: (this.paging - 1) * this.pageSize,
      length: this.pageSize,
      beginTime: this.beginTime,
      endTime: this.endTime,
    };
    // 排序处理
    if (this.sorting && this.naming) {
      params.order = [this.sorting + ' ' + this.naming];
    }
    return params;
  }
}
