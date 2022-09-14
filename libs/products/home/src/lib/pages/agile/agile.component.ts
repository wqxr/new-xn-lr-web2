import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
  templateUrl: './agile.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }`,
  ]
})
export class AgileComponent implements OnInit {
  public todoConfig: any; // 首页代办
  public countYjl: number;
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
      this.todoConfig = config.todo;
      this.todoConfig.productIdent = this.productIdent;
      // isPerson是否个人待办标识
      this.todoConfig.isPerson = config.isPerson;

      // 获取待办数量
      this.xn.dragon.post('/list/todo_record/todo_count',
        { isPerson: config.isPerson ? config.isPerson : undefined }
      ).subscribe((json) => {
        if (this.productIdent) {
          this.countYjl = json.data[this.productIdent]
        }
        this.publicCommunicateService.change.emit({ todoCount: json.data });
      });
    })

  }



}
