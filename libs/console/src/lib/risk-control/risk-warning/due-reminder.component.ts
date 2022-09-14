import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {SelectOptions} from 'libs/shared/src/lib/config/select-options';

/**
 * 到期提醒
 */
@Component({
    selector: 'app-risk-warning-due-reminder',
    templateUrl: './due-reminder.component.html'
})
export class DueReminderComponent implements OnInit {
    public varData = {
        contractDue: {
            url: '/llz/risk_warning/due_setting/get_detail',
            page: 1,
            total: 0,
            rows: 10,
            list: []
        },
        limitDue: {
            url: '/llz/risk_warning/due_setting/get_quota',
            page: 1,
            total: 0,
            rows: 10,
            list: []
        },
        businessDue: {
            url: '/llz/risk_warning/due_setting/get_deal',
            page: 1,
            total: 0,
            rows: 10,
            list: []
        },
    };

    public orgNameType = SelectOptions.get('orgNameType');

    public constructor(private xn: XnService) {
    }

    public ngOnInit() {

        for (const key of Object.keys(this.varData)) {
            this.getList(key, {start: 0, length: 10});
        }
    }

    handleChange(num: number, type) {
        this.varData[type].page = num || 1;
        const params = {
            start: (this.varData[type].page - 1) * this.varData[type].rows,
            length: this.varData[type].rows
        };
        this.getList(type, params);
    }

    getList(type, params) {
        this.xn.api.post(this.varData[type].url, params)
            .subscribe(({ret, data}) => {
                if (ret === 0) {
                    this.varData[type].list = data.data;
                    this.varData[type].total = data.count;
                }
            });
    }
}
