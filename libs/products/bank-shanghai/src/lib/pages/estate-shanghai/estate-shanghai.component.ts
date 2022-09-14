/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：home-comm-list.component.ts
 * @summary：控制台待办首页--上海银行 平台、供应商
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  yutianbao          增加功能1         2019-05-15
 * **********************************************************************
 */
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ExpirationReminderModalComponent } from 'libs/products/avenger/src/lib/factoring-business/expiration-reminder-modal.component';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { OrgTypeEnum } from 'libs/shared/src/lib/config/enum';

@Component({
  selector: 'lib-estate-shanghai',
  templateUrl: './estate-shanghai.component.html',
  styleUrls: ['./estate-shanghai.component.css']
})
export class EstateShanghaiComponent implements OnInit {
  public shanghaiTodo: any; // 上海银行-待办任务列表
  public defaultValue = 'A'; // tab页
  public countSH: number;  // 待办数量
  /** 产品标识 */
  public productIdent: string = '';

  constructor(public xn: XnService, private api: ApiService, public localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private vcr: ViewContainerRef,
    private publicCommunicateService: PublicCommunicateService) {
  }

  ngOnInit() {
    // 如果当前用户还未审批通过，跳转到/user
    if (this.xn.user.status !== 2) {
      this.xn.msgBox.open(false, '您的机构注册还未审批通过，请等候', () => {
        this.xn.router.navigate(['/']);
      });
      return;
    }

    // 获取产品标识
    this.route.paramMap.subscribe((v: any) => {
      this.productIdent = v.params?.productIdent
    })

    this.route.data.subscribe((config: any) => {
      this.shanghaiTodo = config.shanghaiTodo[OrgType[this.xn.user.orgType]];
      this.shanghaiTodo.productIdent = this.productIdent;
      // isPerson是否个人待办标识
      this.shanghaiTodo.isPerson = config.isPerson;

      // 获取个人待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson: true }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.countSH = config.isPerson ? json.data[this.productIdent] : this.countSH
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.countSH = !config.isPerson ? json.data[this.productIdent] : this.countSH
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });

      // 平台角色待办
      if (this.xn.user.orgType === OrgTypeEnum.PLATFORM) { // 万科数据对接-平台审核交易状态特殊处理
        const checkers = [{
          title: '审核暂停状态', checkerId: 'pauseStatus', memo: '', type: 'pauseStatus',
          _inSearch: { number: 11, type: 'select', selectOptions: 'platPauseStatus', },
          _inList: { sort: false, search: false, },
        }, {
          title: '资金中心受理情况', checkerId: 'acceptState', memo: '', type: 'acceptState',
          _inSearch: { number: 11, type: 'select', selectOptions: 'platAcceptState', },
          _inList: { sort: false, search: false, },
        },
        {
          title: '待办类型', checkerId: 'flowId', memo: '', type: 'flowId',
          _inSearch: {
            number: 11,
            type: 'select',
            selectOptions: [
              { label: '平台审核退单', value: 'sub_sh_platform_check_retreat' },
              { label: '平台审核', value: 'sh_vanke_platform_verify' },
              { label: '中止', value: 'sub_dragon_book_stop' },
              { label: '平台审核供应商准入资料', value: 'sub_sh_supplementaryinfo_platform_verify' },
              { label: '平台审核普惠开户申请', value: 'sub_sh_prattwhitney_platform_verify' }
            ],
          },
          _inList: {
            sort: false,
            search: false,
          },
        }
        ];
        this.shanghaiTodo.fields.push(...checkers);
        this.shanghaiTodo.fields = XnUtils.distinctArray2(this.shanghaiTodo.fields, 'checkerId'); // 去除相同的项
      } else if (this.xn.user.orgType === OrgTypeEnum.SUPPLIER) {
        const checkers = [
        {
          title: '待办类型', checkerId: 'flowId', memo: '', type: 'flowId',
          _inSearch: {
            number: 11,
            type: 'select',
            selectOptions: [
              { label: '普惠开户申请', value: 'sub_sh_prattwhitney_input' },
              { label: '对公账号激活', value: 'sub_sh_prattwhitney_account_active' },
            ],
          },
          _inList: {
            sort: false,
            search: false,
          },
        }];
        this.shanghaiTodo.fields.push(...checkers);
        // 其他待办-供应商
        this.shanghaiTodo.fields = this.shanghaiTodo.fields.filter((c) => c.checkerId !== 'pauseStatus' && c.checkerId !== 'acceptState');
        this.shanghaiTodo.fields = XnUtils.distinctArray2(this.shanghaiTodo.fields, 'checkerId'); // 去除相同的项
      }
    });

  }

  initActiveTab() {
    this.defaultValue = this.localStorageService.caCheMap.get('defaultValue') || 'A';
    this.initData(this.defaultValue, true);
  }


  initData(type: string, init?: boolean) {
    if (this.defaultValue === type && !init) {
      return;
    } else {
      this.defaultValue = type;
    }
    this.localStorageService.setCacheValue('defaultValue', this.defaultValue);
  }

  /**
   *  平台 ，保理商业务提醒
   */
  private displayRemind() {
    this.xn.avenger.post('/aprloan/prompt/selfPrompt', {}).subscribe(x => {
      if (x.ret === 0 && x.data && x.data.data && x.data.data.length && x.data.flag === 1) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ExpirationReminderModalComponent, x.data.data).subscribe(param => {
          if (param === null) {
            return;
          }
        });
      }
    });
  }

}

enum OrgType {
  'todoBankShangHaiSupplier' = 1,
  'todoBankShangHaiPlat' = 99,
  'todoBankShangHaiBank' = 4,
}
