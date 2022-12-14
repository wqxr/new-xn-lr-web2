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
    public signtodo: any; // CFCA????????????
    public defaultValue = 'A';
    tabConfig: any;
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    public formModule = 'dragon-input';
    currentTab: any; // ???????????????
    public cfcaSigncount: number;
    public avengerShow: boolean;
    public isProduction: boolean;
    public listInfo: any[] = []; // ??????
    sorting = ''; // ???????????????
    naming = ''; // ???????????????
    paging = 1; // ???????????????
    public subDefaultValue = 'DOING'; // ??????????????????
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // ??????????????????
    beginTime: any;
    endTime: any;
    arrObjs = {} as any; // ?????????????????????
    heads: any[];
    shows: any[] = [];
    form: FormGroup;
    searches: any[] = []; // ????????????????????????
    timeId = [];
    preChangeTime: any[] = [];
    nowTimeCheckId = '';

    /**
     * ???????????????????????????????????????
     *  summary  ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     */
    public factoringBusinessBoolean = false;
    /** ???????????? */
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
        // ????????????,???????????????????????????
        this.showPaymentMessage = this.xn.user.orgType === 2 || this.xn.user.orgType === 1;
        // ????????????????????????????????????????????????/user
        if (this.xn.user.status !== 2) {
            this.xn.msgBox.open(false, '????????????????????????????????????????????????', () => {
                this.xn.router.navigate(['/']);
            });
            return;
        }

        // ??????????????????
        this.route.paramMap.subscribe((v: any) => {
            this.productIdent = v.params?.productIdent
        })

        this.route.data.subscribe((config: any) => {
            this.tabConfig = config;
            this.initData(this.defaultValue, true);

        });

        // ??????????????????
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
    *  ??????????????????????????????
    * @param paramTabValue
    * @param init ????????????????????????true ??????????????????????????????????????????
    */
    public initData(paramTabValue: string, init?: boolean) {

        if (this.defaultValue === paramTabValue && !init) {
            return;
        } else { // ??????????????????
            this.listInfo = [];
            this.naming = '';
            this.sorting = '';
            this.paging = 1;
            this.pageConfig = { pageSize: 10, first: 0, total: 0 };
        }
        this.defaultValue = paramTabValue;
        this.subDefaultValue = 'DOING'; // ?????????????????????
        this.onPage({ page: this.paging });
    }

    /**
      * @param e  page: ???????????? pageSize: ?????????????????????first: ??????????????????????????????pageCount : ????????????
      * @summary ?????????????????????abs  ??????api???????????????????????????avenger ?????????abs???api
      */
    public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
        this.paging = e.page || 1;
        this.onUrlData(); // ??????????????????
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // ????????????
        const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
        this.currentTab = !!find ? find : new TabListOutputModel();
        // ???????????????
        const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
        this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
        this.heads = CommUtils.getListFields(this.currentSubTab.headText);
        this.searches = this.currentSubTab.searches; // ???????????????????????????
        this.buildShow(this.searches);
        // ????????????

        const params = this.buildParams();
        if (this.currentTab.post_url === '') {
            // ?????????
            // this.listInfo = [{ file: '??????' }];
            this.listInfo = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        this.requestInterface(params);
    }
    /**
   * ????????????
   */
    public requestInterface(params) {
        // ???????????? ???avenger,  ??????abs ???api
        this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.listInfo = x.data.data;
                this.pageConfig.total = x.data.count;
            } else {
                // ?????????
                this.listInfo = [];
                this.pageConfig.total = 0;
            }
        }, () => {
            // ?????????
            this.listInfo = [];
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });
    }
    /**
    * ????????????
    */
    private buildParams() {
        // ????????????
        const params: any = {
            pageNo: this.paging,
            pageSize: this.pageConfig.pageSize,
            recordType: 1, // 1??????????????????
            productIdent: this.productIdent
        };
        // ????????????
        if (this.sorting && this.naming) {
            params.order = [{ name: this.sorting, order: this.naming }];
        }
        // ????????????
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
    * ??????????????????
    * @param item ???????????????
    * @param btn {label:string,operate:string,value:string,value2?:string}
    * @param i ??????
    */
    public handleRowClick(item, btn: ButtonConfigModel, i: number) {
        // ??????????????????
        btn.click(this.xn, item);
    }
    public  handleLabelClick(item, label) {
        label.click(this.xn, item);
    }
    /**
   *  ??????,?????????????????????
   */
    public searchMsg() {
        this.paging = 1;
        this.onPage({ page: this.paging, first: 0 });
    }
    /**
  * ??????
  */
    public reset() {
        // this.form.reset(); // ??????
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // ???????????????????????????search
    }
    /**
  * ???????????????
  * @param searches
  */
    private buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }
    /**
    * ?????????????????????
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
        })); // ?????????????????????;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        const time = this.searches.filter(v => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.form.valueChanges.subscribe((v) => {
            // ?????????
            const changeId = v[timeCheckId];
            // delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime.beginTime;
                const endTime = paramsTime.endTime;
                // ???????????????????????????
                this.preChangeTime.unshift({ begin: beginTime, end: endTime });
                // ??????????????????
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
            this.arrObjs = $.extend(true, {}, arrObj); // ?????????;????????????????????????
            this.onUrlData();
        });
    }
    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    /**
    * ?????????????????????
    * currentSubTab.headText.length + ?????????1 + ??????1 + ?????????+1
    */
    public calcAttrColspan(): number {
        let nums: number = this.currentSubTab.headText.length + 1;
        const boolArray = [this.currentSubTab.canChecked,
        this.currentSubTab.edit && this.currentSubTab.edit.rowButtons && this.currentSubTab.edit.rowButtons.length > 0];
        nums += boolArray.filter(arr => arr === true).length;
        return nums;
    }
    /**
  * ????????????
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
