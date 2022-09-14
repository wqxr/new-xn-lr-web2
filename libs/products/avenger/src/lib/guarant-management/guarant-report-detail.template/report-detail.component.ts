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


@Component({
    templateUrl: `./report-detail.component.html`,
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
export class ReportDetailComponent implements OnInit {
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
    twopageConfig = {  // 第三个表格页码设置
        pageSize: 5,
        first: 0,
        total: 0,
    };
    threepageConfig = {  // 第三个表格页码设置
        pageSize: 5,
        first: 0,
        total: 0,
    };
    warnLevel = {
        warn: 1,
        alert: 2
    };
    // 搜索项
    currentTab: any; // 当前标签页
    arrObjs = {} as any; // 缓存后退的变量
    paging = 0; // 共享该变量
    onepaging = 0; // 第一个表格页码设置
    threepaging = 0;
    alertpaging = 0;
    appId = '';
    orgName = '';
    dt = '';
    datalist: any[] = [];
    loanLimit: any[] = [];        // 额度汇总
    dateLimit: any[] = [];        // 期限汇总
    factoringFee: any[] = [];        // 保理费率汇总
    factoringSvcFee: any[] = [];     // 保理服务费率汇总
    platformSvcFee: any[] = [];       // 平台服务费率汇总
    paybackData: any = [];            // 还款意愿和能力数据汇总
    financingData: any = [];          // 财务报表关键指标变化趋势
    date: any[] = [];
    financingtable: any[] = [];
    historyreport: any[] = [];    // 月份
    @ViewChild('chart1') chart1: ElementRef;
    @ViewChild('chart2') chart2: ElementRef;
    @ViewChild('chart3') chart3: ElementRef;
    // keydetail: any[] = [];
    constructor(private xn: XnService,
                public route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(x => {
            this.orgName = x.orgName;
            this.appId = x.appId;
            this.dt = x.dt;
        });

        this.initData();
    }

    /**
     *  加载信息
     * @param val
     */
    public initData() {
        this.onepage({ page: this.onepaging });    // 填充预警信息
        this.onPage({ page: this.paging });
        this.onepageFinanecing({ paging: this.threepaging });      // 填充提示信息
        // 请求业务三要素数据
        this.xn.api.post('/custom/avenger/customer_manager/three_element', {
            enterpriseName: this.orgName,
            dt: this.dt
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
            const chart01 = echarts.init(this.chart1.nativeElement);
            chart01.setOption(option01);
            const chart02 = echarts.init(this.chart2.nativeElement);
            chart02.setOption(option02);
        });
        // 还款意愿和还款能力趋势图
        this.payBack();

        // 回退操作
        this.onUrlData();
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    public onepage(e?) {
        this.paging = e.page || 1;
        this.onepaging = e.page || 1;
        this.onepageConfig = Object.assign({}, this.onepageConfig, e);
        this.twopageConfig = Object.assign({}, this.twopageConfig, e);
        // 页面配置
        this.xn.api.post('/custom/avenger/guarantee_manager/monitor_file_detail', {
            warnLevel: this.warnLevel.warn,
            dt: this.dt,
            orgName: this.orgName,
            start: this.paging,
            length: this.onepageConfig.pageSize,
        }).subscribe(data => {
            this.warnInfoData = data.data.data;
            this.onepageConfig.total = data.data.count;
        });
        this.xn.api.post('/custom/avenger/guarantee_manager/financing_check', {
            dt: this.dt,
            orgName: this.orgName,
            start: (this.onepaging - 1) * this.twopageConfig.pageSize,
            length: this.twopageConfig.pageSize,
        }).subscribe(data => {
            this.financingtable = data.data.data;
            this.twopageConfig.total = data.data.count;
        });

        // this.xn.api.post('/custom/avenger/guarantee_manager/financing_target', {
        //     dt: this.dt,
        //     orgName: this.orgName,
        // }).subscribe(data => {
        //     if (data.ret === 0) {
        //         this.keydetail = data.data.data;
        //     } else {
        //     }
        // });
        // this.xn.api.post('/custom/avenger/guarantee_manager/history_list', {
        //     orgName: this.orgName,
        //     start: (this.threepaging - 1) * this.threepageConfig.pageSize,
        //     length: this.threepageConfig.pageSize,
        // }).subscribe(data => {
        //     if (data.ret === 0) {
        //         this.historyreport = data.data.data;
        //         this.threepageConfig.total = data.data.count;

        //     } else {
        //     }
        // });
    }

    public onPage(e?) {
        this.alertpaging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        this.xn.api.post('/custom/avenger/guarantee_manager/monitor_file_detail', {
            warnLevel: this.warnLevel.alert,
            dt: this.dt,
            orgName: this.orgName,
            start: this.alertpaging,    // 初始为0
            length: this.pageConfig.pageSize,
        }).subscribe(data => {
            this.alertInfoData = data.data.data;
            this.pageConfig.total = data.data.count;
        });

    }

    /**
     * 跳转到企业资料页面
     */
    public turnToOrg() {
        this.xn.router.navigate([`console/record/info`], { queryParams: { appId: this.appId } });
    }

    /**
     * 还款能力趋势图
     */
    public payBack() {
        this.xn.api.post('/custom/avenger/guarantee_manager/payback_trend', {
            orgName: this.orgName,
            dt: this.dt
        }).subscribe(data => {
            this.paybackData = data.data.data.map(x => {
                return {
                    ability: x.ability,
                    willingness: x.willingness,
                    dt: x.dt
                };
            });
            const option03 = this.optionData03(this.paybackData);
            const chart03 = echarts.init(this.chart3.nativeElement);
            chart03.setOption(option03);
        });
    }

    /**
     * 三要素内容: 额度、期限
     * @param data
     */
    public optionData01(data) {
        const date01: any[] = [];
        for (const i of data) {
            this.loanLimit.push(i.loanLimit);                // 额度值
            this.dateLimit.push(i.dateLimit);                // 期限值                        // 三要素记录时间
            date01.push(i.date);
        }
        return {
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
            grid: [
                {
                    left: '0%',
                    bottom: '10%',
                    right: '10%',
                    containLabel: true

                }],
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
    onepageFinanecing(e?) {
        this.threepaging = e.page || 1;
        this.threepageConfig = Object.assign({}, this.threepageConfig, e);
        // 页面配置
        this.xn.api.post('/custom/avenger/guarantee_manager/history_list', {
            orgName: this.orgName,
            start: (this.threepaging - 1) * this.threepageConfig.pageSize,
            length: this.threepageConfig.pageSize,
        }).subscribe(data => {
            if (data.ret === 0) {
                this.historyreport = data.data.data;
                this.threepageConfig.total = data.data.count;

            } else {
            }
        });

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
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['保理费率', '保理服务费率', '平台服务费率']
            },
            grid: {
                left: '0%',
                right: '20%',
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
    * 还款意愿和还款能力变化曲线图
    * @param data
    */
    public optionData03(data) {
        const date03: any[] = [];
        const ability: any[] = [];
        const willingness: any[] = [];
        for (const i of data) {
            ability.push(i.ability);
            willingness.push(i.willingness);
            date03.push(i.dt);
        }
        return {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['还款能力', '还款意愿']
            },
            grid: {
                left: '0%',
                right: '20%',
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
                data: date03.reverse()
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '还款能力',
                    type: 'line',
                    stack: '总量1',
                    data: ability.reverse()
                },
                {
                    name: '还款意愿',
                    type: 'line',
                    stack: '总量2',
                    data: willingness.reverse()
                }
            ]
        };
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
            this.threepageConfig = urlData.data.threepageConfig || this.threepageConfig;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                onepaging: this.onepaging,
                onepageConfig: this.onepageConfig,
                threepageConfig: this.threepageConfig,
                pageConfig: this.pageConfig,
                arrObjs: this.arrObjs,
            });
        }
    }
    onCancel() {
        this.xn.user.navigateBack();
    }
}
