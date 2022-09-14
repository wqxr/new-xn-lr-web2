import {Component, OnInit} from '@angular/core';
import {TradingModeEnum} from '../../enum/risk-control-enum';

/**
 *  交易控制-费率控制
 */
@Component({
    selector: 'app-rate-control-index-component',
    templateUrl: './rate-control-index.component.html',
    styles: [`
        .select-width {
            width: 200px;
            margin-left: 15px;
        }
    `]
})
export class RateControlIndexComponent implements OnInit {
    pageTitle = '交易控制>费率控制';
    selectValue: any;
    tradingModeEnum = TradingModeEnum;

    constructor() {
    }

    ngOnInit() {
        // 默认显示万科模式
        this.selectValue = '1';
    }

}
