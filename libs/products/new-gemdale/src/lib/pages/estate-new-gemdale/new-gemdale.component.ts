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
  templateUrl: './new-gemdale.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }`,
  ]
})
export class EstateNewGemdaleComponent implements OnInit {
  public newGemdaleTodo: any; // 新金地任务列表
  public count_new_jd: number; // 新金地待办数量
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
      this.newGemdaleTodo = config.newGemdaleTodo;
      this.newGemdaleTodo.productIdent = this.productIdent;
      // isPerson是否个人待办标识
      this.newGemdaleTodo.isPerson = config.isPerson;

      // 获取个人待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson: true }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.count_new_jd = config.isPerson ? json.data[this.productIdent] : this.count_new_jd
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.count_new_jd = !config.isPerson ? json.data[this.productIdent] : this.count_new_jd
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });
    });
    if (this.xn.user.orgType === OrgTypeEnum.PLATFORM) {
      this.newGemdaleTodo.fields.push({
        title: '待办类型', checkerId: 'flowId', memo: '', type: 'flowId',
        _inSearch: {
          number: 11,
          type: 'select',
          selectOptions: [...SelectOptions.get('commonPlatStatus'),
          { label: '平台审核', value: 'jd_platform_verify' },
          { label: '中止', value: 'sub_dragon_book_stop' },

          ],
        },
        _inList: {
          sort: false,
          search: false,
        },
      });
      this.newGemdaleTodo.fields = XnUtils.distinctArray2(this.newGemdaleTodo.fields, 'checkerId'); // 去除相同的项

    }

  }

}
