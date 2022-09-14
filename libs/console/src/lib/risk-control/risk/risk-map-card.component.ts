import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {FormGroup} from '@angular/forms';
import {Component, OnInit, ElementRef, ViewChild, Input, OnChanges} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-risk-map-card',
    templateUrl: './risk-map-card.component.html',
})
export class RiskMapCardComponent implements OnInit, OnChanges {
    shows = [];
    mainForm: FormGroup;
    datalist1 = [];
    json1 = {
        stockName: '',
        stockId: '',
        ratting: '',
        score: ''
    };

    @ViewChild('chart1') chart1: ElementRef;
    @Input() stockId: string;

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.stockId === '思贝克') {
            this.buildChart3(this.stockId);
        } else {
            this.buildChart1(this.stockId);
        }
    }

    private buildChart1(stockId) {
        this.xn.api.post('/jzn/intelligence/card_score', {
            stockId
        }).subscribe(json => {
            if (XnUtils.isEmptyObject(json.data)) {
                this.json1 = {
                    stockName: '',
                    stockId: '',
                    ratting: '',
                    score: ''
                };
                this.datalist1 = [];
                return;
            }
            this.json1 = json.data;
            if (json.data && json.data.detail && json.data.detail.length) {
                this.datalist1 = json.data.detail.map(v => {
                    v.score = Number(v.score).toFixed(2);
                    return v;
                });
            }
            const option = this.optionCardScore(json.data);
            const chart = echarts.init(this.chart1.nativeElement);
            chart.setOption(option);
        });
    }

    private buildChart3(stockId) {
        this.xn.api.post('/jzn/intelligence/card_score2', {
            stockId,
            type: 2
        }).subscribe(json => {
            if (XnUtils.isEmptyObject(json.data)) {
                this.json1 = {
                    stockName: '',
                    stockId: '',
                    ratting: '',
                    score: ''
                };
                this.datalist1 = [];
                return;
            }
            this.json1 = json.data;
            if (json.data && json.data.detail && json.data.detail.length) {
                this.datalist1 = json.data.detail.map(v => {
                    v.score = Number(v.score).toFixed(2);
                    return v;
                });
            }
            const option = this.optionCardScore(json.data);
            const chart = echarts.init(this.chart1.nativeElement);
            chart.setOption(option);
        });
    }

    private optionCardScore(data) {
        if (data && data.detail && data.detail.length) {
            return {
                tooltip: {},
                legend: {
                    data: ['打分卡得分明细']
                },
                radar: {
                    indicator: this.buildIndicator(data.detail)
                },
                series: [{
                    name: '打分卡得分明细',
                    type: 'radar',
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        areaStyle: {
                            color: 'rgba(0,250,0,0.3)'
                        }
                    },
                    data: [
                        {
                            name: '得分明细',
                            type: 'radar',
                            radius: '55%',
                            center: ['50%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: true,
                                    formatter: '{c}',
                                }
                            },
                            value: data.detail.map(d => {
                                return Number(d.score).toFixed(2);
                            }),
                        }
                    ]
                }]
            };
        }
        return data;
    }

    private buildIndicator(detail) {
        return detail.map(c => {
            return {
                name: c.indexName,
                max: 1
            };
        });
    }
}
