import {Component, OnInit, ElementRef, ViewChildren, QueryList, ViewContainerRef, ViewChild} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute, Params} from '@angular/router';

import {isArray} from 'util';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {LogDetailModalComponent} from 'libs/shared/src/lib/public/modal/log-detail-modal.component';

declare let $: any;
import * as moment from 'moment';

@Component({
    templateUrl: './enterprise.component.html',
    styles: [
        `.date-time { position: relative; width: 250px; }`,
        `.date-time i { position: absolute; bottom: 8px; right: 10px; top: auto; cursor: pointer; }`,
        `.date-input { padding: 4 10px; box-shadow: inset 0 1px 1px rgba(0,0,0,.075); border-radius: 4px;}`,
        `.box-title { height: 32px; line-height: 30px }`,
        `.text-right { text-align: right }`,
        `.text-center { text-align: center }`,
    ]
})
export class EnterpriseComponent implements OnInit {

    pageTitle = '融资详情';
    pageDesc = '';
    tableTitle = '融资详情';
    column: any[] = [];
    list: any[] = [];
    chartBars: any = [];
    chartPies: any = [];
    total: any = [];

    @ViewChildren('chartBar') chartBar: QueryList<ElementRef>;
    @ViewChildren('chartPie') chartPie: QueryList<ElementRef>;

    @ViewChild('chart1') chart1: ElementRef;
    @ViewChild('chart2') chart2: ElementRef;
    @ViewChild('chart3') chart3: ElementRef;
    @ViewChild('chart4') chart4: ElementRef;
    @ViewChild('chart5') chart5: ElementRef;
    @ViewChild('chart6') chart6: ElementRef;

     @ViewChild('configDate', { static: true }) configDate: ElementRef;

    constructor(private xn: XnService, private route: ActivatedRoute, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.getData();
        });

        this.initDate();
    }

    private getData(beginTime?, endTime?) {
        const params = {} as any;
        params.beginTime = beginTime;
        params.endTime = endTime;

        this.xn.api.post('/data/enterprise/all', params).subscribe(json => {
            this.column = json.data.columns;
            this.list = json.data.data;

            if (json.data.data.length <= 0) { // data为空，不往下执行
                return;
            }

            // 计算合计
            let arr = [];
            arr = this.computeTotal(json.data.data);
            arr[0] = '合计';
            this.total = arr;

            // chartBars和chartPies重置为空，重新计算
            this.chartBars = [];
            this.chartPies = [];
            const balance = {} as any; // 余额
            const maxAmount = {} as any; // 单笔金额
            const avgTime = {} as any; // 平均期限
            const appName = {} as any; // 核心企业
            const allAmount = {} as any; // 收入贡献
            const proportion = {} as any; // 业务份额， 同累计发生额

            this.buildObj(this.column, balance, maxAmount, avgTime, proportion, allAmount, appName); // 生成一个对象，供echarts使用

            // 拼成一个数组
            const bars = [balance, maxAmount, avgTime];
            const barpies = [proportion, allAmount];

            for (let bar of bars) { // 上面的echart样式
                bar = this.createArray(bar);
                for (let i = 0; i < this.list.length; i++) {
                  (bar as any).name.push(this.list[i][(appName as any).index]);
                  (bar as any).value.push(this.list[i][(bar as any).index]);
                }
                this.chartBars.push(bar);
            }

            for (let bar of barpies) { // 下面的echart样式
                bar = this.createArray(bar);
                for (let i = 0; i < this.list.length; i++) {
                    (bar as any).name.push(this.list[i][(appName as any).index]);
                    (bar as any).value.push({
                        value: this.getPiesValue(this.list[i][(bar as any).index]),
                        name: this.list[i][(appName as any).index]
                    });
                }
                this.chartPies.push(bar);
            }

            setTimeout(() => {
                const elementBars = this.chartBar.toArray(); // 上面的echart样式
                for (let i = 0; i < this.chartBars.length; ++i) {
                    this.initEchart(elementBars[i], this.option1(this.chartBars[i]));
                }

                const elementPies = this.chartPie.toArray(); // 下面的echart样式
                for (let i = 0; i < this.chartPies.length; ++i) {
                    this.initEchart(elementPies[i], this.option2(this.chartPies[i]));
                }
            });
        });
    }

    computeTotal(data) {
        // ["核心企业", "累计发生额", "业务份额", "余额", "已回款", "总笔数", "单笔金额", "平均期限", "收入贡献", "详情"]
        // 需统计的总和为a[1], a[3], a[4], a[5], a[8]
        // 需统计的百分数相加为a[2]
        const needComputes = [1, 3, 4, 5, 8]; // 单侧相加
        const perAmount = [6];  // 单笔金额
        const averageDay = [7]; // 平均期限
        const count = [5]; // 总笔数
        const afterComputes = [];
        for (const need of needComputes) {
            afterComputes[need] = this.computeSum(data.map(v => Number(v[need].toString().replace(/,/g, ''))));
        }

        let after = [];
        after = afterComputes.map(v => v.toFixed(2));
        after[count[0]] = parseInt(after[count[0]], 10); // 总笔数为整型
        after[perAmount[0]] = (after[1] / after[5]).toFixed(2); // 计算单笔金额 = 累计发生额 / 总笔数
        after[averageDay[0]] = this.computeAverageDay(data, averageDay, count, afterComputes); // 平均期限
        return after; // js浮点数相加会错乱，取两位小数
    }

    // 算平均期限
    computeAverageDay(data, averageDay, count, afterComputes) {
        return (this.computeSum(data.map(v => v[averageDay[0]] * v[count[0]])) / afterComputes[count[0]]).toFixed(0);
    }

    // 具体到单个数组的求和
    computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }

    // 初始化Echart
    private initEchart(element, option) {
        if (!element.chart) {
            element.chart = echarts.init(element.nativeElement);
        }
        element.chart.setOption(option);
    }

    // 生成对象
    private buildObj(column, balance, maxAmount, avgTime, proportion, allAmount, appName) {
        for (let i = 0; i < column.length; i++) {
            switch (column[i]) {
                case '余额':
                    balance.index = i;
                    balance.key = 'balance';
                    balance.title = '余额';
                    balance.unit = '百万元';
                    break;
                case '单笔金额':
                    maxAmount.index = i;
                    maxAmount.key = 'maxAmount';
                    maxAmount.title = '单笔金额';
                    maxAmount.unit = '百万元';
                    break;
                case '平均期限':
                    avgTime.index = i;
                    avgTime.key = 'avgTime';
                    avgTime.title = '平均期限';
                    avgTime.unit = '天';
                    break;
                case '累计发生额': // 事实上是业务份额，拿的是累计发生额的值
                    proportion.index = i;
                    proportion.key = 'proportion';
                    proportion.title = '业务份额';
                    proportion.unit = '百万元';
                    break;
                case '收入贡献':
                    allAmount.index = i;
                    allAmount.key = 'allAmount';
                    allAmount.title = '收入贡献';
                    allAmount.unit = '百万元';
                    break;
                case '核心企业':
                    appName.index = i;
                    appName.key = 'appName';
                    appName.title = '核心企业';
                    break;
            }
        }
    }

    private getPiesValue(value) {
        if (!value) {
            return;
        }
        return (Number(value.replace(/,/g, '')) / 1000000).toFixed(2); // 除以100万

    }

    // 如果不是数组，则新建数组
    private createArray(obj) {
        if (!isArray(obj.name)) {
            obj.name = [];
        }
        if (!isArray(obj.value)) {
            obj.value = [];
        }

        return obj;
    }

    private initDate() {
        $(this.configDate.nativeElement).daterangepicker({
            startDate: moment(),
            endDate: moment(),
            opens: 'left',
            alwaysShowCalendars: true,
            ranges: {
                今天: [moment(), moment()],
                昨天: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                近7天: [moment().subtract(7, 'days'), moment()],
                近30天: [moment().subtract(30, 'days'), moment()],
                这个月: [moment().startOf('month'), moment().endOf('month')],
                上个月: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            },
            locale: {
                customRangeLabel: '自定义日期',
                applyLabel: '确定',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '到',
                format: 'YYYY-MM-DD',
                weekLabel: '周',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }
        }, (start, end, label) => {
            this.getData(start.format('X'), end.format('X'));
        });
    }

    private option1(data) {
        return {
            title: {
                text: data.title,
                subtext: '单位（' + data.unit + '）',
                x: 0,
                y: 0,
                textStyle: {
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    // 字体大小
                    fontSize: 18
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: data.name,
            },
            series: [
                {
                    type: 'bar',
                    data: data.key === 'avgTime' ? data.value : data.value.map(v => (Number(v.replace(/,/g, '')) / 1000000).toFixed(2))
                }
            ]
        };
    }

    private option2(data) {
        return {
            title: {
                text: data.title,
                subtext: '单位（' + data.unit + '）',
                x: 'center',
                y: 0,
                textStyle: {
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    // 字体大小
                    fontSize: 18
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                y: '30px',
                data: data.name
            },
            series: [
                {
                    name: data.title,
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data.value
                }
            ]
        };
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, LogDetailModalComponent, item).subscribe(() => {
        });
    }

}
