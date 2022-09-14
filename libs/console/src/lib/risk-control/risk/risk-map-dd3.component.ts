import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild, OnChanges, Input } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

@Component({
    selector: 'app-risk-map-dd3',
    templateUrl: './risk-map-dd3.component.html',
    styles: [
        `.search {
            margin-bottom: 20px;
        }

        .showscore {
            opacity: 0
        }

        .list {
            float: left;
            width: 200px;
        }

        .innerbox {
            width: 900px;
            margin: 0 auto;
        }

        .chartbox {
            float: left;
            width: 700px;
            height: 500px;
            margin: 0 auto;
        }`
    ]
})
export class RiskMapDD3Component implements OnInit, OnChanges {

    pageTitle = '风险地图';
    pageDesc = '';
    tableTitle1 = '打分卡得分明细';
    tableTitle2 = '短期债务模型得分明细';
    shows = [];
    shows1 = [];
    mainForm: FormGroup;
    mainForm1: FormGroup;
    selectOption = [];
    datalist1 = [];
    datalist2 = [];
    showDDscore = false;

    json2 = {
        stockName: '',
        stockId: '',
        score: '',
        industryAvgScores: [],
        scores: [],
        tendency: []
    };

    @ViewChild('chart2') chart2: ElementRef;
    @ViewChild('showscore') showscore: ElementRef;
    @Input() stockId: string;

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.buildChart2(this.stockId);
    }

    reset(top, bottom) {
        if (bottom < 0) {
            this.xn.msgBox.open(false, '得分下限不能小于0');
            return;
        }
        if (top <= bottom) {
            this.xn.msgBox.open(false, '得分上限必须大于下限');
            return;
        }
        const option = this.optionDDScore(this.json2, top, bottom);
        const chart = echarts.init(this.chart2.nativeElement);
        chart.setOption(option);
    }

    private buildChart2(stockId) {
        this.xn.api.post('/jzn/intelligence/dd_score1', {
            stockId
        }).subscribe(json => {
            if (XnUtils.isEmptyObject(json.data)) {
                $(this.showscore.nativeElement).css('opacity', 0);
                this.json2 = {
                    stockName: '',
                    stockId: '',
                    score: '',
                    industryAvgScores: [],
                    scores: [],
                    tendency: []
                };
                this.datalist2 = [];
                return;
            }

            json.data.scores.reverse();
            json.data.industryAvgScores.reverse();
            json.data.tendency.reverse();
            this.json2 = json.data;
            $(this.showscore.nativeElement).css('opacity', 1);
            const option = this.optionDDScore(json.data);
            const chart = echarts.init(this.chart2.nativeElement);
            chart.setOption(option);
        });
    }

    private optionDDScore(data, top?, bottom?) {

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
                    magicType: { show: true, type: ['line'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['近90天DD得分', '行业平均得分趋势', '近90天线性拟合趋势']
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: data.scores.map(a => a.date),
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '得分',
                    min: top || 0,
                    max: bottom || 10,
                    interval: 1,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: this.buildIndicator(data)
        };
    }

    private buildIndicator(data) {
        let arr = [];
        const scores = {
            name: '近90天DD得分',
            // label: {
            //     normal: {
            //         show: true,
            //         // formatter: '{c}',
            //     }
            // },
            type: 'line',
            yAxisIndex: 0,
            data: data.scores.map(m => Number(m.score).toFixed(2))
        };
        const industryAvgScores = {
            name: '行业平均得分趋势',
            // label: {
            //     normal: {
            //         show: true,
            //         // formatter: '{c}',
            //     }
            // },
            type: 'line',
            yAxisIndex: 0,
            // data: data.industryAvgScores.map(m => m.score)
            data: data.industryAvgScores.map(m => Number(m.score).toFixed(2))
        };
        const tendency = {
            name: '近90天线性拟合趋势',
            // label: {
            //     normal: {
            //         show: true,
            //         // formatter: '{c}',
            //     }
            // },
            type: 'line',
            yAxisIndex: 0,
            data: data.tendency.map(m => Number(m.score).toFixed(2))
        };

        arr = [scores, industryAvgScores, tendency];
        return arr;
    }
}
