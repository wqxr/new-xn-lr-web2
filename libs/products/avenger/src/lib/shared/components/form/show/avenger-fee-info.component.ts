import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import AvengerapprovalTable from '../approval-normal/approval.fitall.tab';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%">
            <thead>
            <tr>
                <th *ngFor="let head of Tabconfig.tabList[3].headText">{{head.label}}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>保理使用费</td>
                <td>{{items.factoringUseFee.sureReceive}}</td>
                <td>{{items.factoringUseFee.factRecevie}}</td>
                <td>{{items.factoringUseFee.gap}}</td>
                <td>{{items.factoringUseFee.dt}}</td>
            </tr>
            <tr>
                <td>保理服务费</td>
                <td>{{items.factoringServiceFee.sureReceive}}</td>
                <td>{{items.factoringServiceFee.factRecevie}}</td>
                <td>{{items.factoringServiceFee.gap}}</td>
                <td>{{items.factoringServiceFee.dt}}</td>
            </tr>
            <tr>
                <td>平台服务费</td>
                <td>{{items.platformServiceFee.sureReceive}}</td>
                <td>{{items.platformServiceFee.factRecevie}}</td>
                <td>{{items.platformServiceFee.gap}}</td>
                <td>{{items.platformServiceFee.dt}}</td>
            </tr>
            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'fee-info', formModule: 'avenger-show' })
export class AvengerFeeInfoComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    // TO DO: 确认 items 是数组还是对象？
    public items: any;
    public Tabconfig: any;


    constructor() {
    }

    ngOnInit() {
        this.Tabconfig = AvengerapprovalTable.tableFormlist;

        const data = this.row.data;
        if (data !== '') {
            this.items = JSON.parse(data);
        }
    }
}
