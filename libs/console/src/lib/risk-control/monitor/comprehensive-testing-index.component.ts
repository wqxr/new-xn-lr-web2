import {Component, OnInit} from '@angular/core';
import {LabelPageModel} from '../model/risk-warning-model';

/**
 *  综合监测
 */
@Component({
    selector: 'app-comprehensive-testing',
    templateUrl: './comprehensive-testing-index.component.html',
    styles: [`
        .box-header {
            padding-bottom: 0
        }

        .box {
            margin: 0 10px;
            padding: 0;
            border-top: 0;
        }
    `]
})
export class ComprehensiveTestingIndexComponent implements OnInit {
    // 标题
    public pageTitle = '综合监测';
    // 激活的标签页code值-默认1.1
    public activeCode: number;
    // 标签页数据
    public labelPage: LabelPageModel[] =
        [
            {label: '平台运营指标', value: 1.1},
            {label: '客户流动性指标', value: 1.2},
            {label: '客户评级分布', value: 1.3},
            {label: '债项评级分布', value: 1.4},
        ];

    public constructor() {
    }

    public ngOnInit() {
        // 默认显示第一个
        this.activeCode = 1.1;
    }

    // 切换标签页
    public changePage(val) {
        this.activeCode = val;
    }

}
