import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ReconciliationDetailModalComponent } from 'libs/shared/src/lib/public/modal/reconciliation-detail-modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  selector: 'reconciliation-manage',
  templateUrl: './reconciliation-manage.component.html',
  styles: [
  ]
})
export class ReconciliationManageComponent implements OnInit {
  public pageConfig = { pageSize: 10, first: 0, total: 0 }; // 页码配置
  private paging = 0; // 共享该变量
  public items = [];
  form1: FormGroup;
  private timeId = [];
  public checker1 = [{
    title: '对账时间',
    checkerId: 'checkDate',
    type: 'date4',
    required: 0,
    value: '',
  },
  {
    title: '对账结果',
    checkerId: 'status',
    type: 'select',
    required: 0,
    options: { ref: 'reconciliationResult' },
    value: '',
  },
  ]

  constructor(private xn: XnService, private vcr: ViewContainerRef) { }

  ngOnInit() {
    XnFormUtils.buildSelectOptions(this.checker1);
    this.buildChecker(this.checker1);
    this.form1 = XnFormUtils.buildFormGroup(this.checker1);
    this.onPage({ page: 1 });
  }

  onPage(e?: { page: number }) {
    this.paging = e.page || 1;
    const params = this.buildParams();
    this.xn.api.avenger.post('/jd/checkBillList', params).subscribe(json => {
      this.items = json.data.data;
      this.pageConfig.total = json.data.count;
    });
  }
  /**
 *  搜索,默认加载第一页
 */
  public searchMsg() {
    this.items = [];
    this.onPage({ page: this.paging });
  }
  reset() {
    this.form1.get('checkDate').setValue('');
    this.form1.get('status').setValue('');
    this.onPage({ page: this.paging });
  }
  /**
    * 构建列表请求参数
    */
  private buildParams() {
    let params = {
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
    } as any;
    // 分页处理


    // 搜索处理
    if (this.form1.get('checkDate').value !== '') {
      params.checkDate = this.form1.get('checkDate').value.replace(/-/g, '');
    }
    if (this.form1.get('status').value !== '') {
      params.status = this.form1.get('status').value;
    }
    // 列表子标签页，构建参数 ,当且子标签状态有大于2中时,添加状态参数
    return params;
  }


  // 对账清单
  getReconciliationList(item) {
    this.xn.api.avenger.post('/jd/checkBillDetailList', { checkDate: item.checkDate }).subscribe(x => {
      if (x.ret === 0) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ReconciliationDetailModalComponent,
          { datainfo: x.data }).subscribe((x) => {

          });
      }
    })

  }
  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }
}
