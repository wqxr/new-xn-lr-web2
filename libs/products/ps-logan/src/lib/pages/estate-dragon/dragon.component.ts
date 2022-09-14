import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

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
  public count_lg_boshi: number;
  /** 产品标识 */
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
          this.count_lg_boshi = config.isPerson ? json.data[this.productIdent] : this.count_lg_boshi
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.count_lg_boshi = !config.isPerson ? json.data[this.productIdent] : this.count_lg_boshi
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });
    });

  }

}
