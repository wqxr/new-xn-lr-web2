import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute} from '@angular/router';
import {BigDataListModel} from '../risk-control.service';
import {CustomerEnum} from '../enum/risk-control-enum';

@Component({
    templateUrl: './survey-detail.component.html',
    styles: [
            `
            .box-header {
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
export class SurveyDetailComponent implements OnInit {

    pageTitle = '客户调查';
    inputValue = '';
    tableTitle = '企业列表';
    type = 'info';
    customerInfo: BigDataListModel = new BigDataListModel();
    customerEnum = CustomerEnum;

    constructor(private xn: XnService, private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.router.queryParams.subscribe(x => {
            this.customerInfo = x;
        });
    }

    onItemClick(e) {
        this.type = e;
    }

    onCssClass(type) {
        return this.type === type ? 'active' : '';
    }

    onBack() {
        this.xn.user.navigateBack();
    }
}
