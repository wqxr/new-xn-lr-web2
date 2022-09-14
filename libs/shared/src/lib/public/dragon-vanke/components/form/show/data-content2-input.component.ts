import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import TableHeadConfig from '../../../../../config/table-head-config';
import { XnService } from '../../../../../services/xn.service';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from '../../../../modal/invoice-data-view-modal.component';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { ActivatedRoute } from '@angular/router';
@Component({
    templateUrl: './data-content2-input.component.html',
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
@DynamicForm({ type: 'data-content2', formModule: 'dragon-show' })
export class DataContentVankenewComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig?: any;

  items: any[] = [];

  // 左移动距离
  public headLeft = 0;

  // 表格字段对应
  public heads: any;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private route: ActivatedRoute,
    public hwModeService: HwModeService) { }

  ngOnInit() {
    if (!!this.row.data) {
      this.items = JSON.parse(this.row.data);
    }
    this.route.queryParams.subscribe(params => {
      if (this.svrConfig && this.svrConfig.flowId === 'bgy_financing_pre') {
          this.heads = TableHeadConfig.getConfig('龙光提单').碧桂园地产集团有限公司;
      } else {
          this.heads = TableHeadConfig.getConfig('龙光提单').万科企业股份有限公司;
          if (+params.factoringAppId === applyFactoringTtype['深圳市柏霖汇商业保理有限公司']) {
              const headText = JSON.parse(JSON.stringify(this.heads.headText))
              headText.splice(1, 0, { label: '标识', value: 'isPreTrade', options: {type: 'text1' }})
              this.heads.headText = this.uniqueArr(headText, 'label')
          }
      }
    });
  }

  uniqueArr(arr: any, prop: string) {
    return arr.reduce((pre: any, cur: any) => {
        if (!pre.some((c: any) => c[prop] === cur[prop])) {
            pre.push(cur)
        }
        return pre
    }, [])
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
