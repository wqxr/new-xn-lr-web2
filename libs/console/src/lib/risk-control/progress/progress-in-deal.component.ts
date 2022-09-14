import {ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'app-progress-in-deal',
    templateUrl: './progress-in-deal.component.html',
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
export class ProgressInDealComponent implements OnInit {

    public appId: any; // 企业ID
    public appName: string; // 企业名字
    public amountRatio; // 总量占比 XX公司保理总量/保理公司保理总量
    public balanceRatio; // 余额占比 XX公司保理余额/保理公司保理余额
    public table;

    constructor(private xn: XnService, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(x => {
            this.appId = x.appId;
            this.appName = x.orgName;
            this.getData();
        });
    }

    getData() {
        this.xn.api.post('/mdz/change_record/transaction_change', {enterpriseAppId: this.appId})
            .subscribe(json => {
                if (json.ret === 0) {
                    this.table = this.fixData(json.data);
                }
            });
    }

    fixData(data) {
        // 计算总量比例
        this.amountRatio = data.myAllCount / data.allCount * 100;
        // 计算余额比例
        this.balanceRatio = data.myAllResidueCount / data.allResidueCount * 100;
        let _data = JSON.parse(JSON.stringify(data.now));
        let amountNaN = true;
        let balanceNaN = true;
        _data = _data.map((c) => {
            c.amountRatio = c.amount / data.myAllCount * 100;
            c.balanceRatio = c.balance / data.myAllResidueCount * 100;
            amountNaN = Number.isNaN(c.amountRatio) || amountNaN;
            balanceNaN = Number.isNaN(c.balanceRatio) || balanceNaN;
            return c;
        });
        _data.unshift({amountRatio: '占比', balanceRatio: '占比', amount: '保理总量', balance: '保理余额', des: ''});
        _data.push({
            amountRatio: amountNaN ? '-' : '100%',
            balanceRatio: balanceNaN ? '-' : '100%',
            amount: data.myAllCount,
            balance: data.myAllResidueCount,
            des: '合计'
        });
        return _data;
    }

}
