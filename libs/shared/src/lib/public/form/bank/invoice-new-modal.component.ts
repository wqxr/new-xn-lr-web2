import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    ModalComponent,
    ModalSize
} from 'libs/shared/src/lib/common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

@Component({
    templateUrl: './invoice-new-modal.component.html',
    styles: [
        `
            .this-img {
                width: 100%;
                border: none;
            }
        `,
        `
            .button-rotate {
                position: absolute;
                top: 10px;
                cursor: pointer;
                z-index: 10;
            }
        `,
        `
            .rotate-left {
                right: 60px;
            }
        `,
        `
            .rotate-right {
                right: 10px;
            }
        `,
        `
            .row {
                padding: 0 20px;
            }
        `,
        `
            .img-container {
                max-height: calc(100vh - 380px);
                overflow-x: hidden;
                text-align: center;
                position: relative;
            }
        `,
        `
            .img-wrapper {
                transition: all 0.5s ease-in-out;
            }
        `,
        `
            ::ng-deep .modal-body {
                height: 425px;
                overflow-y: auto;
            }
        `
    ]
})
export class BankInvoiceNewModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;

    private observer: any;
    mainForm: FormGroup;
    rows: any[] = [];
    fileImg: string;

    constructor() {}

    ngOnInit() { }

    open(): Observable<any> {
        this.rows = [
            {
                title: '发票代码',
                checkerId: 'invoiceNum',
                type: 'text'
            },
            {
                title: '发票号码',
                checkerId: 'invoiceCode',
                type: 'text'
            },
            {
                title: '开票日期',
                checkerId: 'invoiceDate',
                validators: { date: true }
            },
            {
                title: '开票金额',
                checkerId: 'invoiceAmount',
                type: 'text'
            },
            {
                title: '发票购方',
                checkerId: 'buyer',
                type: 'text'
            },
            {
                title: '发票销方',
                checkerId: 'supplier',
                type: 'text'
            },
            {
                title: '上传发票复印件',
                checkerId: 'invoiceFile',
                type: 'mfile',
                options: {
                    // showWhen: ['fileType', 'img'],
                    filename: '发票文件图片',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500'
                }
            }
        ];

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);

        this.mainForm.valueChanges.subscribe((v) => {
            // 显示图片
            const fileId = v.invoiceFile && JSON.parse(v.invoiceFile)[0].fileId;
            this.fileImg = fileId ? `/api/attachment/view?key=${fileId}` : '';
        });

        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onSubmit() {
        const v = this.mainForm.value;
        const data = {
            invoiceNum: v.invoiceNum,
            invoiceCode: v.invoiceCode,
            invoiceDate: v.invoiceDate,
            invoiceAmount: v.invoiceAmount,
            buyer: v.buyer,
            supplier: v.supplier
        };
        if (v.fileType === 'pdf') {
            this.close(
                Object.assign(data, {
                    files: [JSON.parse(v.pdf)]
                })
            );
        } else {
            this.close(
                Object.assign(data, {
                    files: JSON.parse(v.invoiceFile)
                })
            );
        }
    }

    onCancel() {
        this.close(null);
    }
}
