import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    templateUrl: './trade.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.btn-right { float: right }`,
        `.btn { padding: 4px 12px; }`,
        `.receive { margin-bottom: 20px; }`,
        `.receive.active { border-bottom: 1px solid #000 }`,
        `.receive:last-child { border: none }`
    ]
})
export class TradeComponent implements OnInit {

    pageTitle = '转账流水详情';
    pageDesc = '';
    tableTitle1 = '保理放款到平台';
    tableTitle2 = '保理线下收票';
    tableTitle3 = '平台线下放款到企业';
    receive = [];
    trade1 = {} as any;
    trade2 = {} as any;

    constructor(private xn: XnService, private vcr: ViewContainerRef, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            const mainFlowId = params.mainFlowId;

            this.xn.api.post('/jzn/bank/info', {
                mainFlowId
            }).subscribe(json => {
                this.receive = json.data.receive;
                this.trade1 = json.data.trade1;
                this.trade2 = json.data.trade2;
            });
        });
    }

    changeStatus(mainFlowId: string, type: number) {
        this.xn.api.post('/jzn/bank/set', {
            mainFlowId,
            type
        }).subscribe(json => {
            this.refresh(type, json);
        });
    }

    refresh(type, json) {
        if (type === 1 || type === 3) {
            for (const i in this.trade1) {
                if (this.trade1.hasOwnProperty(i)) {
                    this.trade1[i] = json.data[i];
                }
            }
        } else if (type === 2) {
            this.receive = $.extend(true, [], json.data);
        }
    }

    borderBottom() {
        return this.receive.length > 1 ? 'active' : '';
    }
}
