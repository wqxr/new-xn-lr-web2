import { Component, Input, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
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
                <th *ngFor="let head of lvyueinfo.headText">{{head.label}}</th>
                <th *ngIf="lvyueinfo?.edit && lvyueinfo?.edit?.rowButtons && lvyueinfo?.edit?.rowButtons?.length">
                操作
                </th>
            </tr>
            </thead>
            <tbody>
                <tr *ngFor="let item of items; let i=index">
                    <td *ngFor="let head of lvyueinfo.headText">
                    <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                    </td>
                    <td><a href='javascript:void(0)' (click)='showContract(item)'>查看</a></td>
                </tr>

            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'lvyueBoth', formModule: 'avenger-show' })
export class AvengerLvyueBothComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public documentAllType: any;
    public documentType: string;
    public uploader: string;

    items: any[] = [];
    lvyueinfo: any;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef, ) {
    }
    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.lvyueinfo = AvengerFormTable.tableFormlist.tabList[5];
            this.items = JSON.parse(data);
        }
    }
    showContract(items) {
        this.documentAllType = SelectOptions.get('Certificateperformance');
        this.documentAllType.filter(item => {
            if (item.value === items.documentType) {
                return this.documentType = item.label;
            }
        });
        if (items.owner === 0) {
            this.uploader = '上游客户';
        } else if (items.owner === 1) {
            this.uploader = '供应商';
        }

        const checkers = [
            {
                title: '首次发货时间',
                checkerId: 'firstSendTime',
                type: 'date',
                required: 0,
                value: items.firstSendTime || '',
            },
            {
                title: '发货方',
                checkerId: 'contractAmount',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: items.contractAmount || '',
            },
            {
                title: '数量',
                checkerId: 'counts',
                required: 0,
                type: 'text',
                options: { readonly: true },
                value: items.counts || ''
            },
            {
                title: '最后签收时间',
                checkerId: 'lastSignTime',
                type: 'date',
                required: 0,
                options: { readonly: true },
                value: items.lastSignTime || ''
            },
            {
                title: '签收方',
                checkerId: 'consiger',
                type: 'text',
                required: 0,
                value: items.consiger,
                options: { readonly: true }

            },
            {
                title: '金额',
                checkerId: 'lvyueAmount',
                required: false,
                type: 'money',
                value: items.lvyueAmount,
                options: { readonly: true }

            },
            {
                title: '单据类型',
                checkerId: 'documentType',
                type: 'text',
                required: 0,
                value: this.documentType,
                options: { readonly: true }
            },
            {
                title: '上传方',
                checkerId: 'uploader ',
                type: 'text',
                required: 0,
                value: this.uploader,
                options: { readonly: true }
            },

        ];
        const params = {
            checkers,
            value: items,
            title: '履约证明资料补录',
            type: 1,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengeraddContractModalComponent, params)
            .subscribe(v => { });


    }
}
