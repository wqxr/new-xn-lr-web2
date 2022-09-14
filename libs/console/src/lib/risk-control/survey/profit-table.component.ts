import {Component, Input} from '@angular/core';

/**
 *  利润表
 */
@Component({
    selector: 'app-survey-profit-table',
    templateUrl: './profit-table.component.html',
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
export class ProfitTableComponent {
    @Input() profit;
}
