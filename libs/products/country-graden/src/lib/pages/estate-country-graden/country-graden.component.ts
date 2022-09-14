import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
  templateUrl: './country-graden.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }`,
  ]
})
export class EstateCountryGradenComponent implements OnInit {
  public countryGradenTodo: any; // 碧桂园任务列表
  public count_bgy: number; // 碧桂园待办数量
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
      this.countryGradenTodo = config.countryGradenTodo;
      this.countryGradenTodo.productIdent = this.productIdent
      // isPerson是否个人待办标识
      this.countryGradenTodo.isPerson = config.isPerson;

      // 获取个人待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson: config.isPerson ? config.isPerson : undefined }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.count_bgy = config.isPerson ? json.data[this.productIdent] : this.count_bgy
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: true });
      });
      // 获取产品待办数量
      this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
        if (this.productIdent) {
          this.count_bgy = !config.isPerson ? json.data[this.productIdent] : this.count_bgy
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data, isPerson: false });
      });
    });

  }

}
