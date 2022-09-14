import {Component, OnInit} from '@angular/core';
import {LabelPageModel} from '../model/risk-warning-model';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

/**
 *  预警保全
 */
@Component({
    selector: 'app-risk-warning',
    templateUrl: './risk-warning-index.component.html',
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
export class RiskWarningIndexComponent implements OnInit {
    // 标题
    public pageTitle = '预警保全';
    // 激活的标签页code值-默认1.1
    public activeCode: number;
    public code: number; // 共享变量
    // 标签页数据
    public labelPage: LabelPageModel[] =
        [
            {label: '催收提示', value: 1.1},
            {label: '逾期催收', value: 1.2},
            {label: '发票管理', value: 1.3},
            {label: '商票管理', value: 1.4},
            {label: '控制参数到期', value: 1.5}
        ];
    public urlData: any;

    public constructor(private xn: XnService) {
    }

    public ngOnInit() {
        this.onUrlData();
        // 默认显示第一个
        this.activeCode = this.code || 1.1;
    }

    // 切换标签页
    public changePage(e) {
        this.activeCode = e;
    }

    // 回退操作
    private onUrlData() {
        this.urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (this.urlData && this.urlData.pop) {
            this.code = this.urlData.data.code || this.activeCode;
        }
    }
}

export class DateTypeModel {
    public isDate: boolean; // 选择具体的日期
    public isDays: boolean; // 选择具体的天数
    public isSelectDate: boolean;   // 是否选择日期
}
