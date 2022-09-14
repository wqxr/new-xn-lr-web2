import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnUtils} from '../../common/xn-utils';

@Component({
    templateUrl: './invoice-factory-edit-modal.component.html',
    styles: [
            `
            .panel {
                margin-bottom: 0
            }

            @media (min-height: 1001px) {
                .table-box {
                    max-height: 440px;
                    overflow-y: auto
                }
            }

            @media (max-height: 1000px) {
                .table-box {
                    max-height: 300px;
                    overflow-y: auto
                }
            }

            @media (max-height: 900px) {
                .table-box {
                    max-height: 250px;
                    overflow-y: auto
                }
            }

            @media (max-height: 800px) {
                .table-box {
                    max-height: 220px;
                    overflow-y: auto
                }
            }

            @media (max-height: 700px) {
                .table-box {
                    max-height: 200px;
                    overflow-y: auto
                }
            }

            .amounts-all {
                background: #eee
            }
        `
    ]
})
export class InvoiceFactoryEditModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    shows2: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    newUserRoleList: any[] = [];
    roleArr: any[] = [];
    roleArrTemp: any[] = [];
    memoTemp = '';
    invoiceInfo: any;
    mainFlowId: any;
    supplierOrgName: any;
    billAmounts: any;
    payTime: any;
    enterpriseOrgName: any;
    amountsAll: any;

    constructor(private xn: XnService) {
    }

    ngOnInit() {

    }

    open(params: any): Observable<string> {

        this.params = params;
        this.getData(params.mainFlowId);
        this.modal.open(ModalSize.XLarge);


        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    cssClass(step): string {
        if (step === this.steped) {
            return 'current';
        }
        if (step > this.steped) {
            return 'disabled';
        } else {
            return 'success';
        }
    }

    onOk() {

    }

    onSubmit() {
        // 获取商票发票金额
        const invoiceInfoStr = this.mainForm.value.invoiceInfo;
        console.log('invoiceInfoStr: ', invoiceInfoStr);
        let invoiceInfoArr: any = [];
        if (Array.isArray(invoiceInfoStr)) {
            invoiceInfoArr = invoiceInfoStr;
        } else {
            invoiceInfoArr = JSON.parse(invoiceInfoStr);
        }

        for (const row of invoiceInfoArr) {
            if (!row.invoiceNum) {
                this.xn.msgBox.open(false, '请补充发票具体信息');
                return;
            }
        }

        this.xn.api.post('/invoice_upload/upload', {
            invoiceInfo: typeof(this.mainForm.value.invoiceInfo) === 'string' ?
                this.mainForm.value.invoiceInfo : JSON.stringify(this.mainForm.value.invoiceInfo),
            mainFlowId: this.params.mainFlowId
        }).subscribe(json => {
            // console.log("json: ", json);
            this.params.invoiceAmounts = this.amountsAll;
            this.params.unInvoiceAmounts = Number((Number(this.params.billAmounts) - Number(this.params.invoiceAmounts)).toFixed(2));
            this.close(this.params);
        });
    }

    getData(mainFlowId) {
        this.xn.api.post('/invoice_upload/show_upload', {
            mainFlowId
        }).subscribe(json => {
            console.log('jsonShow: ', json);
            this.invoiceInfo = json.data.data.invoiceInfo;
            this.invoiceInfo.status = 'unfill';
            this.mainFlowId = json.data.data.mainFlowId;
            this.supplierOrgName = json.data.data.supplierOrgName;
            this.billAmounts = json.data.data.billAmounts;
            this.payTime = json.data.data.payTime;
            this.enterpriseOrgName = json.data.data.enterpriseOrgName;
            console.log('billAmounts: ', this.billAmounts);
            this.build();
        });
    }

    build() {
        this.shows = [];
        this.shows2 = [];

        this.shows.push({
            checkerId: 'supplyInvoice',
            name: 'invoiceInfo',
            required: true,
            type: 'invoice',
            title: '发票详情',
            options: {
                mode: 'upload_lack',
                multi: true,
                fileext: 'jpg, jpeg, png',
                picSize: '500'
            },
            value: this.invoiceInfo,
            memo: '发票大于10张，上传excel'
        });
        console.log('invoiceInfo: ', this.invoiceInfo);

        this.shows2.push({
            name: 'mainFlowId',
            required: true,
            type: 'text',
            title: '交易ID',
            options: {readonly: true},
            value: this.mainFlowId
        });

        this.shows2.push({
            name: 'supplierOrgName',
            required: true,
            type: 'text',
            title: '业务发起人',
            options: {readonly: true},
            value: this.supplierOrgName
        });

        this.shows2.push({
            name: 'enterpriseOrgName',
            required: true,
            type: 'text',
            title: '核心企业',
            options: {readonly: true},
            value: this.enterpriseOrgName
        });

        this.shows2.push({
            name: 'billAmounts',
            required: true,
            type: 'money',
            title: '保理金额',
            options: {readonly: true},
            value: this.billAmounts
        });

        this.shows2.push({
            name: 'payTime',
            required: true,
            type: 'text',
            title: '保理日期',
            options: {readonly: true},
            value: XnUtils.formatDate(this.payTime)
        });


        this.mainForm = XnFormUtils.buildFormGroup(this.shows, this.shows2);
        console.log('shows: ', this.shows);
        console.log('formValue: ', this.mainForm.value);
        this.calcInvoice();

        this.mainForm.valueChanges.subscribe((v) => {
            console.log('change: ', this.mainForm.value);
            this.calcInvoiceChange();
        });

        this.formValid = this.mainForm.valid;

        this.steped = parseInt(this.params.status, 0);
    }

    calcInvoice() {
        const invoice = this.mainForm.value.invoiceInfo;
        let total = 0;
        if (invoice && invoice.length !== 0) {
            for (const row of invoice) {
                console.log('rowArr: ', row);
                if (!row.invoiceAmount) {
                    total = total;
                    continue;
                }
                total += row.invoiceAmount * 1;
            }
        }
        this.amountsAll = total.toFixed(2);
        this.formValid = this.mainForm.valid;
    }

    calcInvoiceChange() {
        const invoice = this.mainForm.value.invoiceInfo;
        let total = 0;
        if (invoice && invoice.length !== 0) {
            for (const row of JSON.parse(invoice)) {
                console.log('row: ', row);
                if (!row.invoiceAmount) {
                    total = total;
                    continue;
                }
                total += row.invoiceAmount * 1;
            }
        }
        this.amountsAll = total.toFixed(2);
        this.formValid = this.mainForm.valid;
    }
}
