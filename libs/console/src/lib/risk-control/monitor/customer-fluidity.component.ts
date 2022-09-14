import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {windData1} from 'libs/shared/src/lib/config/wind1';
import {FormGroup} from '@angular/forms';
import {AccountsOutputModel, ComprehensiveTestingServive} from './comprehensive-testing.servive';

declare let $: any;

/**
 *  客户流动性指标
 */
@Component({
    selector: 'app-comprehensive-testing-customer-fluidity',
    templateUrl: './customer-fluidity.component.html',
    styles: [`
        .select-pos {
            margin: 15px 0;
        }

        .table-caption {
            text-align: left;
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
    `]
})
export class CustomerFluidityComponent implements OnInit {

    pageTitle = '综合监测';
    pageDesc = '';
    shows = [];
    selectOption = '';
    mainForm: FormGroup;
    public accountsLists: AccountsOutputModel[];

    constructor(private xn: XnService, private testingServive: ComprehensiveTestingServive) {
    }

    ngOnInit() {
        this.testingServive.getaccoutsLists().subscribe(x => {
            this.accountsLists = x;
        });
        const wind = windData1;
        this.selectOption = this.buildOption(wind);
        this.shows.push({
            checkerId: 'card_score',
            type: 'select',
            title: '选择公司',
            required: false,
            selectOptions: this.selectOption,
        });
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    }

    private buildOption(v) {
        return v.map(data => {
            return {
                label: data.name,
                value: data.code
            };
        });
    }
    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
