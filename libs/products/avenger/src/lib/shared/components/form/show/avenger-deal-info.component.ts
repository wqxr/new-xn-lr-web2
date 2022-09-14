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
                <td>序号</td>
                <th *ngFor="let head of Tabconfig.tabList[4].headText">{{head.label}}</th>

            </tr>
            </thead>
            <tbody>
            <ng-container *ngIf="items.length;">
                <tr *ngFor="let item of items; let i=index">
                <td>{{i+1}}</td>
                <td *ngFor="let head of Tabconfig.tabList[4].headText">
                    <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                </td>
                </tr>
            </ng-container>
            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'deal-info', formModule: 'avenger-show' })
export class AvengerDealInfoComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    public items: any[] = [];
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
