import { Component, OnInit, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ExpirationReminderModalComponent } from 'libs/products/avenger/src/lib/factoring-business/expiration-reminder-modal.component';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
    templateUrl: './home.component.html',
    styles: [
        `.table {
            font-size: 13px;
        }`,
    ]
})
export class HomeComponent implements OnInit {
    public todoConfig: any; // 首页代办
    public msgConfig: any;  // 系统消息
    public payMsgConfig: any; // 备付通知
    public todo: any; // 任务列表
    public dragonTodoConfig: any; // 龙光任务列表
    public defaultValue = 'todo';
    public todoCount: number;
    public otherTodoCount: number;
    public dragonTodoCount: number;
    public isProduction: boolean;

    constructor(public xn: XnService, private api: ApiService,
                public localStorageService: LocalStorageService,
                private route: ActivatedRoute,
                private vcr: ViewContainerRef,
                private publicCommunicateService: PublicCommunicateService) {
    }

    ngOnInit() {
        this.isProduction = this.xn.user.env === 'production' || this.xn.user.env === 'exp';

        // todo 业务到期提醒
        if (this.xn.user.orgType === 99 || this.xn.user.orgType === 3) {
            if (moment().weekday(1).format('YYYYMMDD') === moment().startOf('day').format('YYYYMMDD')) {// 判断是周一
                this.displayRemind();
            }
        }

        this.route.data.subscribe((config: any) => {

            this.todoConfig = config.todo;
            this.msgConfig = config.sysMsg;
            this.payMsgConfig = config.payMsg;
            this.dragonTodoConfig = config.dragonTodo;
            this.todo = config.todo;
        });

        // 获取雅居乐-星顺待办总数
        this.api.post('/user/todo_count', { modelId: this.xn.user.modelId }).subscribe((json) => {
            this.otherTodoCount = json.data.count1;
            this.dragonTodoCount = json.data.count3;
            this.todoCount = json.data.count_xinshun;
            this.initActiveTab();
            this.publicCommunicateService.change.emit({ todoCount: json.data });

        });
    }

    initActiveTab() {
        const activeTab = this.todoCount
            ? 'todo'
            : this.dragonTodoCount ? 'C' : 'A';

        this.defaultValue = this.localStorageService.caCheMap.get('defaultValue') || activeTab;
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
            if (x.ret === 0) {
                if (x.data.data.length > 0) {
                    if (x.data.flag === 1) {
                        XnModalUtils.openInViewContainer(this.xn, this.vcr, ExpirationReminderModalComponent, x.data.data)
                            .subscribe(param => {
                                if (param === null) {
                                    return;
                                }
                            });
                    }
                }
            }
        });
    }
}
