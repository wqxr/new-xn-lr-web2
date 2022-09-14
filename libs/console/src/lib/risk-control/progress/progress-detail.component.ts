import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {BigDataListModel} from '../risk-control.service';
import {ActivatedRoute} from '@angular/router';
import {LabelPageModel} from '../model/risk-warning-model';

@Component({
    templateUrl: './progress-detail.component.html',
    styles: [
            ` .box-header {
            padding-bottom: 0
        }

        .box {
            margin: 0 10px;
            padding: 0;
            border-top: 0;
        }

        .back-btn {
            height: 50px;
            line-height: 50px;
            padding: 0 10px;
        }
        `
    ]
})
export class ProgressDetailComponent implements OnInit {

    pageTitle = '过程管理';
    inputValue = '';
    tableTitle = '企业列表';
    detailTitle = '';
    type = 'normal';
    nav: LabelPageModel[] = [
        {label: '常规检测', value: 'normal'},
        {label: '评级变动记录', value: 'grade'},
        {label: '征信变动记录', value: 'credit'},
        {label: '管户走访记录', value: 'houseHold'},
        {label: '交易变动记录', value: 'deal'},
        {label: '流动性变动', value: 'flow'},
        {label: '现金流变动', value: 'cash'}
    ];
    customerInfo: BigDataListModel = new BigDataListModel();

    constructor(private xn: XnService, private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.router.queryParams.subscribe(x => {
            this.customerInfo = x;
            this.detailTitle = x.orgName;
        });
    }

    changePage(e) {
        this.type = e;
    }

    onCssClass(type) {
        return this.type === type ? 'active' : '';
    }

    onBack() {
        this.xn.user.navigateBack();
    }
}
