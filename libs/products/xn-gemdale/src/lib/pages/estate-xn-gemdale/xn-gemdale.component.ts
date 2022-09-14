import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import * as moment from 'moment';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
  templateUrl: './xn-gemdale.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }`,
  ]
})
export class EstateXnGemdaleComponent implements OnInit {
  public xnGemdaleTodo: any; // 新金地任务列表
  public count_jd_xn: number; // 香纳金地待办数量
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
      this.xnGemdaleTodo = config.xnGemdaleTodo;
      this.xnGemdaleTodo.productIdent = this.productIdent;
      // isPerson是否个人待办标识
      this.xnGemdaleTodo.isPerson = config.isPerson;

      // 获取个人待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson: true }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.count_jd_xn = config.isPerson ? json.data[this.productIdent] : this.count_jd_xn
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.count_jd_xn = !config.isPerson ? json.data[this.productIdent] : this.count_jd_xn
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });
    });


  }

}
