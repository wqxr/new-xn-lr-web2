import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
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
            <div #chart1 id='chart1' class="chart-height-400"></div>
            </div>
        </div>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'businessPeriodTrend', formModule: 'avenger-show' })
export class AvengerBusinessPeriodTrendComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    items: any[] = [];
    datalist: any[] = [];
    factoringFee: any[] = [];        // 保理费率汇总
    factoringSvcFee: any[] = [];     // 保理服务费率汇总
    platformSvcFee: any[] = [];       // 平台服务费率汇总

    constructor(private xn: XnService, private localStorageService: LocalStorageService, private communicate: PublicCommunicateService, ) {
    }

    ngOnInit() {
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
            const option02 = this.optionData02(this.datalist);
            const chart02 = echarts.init(el);
            chart02.setOption(option02);


        });

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
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
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
                    stack: '总量1',
                    data: this.factoringFee.reverse()
                },
                {
                    name: '保理服务费率',
                    type: 'line',
                    stack: '总量2',
                    data: this.factoringSvcFee.reverse()
                },
                {
                    name: '平台服务费率',
                    type: 'line',
                    stack: '总量3',
                    data: this.platformSvcFee.reverse()
                }
            ]
        };
    }
}
