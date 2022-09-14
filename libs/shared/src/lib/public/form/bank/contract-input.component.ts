import {
    Component,
    Input,
    OnInit,
    ElementRef,
    ViewContainerRef,
    ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ContractInputComponent } from '../contract-input.component';
import { BankContractNewModalComponent } from './contract-new-modal.component';
import { BankContractViewModalComponent } from './contract-view-modal.component';

@Component({
    selector: 'xn-bank-contract-input',
    template: '<xn-contract-input></xn-contract-input>',
    styles: [
        `
            .file-row-table {
                margin-bottom: 0;
            }
        `,
        `
            .file-row-table td {
                padding: 6px;
                border-color: #d2d6de;
                font-size: 12px;
            }
        `,
        `
            .file-row-table th {
                font-weight: normal;
                border-color: #d2d6de;
                border-bottom-width: 1px;
                line-height: 100%;
                font-size: 12px;
            }
        `,
        `
            .table-bordered {
                border-color: #d2d6de;
            }
        `,
        `
            .table > thead > tr > th {
                padding-top: 7px;
                padding-bottom: 7px;
            }
        `
    ]
})
export class BankContractInputComponent implements OnInit {
    @ViewChild(ContractInputComponent)
    contractInputComponent: ContractInputComponent;
    @Input() row: any;
    @Input() form: FormGroup;

    mode: string;

    constructor(
        private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef
    ) {}

    ngOnInit() {
        this.mode = this.row.options.mode;

        this.contractInputComponent.row = this.row;
        this.contractInputComponent.form = this.form;
        this.contractInputComponent.onNew = this.onNew.bind(this);
        this.contractInputComponent.onView = this.onView.bind(this);
    }

    onNew() {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            BankContractNewModalComponent,
            null
        ).subscribe(v => {
            if (v === null) {
                return;
            }

            this.contractInputComponent.items.push(v);
            this.contractInputComponent.toValue();
        });
    }

    onView(item: any) {
        item.preview = this.row.options.preview;
        item.map = this.contractInputComponent.map;
        item.supplier =
            (this.contractInputComponent.supplierChange &&
                this.contractInputComponent.supplierChange.value) ||
            item.supplier;
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            BankContractViewModalComponent,
            item
        ).subscribe(() => {});
    }
}
