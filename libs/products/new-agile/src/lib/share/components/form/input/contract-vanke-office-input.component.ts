import { Component, ElementRef, Input, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { VankeViewContractModalComponent } from 'libs/shared/src/lib/public/modal/contract-vanke-mfile-detail.modal';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    templateUrl: './contract-vanke-office-input.component.html'
})
@DynamicForm({ type: 'contract-office', formModule: 'new-agile-input' })
export class ContractOfficeInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    alert = '';
    public ctrl: AbstractControl;
    public ctrl1: AbstractControl;

    public xnOptions: XnInputOptions;
    public mainFlowId = '';
    public items: any[] = [];

    // 供应商
    public debtUnit = '';
    // 项目公司
    public projectCompany = '';
    public payablesCtrl: AbstractControl; // 应收帐款金额

    public constructor(private xn: XnService,
                       private er: ElementRef,
                       private vcr: ViewContainerRef,
                       private cdr: ChangeDetectorRef,
                       private localStorageService: LocalStorageService) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl1 = this.form.get('performanceFile');
        this.payablesCtrl = this.form.get('payables');
        if (this.ctrl1 !== null) {
            this.ctrl1.valueChanges.subscribe(x => {
                if (x !== '') {
                    if (JSON.parse(x)[0].files.contractNum !== undefined) {
                        const imgs = this.items[0].files.img;
                        this.items = JSON.parse(x);
                        this.items[0].files.img = imgs;
                        this.toValue();
                        this.cdr.markForCheck();
                    }
                }
            });
        }
        this.debtUnit = !!this.form.get('debtUnit') ? this.form.get('debtUnit').value : '';
        this.projectCompany = !!this.form.get('projectCompany') ? this.form.get('projectCompany').value : '';
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }

    public onEdit(item) {
        // 该交易总部公司
        const headquarters = this.localStorageService.caCheMap.get('headquarters');
        // 合同编号
        const payablesValue = this.payablesCtrl.value ? this.payablesCtrl.value.toString().replace(/,/g, '') : '';
        const checkers = [
            {
                title: '合同编号',
                checkerId: 'contractNum',
                type: 'text',
                required: true,
                value: item.files.contractNum,
                number: 2
            },
            {
                title: '合同名称',
                checkerId: 'contractName',
                required: true,
                type: 'text',
                value: item.files.contractName || '',
                number: 3
            },
            {
                title: '合同金额',
                checkerId: 'contractAmount',
                type: 'money',
                required: true,
                value: item.files.contractAmount,
                number: 6
            },
            {
                title: '付款比例',
                checkerId: 'payRate',
                type: 'text',
                required: true,
                value: item.files.payRate || '',
                number: 6
            },
            {
                title: '合同类型',
                checkerId: 'contractType',
                type: 'select',
                required: true,
                options: { ref: 'contractType_jban' },
                value: item.files.contractType,
                number: 6
            },
            {
                title: '合同签订时间',
                checkerId: 'contractSignTime',
                required: false,
                type: 'date4',
                value: item.files.contractSignTime || '',
                placeholder: '',
                number: 7
            },
            {
                title: '基础合同甲方名称',
                checkerId: 'contractJia',
                type: 'text',
                required: true,
                value: item.files.contractJia || '',
                number: 6
            },
            {
                title: '基础合同乙方名称',
                checkerId: 'contractYi',
                type: 'text',
                required: true,
                value: item.files.contractYi || '',
                number: 6
            },
            {
                title: '累积确认产值',
                checkerId: 'cumulativelyOutputValue',
                type: 'money',
                required: false,
                value: item.files.cumulativelyOutputValue,
                number: 1
            },
            {
                title: '本次产值金额',
                checkerId: 'percentOutputValue',
                type: 'money',
                required: false,
                value: item.files.percentOutputValue || '',
                number: 6
            },
            {
                title: '本次付款性质',
                checkerId: 'payType',
                type: 'select',
                required: true,
                options: { ref: 'payType' },
                value: item.files.payType || '',
                number: 6
            },
            {
                title: '收款单位',
                checkerId: 'debtUnit',
                required: false,
                type: 'text',
                options: { readonly: true },
                value: item.files.debtUnit || this.debtUnit || '',
                number: 4
            },
            {
                title: '申请付款单位',
                checkerId: 'projectCompany',
                required: false,
                type: 'text',
                options: { readonly: true },
                value: item.files.projectCompany || this.projectCompany || '',
                number: 5
            },
            {
                title: '应付账款金额',
                checkerId: 'payables',
                required: false,
                type: 'money',
                options: { readonly: true },
                value: payablesValue,
                number: 8
            }];
        // 总部公司为 万科 雅居乐时 合同编号不可更改
        if (this.row.flowId === 'financing_supplier18') {
            checkers[0].options = { readonly: true };
        }
        const params = {
            checkers,
            value: item,
            title: '补充合同信息',
            isShow: false,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeViewContractModalComponent
            , params).subscribe((v: any) => {
                if (v.action === 'ok') {
                    this.items[0].files.contractType = v.contractType.contractType;
                    this.items[0].files.contractName = v.contractType.contractName;
                    this.items[0].files.contractAmount = v.contractType.contractAmount;
                    this.items[0].files.contractNum = v.contractType.contractNum;
                    this.items[0].files.contractSignTime = v.contractType.contractSignTime;
                    this.items[0].files.payRate = v.contractType.payRate;
                    this.items[0].files.contractJia = v.contractType.contractJia;
                    this.items[0].files.contractYi = v.contractType.contractYi;
                    this.items[0].files.percentOutputValue = v.contractType.percentOutputValue;
                    this.items[0].files.payType = v.contractType.payType;
                    this.items[0].files.cumulativelyOutputValue = v.contractType.cumulativelyOutputValue;
                    this.items[0].files.debtUnit = item.files.debtUnit || this.debtUnit || '',
                        this.items[0].files.projectCompany = item.files.projectCompany || this.projectCompany || '',
                        this.toValue();
                }
            });
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        this.toValue();
    }

    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            const contractTypeBool = [];
            for (let i = 0; i < this.items.length; i++) {
                contractTypeBool.push(!!(this.items[i].files && this.items[i].files.contractType && this.items[i].files.contractName));
            }
            contractTypeBool.indexOf(false) > -1 ? this.ctrl.setValue('') : this.ctrl.setValue(JSON.stringify(this.items));
        }
        this.localStorageService.setCacheValue('contractFile', this.items); // 保存值
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
