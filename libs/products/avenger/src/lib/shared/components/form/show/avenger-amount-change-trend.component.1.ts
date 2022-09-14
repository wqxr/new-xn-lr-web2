import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';


@Component({
    template: `
    <div style='width:100%'>
        <div class="tab-pane active" style="padding: 15px 0">
            <div style="width:100%">
            <div #chart2 id='chart2' class="chart-height-400"></div>
            </div>
        </div>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'amountChangeTrend', formModule: 'avenger-show' })
export class AvengerAmountChangeTrendComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    items: any[] = [];
    datalist: any[] = [];
    loanLimit: any[] = [];        // 额度汇总
    dateLimit: any[] = [];        // 期限汇总


    constructor(
        private xn: XnService, private localStorageService: LocalStorageService, private communicate: PublicCommunicateService) {
    }

    ngOnInit() {
        this.xn.avenger.post('/sub_system/risk/threeElement', {
            companyName:  this.svrConfig.record.supplierName
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
}
