import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
  selector: 'lib-linkage-radio-show',
  templateUrl: './linkage-radio-show.component.html',
  styles: [``]
})
@DynamicForm({ type: 'linkage-radio', formModule: 'dragon-show' })
export class LinkageRadioShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  resultObj: {
    queryStatus: number | string,  // 0未查询 1已查询
    relation: number | string,  // 已选关联 0无关联 1上海银行关联企业 2万科关联企业 3 华侨城关联企业
    relationOperatorUserName: string,
    relationUpdateTime: number | string,
    overDays: string  // 0未超过180天 1超过180天
  } = {
    queryStatus: 0,
    relation: 0,
    relationOperatorUserName: '',
    relationUpdateTime: '',
    overDays: ''
  };  // 关联查询结果

  myClass = '';

  constructor(private er: ElementRef, private xn: XnService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    // const val = XnUtils.parseObject(this.row.data, {});
    const param = {
      appId: this.svrConfig.debtUnitId,
    };
    this.xn.dragon.post(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/getSupplierRelation`, param).subscribe((x: any) => {
      if (x && x.ret === 0 && x.data) {
        this.resultObj = Object.assign({}, this.resultObj, {
          ...x.data,
          overDays: Tip[Number(x.data.overDays)],
          queryStatus: !XnUtils.isEmptys(x.data?.relation, [0]) ? 1 : 0
        });
        this.cdr.markForCheck();
      }
    });
  }

}
enum Tip {
  '查询结果已失效（180天），请重新查询' = 1,
  '' = 0,
}
