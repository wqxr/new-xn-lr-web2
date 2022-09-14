import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {XnInputOptions} from '../xn-input.options';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {InvoiceDataViewModalComponent} from '../../modal/invoice-data-view-modal.component';
import {FileViewModalComponent} from '../../modal/file-view-modal.component';
import {SelectOptions} from 'libs/shared/src/lib/config/select-options';
import {PdfSignModalComponent} from '../../modal/pdf-sign-modal.component';

/**
 *  过桥资金-上传付款清单
 */
@Component({
    selector: 'app-xn-upload-file-table-input',
    templateUrl: './upload-file-table-input.component.html',
    styles: [`

        .table-display tr td {
            width: 200px;
            vertical-align: middle;
            word-wrap: break-word;
            word-break: break-all;
        }

        .height {
            width: 100%;
            overflow-x: hidden;
        }

        .table {
            table-layout: fixed;
            width: 1600px;
        }

        .table-height {
            max-height: 600px;
            overflow: auto;
        }

        .head-height {
            position: relative;
            overflow: auto;
        }

        .table-display {
            margin: 0;
        }

        .relative {
            position: relative
        }

        .fix-table {
            width: 100%;
        }

        .word-break {
            word-break: break-all;
        }
    `]
})
export class UploadFileTableInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    alert = '';
    xnOptions: XnInputOptions;
    headLeft = 0;
    selectItems: any[] = [];
    data: any[] = [];
    procedureId: boolean;
    moneyChannelOptions = SelectOptions.get('moneyChannel');
    enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // 总部企业对应
    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.procedureId = this.row.procedureId === '@begin';
        this.data = JSON.parse(this.form.get(this.row.name).value);
        //  发票号字段要整理
        // 整理发票号字段
        this.data.forEach(c => {
            const invoiceArr =
                c.realInvoiceNum && c.realInvoiceNum !== ''
                    ? JSON.parse(c.realInvoiceNum)
                    : [];
            c.invoiceNumLocal = invoiceArr;
            if (invoiceArr.length > 2) {
                c.invoiceNumLocal = `${invoiceArr[0]};${invoiceArr[1]}等`;
            } else if (invoiceArr.length === 1) {
                c.invoiceNumLocal = `${invoiceArr[0]}`;
            }
            if (invoiceArr.length === 2) {
                c.invoiceNumLocal = `${invoiceArr[0]};${invoiceArr[1]}`;
            }
            c.invoiceLength = invoiceArr.length;
        });
    }

    // 查看交易流程
    public viewProcess(item: any) {
        this.xn.router.navigate([
            `console/main-list/detail/${item.mainFlowId}`
        ]);
    }

    // 查看所有发票
    public viewAllInvoice(e) {
        if (e.invoiceLength <= 2) {
            return;
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            JSON.parse(e.realInvoiceNum)
        ).subscribe(() => {
        });
    }

    // 查看付款确认书
    onView(item: any) {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            FileViewModalComponent,
            item
        ).subscribe(() => {
        });
    }

    showContract(id, secret, label) {
        // console.log('showContract');
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            PdfSignModalComponent,
            {
                id,
                secret,
                label,
                readonly: true
            }
        ).subscribe(v2 => {
            // 啥也不做
        });
    }

}
