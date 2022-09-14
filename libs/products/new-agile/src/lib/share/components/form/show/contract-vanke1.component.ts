import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ContractVankeEditModalComponent } from 'libs/shared/src/lib/public/modal/contract-vanke-edit-modal.component';


@Component({
    templateUrl: './contract-vanke1.component.html',
})
@DynamicForm({ type: 'contract-vanke1', formModule: 'new-agile-show' })
export class XnContractVanke1ShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    items: any[];

    constructor(private xn: XnService, private vcr: ViewContainerRef) {}

    ngOnInit(): void {
        const { data } = this.row;
        if (!!data) {
            this.items = JSON.parse(data);
        }
    }

    public contractOnView(item: any, mode: string) {
        const checkers = [
            {
                title: '合同编号',
                checkerId: 'contractNum',
                type: 'text',
                required: false,
                options: { readonly: true },
                value: item.files.contractNum || '',
            },
            {
                title: '合同金额',
                checkerId: 'contractAmount',
                type: 'text',
                required: false,
                options: { readonly: true },
                value: item.files.contractAmount || '',
            },
            {
                title: '合同名称',
                checkerId: 'contractName',
                type: 'text',
                required: false,
                options: { readonly: true },
                value: item.files.contractName || '',
            },
        ];

        const params = {
            checkers,
            title: '查看合同信息',
            value: item,
            isShow: true,
        };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            ContractVankeEditModalComponent,
            params
        ).subscribe(() => {});
    }
}
