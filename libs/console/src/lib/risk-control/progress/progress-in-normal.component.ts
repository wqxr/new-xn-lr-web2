import {Component, Input} from '@angular/core';
import {BigDataListModel} from '../risk-control.service';
import {DateTypeModel} from '../risk-warning/risk-warning-index.component';

/**
 *  常规检测 - 过程控制
 */
@Component({
    selector: 'app-progress-in-normal',
    template: `
        <app-risk-warning-collection-reminder-index [dateSelectedConfig]="dateSelectedConfig"
                                                    [customerInfo]="customerInfo"></app-risk-warning-collection-reminder-index>
    `,
})
export class ProgressInNormalComponent {
    @Input() customerInfo: BigDataListModel;
    // 风险预警
    public dateSelectedConfig: DateTypeModel = {
        isDate: false,
        isDays: false,
        isSelectDate: true,
    };

    constructor() {
    }

}
