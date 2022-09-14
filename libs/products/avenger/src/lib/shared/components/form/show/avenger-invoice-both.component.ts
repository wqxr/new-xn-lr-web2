import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import AvengerFormTable from '../normal/avenger-table';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { AvengerViewInvoiceComponent } from '../../modal/avenger-invoice-view.modal';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%">
            <thead>
            <tr>
                <th *ngFor="let head of Tabconfiginvoice.headText">{{head.label}}</th>
                <th>
                操作
                </th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let item of items; let i=index">
                <td *ngFor="let head of Tabconfiginvoice.headText">
                <ng-container [ngSwitch]="head.type">
                <ng-container *ngSwitchCase="'mainFlowId'">

                <p *ngFor='let sub of item[head.value] | xnJson; let i=index'>

                  <ng-container *ngIf="sub.endsWith('cg')">
                      <a href="javaScript:void(0)"
                    (click)="hwModeService.viewProcess(sub,50)">{{sub}}</a>
                  </ng-container>
                  <ng-container *ngIf="!sub.endsWith('cg')">
                      <a href="javaScript:void(0)"
                    (click)="hwModeService.viewProcess(sub)">{{sub}}</a>
                  </ng-container>
                </p>
              </ng-container>
              <ng-container *ngSwitchDefault>
              <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
            </ng-container>
                </ng-container>
                </td>
        <td><a href='javascript:void(0)' (click)="onViewInvoice(item)">查看详情</a></td>
            </tr>

            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'invoiceBoth', formModule: 'avenger-show' })
export class AvengerInvoiceBothComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    public items: any[] = [];
    Tabconfiginvoice: any;

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private hwModeService: HwModeService) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.Tabconfiginvoice = AvengerFormTable.tableFormlist.tabList[3];
            this.items = JSON.parse(data);
            this.items.forEach(temp => {
                this.xn.avenger.post('/file/allHistoryList',
                    {
                        mainFlowId: this.svrConfig.record.mainFlowId,
                        invoiceNum: temp.invoiceNum || temp.upstreamInvoice, invoiceCode: temp.invoiceCode
                    }).subscribe(x => {
                        if (x.ret === 0) {
                            temp.mainFlowId = x.data;
                        }

                    });
            });
        }
    }

    public onViewInvoice(item: any) {
        const params = { ...item, isAvenger: true, isPreliminary: false};
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerViewInvoiceComponent, params).subscribe(() => {
        });
    }
}
