import {Component, Input} from '@angular/core';

/**
 *  现金流量表
 */
@Component({
    selector: 'app-survey-cash-table',
    templateUrl: './cash-table.component.html',
    styles: [`
        .table tr td, .table tr th {
            width: 20%;
            text-align: center;
        }

        .table tr th:first-child, .table tr td:first-child {
            text-align: left;
        }
    `]
})
export class CashTableComponent {
    @Input() cash: any;
}
