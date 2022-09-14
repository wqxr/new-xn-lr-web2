import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InvoiceVankeInputComponent } from '../invoice-vanke-input.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BankInvoiceViewModalComponent } from './invoice-view-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'xn-bank-invoice-input',
    template:
        '<app-xn-invoice-input #invoice [row]="row" [form]="form"></app-xn-invoice-input>'
})
export class BankInvoiceInputComponent implements OnInit {
    @ViewChild('invoice')
    invoiceComponent: InvoiceVankeInputComponent;
    @Input() row: any;
    @Input() form: FormGroup;
    constructor(
        private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef
    ) {
        //
    }
    ngOnInit() {
        this.invoiceComponent.onView = this.onView.bind(this);
        // this.invoiceComponent.onOpenImage = this.onOpenImage.bind(this);
    }

    onOpenImage(item: any) {
        item.preview = this.row.options.preview;
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            BankInvoiceViewModalComponent,
            item
        ).subscribe(() => {});
    }

    onView(fileId: string, itemData?) {
        let item;
        if (fileId && fileId !== '') {
            for (let i = 0; i < this.invoiceComponent.items.length; ++i) {
                if (this.invoiceComponent.items[i].fileId === fileId) {
                    item = this.invoiceComponent.items[i];
                }
            }
        } else {
            item = itemData;
        }


        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            BankInvoiceViewModalComponent,
            {
                fileId,
                invoiceCode: item.invoiceCode,
                invoiceNum: item.invoiceNum,
                invoiceDate: item.invoiceDate,
                invoiceAmount: item.invoiceAmount,
                preview: this.row.options.preview
            }
        ).subscribe(() => {});
    }
}
