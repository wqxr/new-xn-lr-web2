import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnService} from '../../services/xn.service';

@Component({
    templateUrl: './bill-view-modal.component.html',
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
export class BillViewModalComponent implements OnInit {

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
        this.params = params || {};
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
            value: this.params.companyName,
            options: {readonly: true}
        });

        this.shows2.push({
            name: 'taxpayerSegistrationNumber',
            type: 'text',
            require: false,
            title: '纳税人识别号',
            validators: false,
            value: this.params.taxpayerSegistrationNumber,
            options: {readonly: true}
        });

        this.shows1.push({
            name: 'taxpayerAddress',
            type: 'text',
            require: false,
            title: '纳税人地址',
            validators: false,
            value: this.params.taxpayerAddress,
            options: {readonly: true}
        });

        this.shows2.push({
            name: 'taxpayerTelephone',
            type: 'text',
            require: false,
            title: '纳税人电话',
            validators: false,
            value: this.params.taxpayerTelephone,
            options: {readonly: true}
        });

        this.shows1.push({
            name: 'taxpayerBankName',
            type: 'text',
            require: false,
            title: '纳税人开户行',
            validators: false,
            value: this.params.taxpayerBankName,
            options: {readonly: true}
        });

        this.shows2.push({
            name: 'taxpayerBankAccount',
            type: 'text',
            require: false,
            title: '纳税人开户行账号',
            validators: false,
            value: this.params.taxpayerBankAccount,
            options: {readonly: true}
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
            value: this.params.taxType && this.params.taxType.toString(),
            options: {readonly: true}
        });

        this.shows1.push({
            name: 'contacts',
            type: 'text',
            require: false,
            title: '联系人',
            validators: false,
            value: this.params.contacts,
            options: {readonly: true}
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
        this.close(this.params);
    }

    onCancel() {
        this.close({
            action: 'cancel'
        });
    }

}
