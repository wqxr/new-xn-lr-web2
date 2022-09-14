import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute, Params} from '@angular/router';


declare let $: any;
import * as moment from 'moment';

@Component({
    templateUrl: './money-table.component.html',
    styles: [
        `.purple {color: purple}`,
        `.black {color: black}`,
        `.red {color: red}`,
        `.green {color: green}`,
        `.margin-bottom-0 { margin-bottom: 0 }`,
        `.box-body { overflow: hidden }`,
        `.text-right { text-align: right }`,
        `.form-group { margin-right: 0; margin-left: 0; overflow-x: scroll }`,
        `.mr3 { margin-right: 10px }`,
        `tr td { vertical-align: middle; text-align: center }`,
        `tr th { vertical-align: middle; text-align: center; min-width: 120px; padding-left: 0; padding-right: 0;}`,
        `.enterprise-name { min-width: 300px }`,
        // `.table { width: 1500px; }`,
        `.table-left { display: inline-block; }`,
        `.table-right { display: inline-block; vertical-align: top }`,
        `.table-body { position: absolute; left: 0; top: 0; }`,
        `.table-tr.active td { background-color: #b6e3de;  border-bottom: 0; }`,
        `.chart-height-600 { height: 600px; width: 2800px }`,
        `.over-hidden { overflow: hidden }`
    ]
})
export class MoneyTableComponent implements OnInit {

    pageTitle = '资金回笼表';
    pageDesc = '';
    tableTitle = '资金回笼表';
    titles: any = [];
    datas: any = [];
    sums: any = {} as any;
    line: number;
    nowMonth: number;
    nowCnMonth: string;
    nowMonthIndex: number;
    optionKey: any = [
        {
            cn: '回款中',
            en: 'backAmont'
        },
        {
            cn: '放款',
            en: 'loanAmount'
        },
        {
            cn: '逾期',
            en: 'overAmont'
        },
        {
            cn: '已还款',
            en: 'repaymentAmount'
        },
    ];
    optionKeyAll: any = [
        {
            cn: '回款中',
            en: 'backAmont',
            all: 'allBackAmont'
        },
        {
            cn: '放款',
            en: 'loanAmount',
            all: 'allLoanAmount'
        },
        {
            cn: '逾期',
            en: 'overAmont',
            all: 'allOverAmont'
        },
        {
            cn: '已还款',
            en: 'repaymentAmount',
            all: 'allRepayment'
        },
    ];

    @ViewChild('chart1') chart1: ElementRef;
    @ViewChild('chart2') chart2: ElementRef;
    @ViewChild('chart3') chart3: ElementRef;

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.xn.api.post('/data/capital/info', {}).subscribe(json => {
                if (json.data.length <= 0) {
                    return;
                }

                // 生成一个数组，就是列，当前月份往前推12个月。
                let rows: any = [];
                this.titles = [];
                rows = this.getLastYear();
                this.titles = rows;
                this.nowMonth = +(moment().format('YY') + moment().format('MM'));
                this.nowCnMonth = moment().format('YYYY') + '年' + moment().format('MM') + '月';
                const index = this.getNowMonthIndex(rows, this.nowMonth);
                const preData = this.getCol(json.data);
                const uniqueData = this.arrUnique(preData, 'appName');

                const uniqueAppName = uniqueData.map(v => v.appName);
                // uniqueAppName.push('总计');

                const afterData = this.uniteMonth(preData, uniqueAppName);
                this.datas = afterData;

                const compute = this.computeOptionAndSums(afterData, rows);
                const optionKeys = compute.optionKeys;
                const sums = compute.sums;

                const optionDataLoanAmount = optionKeys.loanAmount;
                const sumLoanAmount = sums.loanAmount;
                const option = this.getOption(optionDataLoanAmount, sumLoanAmount);

                const nowPieData = this.getNowMonthData(sums, index);
                this.buildPieNow(nowPieData, this.nowCnMonth + '回款情况');

                const allPieData = this.getAllMonthData(sums);
                this.buildPieAll(allPieData, '总回款情况');
                uniqueAppName.push('总计');
                this.buildChart(this.titles, uniqueAppName, option);

            });


            // this.xn.api.post('/data/piaojc/profit', {}).subscribe(json => {
            //     console.log('profit: ', json.data.data);

            //     const option = this.optionProfit(json.data.data);
            //     console.log(option);

            //     let chart = echarts.init(this.chart3.nativeElement);
            //     chart.setOption(option);
            // });
        });
    }

    buildPieNow(data, title) {
        const option = this.optionTerm(data, title);
        const chart = echarts.init(this.chart2.nativeElement);
        chart.setOption(option);
    }

    buildPieAll(data, title) {
        const option = this.optionProfit(data, title);
        const chart = echarts.init(this.chart3.nativeElement);
        chart.setOption(option);
    }

    getNowMonthData(sums, index) {
        const optionKey = this.optionKey;
        const arr: any = [];
        for (const key of optionKey) {
            arr.push({
                name: key.cn,
                value: (sums[key.en][index] * 100).toFixed(2)
            });
        }
        return arr;
    }

    getAllMonthData(sums) {
        const optionKey = this.optionKey;
        const optionKeyAll = this.optionKeyAll;
        const arr: any = [];
        for (const key of optionKey) {
            for (const keyAll of optionKeyAll) {
                if (keyAll.en === key.en) {
                    arr.push({
                        name: keyAll.cn,
                        value: (sums[keyAll.all] * 100).toFixed(2)
                    });
                }
            }
        }
        return arr;
    }

    // 计算当前月份所在的index
    getNowMonthIndex(rows, nowMonth) {
        for (let i = 0; i < rows.length; i++) {
            if (Number(rows[i].month) === Number(nowMonth)) {
                this.nowMonthIndex = i;
            }
        }
        return this.nowMonthIndex;
    }

    computeOptionAndSums(afterData, rows) {
        const optionKey = this.optionKey.map(v => v.en);
        const optionKeys = {} as any;
        for (const key of optionKey) {
            optionKeys[key] = this.buildOptionData(afterData, rows, key);
        }
        const sums = {
          repaymentAmount: 0,
          backAmont: 0,
          loanAmount: 0,
          overAmont: 0,
          allRepayment: 0,
          allBackAmont: 0,
          allLoanAmount: 0,
          allOverAmont: 0,
        };
        for (const key of optionKey) {
            sums[key] = this.getSum(this.buildArray(optionKeys[key]));
        }
        sums.allRepayment = this.getAllRepay(sums.repaymentAmount);
        sums.allBackAmont = this.getAllRepay(sums.backAmont);
        sums.allLoanAmount = this.getAllRepay(sums.loanAmount);
        sums.allOverAmont = this.getAllRepay(sums.overAmont);
        this.sums = sums;
        return {
            optionKeys,
            sums
        };
    }

    getAllRepay(sums) {
        let total = 0;
        for (const sum of sums) {
            total += sum;
        }
        return total;
    }

    // 拼成option的值，带上总计
    getOption(optionData, sum) {
        const option = optionData.map(v => {
            return {
                name: v.name,
                data: v.value.map(d => d.toFixed(2)),
                type: 'bar',
            };
        });
        option.push({
            name: '总计',
            type: 'line',
            data: sum.map(v => v.toFixed(2)),
        });
        return option;
    }

    // 拼成纯数组
    buildArray(optionData) {
        const arr = optionData.map(v => v.value);
        return arr;
    }

    // 求和
    getSum(arr) {
        const newArray = arr[0].map((col, i) => {
            return arr.map((row) => {
                return row[i];
            });
        });
        const sum = [];
        for (const array of newArray) {
            sum.push(this.computeSum(array));
        }
        return sum; // js浮点数相加会错乱，取两位小数
    }

    // 具体到单个数组的求和
    computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }

    buildOptionData(datas, titles, v) {
        const arrs = [];
        for (const data of datas) {
            const arr = [];
            for (const title of titles) {
                let key = false;
                for (const i of data.value) {
                    if (parseInt(i.month, 10) === parseInt(title.month, 10)) {
                        key = true;
                        arr.push(i[v] / 1000000); // 除以百万
                    }
                }
                if (key === false) {
                    arr.push(0);
                }
            }
            arrs.push({
                name: data.name,
                value: arr
            });
        }
        return arrs;
    }

    // 生成一个数组，就是列，当前月份往前推12个月。
    // 测试月份：moment('2015-03-25').subtract(i, 'months').format('M')
    getLastYear() {
        const rows = [];
        // 当前月份往前推12个月。
        for (let i = 11; i >= 0; i--) {
            rows.push({
                year: moment().subtract(i, 'months').format('YY'),
                MMmonth: moment().subtract(i, 'months').format('MM'),
                month: moment().subtract(i, 'months').format('YY') + moment().subtract(i, 'months').format('MM')
            });
        }
        // 当前月份往前后12个月。
        for (let i = 1; i <= 11; i++) {
            rows.push({
                year: moment().add(i, 'months').format('YY'),
                MMmonth: moment().add(i, 'months').format('MM'),
                month: moment().add(i, 'months').format('YY') + moment().add(i, 'months').format('MM'),
            });
        }
        return rows.filter(v =>  Number(v.month) >= 1710);
    }

    // 遍历所有data项，将每个data项的时间戳算成月份，并加上
    getCol(datas) {
        for (let i = 0; i < datas.length; ++i) {
            const payMonth = this.computeMonth(datas[i].payTime);
            const factoryMonth = this.computeMonth(datas[i].factoringTime);
            datas[i].payMonth = parseInt(payMonth, 10);
            datas[i].factoryMonth = parseInt(factoryMonth, 10);
        }

        return datas;
    }

    // 将时间戳转成月份
    computeMonth(date) {
        // 时间戳转成毫秒
        const month = moment(new Date(date * 1000)).format('YY') + moment(new Date(date * 1000)).format('MM');
        return month;
    }

    // 将相同公司相同月份的值进行统一相加
    uniteMonth(datas, uniqueAppName) {
        if (datas && datas.length === 0 || uniqueAppName && uniqueAppName.length === 0) {
            return;
        }
        const uniteData: any = [];

        for (const name of uniqueAppName) {
            const arrs: any = [];
            for (const data of datas) {
                if (name === data.appName) {
                    arrs.push(data);
                }
            }
            const obj = {} as any;
            obj.name = name;
            obj.value = this.sameMonthAdd(arrs);
            obj.total = this.getPerTotal(this.sameMonthAdd(arrs));
            uniteData.push(obj);
        }
        return uniteData;
    }

    getPerTotal(arrs) {
        let total = 0;
        for (const arr of arrs) {
            total += arr.repaymentAmount;
        }
        return total;
    }

    // 数组去重
    arrUnique(arrs, id) {
        const hash = {} as any;
        arrs = arrs.reduce(function(item, next) {
            hash[next[id]] ? '' : hash[next[id]] = true && item.push(next);
            return item;
        }, []);
        return arrs;
    }

    // 将相同月份的值进行相加
    sameMonthAdd(arrs) {
        // let backAmont: number = 0; // 回款中
        // let loanAmount: number = 0; // 放款中
        // let overAmont: number = 0; // 逾期
        // let repaymentAmount: number = 0; // 还款
        const obj = {} as any;
        const arr = [];
        // for (const item of arrs) {
        //     if (!obj[item['payMonth']]) {
        //         obj[item['payMonth']] = {} as any;
        //         obj[item['payMonth']].backAmont = 0;
        //         obj[item['payMonth']].loanAmount = item.loanAmount;
        //         obj[item['payMonth']].overAmont = 0;
        //         obj[item['payMonth']].repaymentAmount = 0;
        //     } else {
        //         obj[item['payMonth']].loanAmount +=  item.loanAmount;
        //     }

        // }

        // for (const item of arrs) {
        //     if (!obj[item['factoryMonth']]) {
        //         obj[item['factoryMonth']] = {} as any;
        //         obj[item['factoryMonth']].backAmont = 0;
        //         obj[item['factoryMonth']].overAmont = item.overAmont;
        //         obj[item['factoryMonth']].repaymentAmount = item.repaymentAmount;
        //     } else {
        //         if (item.repaymentAmount <= 0 && item.overAmont <= 0) {
        //             obj[item['factoryMonth']].backAmont += item.loanAmount;
        //         }
        //         obj[item['factoryMonth']].overAmont +=  item.overAmont;
        //         obj[item['factoryMonth']].repaymentAmount += item.repaymentAmount;
        //     }
        // }

        for (const item of arrs) {
            if (!obj[item.factoryMonth]) {
                obj[item.factoryMonth] = {} as any;
                obj[item.factoryMonth].backAmont = 0;
                if (item.repaymentAmount <= 0 && item.overAmont <= 0) {
                    obj[item.factoryMonth].backAmont += item.loanAmount;
                }
                obj[item.factoryMonth].loanAmount = item.loanAmount;
                obj[item.factoryMonth].overAmont = item.overAmont;
                obj[item.factoryMonth].repaymentAmount = item.repaymentAmount;
            } else {
                if (item.repaymentAmount <= 0 && item.overAmont <= 0) {
                    obj[item.factoryMonth].backAmont += item.loanAmount;
                }
                obj[item.factoryMonth].loanAmount +=  item.loanAmount;
                obj[item.factoryMonth].overAmont +=  item.overAmont;
                obj[item.factoryMonth].repaymentAmount += item.repaymentAmount;
            }

        }

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const temp = {} as any;
                temp.month = parseInt(key, 10);
                temp.backAmont = obj[key].backAmont;
                temp.loanAmount = obj[key].loanAmount;
                temp.overAmont = obj[key].overAmont;
                temp.repaymentAmount = obj[key].repaymentAmount;
                arr.push(temp);
            }
        }

        return arr;
    }

    buildChart(titles, uniqueAppName, option) {
        const option1 = {
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
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                x : '0',
                y : '0',
                orient: 'vertical',
                itemGap: 10,
                itemWidth: 20,
                itemHeight: 14,
                padding: 5,
                data: uniqueAppName
            },
            xAxis: [
                {
                    type: 'category',
                    data: titles.map(v => {
                        return v.year + '/' + v.MMmonth;
                    }),
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '百万',
                    min: 0,
                    max: 1200,
                    interval: 100,
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
            ],
            series: option
        };
        const chart1 = echarts.init(this.chart1.nativeElement);
        chart1.setOption(option1);
    }

    clickOn(i) {
        this.line = i;
    }

    onCss(num) {
        return this.line === num ? 'active' : '';
    }

    private optionTerm(data, title) {
        return {
            title: {
                text: title,
                subtext: '单位（万元）',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#000'
                }
            },

            tooltip : {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                x: '30px',
                y: '30px',
                data: data.map(v => v.name)
            },
            series: [
                {
                    name: '占比详情',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data: data.sort(function(a, b) { return a.value - b.value; }),
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            // position: 'inner',
                            formatter: '{b}：{c}',
                        }
                    }
                }
            ]
        };
    }

    private optionProfit(data, title) {
        return {
            title: {
                text: title,
                subtext: '单位（万元）',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#000'
                }
            },

            tooltip : {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                x: '30px',
                y: '30px',
                data: data.map(v => v.name)
            },
            series: [
                {
                    name: '占比详情',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data: data.sort(function(a, b) { return a.value - b.value; }),
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            // position: 'inner',
                            formatter: '{b}：{c}',
                        }
                    }
                }
            ]
        };
    }
}
