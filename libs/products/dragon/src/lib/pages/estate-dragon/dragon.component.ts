import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PromotionInformationModalComponent } from 'libs/products/avenger/src/lib/factoring-business/promotion-information.modal.component';
import { ExpirationReminderModalComponent } from 'libs/products/avenger/src/lib/factoring-business/expiration-reminder-modal.component';
import {
  SupplierExpirationReminderModalComponentComponent
} from 'libs/products/avenger/src/lib/factoring-business/supplier-expiration-reminder-modal.component';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { FactoringBusinessModel } from 'libs/products/avenger/src/lib/factoring-business/factoring-business.model';
import { RecommendationLetterComponent } from 'libs/products/bank-puhuitong/src/lib/share/modal/recommendation-letter-modal.component';
import * as moment from 'moment';
import { Isshow } from 'libs/shared/src/lib/config/hideOrshow';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { OrgTypeEnum } from 'libs/shared/src/lib/config/enum';

@Component({
  templateUrl: './dragon.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }`,
  ]
})
export class EstateDragonComponent implements OnInit {
  public dragonTodo: any; // 龙光任务列表
  public countLg: number;
  /** 产品标识 */
  public productIdent: string = '';

  constructor(public xn: XnService, private api: ApiService,
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
      // 修改产品标识
      this.dragonTodo.productIdent = this.productIdent;
      // isPerson是否个人待办标识
      this.dragonTodo.isPerson = config.isPerson;

      // 获取个人待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson:true }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.countLg = config.isPerson ? json.data[this.productIdent] : this.countLg
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson:true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.countLg = !config.isPerson ? json.data[this.productIdent] : this.countLg
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });
    });

    if (this.xn.user.orgType === OrgTypeEnum.PLATFORM) {
      this.dragonTodo.fields.push(
        {
          title: '待办类型', checkerId: 'flowId', memo: '', type: 'flowId',
          _inSearch: {
            number: 11,
            type: 'select',
            selectOptions: [...SelectOptions.get('commonPlatStatus'),
            { label: '平台审核', value: 'dragon_platform_verify' },
            { label: '修改预录入信息', value: 'sub_dragon_book_change' },
            { label: '中止', value: 'sub_dragon_book_stop' },

            ],
          },
          _inList: {
            sort: false,
            search: false,
          },
        }
      )
      this.dragonTodo.fields = XnUtils.distinctArray2(this.dragonTodo.fields, 'checkerId'); // 去除相同的项
    }

  }

}
