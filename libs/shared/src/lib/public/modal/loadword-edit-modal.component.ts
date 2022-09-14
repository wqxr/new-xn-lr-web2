import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';

@Component({
    templateUrl: './loadword-edit-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
        `.form-group .input { height: 28px; line-height: normal }`,
        `.button-list { margin-bottom: 10px }`,
        `.editor { height: 300px; border: 1px solid #ddd; border-radius: 5px; overflow-y: scroll}`,
    ]
})
export class LoadwordEditModalComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('editor') editor: ElementRef;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    title = '';
    content = '';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.params = params;
        this.shows = [];
        const coreValue = {
            label: params.appName,
            value: params.appId
        };

        this.shows = [
            {
                title: '基础交易合同编号', checkerId: 'contractId', required: true, type: 'text', value: params.contractId,
                options: {readonly: true}
            },
            {
                title: '发票号', checkerId: 'invoiceNum', required: true, type: 'text', value: params.invoiceNum,
                options: {readonly: true}
            },
            {
                title: '发票金额', checkerId: 'invoiceAmount', required: true, type: 'money', value: params.invoiceAmount
            },
            {
                title: '应收账款金额', checkerId: 'receivable', required: true, type: 'money', value: params.debtAccount
            },
            {
                title: '债权单位', checkerId: 'debtUnit', required: true, type: 'text', value: params.debtUnit
            },
            {
                title: '债权单位银行账户', checkerId: 'debtAccount', required: true, type: 'text', value: params.debtAccount
            },
            {
                title: '债权单位银行开户行', checkerId: 'debtBank', required: true, type: 'text', value: params.debtBank
            },
            {
                title: '项目公司', checkerId: 'projectCompany', required: true, type: 'text', value: params.projectCompany
            },
            {
                title: '付款确认书编号', checkerId: 'originalSingleEencoding', required: true, type: 'text', value: params.originalSingleEencoding
            },
            {
                title: '应收账款到期日', checkerId: 'expiryTime', required: true, type: 'date', value: params.expiryTime
            },
        ];

        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        this.mainForm.valueChanges.subscribe((v) => {
            this.formValid = this.mainForm.valid;
        });
        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
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

        const params = {} as any;
        for (const item in this.mainForm.value) {
            if (this.mainForm.value.hasOwnProperty(item)) {
                params[item] = this.mainForm.value[item];
            }
        }

        params.contractId = this.params.contractId;
        params.invoiceNum = this.params.invoiceNum;

        this.postValue(params);
    }

    postValue(params) {
        this.xn.api.post('/ljx/word/update', params).subscribe(json => {
            // // 有变化时，进行更改
            // if (this.params.appId !== JSON.parse(this.mainForm.value.appName).value) {
            //     this.params.appId = JSON.parse(this.mainForm.value.appName).value;
            // }
            // if (this.params.appName !== JSON.parse(this.mainForm.value.appName).label) {
            //     this.params.appName = JSON.parse(this.mainForm.value.appName).label;
            // }
            // if (this.params.content !== this.mainForm.value.content) {
            //     this.params.content = this.mainForm.value.content;
            // }
            for (const item in this.mainForm.value) {
                if (this.mainForm.value.hasOwnProperty(item)) {
                    this.params[item] = this.mainForm.value[item];
                }
            }

            this.close(this.params);
        });
    }
}
