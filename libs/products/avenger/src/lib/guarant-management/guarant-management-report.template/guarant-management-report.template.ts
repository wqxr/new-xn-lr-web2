/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customers-panel.ts
 * @summary：多标签页列表项 根据TabConfig.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-05-22
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import GuarantTabConfig from '../guarant-management.tab';
import { ActivatedRoute } from '@angular/router';
import { MfilesViewModalComponent } from 'libs/shared/src/lib/public/modal/mfiles-view-modal.component';



@Component({
    templateUrl: `./guarant-management-report.template.html`,
    styles: [`
        .title {
            width: 100px;
        }

        .label {
            font-weight: normal;
            flex: 1;
            color: black;
        }

        .flex {
            display: flex;
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
    `]
})

export class GuarantManagementReportTemplateComponent implements OnInit {
    tabConfig: any;
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'do_not';
    // 数据
    data: any[] = [];
    // 页码配置
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    // 搜索项
    shows: any[] = [];
    form: FormGroup;
    searches: any[] = []; // 面板搜索配置项项
    selectedItems: any[] = []; // 选中的项
    currentTab: any; // 当前标签页

    arrObjs = {} as any; // 缓存后退的变量
    paging = 0; // 共享该变量
    beginTime: any;
    endTime: any;
    timeId = [];
    nowTimeCheckId = '';
    // 上次搜索时间段
    preChangeTime: any[] = [];
    orgName = '';
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    appId = '';
    type = '';
    fileType = 1;
    CONST01 = 'get-report';
    CONST02 = 'view-exceptions';
    constructor(private xn: XnService,
                private vcr: ViewContainerRef, public route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(x => {
            this.orgName = x.orgName;
            this.appId = x.appId;
            this.type = x.type;
        });
        this.initData(this.label);
    }

    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }

    /**
     *  格式化数据
     * @param data
     */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }

    /**
     *  加载信息
     * @param val
     */
    public initData(val: string) {
        if (this.label !== val) {
            this.selectedItems = []; // 切换标签页是清空选中的项
            this.naming = '';
            this.sorting = '';
        }
        this.label = val;
        switch (this.label) {
            case 'do_not': this.fileType = 1; break;
            case 'not': this.fileType = 2; break;
        }
        this.onPage({ page: this.paging });
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    public onPage(e?) {
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        this.onUrlData(); // 导航回退取值
        if (this.type === 'get-report') {
            this.tabConfig = GuarantTabConfig.getReportlist;
            this.currentTab = this.tabConfig.tabList.find((x: any) => x.value === this.label); // 当前标签页
        } else if (this.type === 'view-exceptions') {
            this.tabConfig = GuarantTabConfig.getviewexceptionslist;
            this.currentTab = this.tabConfig.tabList.find((x: any) => x.value === this.label); // 当前标签页
        }


        // 页面配置
        this.searches = this.currentTab.searches; // 当前标签页的搜索项
        this.buildShow(this.searches);
        // 构建参数
        const params = this.buildParams(this.type);
        if (this.currentTab.get_url === '') {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        this.xn.api.post(this.currentTab.get_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.data = x.data.data;
                this.pageConfig.total = x.data.count;
            } else {
                // 固定值
                this.data = [];
                this.pageConfig.total = 0;
            }
        }, () => {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.selectedItems = [];
        this.paging = 1;
        this.onPage({ page: this.paging });
    }
    routeUrl() {
        this.xn.router.navigate([`/console/record/new/add_check_file`],
            { queryParams: { id: 'add_check_file', relate: 'orgName', relateValue: this.orgName } });
    }
    /**
     *
     * @param item 所选当前预警信息
     */
    processWarningInfo(item: any) {
        this.xn.router.navigate([`/console/record/new/handle_warning_msg`]
            , {
                queryParams: {
                    id: 'handle_warning_msg',
                    relate: 'warnInfo',
                    relateValue: JSON.stringify(
                        { warnType: item.warnType, expression: item.expression, dt: item.dt, orgName: this.orgName })
                }
            });


    }
    // 点击下载系统监测报告
    public downloadCompanyDetail(item: any) {
        this.xn.api.download('/custom/avenger/down_file/load_monitor_report', {
            orgName: this.orgName,
            dt: item.createTime
        }).subscribe((x: any) => {
            this.xn.api.save(x._body, '保后监测报告.zip');
            this.xn.loading.close();
        });
    }

    // 点击下载自查报告
    public downloadCheckDetail(item: any) {

    }

    /**
     * 重置
     */
    public reset() {
        this.selectedItems = [];
        this.form.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.beginTime = '';
        this.endTime = '';
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    /**
     * 查看具体的保后监测报告页面
     */
    openCompanyDetail(item: any) {
        this.xn.router.navigate([`/console/manage/guarant-manage/report-detail`],
            { queryParams: { appId: item.appId, orgName: item.orgName, dt: item.createTime } });
    }

    /**
     * 查看具体的自查报告页面
     */
    openCheckDetail(item: any) {
        // let params = {
        //     title: '自查报告'+item.appId,
        //     checker: <CheckersOutputModel[]>[
        //         {
        //             title: '供应商名称',
        //             checkerId: 'nameofCounterparty',
        //             type: 'text',
        //             required: 1,
        //             value:item.orgName ,

        //         },
        //         {
        //             title: '四级分类',
        //             checkerId: 'flag',
        //             type: 'text',
        //             required: 1,

        //         },
        //         {
        //             title: '自查结论',
        //             checkerId: 'balance',
        //             type: 'text',
        //             required: 1,

        //         },
        //         {
        //             title: '重大事项',
        //             checkerId: 'analysis',
        //             type: 'textarea',
        //             required: 1,

        //         },
        //         {
        //             title: '融资情况',
        //             checkerId: 'analysis',
        //             type: 'textarea',
        //             required: 1,

        //         },
        //         {
        //             title: '经营情况',
        //             checkerId: 'analysis',
        //             type: 'textarea',
        //             required: 1,

        //         },
        //         {
        //             title: '交易对手',
        //             checkerId: 'opponentForm',
        //             type: 'opponentForm',
        //             required: 1,

        //         },
        //         {
        //             title: '财报数据',
        //             checkerId: 'earningForm',
        //             type: 'earningForm',
        //             required: 1,

        //         },
        //         {
        //             title: '',
        //             checkerId: 'analysis',
        //             type: 'textarea',
        //             required: 1,

        //         },
        //     ],
        //     buttons: ['返回', '下载本页报告'],
        // };
        // XnModalUtils.openInViewContainer(this.xn, this.vcr, EditInfoModalComponent, params)
        //     .subscribe(v => {
        //         if (v === null) {
        //             return;
        //         } else {
        //             //this.datalist.push(v);
        //            // this.toValue();
        //         }
        //     });
        this.xn.router.navigate([`/console/manage/guarant-manage/check-detail`],
            { queryParams: { appId: item.appId, orgName: item.orgName, recordId: item.recordId } });
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
        this.timeId = $.extend(true, [], this.searches
            .filter(v => v.type === 'quantum')
            .map(v => v.checkerId));
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
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
            delete v[timeCheckId];
            if (changeId && changeId !== '' && this.nowTimeCheckId) {
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
                    const searchFilter = this.searches
                        .filter(v1 => v1 && v1.base === 'number')
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

    /**
     * 构建参数
     */
    private buildParams(type: string) {
        // 分页处理
        let pageSize = 0;
        if (this.type === 'get-report') {
            pageSize = this.paging;
        } else if (this.type === 'view-exceptions') {
            pageSize = (this.paging - 1) * this.pageConfig.pageSize;
        }
        const params: any = {
            appId: this.appId,
            start: pageSize,
            length: this.pageConfig.pageSize,
            fileType: this.fileType,
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
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

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // public fileView(paramFiles) {
    //     let files = [{ 'fileId': paramFiles }];
    //     XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, JsonTransForm(files))
    //         .subscribe(() => {
    //         });
    // }

    onCancel() {
        this.xn.user.navigateBack();
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
            this.label = urlData.data.label || this.label;
            this.type = urlData.data.type || this.type;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs,
                label: this.label,
                type: this.type


            });
        }
    }

}
