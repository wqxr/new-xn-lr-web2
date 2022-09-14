import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';


declare let $: any;

/**
 *  债项评级分布
 */
@Component({
    selector: 'app-comprehensive-testing-debt-rating',
    templateUrl: './debt-rating.component.html',
    styles: [`
        .chart-border {
            border: 1px solid #dddddd;
        }
    `]
})
export class DebtRatingComponent implements OnInit {

    pageTitle = '综合监测';
    pageDesc = '';

    @ViewChild('chart1') chart1: ElementRef;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        const option = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['正常', '关注', '次级', '可疑', '损失'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '债项金额汇总(万元)'
                }
            ],
            series: [
                {
                    name: '债项金额汇总',
                    type: 'bar',
                    barWidth: '30%',
                    data: [10, 52, 200, 120, 190]
                }
            ]
        };
        const chart1 = echarts.init(this.chart1.nativeElement);
        chart1.setOption(option);


    }
}
