import {Component, Input, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {CoreReferenceOutputModel} from '../model/survey-info.model';
import {BigDataListModel} from '../risk-control.service';

/**
 * 核心指标
 */
@Component({
    selector: 'app-survey-in-core',
    templateUrl: './survey-in-core.component.html',
    styles: [
            `.title {
            font-size: 16px;
            padding: 10px 0px;
            font-weight: bold
        }

        .label-text {
            background-color: #F2F9FC
        }

        .label-value {
            width: 400px;
        }

        .deal {
            margin-bottom: 50px;
        }

        .table th, .table td {
            vertical-align: middle;
        }

        .table th:nth-child(5), .table th:nth-child(6) {
            width: 120px;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
            background-color: #fff;
        }

        .table tr td:last-child {
            text-align: left;
        }

        .text-input {
            border: none;
            text-align: center;
            padding: 0;
            margin: 0 auto;
        }
        `
    ]
})
export class SurveyInCoreComponent implements OnInit {
    @Input() customerInfo: BigDataListModel;
    entryCacheMap = new Map();
    entry: CoreReferenceOutputModel = new CoreReferenceOutputModel();

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        this.init();
    }

    // 只提交值修改过的 找出entry基于entryCache不同的值
    saveInfo() {
        const data = {} as any;
        for (const key in this.entry) {
            if (this.entry.hasOwnProperty(key)) {
                if ((!this.entryCacheMap.has(key) || this.entryCacheMap.has(key) && (this.entry[key] !== this.entryCacheMap.get(key)))
                    && this.entry[key] !== '') {
                    data[key] = this.entry[key];
                }
            }
        }
        data.appId = this.customerInfo.appId;
        data.orgName = this.customerInfo.orgName;
        // 提交
        this.xn.api.post('/yb/risk1/core/update_data', data).subscribe(() => {
            this.init();
        });
    }

    init() {
        this.xn.api.post('/yb/risk1/core/get_data', {appId: this.customerInfo.appId}).subscribe(x => {
            if (Object.keys(x.data).length) {
                this.entry = x.data;
                Object.keys(x.data).map(key => {
                    this.entryCacheMap.set(key, x.data[key]);
                });

            }
        });
    }
}
