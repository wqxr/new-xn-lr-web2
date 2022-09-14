import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {FormGroup} from '@angular/forms';
import {Component, OnInit, ElementRef, ViewChild, OnChanges, Input} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';


@Component({
    selector: 'app-risk-map-dd',
    templateUrl: './risk-map-dd.component.html',
    styles: [`
        .showscore {
            opacity: 0
        }`]
})
export class RiskMapDDComponent implements OnInit, OnChanges {

    pageTitle = '风险地图';
    pageDesc = '';
    shows = [];
    mainForm: FormGroup;
    datalist2 = [];

    json2 = {
        stockName: '',
        stockId: '',
        ratting: '',
        score: ''
    };

    @ViewChild('chart2') chart2: ElementRef;
    @ViewChild('showscore') showscore: ElementRef;
    @Input() stockId: string;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.buildChart2(this.stockId);
    }

    private buildChart2(stockId) {
        this.xn.api.post('/jzn/intelligence/dd_score', {
            stockId
        }).subscribe(json => {
            if (XnUtils.isEmptyObject(json.data)) {
                $(this.showscore.nativeElement).css('opacity', 0);
                this.json2 = {
                    stockName: '',
                    stockId: '',
                    ratting: '',
                    score: ''
                };
                this.datalist2 = [];
                return;
            }
            this.json2 = json.data;
            this.datalist2 = json.data.detail;
            $(this.showscore.nativeElement).css('opacity', 1);
            const option = this.optionDDScore(json.data);
            const chart = echarts.init(this.chart2.nativeElement);
            chart.setOption(option);
        });
    }

    private optionDDScore(data) {
        data.detail.sort(function(a, b) {
            return a.date > b.date;
        });
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
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data: ['短期债务模型得分明细']
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: data.detail.map(a => a.date),
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '得分',
                    min: 0,
                    max: 10,
                    interval: 1,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '短期债务模型得分明细',
                    label: {
                        normal: {
                            show: true,
                            formatter: '{c}',
                        }
                    },
                    type: 'line',
                    yAxisIndex: 0,
                    data: data.detail.map(d => {
                        return Number(d.score).toFixed(2);
                    }),
                }
            ]
        };
    }
}
