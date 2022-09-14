/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：show-avenger-input-component.ts
 * @summary：提交记录显示组件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          风险审查         2019-06-17
 * **********************************************************************
 */

import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import AvengerplatTable from './avenger-msgFirstReview-tab';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';


@Component({
    selector: 'xn-show-avenger-Platformrisk-component',
    templateUrl: './avenger-msgFirstReview-all.component.html',
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({
    type: [
        'msgFirstReview',
        'ownYaosu',
        'historyBusiness',
        'accountsCheck',
        'accountsTarget',
        'yujingMsg',
        'alertMsg',
        'basicMsg',
        'stockHolderMsg',
        'lawsuitMsg',
        'amountChangeTrend',
        'businessPeriodTrend'
    ], formModule: 'avenger-input'
})
export class ShowPlatformriskInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public ctrl: AbstractControl;

    // 组件配置的type类型
    public type = '';
    private label = '';
    public items: any[] = [];
    public twoselect: any[] = [];
    public threeselect: any[] = [];
    public lawsuitMsgtable: any[] = [];
    datalist: any[] = [];
    alldatalist: any[] = [];
    @ViewChild('chart1', { static: true }) chart1: ElementRef;
    @ViewChild('chart2', { static: true }) chart2: ElementRef;
    loanLimit: any[] = [];        // 额度汇总
    dateLimit: any[] = [];        // 期限汇总
    factoringFee: any[] = [];        // 保理费率汇总
    factoringSvcFee: any[] = [];     // 保理服务费率汇总
    platformSvcFee: any[] = [];       // 平台服务费率汇总
    Tabconfig: any;
    paging = 0; // 共享该变量
    keydetail: any[] = [];
    public suppliercomp = {
        name: '', // 公司名称
        CreditCode: '', // 社会信用代码
        OperName: '', // 法人
        StartDate: '', // 成立时间
        RegistCapi: '', // 注册资本
        industry: '', // 所属行业
        EconKind: '', // 企业类型
        address: '',
        businessTerm: '', // 营业期限
        Scope: '', // 经营范围
        BelongOrg: '', // 登记机关
        approvalDate: '', // 核准日期
    };
    public ustreamcomp = {
        name: '', // 公司名称
        CreditCode: '', // 社会信用代码
        OperName: '', // 法人
        StartDate: '', // 成立时间
        RegistCapi: '', // 注册资本
        industry: '', // 所属行业
        EconKind: '', // 企业类型
        address: '',
        businessTerm: '', // 营业期限
        Scope: '', // 经营范围
        BelongOrg: '', // 登记机关
        approvalDate: '', // 核准日期

    };

    public msgFirstReviewtype = {
        reviewFirst: '',
        reviewFirstMemo: '',
    };
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };

    public historydata: any[] = [];

    pageConfighistory = {
        pageSize: 5,
        first: 0,
        total: 0,
    };


    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private localStorageService: LocalStorageService,
        private communicate: PublicCommunicateService, public hwModeService: HwModeService, ) {
    }

    ngOnInit() {
        this.Tabconfig = AvengerplatTable.tableFormlist.tabList;
        this.lawsuitMsgtable = AvengerplatTable.tableFormlist.tabList.slice(8, this.Tabconfig.length);
        this.type = this.row.type;
        if (this.row.type === 'msgFirstReview') {
            this.msgFirstReviewtype = JSON.parse(this.row.value);
        } else if (this.row.type === 'ownYaosu') {
            this.xn.loading.open();
            this.xn.avenger.post('/sub_system/history/thisBusiness', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
                if (x.data) {
                    x.data.mainFlowId = this.svrConfig.record.mainFlowId;
                    this.items[0] = x.data;
                }

            });
            this.xn.loading.close();

        } else if (this.row.type === 'historyBusiness') {
            this.xn.loading.open();
            this.xn.avenger.post('/sub_system/history/allBusiness', {
                mainFlowId: this.svrConfig.record.mainFlowId,
                start: 0, length: this.pageConfighistory.pageSize
            }).subscribe(x => {
                if (x.ret !== 0) {
                    this.xn.msgBox.open(false, x.msg);
                } else {
                    if (x.data) {
                        this.items = x.data.rows;
                        this.historydata[0] = x.data.history;
                        this.pageConfighistory.total = this.items.length;
                    }
                }
            });
            this.xn.loading.close();

        } else if (this.row.type === 'yujingMsg') {

            this.xn.loading.open();

            this.xn.avenger.post('/sub_system/risk/warn',
                { companyName: this.svrConfig.record.supplierName }).subscribe(x => {
                    if (x.data) {
                        this.Tabconfig[3].alldata = x.data;
                        this.Tabconfig[3].data = x.data.slice(0, this.Tabconfig[3].pageConfig.pageSize);
                        this.Tabconfig[3].pageConfig.total = x.data.length;
                    }
                });
            this.xn.loading.close();

        } else if (this.row.type === 'alertMsg') {

            this.xn.loading.open();
            this.xn.avenger.post('/sub_system/risk/alert', { companyName: this.svrConfig.record.supplierName }).subscribe(x => {
                if (x.data) {
                    this.Tabconfig[4].alldata = x.data;
                    this.Tabconfig[4].data = x.data.slice(0, this.Tabconfig[4].pageConfig.pageSize);
                    this.Tabconfig[4].pageConfig.total = x.data.length;

                }


            });
            this.xn.loading.close();

        } else if (this.row.type === 'stockHolderMsg') {
            const item = this.Tabconfig[5];
            const tablesinfo = this.Tabconfig[6];
            this.xn.loading.open();
            this.xn.avenger.post('/sub_system/qichacha/getCompanyMaster',
                { company: this.svrConfig.record.supplierName }).subscribe(x => {
                    if (x.data && x.data.Result) {
                        item.alldata = x.data.Result.Partners;
                        item.data = x.data.Result.Partners.slice(0, this.Tabconfig[5].pageConfig.pageSize);
                        item.pageConfig.total = x.data.Result.Partners.length;
                    } else {
                        this.xn.msgBox.open(false, '未查到该企业信息');
                    }
                });

            this.xn.avenger.post('/sub_system/qichacha/getCompanyMaster',
                { company: this.svrConfig.record.upstreamName }).subscribe(x => {
                    if (x.data && x.data.Result) {
                        tablesinfo.alldata = x.data.Result.Partners;
                        tablesinfo.data = x.data.Result.Partners.slice(0, this.Tabconfig[6].pageConfig.pageSize);
                        tablesinfo.pageConfig.total = x.data.Result.Partners.length;
                    } else {
                        this.xn.msgBox.open(false, '未查到该企业信息');
                    }
                });

            this.xn.loading.close();


        } else if (this.row.type === 'basicMsg') {
            this.xn.loading.open();
            this.xn.avenger.post('/sub_system/qichacha/getCompanyMaster',
                { company: this.svrConfig.record.supplierName }).subscribe(x => {
                    if (x.data && x.data.Result) {
                        const data = x.data.Result;
                        this.suppliercomp.name = data.Name;
                        this.suppliercomp.CreditCode = data.CreditCode;
                        this.suppliercomp.address = data.Address;
                        this.suppliercomp.StartDate = data.StartDate;
                        this.suppliercomp.approvalDate = data.CheckDate;
                        this.suppliercomp.OperName = data.OperName;
                        this.suppliercomp.industry = data.Industry.Industry;
                        this.suppliercomp.businessTerm = data.TermStart + '-' + data.TeamEnd;
                        this.suppliercomp.RegistCapi = data.RegistCapi;
                        this.suppliercomp.BelongOrg = data.BelongOrg;
                        this.suppliercomp.EconKind = data.EconKind;
                        this.suppliercomp.Scope = data.Scope;
                    } else {
                        this.xn.msgBox.open(false, '未查到该企业信息');
                    }
                });
            this.xn.avenger.post('/sub_system/qichacha/getCompanyMaster',
                { company: this.svrConfig.record.upstreamName }).subscribe(x => {
                    if (x.data && x.data.Result) {
                        const data = x.data.Result;
                        this.ustreamcomp.name = data.Name;
                        this.ustreamcomp.CreditCode = data.CreditCode;
                        this.ustreamcomp.address = data.Address;
                        this.ustreamcomp.StartDate = data.StartDate;
                        this.ustreamcomp.approvalDate = data.CheckDate;
                        this.ustreamcomp.OperName = data.OperName;
                        this.ustreamcomp.industry = data.Industry.Industry;
                        this.ustreamcomp.businessTerm = data.TermStart + '-' + data.TeamEnd;
                        this.ustreamcomp.RegistCapi = data.RegistCapi;
                        this.ustreamcomp.BelongOrg = data.BelongOrg;
                        this.ustreamcomp.EconKind = data.EconKind;
                        this.ustreamcomp.Scope = data.Scope;
                    } else {
                        this.xn.msgBox.open(false, '未查到该企业信息');
                    }
                });

            this.xn.loading.close();

        } else if (this.row.type === 'lawsuitMsg') {
            for (let i = 0; i < this.lawsuitMsgtable.length; i++) {
                const item = this.lawsuitMsgtable[i];
                this.xn.avenger.post(item.get_url,
                    { company: this.svrConfig.record.supplierName, pageIndex: 0, pageSize: 5 }).subscribe(x => {
                        if (x.data && x.data.Result !== null && x.data.Result.length > 0) {
                            item.data = x.data.Result;
                            item.pageConfig.total = x.data.Paging.TotalRecords;
                        } else {
                            item.data = [];
                            item.pageConfig.total = 0;
                        }
                    });

            }

        } else if (this.row.type === 'amountChangeTrend') {

            this.xn.avenger.post('/sub_system/risk/threeElement', {
                companyName: this.svrConfig.record.supplierName
            }).subscribe(data => {
                this.datalist = data.data.map(x => {
                    return {
                        date: x.createTime,
                        loanLimit: x.loanLimit,
                        dateLimit: x.dateLimit,
                        factoringFee: x.factoringFee,
                        factoringSvcFee: x.factoringSvcFee,
                        platformSvcFee: x.platformSvcFee,

                    };
                });
                const el = document.getElementById('chart1');
                const option01 = this.optionData01(this.datalist);
                const chart01 = echarts.init(el);
                chart01.setOption(option01);


            });

        } else if (this.row.type === 'businessPeriodTrend') {
            this.xn.avenger.post('/sub_system/risk/threeElement', {
                companyName: this.svrConfig.record.supplierName
            }).subscribe(data => {
                this.datalist = data.data.map(x => {
                    return {
                        date: x.createTime,
                        loanLimit: x.loanLimit,
                        dateLimit: x.dateLimit,
                        factoringFee: x.factoringFee,
                        factoringSvcFee: x.factoringSvcFee,
                        platformSvcFee: x.platformSvcFee,

                    };
                });
                const el = document.getElementById('chart2');
                // console.log('el', el);
                const option02 = this.optionData02(this.datalist);
                const chart02 = echarts.init(el);
                chart02.setOption(option02);

            });

        } else if (this.row.type === 'accountsCheck') {
            this.xn.api.post('/custom/avenger/guarantee_manager/financing_check', {
                dt: this.getNowFormatDate(),
                orgName: this.svrConfig.record.supplierName,
                start: 0,
                length: 10,
            }).subscribe(data => {
                this.Tabconfig[7].data = data.data.data;
                this.Tabconfig[7].pageConfig.total = data.data.count;

            });

            // } else if (this.row.type === 'accountsTarget') {
            //     this.xn.api.post('/custom/avenger/guarantee_manager/financing_target', {
            //         dt: this.getNowFormatDate(),
            //         orgName: this.svrConfig.record.supplierName,
            //     }).subscribe(data => {
            //         if (data.ret === 0) {
            //             this.keydetail = data.data.data;
            //         } else {
            //         }
            //     });
            // }
        }
    }


    onPagehistory(page: number) {
        page = page || 1;
        this.pageConfighistory = Object.assign({}, this.pageConfighistory, page);
        this.xn.loading.open();
        this.xn.avenger.post('/sub_system/history/allBusiness', {
            mainFlowId: this.svrConfig.record.mainFlowId,
            start: (page - 1) * this.pageConfighistory.pageSize, length: this.pageConfighistory.pageSize
        }).subscribe(x => {
            if (x.ret !== 0) {
                this.xn.msgBox.open(false, x.msg);
            } else {
                if (x.data) {
                    this.items = x.data.rows;
                    this.historydata[0] = x.data.history;
                    this.pageConfighistory.total = this.items.length;
                }
            }
        });
        this.xn.loading.close();
    }
    onPagefinacate(page: number, tableinfo: any) {
        page = page || 1;
        tableinfo.pageConfig = Object.assign({}, tableinfo.pageConfig, page);
        this.xn.loading.open();
        this.xn.api.post('/custom/avenger/guarantee_manager/financing_check', {
            dt: this.getNowFormatDate(),
            orgName: this.svrConfig.record.supplierName,
            start: (page - 1) * tableinfo.pageConfig.pageSize,
            length: tableinfo.pageConfig.pageSize,
        }).subscribe(x => {
            if (x.data) {
                this.Tabconfig[7].data = x.data.data;

            }
        });
        this.xn.loading.close();
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
                    right: '0%',
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
            // grid: {
            //     left: '3%',
            //     right: '4%',
            //     bottom: '3%',
            //     containLabel: true
            // },
            grid: [
                {
                    left: '0%',
                    bottom: '10%',
                    right: '2%',
                    containLabel: true
                }],
            toolbox: {
                show: true,
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
                    stack: '总量',
                    data: this.factoringFee.reverse()
                },
                {
                    name: '保理服务费率',
                    type: 'line',
                    stack: '总量1',
                    data: this.factoringSvcFee.reverse()
                },
                {
                    name: '平台服务费率',
                    type: 'line',
                    stack: '总量2',
                    data: this.platformSvcFee.reverse()
                }
            ]
        };
    }
    onPage(e, tableinfo) {
        this.paging = e.page || 1;
        tableinfo.pageConfig = Object.assign({}, tableinfo.pageConfig, e);
        if (this.paging === 1) {
            tableinfo.data = tableinfo.alldata.slice(0, tableinfo.pageConfig.pageSize);

        } else {
            tableinfo.data = tableinfo.alldata.slice((this.paging - 1) * tableinfo.pageConfig.pageSize,
                (this.paging - 1) * tableinfo.pageConfig.pageSize + tableinfo.pageConfig.pageSize);

        }


    }

    onPagelawsuit(e, url, pageconfig, table) {
        this.paging = e.page || 1;
        pageconfig = Object.assign({}, pageconfig, e);
        const params: any = {
            pageIndex: e.page,
            pageSize: pageconfig.pageSize,
            company: this.svrConfig.record.supplierName,
        };
        this.xn.avenger.post(url, params).subscribe(x => {
            if (x.data && x.data.Result !== null) {
                table.data = x.data.Result;
                table.pageConfig.total = x.data.Paging.TotalRecords;
            }

        });

    }
    getNowFormatDate() {
        const date = new Date();
        const seperator1 = '-';
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const strDate = date.getDate();
        let currentmonth = '';
        let currentDate = '';
        if (month >= 1 && month <= 9) {
            currentmonth = '0' + month;
        } else {
            currentmonth = month.toString();
        }
        if (strDate >= 0 && strDate <= 9) {
            currentDate = '0' + strDate;
        } else {
            currentDate = strDate.toString();
        }
        const currentdate = year + seperator1 + currentmonth + seperator1 + currentDate;
        return currentdate;
    }

    /**
     * 处理预警信息
     * @param item 参数
     */
    public processWarningInfo(item) {
        this.xn.router.navigate([`/console/record/new/handle_warning_msg`]
            , {
                queryParams: {
                    id: 'handle_warning_msg',
                    relate: 'warnInfo',
                    relateValue: JSON.stringify(
                        { warnType: item.name, expression: item.resolvedContentExpression,  orgName: item.orgName })
                }
            });
    }

}
