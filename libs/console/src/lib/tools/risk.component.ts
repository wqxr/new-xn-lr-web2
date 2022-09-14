import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

declare var $: any;

@Component({
    templateUrl: './risk.component.html',
    styles: [
        `.table {
            font-size: 13px;
        }`,
        `.xn-click-a {
            display: inline-block;
            padding-left: 5px;
            padding-right: 5px;
        }`,
        `label {
            font-weight: normal
        }`,
        `.bill-details-title {
            background-color: #EFF6FC;
            border: #6FA3DC 1px solid;
            padding: 6px 0px;
            margin-bottom: 15px
        }`,
        `.f-tilte-2 {
            margin-left: 10px
        }`,
        `.l-ticket-title font {
            color: #D10303;
        }`,
        `font {
            line-height: 34px;
        }`,
        `input {
            border-radius: 0 !important;
            background-clip: padding-box !important;
            color: #858585;
            background-color: #fbfbfb;
            border: 1px solid #d5d5d5;
            font-family: inherit;
            transition: box-shadow .45s, border-color .45s ease-in-out;
            -webkit-box-shadow: none;
            -moz-box-shadow: none;
            box-shadow: none;
        }`,
        `.form-horizontal .control-label {
            padding-top: 0px
        }`,
        `.btn-blue, .btn-blue:focus {
            background-color: #5db2ff;
            border-color: #5db2ff;
            color: #fff;
        }`,
        `.d-bill-help-block i {
            color: #E58183;
        }`,
        `tr th, tr td {
            text-align: center
        }`,
        `.no-mbottom {
            margin-bottom: 0
        }`
    ]
})
export class RiskComponent implements OnInit {

    pageTitle = '智能风控';
    pageDesc = '';
    cardNo = '';
    interest: any;
    amount = 0;

    total = 0;
    pageSize = 10;
    items: any[] = [];
    errorStockId = false;
    errorEnterprise = false;
    stockIdTemp: string;

    @ViewChild('stockId') stockId: ElementRef;

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {

    }

    calculate() {
        const stockId = this.stockId.nativeElement.value;
        if (stockId === this.stockIdTemp) {
            return;
        }
        this.stockIdTemp = stockId; // 缓存起来, 避免多次点击调多次接口
        this.getStockData(stockId);
    }

    getStockData(stockId) {
        if (!stockId || stockId === '') {
            this.errorStockId = true;
            this.errorEnterprise = false;
            this.items = [];
            return;
        } else {
            this.errorStockId = false;
        }
        this.xn.api.post('/intelligent/enterprise_score', {
            stockId
        }).subscribe(json => {
            if (json.data.riskScoreList.length > 0) {
                this.items = json.data.riskScoreList;
                this.errorEnterprise = false;
            } else {
                this.items = [];
                this.errorEnterprise = true;
            }
        });
    }
}
