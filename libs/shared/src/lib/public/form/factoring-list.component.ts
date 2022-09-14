import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'xn-factoring-list',
    template: `
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>保理商名称</th>
                    <th>账号</th>
                    <th>开户银行</th>
                    <th>开户银行机构代码</th>
                    <th>保理服务费率</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let item of row.data | xnJson">
                    <td>{{item.factoringName}}</td>
                    <td>{{item.cardCode}}</td>
                    <td>{{item.bankName}}</td>
                    <td>{{item.bankCodeNo}}</td>
                    <td>{{item.factoringFWF}}</td>
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
export class FactoringListComponent {
    @Input() row: any;
    @Input() form: FormGroup;
}
