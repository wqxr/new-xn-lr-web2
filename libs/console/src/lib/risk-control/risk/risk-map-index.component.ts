import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {FormGroup} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute} from '@angular/router';
import {windData1} from 'libs/shared/src/lib/config/wind1';

@Component({
    selector: 'app-risk-map-component',
    templateUrl: './risk-map-index.component.html',
    styles: [
            `.search {
            margin-bottom: 20px;
        }

        .showscore {
            opacity: 0
        }

        .list {
            float: left;
            width: 200px;
        }

        .innerbox {
            width: 900px;
            margin: 0 auto;
        }

        .chartbox {
            float: left;
            width: 700px;
            height: 500px;
            margin: 0 auto;
        }`
    ]
})
export class RiskMapIndexComponent implements OnInit {

    pageTitle = '风险地图';
    pageDesc = '';
    tableTitle1 = '打分卡得分明细';
    shows = [];
    mainForm: FormGroup;
    selectOption = [];
    stockId = '';

    constructor(private xn: XnService, private route: ActivatedRoute) {
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
