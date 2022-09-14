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

@Component({
    templateUrl: './payment-messages.component.html',
    styles: [
        `.table {
            font-size: 13px;
        }`,
    ]
})
export class PaymentMessagesComponent implements OnInit {
    public todoConfig: any; // 首页代办
    public msgConfig: any;  // 系统消息
    public payMsgConfig: any; // 备付通知
    public avengertodo: any; // 采购融资代办列表
    public dragonTodo: any; // 龙光任务列表
    public newAgileTodo: any; // 雅居乐-星顺任务列表
    public defaultValue = 'B';
    public todoCount01: number;
    public todoCount02: number;
    public todoCount03: number;
    public todoCountXinShun: number;
    public fac: FactoringBusinessModel = new FactoringBusinessModel();
    public alertPromotion = false;
    public avengerShow: boolean;
    public isProduction: boolean;
    /**
     * 万科供应商保理业务模块显示
     *  summary  仅【客户管理】中【白名单状态】为【系统白名单】或【人工白名单】的企业可见此模块。
     */
    public factoringBusinessBoolean = false;

    constructor(public xn: XnService, private api: ApiService,
                public localStorageService: LocalStorageService, private route: ActivatedRoute, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.isProduction = this.xn.user.env === 'production' || this.xn.user.env === 'exp';
        if (this.isProduction) {
            Isshow.Avenger = false;
        }
        this.avengerShow = Isshow.Avenger;
        if (this.xn.user.orgType !== 3 && this.xn.user.orgType !== 99 && this.xn.user.orgType !== 102 && this.avengerShow) {
            this.xn.avenger.post('/sign_aggrement/bussiness_info/authority', { appId: this.xn.user.appId }).subscribe(x => {
                if (x.data) {
                    this.factoringBusinessBoolean = x.data.isAuthority;

                }
            });
            // this.xn.avenger.post('/bankpush/list/remind', {}).subscribe(x => {
            //     if (x.ret === 0 && x.data && x.data.data.length > 0) {
            //         XnModalUtils.openInViewContainer(this.xn, this.vcr, RecommendationLetterComponent,
            //             { value: x.data.data[0] }).subscribe(x => {
            //         });
            //     }
            // });
            this.xn.avenger.post('/aprloan/prompt/supplierPrompt', {}).subscribe(x => {
                if (x.ret === 0) {
                    if (x.data.flag === 1) {
                        if (x.data.data.length > 0) {
                            XnModalUtils.openInViewContainer(this.xn,
                                this.vcr, SupplierExpirationReminderModalComponentComponent, x.data.data)
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
        // todo 采购融资信息模块
        // this.factoringBusinessBoolean = this.xn.user.orgType === 1;
        // todo 只有满足显示条件和第一次进入控制台时


        // todo 业务到期提醒
        if (this.xn.user.orgType === 99 || this.xn.user.orgType === 3 && this.avengerShow) {
            if (moment().weekday(1).format('YYYYMMDD') === moment().startOf('day').format('YYYYMMDD')) {// 判断是周一
                this.displayRemind();
            }
        }

        // 如果当前用户还未审批通过，跳转到/user
        if (this.xn.user.status !== 2) {
            this.xn.msgBox.open(false, '您的机构注册还未审批通过，请等候', () => {
                this.xn.router.navigate(['/']);
            });
            return;
        }

        this.route.data.subscribe((config: any) => {
            this.todoConfig = config.todo;
            this.msgConfig = config.sysMsg;
            this.payMsgConfig = config.payMsg;
            this.avengertodo = config.avengertodo;
            this.dragonTodo = config.dragonTodo;
            this.newAgileTodo = config.newAgileToDo;

            if (this.xn.user.orgType === 99) { // 万科数据对接-平台审核交易状态特殊处理
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
                    });
                this.dragonTodo.fields = XnUtils.distinctArray2(this.dragonTodo.fields, 'checkerId'); // 去除相同的项
            } else if (this.xn.user.orgType === 3) {
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

        this.api.post('/user/todo_count', {}).subscribe((json) => {
            this.todoCount01 = json.data.count1;
            this.todoCount02 = json.data.count2;
            this.todoCount03 = json.data.count3;
            this.todoCountXinShun = json.data.count_xinshun;

            this.initActiveTab();
        });
    }

    initActiveTab() {
        let activeTab = this.showNewAgile ? 'D' : 'A';
        if (this.todoCount02) {
            activeTab = 'B';
        } else if (this.todoCount03) {
            activeTab = 'C';
        }

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

    get showNewAgile() {
        return this.xn.user.isNewAgile || this.xn.user.orgType === 99;
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

    // 获取推介函信息
    public getDetail() {
        this.xn.avenger.post('/sign_aggrement/bussiness_info/info', { appId: this.xn.user.appId }).subscribe(x => {
            if (x.data) {
                this.fac.allAmount = x.data.allAmount;
                this.fac.allLeftAoumnt = x.data.allLeftAoumnt;
                this.fac.backAmount = x.data.backAmount;
                this.fac.factoringServiceFLV = x.data.factoringServiceFLV;
                this.fac.factoringUseFLV = x.data.factoringUseFLV;
                this.fac.leftAmount = x.data.leftAmount;
                this.fac.maxAmount = x.data.maxAmount;
                this.fac.nowlimit = x.data.nowlimit;
                this.fac.useAmount = x.data.useAmount;
                this.fac.platformServiceFLV = x.data.platformServiceFLV;
                this.fac.oldReceive = x.data.oldReceive;
                this.fac.totalFLV = x.data.totalFLV;
            }
            XnModalUtils.openInViewContainer(this.xn, this.vcr, PromotionInformationModalComponent, this.fac)
                .subscribe(param => {
                    if (param === null) {
                        return;
                    }
                });

        });
    }

}
