import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import AvengerapprovalTable from '../approval-normal/approval.fitall.tab';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%" (scroll)="onScroll($event)">
            <thead>
            <tr>
                <th>序号</th>
                <th *ngFor="let head of Tabconfig.tabList[0].headText">{{head.label}}</th>
            </tr>
            </thead>
            <tbody>
            <ng-container *ngIf="items.datavalue.length;else block">
                <tr *ngFor="let item of items.datavalue; let i=index">

                <td>{{i+1}}</td>
                <td *ngFor="let head of Tabconfig.tabList[0].headText">
                    <ng-container [ngSwitch]="head.type">
                    <ng-container *ngSwitchCase="'fitResult'">
                        <ng-container>
                        <div>
                            <div [ngStyle]="{'color': (item.result===0 || item.result===2)? 'red':'black'}"
                            [innerHTML]="item[head.value] | xnSelectTransform:'fitResult'"></div>
                        </div>
                        </ng-container>
                    </ng-container>
                    <ng-container *ngSwitchDefault>
                        <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                    </ng-container>
                    </ng-container>
                </td>
                </tr>
            </ng-container>
            </tbody>
        </table>
        <table class="table-hover table table-bordered file-row-table">
            <tr>
            <th style="width: 60px">匹配成功数量
            <td>{{items.successnum}}</td>
            </tr>
            <tr>
            <th style="width: 60px;">匹配失败数量</th>
            <td>{{items.failnum}}</td>
            </tr>
        </table>

        <ng-template #block>
            <tr>
                <td [attr.colspan]="calcAttrColspan(Tabconfig.tabList[0])">
                <div class="empty-message"></div>
                </td>
            </tr>
        </ng-template>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'honor-fit', formModule: 'avenger-show' })
export class AvengerHonorFitComponent implements OnInit {
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

    onScroll(e) {
        console.warn('Not Implemented');
    }

    public calcAttrColspan(tabconfig): number {
        const nums: number = tabconfig.headText.length + 1;
        return nums;
    }
}
