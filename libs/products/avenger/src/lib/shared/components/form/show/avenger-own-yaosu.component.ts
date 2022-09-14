import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import AvengerplatTable from '../normal/avenger-msgFirstReview-tab';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%">
            <thead>
            <tr>
                <th *ngFor="let head of Tabconfigcheck[0].headText">{{head.label}}</th>

            </tr>
            </thead>
            <tbody>
            <ng-container *ngIf="items.length;">
                <tr *ngFor="let item of items; let i=index">
                <td *ngFor="let head of Tabconfigcheck[0].headText">
                <ng-container *ngIf="head.value==='mainFlowId'">
                <a href="javaScript:void(0)"
                  (click)="hwModeService.viewProcess(item[head.value],50)">{{item[head.value]}}</a>
              </ng-container>
              <ng-container *ngIf="head.value!=='mainFlowId'">
                <div [innerHTML]="item[head.value]"></div>
              </ng-container>

                </td>
                </tr>
            </ng-container>
            <tr *ngIf="items.length===0">
                <td [attr.colspan]="calcAttrColspan(Tabconfigcheck[0])">
                <div class="empty-message"></div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'ownYaosu', formModule: 'avenger-show' })
export class AvengerOwnYaosuComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() memo: string;
    @Input() svrConfig: any;

    public items: any[] = [];
    public Tabconfigcheck: any;


    constructor(private xn: XnService, public hwModeService: HwModeService, ) {
    }

    ngOnInit() {
        this.Tabconfigcheck = AvengerplatTable.tableFormlist.tabList;
        this.xn.avenger.post('/sub_system/history/thisBusiness', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
                if (x.data) {
                    x.data.mainFlowId = this.svrConfig.record.mainFlowId;
                    this.items[0] = x.data;
                }
            });
        }

    public calcAttrColspan(tabconfig): number {
        const nums: number = tabconfig.headText.length + 1;
        return nums;
    }
}
