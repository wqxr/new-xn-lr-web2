import {Component, Input} from '@angular/core';

/**
 *  资产负债表
 */
@Component({
    selector: 'app-survey-balance-table',
    templateUrl: './balance-table.component.html',
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
export class BalanceTableComponent {
    @Input() balance: any;
}
