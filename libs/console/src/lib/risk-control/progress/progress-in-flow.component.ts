import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-progress-in-flow',
    templateUrl: './progress-in-flow.component.html',
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
        `
    ]
})
export class ProgressInFlowComponent implements OnInit {

    public property: any; // 流动性资产变动
    public liabilities: any; // 流动性负债变动
    public orgName: string; // 企业名称

    constructor(private xn: XnService, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((x) => {
            this.orgName = x.orgName;
            this.getData();
        });
    }

    getData(): void {
        this.xn.api.post('/mdz/change_record/mobility_flow', {orgName: this.orgName})
            .subscribe(json => {
                if (json.ret === 0) {
                    const _data = this.fixData(json.data);
                    _data.liabilities[0].unshift('本期');
                    _data.liabilities[1].unshift('较上期');
                    _data.liabilities[2].unshift('增减率');
                    _data.property[0].unshift('本期');
                    _data.property[1].unshift('较上期');
                    _data.property[2].unshift('增减率');
                    this.liabilities = _data.liabilities;
                    this.property = _data.property;
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
