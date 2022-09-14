import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute, Params} from '@angular/router';


@Component({
    templateUrl: './piaojc.component.html',
    styles: []
})
export class PiaojcComponent implements OnInit {

    pageTitle = '资产结构';
    pageDesc = '';
    tableTitle = '';

    @ViewChild('chart1') chart1: ElementRef;
    @ViewChild('chart2') chart2: ElementRef;
    @ViewChild('chart3') chart3: ElementRef;

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            // this.ledgerId = params['ledger'];
            // this.id = params['id'];

            this.xn.api.post('/data/piaojc/term', {}).subscribe(json => {

                const option = this.optionTerm(json.data.data);

                const chart = echarts.init(this.chart1.nativeElement);
                chart.setOption(option);
            });

            this.xn.api.post('/data/piaojc/profit', {}).subscribe(json => {

                const option = this.optionProfit(json.data.data);

                const chart = echarts.init(this.chart2.nativeElement);
                chart.setOption(option);
            });

            this.xn.api.post('/data/piaojc/use', {}).subscribe(json => {

                const option = this.optionUse(json.data.series.map(v => {
                    return {
                        name: v.title,
                        type: 'line',
                        stack: '总量',
                        areaStyle: {normal: {}},
                        data: v.data
                    };
                }), json.data.series[0] && json.data.series[0].columns || [], json.data.series.map(v => v.title));
                const chart3 = echarts.init(this.chart3.nativeElement);
                chart3.setOption(option);
            });

        });


    }

    private optionTerm(data) {
        return {
            title: {
                text: '期限结构',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#000'
                }
            },

            tooltip: {
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
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: data.sort(function(a, b) {
                        return a.value - b.value;
                    }),
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
                }
            ]
        };
    }

    private optionProfit(data) {
        return {
            title: {
                text: '收益结构',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#000'
                }
            },

            tooltip: {
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
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: data.sort(function(a, b) {
                        return a.value - b.value;
                    }),
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
                }
            ]
        };
    }

    private optionUse(data, columns, title) {
        return {
            title: {
                text: '再利用率'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: title
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: columns
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: data
        };
    }

}
