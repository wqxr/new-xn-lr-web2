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
import { SubTabListOutputModel, TabListOutputModel, ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { FormGroup } from '@angular/forms';

@Component({
    templateUrl: './sign-estate.component.html',
    styles: [
        `
        .item-box {
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
        }
        .item-control select {
            width: 100%
        }
        .operate-btn {
            min-width: 90px;
        }
        .input-check {
            width: 100px;
        }
        .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            /*position: relative;*/
            cursor: pointer
        }
        .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            font-family: 'Glyphicons Halflings';
            opacity: 0.5;
        }
        .table-head .sorting:after {
            content: "\\e150";
            opacity: 0.2
        }
        .table-head .sorting_asc:after {
            content: "\\e155"
        }
        .table-head .sorting_desc:after {
            content: "\\e156"
        }
        `,
    ]
})
export class EstateSignComponent implements OnInit {
    public showPaymentMessage = false;
    public signtodo: any; // CFCA代办列表
    public defaultValue = 'A';
    tabConfig: any;
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    public formModule = 'dragon-input';
    currentTab: any; // 当前标签页
    public cfcaSigncount: number;
    public avengerShow: boolean;
    public isProduction: boolean;
    public listInfo: any[] = []; // 数据
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    paging = 1; // 共享该变量
    public subDefaultValue = 'DOING'; // 默认子标签页
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
    beginTime: any;
    endTime: any;
    arrObjs = {} as any; // 缓存后退的变量
    heads: any[];
    shows: any[] = [];
    form: FormGroup;
    searches: any[] = []; // 面板搜索配置项项
    timeId = [];
    preChangeTime: any[] = [];
    nowTimeCheckId = '';

    /**
     * 万科供应商保理业务模块显示
     *  summary  仅【客户管理】中【白名单状态】为【系统白名单】或【人工白名单】的企业可见此模块。
     */
    public factoringBusinessBoolean = false;
    /** 产品标识 */
    public productIdent: string = '';

    constructor(public xn: XnService, private api: ApiService,
        public localStorageService: LocalStorageService,
        private route: ActivatedRoute,
        private vcr: ViewContainerRef,
        private publicCommunicateService: PublicCommunicateService) {
    }

    ngOnInit() {
        this.isProduction = this.xn.user.env === 'production' || this.xn.user.env === 'exp';
        if (this.isProduction) {
            Isshow.Avenger = false;
        }
        this.avengerShow = Isshow.Avenger;
        // 核心企业,供应商显示备付通知
        this.showPaymentMessage = this.xn.user.orgType === 2 || this.xn.user.orgType === 1;
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
            this.tabConfig = config;
            this.initData(this.defaultValue, true);

        });

        // 获取待办数量
       this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
            if (this.productIdent) {
               this.cfcaSigncount = json.data[this.productIdent]
              }
               this.publicCommunicateService.change.emit({ todoCount: json.data });
      });

        // this.api.post('/user/todo_count', {}).subscribe((json) => {
        //     this.cfcaSigncount = json.data.count_cfca_sign;
        //     this.publicCommunicateService.change.emit({ todoCount: json.data });

        // });
    }
    /**
    *  标签页，加载列表信息
    * @param paramTabValue
    * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
    */
    public initData(paramTabValue: string, init?: boolean) {

        if (this.defaultValue === paramTabValue && !init) {
            return;
        } else { // 重置全局变量
            this.listInfo = [];
            this.naming = '';
            this.sorting = '';
            this.paging = 1;
            this.pageConfig = { pageSize: 10, first: 0, total: 0 };
        }
        this.defaultValue = paramTabValue;
        this.subDefaultValue = 'DOING'; // 重置子标签默认
        this.onPage({ page: this.paging });
    }

    /**
      * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
      * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
      */
    public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
        this.paging = e.page || 1;
        this.onUrlData(); // 导航回退取值
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
        this.currentTab = !!find ? find : new TabListOutputModel();
        // 子页面配置
        const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
        this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
        this.heads = CommUtils.getListFields(this.currentSubTab.headText);
        this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
        this.buildShow(this.searches);
        // 构建参数

        const params = this.buildParams();
        if (this.currentTab.post_url === '') {
            // 固定值
            // this.listInfo = [{ file: '嘻嘻' }];
            this.listInfo = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        this.requestInterface(params);
    }
    /**
   * 请求接口
   */
    public requestInterface(params) {
        // 采购融资 ：avenger,  地产abs ：api
        this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.listInfo = x.data.data;
                this.pageConfig.total = x.data.count;
            } else {
                // 固定值
                this.listInfo = [];
                this.pageConfig.total = 0;
            }
        }, () => {
            // 固定值
            this.listInfo = [];
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });
    }
    /**
    * 构建参数
    */
    private buildParams() {
        // 分页处理
        const params: any = {
            pageNo: this.paging,
            pageSize: this.pageConfig.pageSize,
            recordType: 1, // 1代表通用签章
            productIdent: this.productIdent
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [{ name: this.sorting, order: this.naming }];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        return params;
    }
    /**
    * 行按钮组事件
    * @param item 当前行数据
    * @param btn {label:string,operate:string,value:string,value2?:string}
    * @param i 下标
    */
    public handleRowClick(item, btn: ButtonConfigModel, i: number) {
        // 查看关联记录
        btn.click(this.xn, item);
    }
    public  handleLabelClick(item, label) {
        label.click(this.xn, item);
    }
    /**
   *  搜索,默认加载第一页
   */
    public searchMsg() {
        this.paging = 1;
        this.onPage({ page: this.paging, first: 0 });
    }
    /**
  * 重置
  */
    public reset() {
        // this.form.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
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
        this.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = searches[i].required;
            obj.type = searches[i].type;
            obj.options = searches[i].options;
            obj.placeholder = searches[i].placeholder;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function (a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        const time = this.searches.filter(v => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.form.valueChanges.subscribe((v) => {
            // 时间段
            const changeId = v[timeCheckId];
            // delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime.beginTime;
                const endTime = paramsTime.endTime;
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
                    const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number').map(c => c.checkerId);
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
    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    /**
    * 计算表格合并项
    * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
    */
    public calcAttrColspan(): number {
        let nums: number = this.currentSubTab.headText.length + 1;
        const boolArray = [this.currentSubTab.canChecked,
        this.currentSubTab.edit && this.currentSubTab.edit.rowButtons && this.currentSubTab.edit.rowButtons.length > 0];
        nums += boolArray.filter(arr => arr === true).length;
        return nums;
    }
    /**
  * 回退操作
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

}
