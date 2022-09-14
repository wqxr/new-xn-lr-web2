import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import AvengerFormTable from '../normal/avenger-table';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { AvengeraddContractModalComponent } from '../../modal/avenger-contract-write.modal';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%">
        <thead>
        <tr>
            <th *ngFor="let head of contractdownstream.headText">{{head.label}}</th>
            <th
            *ngIf="contractdownstream?.edit && contractdownstream?.edit?.rowButtons && contractdownstream?.edit?.rowButtons?.length">
            操作
            </th>
        </tr>
        </thead>
        <tbody>
            <tr *ngFor="let item of items; let i=index">
                <td *ngFor="let head of contractdownstream.headText">
                <ng-container [ngSwitch]="head.type">
                    <ng-container *ngSwitchDefault>
                    <div>
                        <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                    </div>
                    </ng-container>
                    <ng-container *ngSwitchCase="'moreselect'">
                    <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
                        <div>
                        {{(item[head.value]| xnJson).firstValue | xnSelectTransform:'moneyType' }}-
                        {{(item[head.value]| xnJson).secondValue | xnSelectTransform:item.twoselect}}-
                        {{(item[head.value]| xnJson).thirdValue | xnSelectTransform:item.threeselect}}
                        </div>
                    </ng-container>
                    </ng-container>
                </ng-container>
                </td>
                <td><a href='javascript:void(0)' (click)='showContract(item)'>查看</a></td>
            </tr>
            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'contractDownstream', formModule: 'avenger-show' })
export class AvengerContractDownstreamComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    items: any[] = [];
    contractdownstream: any;

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, ) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.contractdownstream = AvengerFormTable.tableFormlist.tabList[6];
            this.items = JSON.parse(data);
            this.getmoneytype(this.items);
        }
    }

    private getmoneytype(items) {
        this.row.selectOptions = SelectOptions.get('moneyType');
        items.map((item) => {
            this.row.selectOptions.map(itemone => {
                if (itemone.value === JSON.parse(item.receiveType).firstValue) {
                    itemone.children.map(itemtwo => {
                        if (itemtwo.value === JSON.parse(item.receiveType).secondValue) {
                            item.twoselect = itemone.children;
                        }
                    });
                }
            });
        });
        items.map(item => {
            item.twoselect.map(itemone => {
                if (itemone.value === JSON.parse(item.receiveType).secondValue) {
                    itemone.children.map(itemtwo => {
                        if (itemtwo.value === JSON.parse(item.receiveType).thirdValue) {
                            item.threeselect = itemone.children;
                        }
                    });
                }
            });
        });

    }
    showContract(item) {
        const checkers = [
            {
                title: '合同编号',
                checkerId: 'contractId',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: item.contractNum
            },
            {
                title: '合同金额',
                checkerId: 'contractAmt',
                type: 'money',
                required: 0,
                value: item.contractAmt,
                options: { readonly: true },

            },
            {
                title: '合同名称',
                checkerId: 'contractName',
                required: 0,
                type: 'text',
                value: item.contractName,
                options: { readonly: true },

            },
            {
                title: '合同甲方',
                checkerId: 'contractJia',
                type: 'text',
                required: 0,
                value: item.contractJia || item.upstreamName,
                options: { readonly: true },

            },
            {
                title: '合同乙方',
                checkerId: 'contractYi',
                type: 'text',
                required: 0,
                value: item.contractYi || item.supplierName,
                options: { readonly: true },

            },
            {
                title: '合同签订时间',
                checkerId: 'contractSignTime',
                required: false,
                type: 'date',
                value: item.contractSignTime,
                placeholder: '请选择时间',
                options: { readonly: true },

            },
            {
                title: '合同结算方式',
                checkerId: 'contractJiesuan',
                type: 'text',
                required: 0,
                value: item.contractJiesuan,
                options: { readonly: true },
            },
            {
                title: '合同付款期限',
                checkerId: 'contractPayTime',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: item.contractPayTime
            },
            {
                title: '应收账款类型',
                checkerId: 'receiveType',
                type: 'moreselect',
                required: 0,
                options: { ref: 'moneyType' },
                value: { twoselect: item.twoselect, threeselect: item.threeselect, valueinfo: item.receiveType }
            },

        ];
        const params = {
            checkers,
            value: item,
            title: '补充合同信息',
            type: 1,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengeraddContractModalComponent, params)
            .subscribe(v => {
            });
    }
}
