import {Component, OnInit} from '@angular/core';
import {windData1} from 'libs/shared/src/lib/config/wind1';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {FormGroup} from '@angular/forms';

/**
 *  信用评级
 */
@Component({
    selector: 'app-financing-map',
    templateUrl: './financing-map.component.html',
    styles: [
            `
            .financing-map {
                padding: 10px;
                background-color: #fff
            }
        `
    ]
})
export class FinancingMapComponent implements OnInit {
    tableTitle1 = '打分卡得分明细';
    shows = [];
    mainForm: FormGroup;
    selectOption = [];
    stockId = '';
    constructor() {
    }
    ngOnInit() {
        const wind = windData1;
        this.selectOption = this.buildOption(wind);
        this.shows.push({
            name: 'card_score',
            type: 'select',
            title: '选择公司',
            required: false,
            selectOptions: this.selectOption,
        });

        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe((v) => {
            this.stockId = v.card_score;
        });

    }

    private buildOption(datas) {
        return datas.map(data => {
            return {
                label: data.name,
                value: data.code
            };
        });
    }
}
