import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnService} from '../../services/xn.service';

@Component({
    templateUrl: './bill-edit-modal.component.html',
    styles: [
        `.flex-row { display: flex; margin-bottom: 15px;}`,
        `.this-title { width: 90px; text-align: right; padding-top: 7px;}`,
        `.col-sm-4, .col-sm-6, .col-sm-8 { padding-left: 0 }`,
        `xn-text-input .xn-input-alert { color: #000 !important}`,
        `.panel {margin-bottom: 0px; border: 0;}`,
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`,
        `.box {box-shadow: none; border-top: 1px solid #d2d6de}`
    ]
})
export class BillEditModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    @Input() row: any;
    @Input() form: FormGroup;
    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows1: any[] = [];
    shows2: any[] = [];
    shows3: any[] = [];
    shows4: any[] = [];
    shows5: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    files: any[];
    private observer: any;
    total = 0;
    pageSize = 5;
    items: any[] = [];
    taxpayerSegistrationNumbers: any = [];
    choosed = '';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        this.onPage(1);
    }

    onPage(page: number) {
        page = page || 1;
        this.xn.api.post('/making_invoice_info?method=get', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.items = json.data.data;
            this.total = json.data.recordsTotal;
            for (let i = 0; i < this.items.length; i++) {
                this.taxpayerSegistrationNumbers.push(this.items[i].taxpayerSegistrationNumber);
            }
        });
    }

    /**
     * 打开查看窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        // 判断一进来是编辑还是新增
        if (params.taxpayerSegistrationNumber) {
            this.choosed = 'true';
        }
        else {
            this.choosed = '';
        }

        this.params = params;
        // 处理数据
        this.buildForm();

        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    buildForm() {
        this.shows1 = [];
        this.shows2 = [];

        this.shows1.push({
            name: 'companyName',
            type: 'text',
            require: false,
            title: '企业名称',
            validators: false,
            value: this.params.companyName
        });

        this.shows2.push({
            name: 'taxpayerSegistrationNumber',
            type: 'text',
            require: false,
            title: '纳税人识别号',
            validators: false,
            value: this.params.taxpayerSegistrationNumber,
            options: {readonly: this.choosed}
        });

        this.shows1.push({
            name: 'taxpayerAddress',
            type: 'text',
            require: false,
            title: '纳税人地址',
            validators: false,
            value: this.params.taxpayerAddress
        });

        this.shows2.push({
            name: 'taxpayerTelephone',
            type: 'text',
            require: false,
            title: '纳税人电话',
            validators: false,
            value: this.params.taxpayerTelephone
        });

        this.shows1.push({
            name: 'taxpayerBankName',
            type: 'text',
            require: false,
            title: '纳税人开户行',
            validators: false,
            value: this.params.taxpayerBankName
        });

        this.shows2.push({
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

        this.shows2.push({
            name: 'taxType',
            type: 'radio',
            require: false,
            title: '纳税类型',
            selectOptions: selectTaxTypeArr,
            validators: false,
            value: this.params.taxType && this.params.taxType.toString()
        });

        this.shows1.push({
            name: 'contacts',
            type: 'text',
            require: false,
            title: '联系人',
            validators: false,
            value: this.params.contacts
        });
        this.mainForm = XnFormUtils.buildFormGroup(this.shows1, this.shows2);

        this.mainForm.valueChanges.subscribe((v) => {
            this.formValid = this.mainForm.valid;
        });

        this.formValid = this.mainForm.valid;
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onOk() {
        // this.params.contractTitle = this.contractTitle;
        // this.params.contractNum = this.contractNum;
        // this.params.contractAmount = this.contractAmount;
        // this.params.contractDate = this.contractDate;
        // this.params.contractBuyer = this.contractBuyer;
        // this.params.action = 'ok';

        this.close(this.params);
    }

    onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    onSelect(item) {
        // console.log("this.mainForm.value: ", this.mainForm.value);
        // console.log("this.params: ", this.params);
        this.choosed = 'true';

        const keys: any = [];
        for (const key in this.mainForm.value) {
            keys.push(key);
        }

        // 如果存在taxpayerSegistrationNumber，不变数组，不存在，添加进数组
        keys.indexOf('taxpayerSegistrationNumber') !== -1 ? '' : keys.push('taxpayerSegistrationNumber');

        for (const key of keys) {
            this.params[key] = item[key];
        }

        this.buildForm();
    }

    onClearList() {
        if (this.choosed === '') {
            return;
        }
        for (const key in this.params) {
            delete this.params[key];
        }
        this.choosed = '';
        this.buildForm();
    }

    onSubmit() {
        if (this.choosed === '') {
            this.xn.api.post('/making_invoice_info?method=post', {
                value: this.mainForm.value
            }).subscribe(json => {
                this.addBack();
                this.backAndClose();
            });
        }
        else {
            this.xn.api.post('/making_invoice_info?method=put', {
                where: {
                    taxpayerSegistrationNumber: this.params.taxpayerSegistrationNumber,
                },
                value: {
                    companyName: this.mainForm.value.companyName,
                    taxpayerSegistrationNumber: this.mainForm.value.taxpayerSegistrationNumber,
                    taxpayerAddress: this.mainForm.value.taxpayerAddress,
                    taxpayerTelephone: this.mainForm.value.taxpayerTelephone,
                    taxpayerBankName: this.mainForm.value.taxpayerBankName,
                    taxpayerBankAccount: this.mainForm.value.taxpayerBankAccount,
                    taxType: this.mainForm.value.taxType,
                    invoiceType: this.mainForm.value.invoiceType,
                    contacts: this.mainForm.value.contacts
                }
            }).subscribe(json => {
                this.backAndClose();
            });
        }
    }

    backAndClose() {
        this.params.companyName = this.mainForm.value.companyName;
        this.params.taxpayerAddress = this.mainForm.value.taxpayerAddress;
        this.params.taxpayerTelephone = this.mainForm.value.taxpayerTelephone;
        this.params.taxpayerBankName = this.mainForm.value.taxpayerBankName;
        this.params.taxpayerBankAccount = this.mainForm.value.taxpayerBankAccount;
        this.params.taxType = parseInt(this.mainForm.value.taxType);
        this.params.invoiceType = parseInt(this.mainForm.value.invoiceType);
        this.params.contacts = this.mainForm.value.contacts;
        this.close(this.params);
    }

    addBack() {
        this.params.taxpayerSegistrationNumber = this.mainForm.value.taxpayerSegistrationNumber;
    }
}
