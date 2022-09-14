import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import PlanTableConfig from '../../bean/plan-table-config';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';

@Component({
  templateUrl: './plan-table-show.component.html',
  styles: [`
    .xn-input-border-radius {
      border-style: dashed;
    }
    .xn-show-input-textarea {
      background-color: #ffffff;
      border-style: dashed;
      resize: none
    }
    .file-row-table {
      margin-bottom: 0;
    }
    .file-row-table th {
      border-style: dashed;
      font-weight: normal;
      border-color: #d2d6de;
      border-bottom-width: 1px;
      line-height: 100%;
      font-size: 13px;
    }
    .file-row-table td {
      border-style: dashed;
      padding: 6px;
      border-color: #d2d6de;
      font-size: 13px;
    }
    .table-bordered {
      border-style: dashed;
      border-color: #d2d6de;
    }
    .check-value {
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 300px;
      margin-right: 10px;
      vertical-align: top;
    }
    .xn-holiday-alert {
      color: #8d4bbb;
      font-size: 12px;
    }
    .border {
      border: 1px dashed #ccc
    }
    .table-display tr td, .table-display tr th {
      width: 250px;
      vertical-align: middle;
    }
    .height {
      overflow-x: hidden;
    }
    .table-data-content {
      table-layout: fixed;
      width: 3000px;
    }
    .table-height {
      max-height: 600px;
      overflow: auto;
    }
    .table-width {
      width: 1000px;
      overflow: auto;
    }
    .head-height {
      position: relative;
      overflow: hidden;
    }
    .height .head-height table tr td{
      border:1px solid #f4f4f4;
    }
    .table-display {
      margin: 0;
    }
    .relative {
      position: relative
    }
    .red {
      color: #f20000
    }
    .title {
      display: block;
      padding: 5px;
      font-weight: bold;
    }
    .load-btn {
      margin-left: 50px;
    }
    .pre-table {
      table-layout: fixed;
      margin: 0;
    }
    .pre-table tr td:first-child, .pre-table tr th:first-child {
      width: 300px;
    }
    .scroll-height {
      max-height: 300px;
      overflow-y: auto;
    }
    .scroll-height > table {
      border-bottom: none;
      border-top: none;
    }
    .scroll-height > table tr:first-child td {
      border-top: 0;
    }
    .scroll-height > table tr:last-child td {
      border-bottom: 0;
    }
    .tag-color{
      color: #f20000;;
    }
    .guaranttable {
      width: 50% !important;
      float: left;
      margin-top: 35px;
    }
    .filetable{
      line-height: 34px;
      border: 1px solid #ccc;
      height: 34px;
    }
    .table-display tr td {
      width: 200px;
      vertical-align: middle;
      background: #fff;
    }
    .tables {
      overflow-x: hidden;
    }
    .table {
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 0;
      word-break: break-all;
    }
    .table-height {
      max-height: 600px;
      overflow: scroll;
    }
    .head-height {
      position: relative;
      overflow: hidden;
    }
    .table-display {
      margin: 0;
    }
    .relative {
      position: relative
    }
    .red {
      color: #f20000
    }
    .table tbody tr td:nth-child(5) {
      word-wrap: break-word
    }
  `]
})
@DynamicForm({ type: 'plan-table', formModule: 'dragon-show' })
export class PlanTableShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  items: any[] = [];

  // 左移动距离
  public headLeft = 0;

  // 表格字段对应
  heads = PlanTableConfig.getConfig('shanghai').sh_vanke_financing_pre;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public hwModeService: HwModeService) { }

  ngOnInit() {
    if (!!this.row.data) {
      this.items = JSON.parse(this.row.data);
    }
  }

  public onScroll($event) {
    this.headLeft = $event.srcElement.scrollLeft * -1;
  }

  /**
   *  查看更多信息
   * @param item 长字符串    122，3213，12313，
   */
  public viewMore(item) {
    item = item.toString().split(',');
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceDataViewModalComponent,
      item
    ).subscribe(() => {
    });
  }
}
