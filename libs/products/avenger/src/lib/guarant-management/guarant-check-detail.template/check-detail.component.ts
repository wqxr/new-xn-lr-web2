/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：CompanyDetailInfo.ts
 * @summary：客户管理详细资料 根据CompanyDetailInfo.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-05-20
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import CompanyDetailInfo from '../../customer-manage/customer-template/customer-company-detail';
import { MfilesViewModalComponent } from 'libs/shared/src/lib/public/modal/mfiles-view-modal.component';
import Echartstyle from '../../Echart.component';


@Component({
    templateUrl: `./check-detail.component.html`,
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
        .formClass{
            font-size: 150%
        }
        .guaranttable {
            width: 50% !important;
            float: left;
            margin-top: 35px;
        }
        .form-group{
            clear:both;
            padding-top:20px;
        }
    `]
})
export class CheckDetailComponent implements OnInit {
    tabConfig: any;
    // 数据
    warnInfoData: any[] = [];    // 预警信息数据汇总
    alertInfoData: any[] = [];   // 提示信息数据汇总
    data: any[] = [];
    // 页码配置
    pageConfig = {
        pageSize: 5,
        first: 0,
        total: 0,
    };
    onepageConfig = {  // 第一个表格页码设置
        pageSize: 5,
        first: 0,
        total: 0,
    };
    // 搜索项
    currentTab: any; // 当前标签页
    arrObjs = {} as any; // 缓存后退的变量
    paging = 0; // 共享该变量
    onepaging = 0; // 第一个表格页码设置

    appId = '';
    orgName = '';
    recordId = '';
    levelClassification = '';         // 四级分类
    checkConclusion: any = {} as any;             // 自查结论
    majorIssues = '';                 // 重大事项
    financingSituation = '';          // 融资情况
    businessSituation = '';          // 经营情况
    opponent: any[] = [];          // 交易对手
    earningData: any[] = [];          // 财报数据
    constructor(private xn: XnService,
                private vcr: ViewContainerRef, public route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(x => {
            this.orgName = x.orgName;
            this.appId = x.appId;
            this.recordId = x.recordId;
        });

        this.initData();
    }

    /**
     *  加载信息
     * @param val
     */
    public initData() {
        // 请求业务三要素数据
        this.xn.api.post('/custom/avenger/guarantee_manager/check_file_detail', {
            appId: this.appId,
            recordId: this.recordId
        }).subscribe(data => {
            const datalist = data.data.data;
            this.levelClassification = datalist.levelClassification;         // 四级分类
            this.checkConclusion = datalist.checkConclusion && JSON.parse(datalist.checkConclusion) || {};             // 自查结论
            this.majorIssues = datalist.majorIssues;                 // 重大事项
            this.financingSituation = datalist.financingSituation;         // 融资情况
            this.businessSituation = datalist.businessSituation;          // 经营情况
            this.opponent = datalist.opponent && JSON.parse(datalist.opponent) || [];            // 交易对手
            this.earningData = datalist.earningData && JSON.parse(datalist.earningData) || [];          // 财报数据
        });
        this.onUrlData();
    }

    /**
     * 跳转到企业资料页面
     */
    public turnToOrg() {
        this.xn.router.navigate([`console/record/info`], { queryParams: { appId: this.appId } });
    }


    /**
     *  取消并返回
     */
    public onCancel() {
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
            this.onepaging = urlData.data.onepaging || this.onepaging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.onepageConfig = urlData.data.onepageConfig || this.onepageConfig;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                onepaging: this.onepaging,
                onepageConfig: this.onepageConfig,
                pageConfig: this.pageConfig,
                arrObjs: this.arrObjs,
            });
        }
    }
}
