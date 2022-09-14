import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { OrgTypeEnum } from 'libs/shared/src/lib/config/enum';

@Component({
  templateUrl: './huaqiao-city.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }`,
  ]
})
export class EstateHuaQiaoCityComponent implements OnInit {
  public dragonTodo: any; // 龙光任务列表
  public count_oct = 0;
  public productIdent: string = '';

  constructor(public xn: XnService, private api: ApiService,
    public localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private publicCommunicateService: PublicCommunicateService) {
  }

  ngOnInit() {

    // 获取产品标识
    this.route.paramMap.subscribe((v: any) => {
      this.productIdent = v.params?.productIdent
    })

    this.route.data.subscribe((config: any) => {
      this.dragonTodo = config.dragonTodo;
      this.dragonTodo.productIdent = this.productIdent;
      // isPerson是否个人待办标识
      this.dragonTodo.isPerson = config.isPerson;

      // 获取个人待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson: true }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.count_oct = config.isPerson ? json.data[this.productIdent] : this.count_oct
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.count_oct = !config.isPerson ? json.data[this.productIdent] : this.count_oct
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });

      if (this.xn.user.orgType === OrgTypeEnum.PLATFORM) { // 万科数据对接-平台审核交易状态特殊处理
        this.dragonTodo.fields.push(
          {
            title: '待办类型', checkerId: 'flowId', memo: '', type: 'flowId',
            _inSearch: {
              number: 11,
              type: 'select',
              selectOptions: [...SelectOptions.get('commonPlatStatus'),
              { label: '平台审核', value: 'oct_platform_verify' },
              ],
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
