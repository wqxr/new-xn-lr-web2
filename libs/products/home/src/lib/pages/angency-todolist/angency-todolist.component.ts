import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';

@Component({
    templateUrl: './angency-todolist.component.html',
    styles: [
        `.table {
            font-size: 13px;
        }`,
    ]
})
export class AngencyTodoListComponent implements OnInit {
    public isProduction: boolean;
    public orgNoticeToDo: any; // 中介机构-提醒待办列表
   

    constructor(public xn: XnService, private api: ApiService,
        public localStorageService: LocalStorageService, private route: ActivatedRoute, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.isProduction = this.xn.user.env === 'production' || this.xn.user.env === 'exp';
        this.route.data.subscribe((config: any) => {
            this.orgNoticeToDo = config.orgNoticeToDo;
        });
    }

}
