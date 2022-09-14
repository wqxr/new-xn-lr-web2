import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'xn-bank-list',
    template: `
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>银行名称</th>
                    <th>银行机构代码</th>
                    <th>银行保理保证利率</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let item of row.data | xnJson">
                    <td>{{item.bankName}}</td>
                    <td>{{item.bankCodeNo}}</td>
                    <td>{{item.interestRate}}</td>
                </tr>
            </tbody>
        </table>
    `,
    styles: [
        `
            .table {
                font-size: 13px;
            }
        `
    ]
})
export class BankListComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    constructor() {}

    ngOnInit() {
        //
    }
}
