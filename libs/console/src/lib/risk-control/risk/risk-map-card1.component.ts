import { forkJoin } from 'rxjs';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';


import * as moment from 'moment';

@Component({
    selector: 'app-risk-map-card1',
    templateUrl: './risk-map-card1.component.html',
    styles: [
        `.search {
            margin-bottom: 20px;
        }

        .showscore {
            opacity: 0
        }

        .list {
            float: left;
            width: 350px;
            text-align: left;
        }

        .innerbox {
            width: 1050px;
            margin: 0 auto;
        }

        .chartbox {
            float: left;
            width: 700px;
            height: 500px;
            margin: 0 auto;
        }

        .list.active {
            left: 50%;
            position: absolute;
            transform: translate(-50%);
        }`
    ]
})
export class RiskMapCard1Component implements OnInit, OnChanges {

    tableTitle1 = '短期债务模型得分';
    shows = [];
    mainForm: FormGroup;
    selectOption = [];
    datalist1 = [];
    json1 = {
        stockName: '',
        stockId: '',
        ratting: '',
        score: '',
        lastCycleScore: '',
        industryAvgScore: ''
    };
    atCenter = false;

    @ViewChild('chart1') chart1: ElementRef;
    @Input() stockId: string;
    @Output() onChange: EventEmitter<any> = new EventEmitter(false);

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        // if (this.stockId === '思贝克') {
        //     this.buildChart3(this.stockId);
        // } else {
        this.buildScore(this.stockId);
        // if (this.stockId !== '思贝克') {
        this.buildChart1(this.stockId);
        // }

        // }
    }

    private buildChart1(stockId) {

        // this.buildScore1(stockId);
        // this.buildChart2(stockId);
        // this.buildChart3(stockId);
        forkJoin(
            this.xn.api.post('/jzn/intelligence/card_score2', {
                stockId,
                type: 1
            }),
            this.xn.api.post('/jzn/intelligence/card_score2', {
                stockId,
                type: 2
            }),
            this.xn.api.post('/jzn/intelligence/card_score2', {
                stockId,
                type: 3
            })
        ).subscribe(([json1, json2, json3]) => {

            // this.datalist1 = json1.data.list.map(c => {
            //     c.rate = Number(c.rate).toFixed(2);
            //     return c;
            // });
            const json01 = json1.data.list.map(c => {
                return {
                    cardName: c.cardName,
                    cardScore: Number(c.cardScore).toFixed(2),
                    rate: Number(c.rate).toFixed(2)
                };
            });
            const json02 = json2.data.list.map(c => {
                return {
                    cardName: c.cardName,
                    cardScore: Number(c.cardScore).toFixed(2),
                    rate: Number(c.rate).toFixed(2)
                };
            });
            const json03 = json3.data.list.map(c => {
                return {
                    cardName: c.cardName,
                    cardScore: Number(c.cardScore).toFixed(2),
                    rate: Number(c.rate).toFixed(2)
                };
            });
            const option = this.optionCardScore(json01, json02, json03);
            const chart = echarts.init(this.chart1.nativeElement);
            chart.setOption(option);
            // this.datalist1 = json1.data.list.map(v => {
            //     v.score = Number(v.score).toFixed(2);
            //     return v;
            // });
            this.onChange.emit(json01.map(v => v.cardName)); // 传一个数组给上级

            for (let i = 0; i < json01.length; i++) {
                this.datalist1[i] = {
                    score: '',
                    preScore: '',
                    averageScore: ''
                };
                this.datalist1[i].name = json01[i].cardName;
                this.datalist1[i].score = json01[i].cardScore;
                this.datalist1[i].preScore = json02[i].cardScore;
                this.datalist1[i].averageScore = json03[i].cardScore;
            }
        });
    }

    buildScore(stockId) {
        this.xn.api.post('/jzn/intelligence/card_score1', {
            stockId
        }).subscribe(json => {
            console.log('card_score: ', json);

            if (XnUtils.isEmptyObject(json.data)) {
                this.json1 = {
                    stockName: '',
                    stockId: '',
                    ratting: '',
                    score: '',
                    lastCycleScore: '',
                    industryAvgScore: ''
                };
                this.datalist1 = [];
                return;
            }
            this.json1 = {
                stockName: json.data.stockName,
                stockId: json.data.stockId,
                ratting: json.data.ratting,
                score: json.data.score,
                lastCycleScore: json.data.lastCycleScore,
                industryAvgScore: json.data.industryAvgScore
            };
            // this.json1 = json.data;
            this.json1.industryAvgScore = json.data.industryAvgScore.toFixed(2);
            // this.datalist1 = json.data.detail.map(v => {
            //     v.score = Number(v.score).toFixed(2);
            //     return v;
            // });
            // console.log('datalist1:', this.datalist1);
            // const option = this.optionCardScore(json.data);
            // const chart = echarts.init(this.chart1.nativeElement);
            // chart.setOption(option);
        });
    }

    // buildScore1(stockId) {
    //     this.xn.api.post('/jzn/intelligence/card_score2', {
    //         stockId: stockId,
    //         type: 1
    //     }).subscribe(json => {
    //         console.log('type1: ', json);

    //         if (XnUtils.isEmptyObject(json.data)) {
    //             this.atCenter = true;
    //             return;
    //         } else {
    //             this.atCenter = false;
    //         }
    //         this.datalist1 = json.data.list.map(c => {
    //             c.rate = Number(c.rate).toFixed(2);
    //             return c;
    //         });


    //         // if (json.data && json.data.detail && json.data.detail.length > 0) {
    //         //     this.datalist1 = json.data.detail.map(v => {
    //         //         v.score = Number(v.score).toFixed(2);
    //         //         return v;
    //         //     });
    //         // }

    //         // for (let i = 0; i < this.datalist1.length; i++) {
    //         // for (let j = 0; j < json.data.list.length; j++) {
    //         // this.datalist1 = json.data.list;
    //         // if (this.datalist1[i].indexName === json.data.list[j].cardName) {
    //         //     this.datalist1[i]['score'] = Number(json.data.list[j].rate).toFixed(2);
    //         // }
    //         // }
    //         // }

    //         this.onChange.emit(this.datalist1.map(v => v.cardName)); // 传一个数组给上级
    //         // console.log('datalist1:', this.datalist1);
    //         // this.buildChart3(stockId);
    //         const option = this.optionCardScore(this.datalist1);
    //         const chart = echarts.init(this.chart1.nativeElement);
    //         chart.setOption(option);
    //     });
    // }

    // private buildChart3(stockId) {
    //     this.xn.api.post('/jzn/intelligence/card_score2', {
    //         stockId: stockId,
    //         type: 3
    //     }).subscribe(json => {
    //         console.log('card_score3: ', json);
    //         console.log('datalist333: ', this.datalist1);

    //         for (let i = 0; i < this.datalist1.length; i++) {
    //             for (let j = 0; j < json.data.list.length; j++) {
    //                 if (this.datalist1[i].cardName === json.data.list[j].cardName) {
    //                     this.datalist1[i]['averageScore'] = Number(json.data.list[j].rate).toFixed(2);
    //                 }
    //             }
    //         }

    //         console.log('datalist: ', this.datalist1);

    //         const option = this.optionCardScore(this.datalist1);
    //         const chart = echarts.init(this.chart1.nativeElement);
    //         chart.setOption(option);
    //     });
    // }

    // private buildChart2(stockId) {
    //     this.xn.api.post('/jzn/intelligence/card_score2', {
    //         stockId: stockId,
    //         type: 2
    //     }).subscribe(json => {
    //         console.log('card_score: ', json);
    //         console.log('list1: ', this.datalist1);
    //         for (let i = 0; i < this.datalist1.length; i++) {
    //             for (let j = 0; j < json.data.list.length; j++) {
    //                 if (this.datalist1[i].cardName === json.data.list[j].cardName) {
    //                     this.datalist1[i]['preScore'] = Number(json.data.list[j].rate).toFixed(2);
    //                 }
    //             }
    //         }
    //         // this.buildChart3(stockId);
    //         console.log('datalist: ', this.datalist1);
    //         const option = this.optionCardScore(this.datalist1);
    //         const chart = echarts.init(this.chart1.nativeElement);
    //         chart.setOption(option);
    //     });
    // }

    private buildOption(datas) {
        return datas.map(data => {
            return {
                label: data.name,
                value: data.code
            };
        });
    }

    private optionCardScore(data1, data2, data3) {
        return {
            tooltip: {},
            legend: {
                data: ['当前得分', '上期得分', '行业平均得分']
            },
            radar: {
                indicator: this.buildIndicator(data1)
            },
            series: [{
                name: '短期债务模型得分',
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
                        name: '当前得分',
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
                        value: data1.map(d => {
                            return Number(d.rate).toFixed(2) || '';
                        }),
                    },
                    {
                        name: '上期得分',
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
                        value: data2.map(d => {
                            return Number(d.rate).toFixed(2) || '';
                        }),
                    },
                    {
                        name: '行业平均得分',
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
                        value: data3.map(d => {
                            return (Number(d.rate)).toFixed(2) || '';
                        }),
                    }
                ]
            }]
        };
    }

    private buildIndicator(detail) {
        if (!detail || detail.length <= 0) {
            return;
        }
        return detail.map(c => {
            return {
                name: c.cardName,
                max: 10
            };
        });
    }
}
