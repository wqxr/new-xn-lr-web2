import {Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

@Component({
    templateUrl: './invoices-edit-modal.component.html',
    styles: [

        `.panel { margin-bottom: 0 }`,
        `.form-group .input { height: 28px; line-height: normal }`,

    ]
})
export class InvoicesEditModalComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('editor') editor: ElementRef;
    @ViewChild('file') file: ElementRef;
    @ViewChild('KeTextArea') KeTextArea: ElementRef;

    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    files: any[];
    articalParams: any = {} as any;
    title = '';
    content = '';
    link: any = {} as any;
    showLink = false;
    showTextArea = false;
    selections: any = {} as any;
    selectedRange: any;
    linkValue = false;
    linkRadio = 'yes';  // 初始化默认为yes
    targetlinkTemp = '';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.articalParams.columnId = params.columnId;
        this.modal.open(ModalSize.XLarge);
        this.params = params;

        // 处理数据
        this.shows = [];

        this.shows.push({
            name: 'companyName',
            type: 'text',
            require: false,
            title: '企业名称',
            validators: false,
            memo: '必须是全称',
            value: this.params.companyName
        });

        this.shows.push({
            name: 'taxpayerSegistrationNumber',
            type: 'text',
            require: false,
            title: '纳税人识别号',
            validators: false,
            value: this.params.taxpayerSegistrationNumber,
            options: {readonly: true}
        });

        this.shows.push({
            name: 'taxpayerAddress',
            type: 'text',
            require: false,
            title: '纳税人地址',
            validators: false,
            value: this.params.taxpayerAddress
        });

        this.shows.push({
            name: 'taxpayerTelephone',
            type: 'text',
            require: false,
            title: '纳税人电话',
            validators: false,
            value: this.params.taxpayerTelephone
        });

        this.shows.push({
            name: 'taxpayerBankName',
            type: 'text',
            require: false,
            title: '纳税人开户行',
            validators: false,
            value: this.params.taxpayerBankName
        });

        this.shows.push({
            name: 'taxpayerBankAccount',
            type: 'text',
            require: false,
            title: '纳税人开户行账号',
            validators: false,
            value: this.params.taxpayerBankAccount
        });

        const selectTaxTypeArr = [
            {label: '增值税一般纳税人', value: '1'},
            {label: '增值税小规模纳税人', value: '2'}
        ];

        this.shows.push({
            name: 'taxType',
            type: 'radio',
            require: false,
            title: '纳税类型',
            selectOptions: selectTaxTypeArr,
            validators: false,
            value: this.params.taxType.toString()
        });

        this.shows.push({
            name: 'contacts',
            type: 'text',
            require: false,
            title: '联系人',
            validators: false,
            value: this.params.contacts
        });
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        this.mainForm.valueChanges.subscribe((v) => {
            this.formValid = this.mainForm.valid;
        });

        this.formValid = this.mainForm.valid;

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onOk() {

    }

    onSubmit() {
        console.log('this.mainForm.value: ', this.mainForm.value);
        this.xn.api.post('/making_invoice_info?method=put', {
            where: {
                taxpayerSegistrationNumber: this.params.taxpayerSegistrationNumber,
            },
            value: {
                companyName: this.mainForm.value.companyName,
                taxpayerAddress: this.mainForm.value.taxpayerAddress,
                taxpayerTelephone: this.mainForm.value.taxpayerTelephone,
                taxpayerBankName: this.mainForm.value.taxpayerBankName,
                taxpayerBankAccount: this.mainForm.value.taxpayerBankAccount,
                taxType: this.mainForm.value.taxType,
                invoiceType: this.mainForm.value.invoiceType,
                contacts: this.mainForm.value.contacts
            }
        }).subscribe(json => {
            this.params.companyName = this.mainForm.value.companyName;
            this.params.taxpayerAddress = this.mainForm.value.taxpayerAddress;
            this.params.taxpayerTelephone = this.mainForm.value.taxpayerTelephone;
            this.params.taxpayerBankName = this.mainForm.value.taxpayerBankName;
            this.params.taxpayerBankAccount = this.mainForm.value.taxpayerBankAccount;
            this.params.taxType = parseInt(this.mainForm.value.taxType, 0);
            this.params.invoiceType = parseInt(this.mainForm.value.invoiceType, 0);
            this.params.contacts = this.mainForm.value.contacts;
            this.close(this.params);
        });
    }

}
