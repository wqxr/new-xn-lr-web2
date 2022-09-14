import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { OrgTypeEnum } from 'libs/shared/src/lib/config/enum';

@Component({
  templateUrl: './agile-hz.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }`,
  ]
})
export class EstateAgileHzComponent implements OnInit {
  public TodoAgileHz: any; // 新雅居乐-恒泽任务列表
  public count_new_yjl_hz: number; // 新雅居乐-恒泽待办数量
  public productIdent: string = ''; // 产品标识

  constructor(public xn: XnService, private api: ApiService,
    private route: ActivatedRoute, private vcr: ViewContainerRef,
    private publicCommunicateService: PublicCommunicateService) {
  }

  ngOnInit() {
    // 获取产品标识
    this.route.paramMap.subscribe((v: any) => {
      this.productIdent = v.params?.productIdent
    })

    this.route.data.subscribe((config: any) => {
      this.TodoAgileHz = config.TodoAgileHz;
      this.TodoAgileHz.productIdent = this.productIdent;
      // isPerson是否个人待办标识
      this.TodoAgileHz.isPerson = config.isPerson;

      // 获取个人待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson: true }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.count_new_yjl_hz = config.isPerson ? json.data[this.productIdent] : this.count_new_yjl_hz
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.count_new_yjl_hz = !config.isPerson ? json.data[this.productIdent] : this.count_new_yjl_hz
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });
    });

    if (this.xn.user.orgType === OrgTypeEnum.PLATFORM) {
      this.TodoAgileHz.fields.push({
        title: '待办类型', checkerId: 'flowId', memo: '', type: 'flowId',
        _inSearch: {
          number: 11,
          type: 'select',
          selectOptions: [...SelectOptions.get('commonPlatStatus'),
          { label: '平台审核', value: 'yjl_platform_verify' },
          ],
        },
        _inList: {
          sort: false,
          search: false,
        },
      });
      this.TodoAgileHz.fields = XnUtils.distinctArray2(this.TodoAgileHz.fields, 'checkerId'); // 去除相同的项

    }

  }

}
