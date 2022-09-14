import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnInputOptions} from '../xn-input.options';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {FileEditInput1ModalComponent} from './modal/file-edit-input1-modal.component';
import {BankPublicCommunicateService} from 'libs/shared/src/lib/services/bank-public-communicate.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    selector: 'app-xn-file-edit-input1',
    templateUrl: './file-edit-input1.component.html',
})
export class FileEditInput1Component implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    label;
    public files: any[];

    public myClass = '';
    public alert = '';
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    // 默认供应商名称
    public accountName = '';
    public bankName = '';
    public accountNumber = '';

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
                private publicCommunicateService: BankPublicCommunicateService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);

        const name = XnUtils.parseObject(this.row.options, []);
        if (!!name.accountName) {
            this.accountName = name.accountName;
        }
        if (!!name.bankName) {
            this.bankName = name.bankName;
        }

        // 设置初始值
        this.files = XnUtils.parseObject(this.ctrl.value, []);
        this.toValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     *  编辑
     * @param paramsItems
     */
    public edit(paramsItems: any) {
        const params = {
            items: paramsItems,
            accountName: this.accountName,
            bankName: this.bankName,
            accountNumber: this.accountNumber,
            edit: {
                accountNameBool: false,
                bankNameBool: false,
                accountNumberBool: true,
                canSave: false,
                operating: 'edit',
                required: 1
            },
            title: {
                accountNameTitle: '名称',
                bankNameTitle: '开户行',
                accountNumberTitle: '账号'
            }
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileEditInput1ModalComponent, params)
            .subscribe(x => {
                if (x.action === 'ok') {
                    this.accountNumber = x.value.accountNumber;
                    this.toValue();
                    this.publicCommunicateService.change.emit(x.value);
                }
            });
    }

    private toValue() {
        if (this.accountNumber === '') {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.files));
        }
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
