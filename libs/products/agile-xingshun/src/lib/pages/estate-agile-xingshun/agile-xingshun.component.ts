import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import * as moment from 'moment';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { OrgTypeEnum } from 'libs/shared/src/lib/config/enum';

@Component({
  templateUrl: './agile-xingshun.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }`,
  ]
})
export class EstateAgileXingshunComponent implements OnInit {
  public AgileXingshunTodo: any; // 新雅居乐-星顺任务列表
  public count_new_yjl_xs: number; // 新雅居乐-星顺待办数量
  /** 产品标识 */
  public productIdent: string = '';

  constructor(public xn: XnService, private api: ApiService,
    public localStorageService: LocalStorageService,
    private route: ActivatedRoute, private vcr: ViewContainerRef,
    private publicCommunicateService: PublicCommunicateService) {
  }

  ngOnInit() {

    // 获取产品标识
    this.route.paramMap.subscribe((v: any) => {
      this.productIdent = v.params?.productIdent
    })

    this.route.data.subscribe((config: any) => {
      this.AgileXingshunTodo = config.AgileXingshunTodo;
      this.AgileXingshunTodo.productIdent = this.productIdent;
      // isPerson是否个人待办标识
      this.AgileXingshunTodo.isPerson = config.isPerson;

      // 获取个人待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson: true }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.count_new_yjl_xs = config.isPerson ? json.data[this.productIdent] : this.count_new_yjl_xs
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.count_new_yjl_xs = !config.isPerson ? json.data[this.productIdent] : this.count_new_yjl_xs
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });
    });

    if (this.xn.user.orgType === OrgTypeEnum.PLATFORM) {
      this.AgileXingshunTodo.fields.push(
        {
          title: '待办类型', checkerId: 'flowId', memo: '', type: 'flowId',
          _inSearch: {
            number: 11,
            type: 'select',
            selectOptions: [...SelectOptions.get('commonPlatStatus'),
            { label: '平台审核', value: 'yjl_platform_verify_common' },
            { label: '中止', value: 'pay_over18' },

            ],
          },
          _inList: {
            sort: false,
            search: false,
          },
        }
      );
      this.AgileXingshunTodo.fields = XnUtils.distinctArray2(this.AgileXingshunTodo.fields, 'checkerId'); // 去除相同的项

    }

  }

}
