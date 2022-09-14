import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute} from '@angular/router';

import * as moment from 'moment';

@Component({
    selector: 'app-progress-in-cash',
    templateUrl: './progress-in-cash.component.html',
    styles: [
            `
            .title {
                font-size: 16px;
                padding: 10px 0px;
                font-weight: bold
            }

            .deal {
                margin-bottom: 50px;
            }

            table th, table td {
                text-align: center
            }
        `
    ]
})
export class ProgressInCashComponent implements OnInit {

    public orgName: string; // 企业名称

    public dealList: any;

    constructor(private xn: XnService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((x) => {
            this.orgName = x.orgName;
            this.getData();
        });
    }

    getData(): void {
        this.xn.api.post('/mdz/change_record/money_flow', {orgName: this.orgName})
            .subscribe(json => {
                if (json.ret === 0) {
                    const _data = this.fixData(json.data);
                    _data.list[0].unshift('本期');
                    _data.list[1].unshift('较上期');
                    _data.list[2].unshift('增减率');
                    this.dealList = _data.list;
                }
            });

    }

    fixData(data) {
        // 复制数据
        const _data = JSON.parse(JSON.stringify(data));
        for (const k of Object.keys(data)) {
            _data[k] = this.arrayTrans(data[k]);
        }
        return _data;
    }

    // 数组横竖转换
    arrayTrans(arr) {
        return arr[0].map(function(col, i) {
            return arr.map(function(row) {
                return row[i];
            });
        });
    }

}
