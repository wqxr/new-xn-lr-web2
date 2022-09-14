import {Component, Input, OnInit} from '@angular/core';
import {BigDataListModel} from '../risk-control.service';
import {FinanceEnum} from '../enum/risk-control-enum';
import {BalanceOutputModel, CashOutputModel, ProfitOutputModel} from '../model/finance.model';
import SeasonDate, {SelectItem} from '../model/config-date';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

/**
 *  财务数据[资产负债表、利润表、现金流量表]
 */

@Component({
    selector: 'app-survey-in-financial',
    templateUrl: './survey-in-financial.component.html',
    styles: [`
        .select-width {
            width: calc(10vw);
        }

        .title-color {
            background-color: #F2F9FC;
        }

        .table tr td {
            width: 20%;
            border-bottom: none;
        }

        .table {
            margin-bottom: 0;
        }
    `
    ]
})
export class SurveyInFinancialComponent implements OnInit {
    @Input() customerInfo: BigDataListModel;
    // 默认显示资产负债表
    classify = 'balance';
    financeEnum = FinanceEnum;
    // 年报
    yearSelectItem: SelectItem[];
    // 季报
    seasonSelectItem: SelectItem [];
    // 表头选择项
    titleModel: TitleModel = new TitleModel();
    // 缓存
    cacheModel: CacheModel = new CacheModel();
    // 数据
    info: DataOutputModel = new DataOutputModel();

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        // 初始化对象的值
        this.initObj(this.info[this.classify]);
        this.seasonSelectItem = SeasonDate.getInfo('2017', 'season', null);
        this.yearSelectItem = SeasonDate.getInfo('2017', 'year', null);
    }

    handleChange(e, index: number) {
        const value = e.target.value;
        const startTime = value.slice(0, value.indexOf(','));
        const endTime = value.slice(value.indexOf(',') + 1);
        // 保存选择项的值
        this.titleModel[this.classify][`change_${index}`] = value;
        this.init(startTime, endTime, index);
    }

    // index 下标，将至插入到数组的下标数
    init(startTime, endTime, index) {
        const postData = {
            url_balance: '/yb/risk1/financial/balance_sheet',
            url_profit: '/yb/risk1/financial/profit',
            url_cash: '/yb/risk1/financial/cash',
            params_balance: {orgName: this.customerInfo.orgName, endTime},
            params_profit: {orgName: this.customerInfo.orgName, startTime, endTime},
            params_cash: {orgName: this.customerInfo.orgName, startTime, endTime},
        };

        // 资产负债表-利润表-现金流量表
        if (!!endTime) {
            this.xn.loading.open();
            this.xn.api.post(postData[`url_${this.classify}`], postData[`params_${this.classify}`]).subscribe(x => {
                if (x.data && x.data.length) {
                    const obj = x.data[0];
                    Object.keys(this.info[this.classify]).forEach(key => {
                        if (typeof obj[key] === 'number' || typeof  obj[key.toLocaleLowerCase()] === 'number') {
                            obj[key] = XnUtils.formatMoney(obj[key] || obj[key.toLocaleLowerCase()]);
                        }
                        this.info[this.classify][key][index - 1] = obj[key] || obj[key.toLocaleLowerCase()] || '';
                    });
                    // 保存值到缓存
                    this.cacheModel[this.classify] = this.info[this.classify];
                    this.xn.loading.close();
                } else {
                    // 清楚当前行数据
                    this.initObj(this.info[this.classify], true, index);
                }
            });
        } else {
            // 该行数据清空
            this.initObj(this.info[this.classify], true, index);
        }
    }

    initObj(obj, clear?, index?) {
        if (clear === true) {
            Object.keys(obj).forEach(key => {
                obj[key][index - 1] = '';
            });
            return;
        }
        Object.keys(obj).forEach(key => {
            obj[key] = ['', '', '', ''];
        });
    }

    // 表单变化，清空选择框,初始化值如果有缓存，则直接显示缓存的数据
    tableChange(e) {
        console.log(e);
        if (!!this.cacheModel[e]) {
            this.info[e] = this.cacheModel[e];
        } else {
            this.initObj(this.info[e]);
        }
    }
}

// 表选择
class TitleModel {
    balance: ChangeModel = new ChangeModel(); // 资产负债
    cash: ChangeModel = new ChangeModel(); // 利润表
    profit: ChangeModel = new ChangeModel(); // 现金流量
}

class ChangeModel {
    change_1 = '';
    change_2 = '';
    change_3 = '';
    change_4 = '';
}

// 接口输出数据
class DataOutputModel {
    balance: BalanceOutputModel = new BalanceOutputModel(); // 资产负债
    profit: ProfitOutputModel = new ProfitOutputModel(); // 利润表
    cash: CashOutputModel = new CashOutputModel(); // 现金流量
}

// 数据缓存
class CacheModel {
    balance: BalanceOutputModel; // 资产负债
    profit: ProfitOutputModel; // 利润表
    cash: CashOutputModel; // 现金流量
}
