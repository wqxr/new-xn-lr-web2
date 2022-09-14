import { Component, OnInit, Input, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import * as moment from 'moment';


@Component({
    templateUrl: './system-update.component.html',
    styles: [
        `.item-box {
            position: relative;
            display: flex;
            margin-bottom: 10px;
        }
        .item-label label {
            min-width: 150px;
            padding-right: 8px;
            font-weight: normal;
            line-height: 34px;
            text-align:right;
        }
        .item-control {
            flex: 1;
        }`

    ]
})
export class SystemUpdateComponent implements OnInit {

    pageTitle = '系统更新通知列表';
    pageDesc = '';
    tableTitle = '系统更新通知列表';
    private arrObjs = {} as any; // 缓存后退的变量
    public formModule = 'dragon-input';
    private paging = 1; // 共享该变量
    public pageConfig = { pageSize: 10, first: 0, total: 0 }; // 页码配置
    items: any = [];
    newItems: any;
    shows = [
        {
            title: '标题',
            checkerId: 'title',
            type: 'text',
            required: false,
            value: '',
            mome: '模糊查询'
        },
        {
            title: '内容',
            checkerId: 'message',
            type: 'text',
            required: false,
            value: '',
            mome: '模糊查询'
        },
        {
            title: '创建时间',
            checkerId: 'createTime',
            type: 'date',
            required: false,
            value: '',

        }
    ];

    total = 0;
    pageSize = 10;
    ctrl: AbstractControl;
    mainForm: FormGroup;
    private beginTime: any;
    private endTime: any;
    private timeId = [];
    private nowTimeCheckId = '';
    private nowItems: any[] = [];
    private preChangeTime: any[] = []; // 上次搜索时间段,解决默认时间段搜索请求两次


    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        // XnFormUtils.buildSelectOptions(this.shows);
        // this.buildChecker(this.shows);
        // this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.buildCondition(this.shows);
        this.onPage({ page: this.paging });


    }
    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    /**
  * 构建搜索项
  * @param searches
  */
    private buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }
    /**
    * 搜索项值格式化
    * @param searches
    */
    private buildCondition(searches) {
        const tmpTime = {
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        const objList = [];
        this.timeId = $.extend(true, [], this.shows.filter(v => v.type === 'quantum').map(v => v.checkerId));
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.sortOrder = searches[i].sortOrder;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.sortOrder - b.sortOrder;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        const time = this.shows.filter(v => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.mainForm.valueChanges.subscribe((v) => {
            // 时间段
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = parseInt(paramsTime.beginTime);
                const endTime = parseInt(paramsTime.endTime);
                // 保存每次的时间值。
                this.preChangeTime.unshift({ begin: beginTime, end: endTime });
                // 默认创建时间
                this.beginTime = beginTime;
                this.endTime = endTime;
                if (this.preChangeTime.length > 1) {
                    if (this.preChangeTime[1].begin === this.beginTime &&
                        this.preChangeTime[1].end === this.endTime) {
                        // return;
                    } else {
                        this.beginTime = beginTime;
                        this.endTime = endTime;
                        this.paging = 1;
                        this.onPage({ page: this.paging });
                    }
                }
            }
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.shows.filter((v1: any) => v1 && v1.base === 'number')
                        .map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });
    }

    onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        this.onUrlData();
        this.buildShow(this.shows);

        const params = this.buildParams();

        this.xn.dragon.post('/message_notice/list', params).subscribe(x => {
            if (x.ret === 0) {
                this.items = x.data.data;
                this.nowItems = JSON.parse(JSON.stringify(this.items));
                this.items.forEach(x => {
                    x.message = JSON.parse(x.message).message.replace(/<[^>]+>|&[^>]+;/g, '').trim();
                });
                this.pageConfig.total = x.data.count;
            }
        });
    }
    buildParams() {
        // 分页处理
        const params: any = {
            pageNo: this.paging,
            pageSize: this.pageConfig.pageSize,
        };

        // 搜索处理
        this.shows
            .filter(x => !XnUtils.isEmpty(this.arrObjs[x.checkerId]))
            .forEach(search => {
                if (search.checkerId === 'createTime') {
                    params[search.checkerId] = moment(this.arrObjs[search.checkerId]).valueOf();
                } else {
                    params[search.checkerId] = this.arrObjs[search.checkerId].trim();

                }
            });

        return params;
    }

    viewDetail(paramItem) {
        const param = this.nowItems.filter((x: any) => x.id === paramItem.id)[0];
        const checkers = [{
            title: '标题',
            checkerId: 'title',
            type: 'text-area',
            value: param.title,
            options: { readonly: true, inputMaxLength: 200 },
            required: 1
        },
        {
            title: '内容',
            checkerId: 'content',
            type: 'text-area',
            value: JSON.parse(param.message).message,
            options: { readonly: true, inputMaxLength: 1000 },
            required: 0,
        },
        {
            title: '目标企业',
            checkerId: 'choseCompany',
            type: 'special-click',
            required: '1',
            value: JSON.stringify({ sendType: param.sendType, partAppIds: param.appNames }),
        }
        ];
        const params = {
            checker: checkers,
            title: '查看记录',
            buttons: ['取消'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
            .subscribe((v) => {
            });

    }

    /**
  * 回退操作，路由存储
  * @param data
  */
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.beginTime = urlData.data.beginTime || this.beginTime;
            this.endTime = urlData.data.endTime || this.endTime;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs,
            });
        }
    }
    // 新增记录
    addSystem() {
        const checkers = [{
            title: '标题',
            checkerId: 'title',
            type: 'text-area',
            value: '',
            options: { readonly: false, inputMaxLength: 200 },
            required: 1
        },
        {
            title: '内容',
            checkerId: 'content',
            type: 'text-area',
            value: '',
            options: { readonly: false, inputMaxLength: 1000 },
            required: 1
        },
        {
            title: '目标企业',
            checkerId: 'choseCompany',
            type: 'special-click',
            required: '1',
            value: '',
        }
        ];
        const params = {
            checker: checkers,
            title: '新增',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
            .subscribe((v) => {
                if (!!v) {
                    const data = Object.assign(v.choseCompany, {
                        title: v.title,
                        message: JSON.stringify({ type: 'notifly', message: v.content }),
                    });
                    this.xn.api.dragon.post('/message_notice/submit', data).subscribe(x => {
                        if (x.ret === 0) {
                            this.xn.msgBox.open(false, '提交记录成功');
                            this.onPage({ page: this.paging });
                        }
                    });
                }
            });
    }
    /**
 *  搜索,默认加载第一页
 */
    public searchMsg() {
        this.paging = 1;
        this.onPage({ page: this.paging });
    }
    /**
   * 重置
   */
    public reset() {
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.shows);
        this.searchMsg(); // 清空之后自动调一次search
    }
}
