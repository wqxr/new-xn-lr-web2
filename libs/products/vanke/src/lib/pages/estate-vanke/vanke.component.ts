import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { OrgTypeEnum } from 'libs/shared/src/lib/config/enum';

@Component({
  templateUrl: './vanke.component.html',
  styles: [
    `.table {
      font-size: 13px;
    }`,
  ]
})
export class EstateVankeComponent implements OnInit {
  // 待办列表配置
  public dragonTodo: any;
  public countWk: number;
  /** 产品标识 */
  public productIdent: string = '';

  constructor(public xn: XnService, private api: ApiService,
    public localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    protected router: Router,
    private vcr: ViewContainerRef,
    private publicCommunicateService: PublicCommunicateService) {
  }

  ngOnInit() {

    // 获取产品标识
    this.route.paramMap.subscribe((v: any) => {
      this.productIdent = v.params?.productIdent
    })

    this.route.data.subscribe((config: any) => {
      this.dragonTodo = config.dragonTodo;
      // 修改产品标识
      this.dragonTodo.productIdent = this.productIdent;
      // isPerson是否个人待办标识
      this.dragonTodo.isPerson = config.isPerson;

      // 获取个人待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson: true }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.countWk = config.isPerson ? json.data[this.productIdent] : this.countWk
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.countWk = !config.isPerson ? json.data[this.productIdent] : this.countWk
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });

      if (this.xn.user.orgType === OrgTypeEnum.PLATFORM) { // 万科数据对接-平台审核交易状态特殊处理
        this.dragonTodo.fields.push(
          {
            title: '审核暂停状态', checkerId: 'pauseStatus', memo: '', type: 'pauseStatus',
            _inSearch: {
              number: 11,
              type: 'select',
              selectOptions: 'platPauseStatus',
            },
            _inList: {
              sort: false,
              search: false,
            },
          },
          {
            title: '资金中心受理情况', checkerId: 'acceptState', memo: '', type: 'acceptState',
            _inSearch: {
              number: 11,
              type: 'select',
              selectOptions: 'platAcceptState',
            },
            _inList: {
              sort: false,
              search: false,
            },
          },
          {
            title: '待办类型', checkerId: 'flowId', memo: '', type: 'flowId',
            _inSearch: {
              number: 11,
              type: 'select',
              selectOptions: [...SelectOptions.get('commonPlatStatus'),
              { label: '平台审核', value: 'vanke_platform_verify' },
              { label: '平台初审', value: 'vanke_abs_step_platform_verify_operate' },
              { label: '平台复核', value: 'vanke_abs_step_platform_verify_review' },
              { label: '修改预录入信息', value: 'sub_dragon_book_change' },
              { label: '中止', value: 'sub_dragon_book_stop' },

              ],
            },
            _inList: {
              sort: false,
              search: false,
            },
          },

        );
        this.dragonTodo.fields = XnUtils.distinctArray2(this.dragonTodo.fields, 'checkerId'); // 去除相同的项
      } else if (this.xn.user.orgType === OrgTypeEnum.FACTORING) {
        this.dragonTodo.fields =
          this.dragonTodo.fields.filter((c) => c.checkerId !== 'pauseStatus' && c.checkerId !== 'acceptState');
        this.dragonTodo.fields.push(
          {
            title: '资金中心受理情况', checkerId: 'acceptState', memo: '', type: 'acceptState',
            _inSearch: {
              number: 11,
              type: 'select',
              selectOptions: 'platAcceptState',
            },
            _inList: {
              sort: false,
              search: false,
            },
          });
        this.dragonTodo.fields = XnUtils.distinctArray2(this.dragonTodo.fields, 'checkerId'); // 去除相同的项
      } else {
        this.dragonTodo.fields =
          this.dragonTodo.fields.filter((c) => c.checkerId !== 'pauseStatus' && c.checkerId !== 'acceptState');
        this.dragonTodo.fields = XnUtils.distinctArray2(this.dragonTodo.fields, 'checkerId'); // 去除相同的项
      }

    });

  }

}
