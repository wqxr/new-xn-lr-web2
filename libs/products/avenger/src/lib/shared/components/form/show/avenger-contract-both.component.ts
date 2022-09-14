import { Component, Input, OnInit, ViewContainerRef, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import AvengerFormTable from '../normal/avenger-table';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { AvengerBothPlatContractModalComponent } from '../../modal/avenger-bothcontract-view.modal';

@Component({
    template: `
    <div style='width:100%'>
    <table class="table table-bordered table-hover file-row-table" width="100%">
        <thead>
        <tr>
            <th *ngFor="let head of contractinfo.headText">{{head.label}}</th>
            <th *ngIf="contractinfo?.edit && contractinfo?.edit?.rowButtons && contractinfo?.edit?.rowButtons?.length">
            操作
            </th>
        </tr>
        </thead>
        <tbody>
            <tr *ngFor="let item of items; let i=index">

                <td *ngFor="let head of contractinfo.headText">
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
                    <ng-container *ngSwitchCase="'moreselect1'">
                    <ng-container>
                      <div *ngIf="item.upstreamContractNum && item.upstreamContractNum!==''">
                        {{(item[head.value]| xnJson).firstValue | xnSelectTransform:'moneyType' }}
                        -{{(item[head.value]| xnJson).secondValue | xnSelectTransform:item.upstreamtwoselect}}
                        -{{(item[head.value]| xnJson).thirdValue | xnSelectTransform:item.upstreamthreeselect}}
                      </div>
                    </ng-container>
                   </ng-container>
                </ng-container>
                </td>
                <td><a href='javascript:void(0)' (click)='viewContract(item,1)'>查看</a></td>
            </tr>
        </tbody>
    </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'contractBoth', formModule: 'avenger-show' })
export class AvengerContractBothComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    items: any[] = [];
    contractinfo: any;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef, ) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.contractinfo = AvengerFormTable.tableFormlist.tabList[4];
            this.items = JSON.parse(data);
            this.getmoneytype(this.items);
        }
    }

    getmoneytype(items) {
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
        this.items.map((item) => {
            if (item.upstreamContractNum && item.upstreamContractNum !== '') {
                this.row.selectOptions.map(itemone => {
                    if (itemone.value === JSON.parse(item.upstreamReceiveType).firstValue) {
                        itemone.children.map(itemtwo => {
                            if (itemtwo.value === JSON.parse(item.upstreamReceiveType).secondValue) {
                                item.upstreamtwoselect = itemone.children;
                            }
                        });
                    }
                });
            }
        });
        this.items.map(item => {
            if (item.upstreamContractNum && item.upstreamContractNum !== '') {
                item.upstreamtwoselect.map(itemone => {
                    if (itemone.value === JSON.parse(item.upstreamReceiveType).secondValue) {
                        itemone.children.map(itemtwo => {
                            if (itemtwo.value === JSON.parse(item.upstreamReceiveType).thirdValue) {
                                item.upstreamthreeselect = itemone.children;
                            }
                        });
                    }
                });
            }
        });
    }
    viewContract(item) {
        const curentparam = item;
        if (item.upstreamName !== undefined && item.supplierName !== undefined) {
            item.contractJia =  item.supplierName;
            item.contractYi = item.upstreamName;
        }
        if (item.contractSignTime === 0) {
            item.contractSignTime = '';
        }
        // if (paramItem.contractNum === undefined) {
        //     // this.xn.msgBox.open(false, '上游客户合同编号不存在，不可以补录');
        //     return;

        // }
        const checkers = [
            {
                title: '合同编号',
                checkerId: 'contractNum',
                type: 'text',
                required: true,
                options: { readonly: true },
                value: item.contractNum
            },
            {
                title: '合同金额',
                checkerId: 'contractAmt',
                type: 'money',
                required: true,
                options: { readonly: true },
                value: item.contractAmt
            },
            {
                title: '合同名称',
                checkerId: 'contractName',
                required: true,
                type: 'text',
                options: { readonly: true },
                value: item.contractName
            },
            {
                title: '合同甲方',
                checkerId: 'contractJia',
                type: 'text',
                options: { readonly: true },
                required: true,
                value: item.supplierName
            },
            {
                title: '合同结算方式',
                checkerId: 'contractJiesuan',
                type: 'text',
                required: 0,
                readonly: 1,
                value: item.contractJiesuan
            },
            {
                title: '合同乙方',
                checkerId: 'contractYi',
                type: 'text',
                options: { readonly: true },
                required: true,
                value: item.upstreamName
            },
            {
                title: '合同付款期限',
                checkerId: 'contractPayTime ',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: item.contractPayTime
            },
            {
                title: '应收账款金额',
                checkerId: 'receive',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: item.receive
            },
            {
                title: '合同签订时间',
                checkerId: 'contractSignTime',
                required: false,
                type: 'date',
                value: item.contractSignTime || '',
                readonly: 1,
                placeholder: '请选择时间'
            },
            {
                title: '应收账款类型',
                checkerId: 'receiveType',
                type: 'moreselect',
                required: 0,
                readonly: 1,
                options: { ref: 'moneyType' },
                value: { twoselect: item.twoselect, threeselect: item.threeselect, valueinfo: item.receiveType }

            },

        ];
        const params = {
            checkers,
            value: item,
            type: 1,
            title: '采购合同补录'
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerBothPlatContractModalComponent, params).subscribe(v => {

        });

    }
}
