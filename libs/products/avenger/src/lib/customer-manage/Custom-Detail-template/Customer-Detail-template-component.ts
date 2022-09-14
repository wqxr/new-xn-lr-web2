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

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import CompanyDetailInfo from '../customer-template/customer-company-detail';
import { ActivatedRoute } from '@angular/router';
import { MfilesViewModalComponent } from 'libs/shared/src/lib/public/modal/mfiles-view-modal.component';

import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { AvengerPdfSignModalComponent } from 'libs/shared/src/lib/public/avenger/modal/pdf-sign-modal.component';

@Component({
    templateUrl: `./Customer-Detail-template-component.html`,
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
export class CustomerDetailComponent implements OnInit {
    [x: string]: any;
    tabConfig: any;
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'do_not';
    // 数据
    dataone: any[] = []; // 第一个表格数据声明
    datatwo: any[] = []; // 第二个表格数据声明
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
    form: FormGroup;
    public numberok = 1;
    currentTab: any; // 当前标签页
    arrObjs = {} as any; // 缓存后退的变量
    paging = 0; // 共享该变量
    onepaging = 0; // 第一个表格页码设置
    // 上次搜索时间段
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    appId = '';
    orgName = '';
    datalist: any[] = [];
    loanLimit: any[] = [];        // 额度汇总
    dateLimit: any[] = [];        // 期限汇总
    factoringFee: any[] = [];        // 保理费率汇总
    factoringSvcFee: any[] = [];     // 保理服务费率汇总
    platformSvcFee: any[] = [];       // 平台服务费率汇总
    date: any[] = [];              // 月份
    restdatatable: any; // 财报数据，征信报告，账号变更记录数据
    constructor(private xn: XnService,
                public hwModeService: HwModeService,
                private vcr: ViewContainerRef, public route: ActivatedRoute, private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.tabConfig = CompanyDetailInfo.customer_detail;
        this.restdatatable = this.tabConfig.tabList[0].tablelist.slice(3, 6);
        this.route.queryParams.subscribe(x => {
            this.appId = x.appId;
            this.orgName = x.orgName;
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
    // 查看发票详情
    invoiceDetail(item) {
        this.xn.router.navigate([`/console/invoice-display/invoice-list`], {
            queryParams: {
                isNew: true
            }
        });
        this.localStorageService.setCacheValue('invoices_mainFlowId', item.mainFlowId); // 暂存mainFlowId
    }

    /**
     *  加载信息
     * @param val
     */
    public initData(val: string) {
        if (this.label !== val) {
            this.naming = '';
            this.sorting = '';
        }
        this.label = val;
        this.currentTab = this.tabConfig.tabList.find((x: any) => x.value === this.label); // 当前标签页
        this.onepage({ page: this.onepaging });
        if (val === 'do_not') {
            this.onPage({ page: this.paging });
            this.xn.api.post('/custom/avenger/customer_manager/three_element', {
                enterpriseName: this.orgName
            }).subscribe(data => {
                this.datalist = data.data.data.map(x => {
                    return {
                        date: x.createTime,
                        loanLimit: x.loanLimit,
                        dateLimit: x.dateLimit,
                        factoringFee: x.factoringFee,
                        factoringSvcFee: x.factoringSvcFee,
                        platformSvcFee: x.platformSvcFee,

                    };
                });
                const option01 = this.optionData01(this.datalist);
                const option02 = this.optionData02(this.datalist);
                const chart1 = document.getElementById('chart1');
                const chart2 = document.getElementById('chart2');
                const chart01 = echarts.init(chart1);
                chart01.setOption(option01);
                const chart02 = echarts.init(chart2);
                chart02.setOption(option02);
            });

            this.financialCountPage('financialReport', { page: this.paging });
            this.financialCountPage('creditReport', { page: this.paging });
            this.financialCountPage('accountChangeReport', { page: this.paging });

        }






        this.onUrlData();
    }

    /**
     * 三要素内容: 额度、期限
     * @param data
     */
    public optionData01(data) {
        const date01: any[] = [];
        for (const i of data) {
            this.loanLimit.push(i.loanLimit);                // 额度值
            this.dateLimit.push(i.dateLimit);                // 期限值
            date01.push(i.date);                             // 三要素记录时间
        }
        return {
            title: {
                text: '额度、期限变化图'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['额度', '期限']
            },
            xAxis: [
                {
                    type: 'category',
                    // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    data: date01.reverse(),
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '额度',
                    min: 0,
                    max: 10000000,
                    interval: 2000000,
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                },
                {
                    type: 'value',
                    name: '期限',
                    min: 0,
                    max: 350,
                    interval: 70,
                    axisLabel: {
                        formatter: '{value} 天'
                    }
                }
            ],
            series: [

                {
                    name: '额度',
                    type: 'bar',
                    // data: [2600000, 5900000, 9000000, 2640000, 2870000, 7070000, 1756000, 1822000, 4870000, 1880000, 6000000, 2300000]
                    data: this.loanLimit.reverse()
                },
                {
                    name: '期限',
                    type: 'line',
                    yAxisIndex: 1,
                    // data: [20, 22, 33, 45, 63, 102, 203, 234, 230, 165, 120, 62]
                    data: this.dateLimit.reverse()
                }
            ]
        };
    }

    /**
     * 三要素：定价
     * @param data
     */
    public optionData02(data) {
        const date02: any[] = [];
        for (const i of data) {
            this.factoringFee.push(i.factoringFee);
            this.factoringSvcFee.push(i.factoringSvcFee);
            this.platformSvcFee.push(i.platformSvcFee);
            date02.push(i.date);
        }
        return {
            title: {
                text: '定价变化图'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['保理费率', '保理服务费率', '平台服务费率']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date02.reverse()
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '保理费率',
                    type: 'line',
                    stack: '总量1',
                    data: this.factoringFee.reverse()
                },
                {
                    name: '保理服务费率',
                    type: 'line',
                    stack: '总量2',
                    data: this.factoringSvcFee.reverse()
                },
                {
                    name: '平台服务费率',
                    type: 'line',
                    stack: '总量3',
                    data: this.platformSvcFee.reverse()
                }
            ]
        };
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    public onPage(e?) {
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        this.xn.api.post('/custom/avenger/customer_manager/cooperation', {
            appId: this.appId,
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
        }).subscribe(data => {
            this.datatwo = data.data.data;
            this.pageConfig.total = data.data.count;
        });
    }
    public financialCountPage(lab: string, e?) {
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        if (lab === 'financialReport') {
            this.xn.api.post('/custom/avenger/customer_manager/report',
                { appId: this.appId, start: (this.paging - 1) * this.restdatatable[0].pageConfig.pageSize, length: 10 }).subscribe(x => {
                    if (x.data) {
                        this.restdatatable[0].data = x.data.financialData;
                        this.restdatatable[0].pageConfig.total = x.data.financialCount;
                    }
                });
        } else if (lab === 'creditReport') {
            this.xn.api.post('/custom/avenger/customer_manager/report',
                { appId: this.appId, start: (this.paging - 1) * this.restdatatable[1].pageConfig.pageSize, length: 10 }).subscribe(x => {
                    if (x.data) {
                        this.restdatatable[1].data = x.data.creditData;
                        this.restdatatable[1].pageConfig.total = x.data.creditCount;
                    }
                });
        } else if (lab === 'accountChangeReport') {
            this.xn.api.post('/custom/avenger/customer_manager/account_change',
                { appId: this.appId, start: (this.paging - 1) * this.restdatatable[2].pageConfig.pageSize, length: 10 }).subscribe(x => {
                    if (x.data) {
                        this.restdatatable[2].data = x.data.data;
                        this.restdatatable[2].pageConfig.total = x.data.count;
                    }
                });
        }
        // 页面配置

    }


    public onepage(e?) {
        this.paging = e.page || 1;
        this.onepageConfig = Object.assign({}, this.onepageConfig, e);
        this.xn.api.post('/custom/avenger/customer_manager/detail_business', {
            orgName: this.orgName,
            start: (this.paging - 1) * this.onepageConfig.pageSize,
            length: this.onepageConfig.pageSize,
        }).subscribe(data => {
            this.data = data.data.data;
            this.onepageConfig.total = data.data.count;
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
     *  列表头样式
     * @param paramsKey
     */
    public onSortClass(paramsKey: string): string {
        if (paramsKey === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    /**
     *  按当前列排序
     * @param sort
     */
    public onSort(sort: string) {
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }
        this.onPage({ page: 1 });
    }

    /**
     *   添加协议
     */
    public addAgreement() {
        this.xn.router.navigate([`/console/record/new`], {
            queryParams: {
                id: 'add_agreement',
                relate: 'orgName',
                relateValue: this.orgName,
            }
        });
    }

    /**
     *  查看子流程
     * @param recordId 子流程Id
     */
    lookflowId(recordId: string) {
        this.xn.router.navigate([`avenger/record/avenger/view/${recordId}`]);
    }


    /**
     *  查看其他协议文件
     * @param paramFiles 协议的fileId，
     */
    public fileView(paramFiles) {
        const files = [{ fileId: paramFiles }];
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, JsonTransForm(files))
            .subscribe(() => {
            });
    }

    /**
     * 查看新系统图片文件（担保协议）
     */
    public fileCgFile(paramFiles) {
        const files = [{ fileId: paramFiles , isAvenger: true}];
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, JsonTransForm(files))
            .subscribe(() => {
            });
    }

    /**
     * 查看合同
     * @param params 合同文件的id secret label;
     */
    public contractView(params: any) {
        params.readonly = true;            // 该合同只读
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerPdfSignModalComponent, params)
            .subscribe(() => {
            });

    }

    /**
     * 点击下载财报文件
     * @param paramData
     */
    public downFinanceFiles(paramData: any) {
        this.xn.api
            .download('/attachment/download/upload_file_down', {
                key: paramData.fileId
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, paramData.fileId);
            });
    }

    /**
     * 点击下载征信文件
     * @param paramData
     */
    public downCreditFiles(paramData: any) {
        this.xn.api
            .download('/attachment/download/index', {
                key: paramData.fileId
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, paramData.fileId);
            });
    }

    /**
     *  查看公司企业资料 传企业的企业Id
     */
    public companyDeatilInfo() {
        this.xn.router.navigate([`console/record/info`], { queryParams: { appId: this.appId } });

    }

    /**
     *  查看合同，只读
     * @param paramContractInfo
     */
    public showContract(paramContractInfo) {
        const params = Object.assign({}, paramContractInfo, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, params).subscribe(() => {
        });
    }
    /**
  * 计算表格合并项
  * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
  */
    public calcAttrColspan(tabconfig): number {
        const nums: number = tabconfig.headText.length + 1;
        return nums;
    }
    /**
     * 回退操作
     * @param data
     */
    private onUrlData() {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.onepaging = urlData.data.onepaging || this.onepaging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.onepageConfig = urlData.data.onepageConfig || this.onepageConfig;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
            this.label = urlData.data.label || this.label;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                onepaging: this.onepaging,
                onepageConfig: this.onepageConfig,
                pageConfig: this.pageConfig,
                arrObjs: this.arrObjs,
                label: this.label
            });
        }
    }
}
