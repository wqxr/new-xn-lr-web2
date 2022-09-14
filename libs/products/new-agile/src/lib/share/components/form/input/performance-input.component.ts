import { Component, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { VankeViewContractModalComponent } from 'libs/shared/src/lib/public/modal/contract-vanke-mfile-detail.modal';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

@Component({
    templateUrl: './performance-input.component.html',
    styles: [`
        .span-line {
            line-height: 20px;
        }
    `]
})
@DynamicForm({ type: 'performance', formModule: 'new-agile-input' })
export class PerformanceInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public alert = '';
    public ctrl: AbstractControl;
    public payablesCtrl: AbstractControl; // 应收帐款金额
    public headquartersCtrl: AbstractControl; // 总部公司
    public xnOptions: XnInputOptions;
    public items: any[] = [];
    public ctrl1: AbstractControl;
    // 供应商
    public debtUnit = '';
    // 项目公司
    public projectCompany = '';
    public constructor(private xn: XnService,
                       private er: ElementRef,
                       private vcr: ViewContainerRef,
                       private localStorageService: LocalStorageService) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.payablesCtrl = this.form.get('payables');
        this.headquartersCtrl = this.form.get('headquarters');
        this.fromValue();
        this.debtUnit = !!this.form.get('debtUnit') ? this.form.get('debtUnit').value : '';
        this.projectCompany = !!this.form.get('projectCompany') ? this.form.get('projectCompany').value : '';
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     *  补充履约证明信息
     * @param paramFile
     */
    public onEdit(paramFile) {
        // 合同信息
        const contractValue = this.localStorageService.caCheMap.get('contractFile');
        // 应收账款金额
        const payablesValue = this.payablesCtrl.value ? this.payablesCtrl.value.toString().replace(/,/g, '') : '';
        // 合同编号
        const checkers = [
            {
                title: '合同名称',
                checkerId: 'contractName',
                required: false,
                type: 'text',
                value: contractValue && contractValue.length ? contractValue[0].files.contractName : '',
                number: 3
            },
            {
                title: '合同编号',
                checkerId: 'contractNum',
                type: 'text',
                required: false,
                value: contractValue && contractValue.length ? contractValue[0].files.contractNum : '',
                number: 2
            },
            {
                title: '合同金额',
                checkerId: 'contractAmount',
                type: 'money',
                required: false,
                value: contractValue && contractValue.length ? contractValue[0].files.contractAmount : '',
                number: 6
            },
            {
                title: '付款比例',
                checkerId: 'payRate',
                type: 'text',
                required: false,
                value: contractValue && contractValue.length ? contractValue[0].files.payRate : '',
                number: 6
            },
            {
                title: '合同类型',
                checkerId: 'contractType',
                type: 'select',
                required: false,
                options: { ref: 'contractType_jban' },
                value: contractValue && contractValue.length ? contractValue[0].files.contractType : '',
                number: 6
            },
            {
                title: '合同签订时间',
                checkerId: 'contractSignTime',
                required: false,
                type: 'date4',
                validators: {},
                value: contractValue && contractValue.length ? contractValue[0].files.contractSignTime : '',
                number: 7
            },
            {
                title: '基础合同甲方名称',
                checkerId: 'contractJia',
                type: 'text',
                required: false,
                value: contractValue && contractValue.length ? contractValue[0].files.contractJia : '',
                number: 6
            },
            {
                title: '基础合同乙方名称',
                checkerId: 'contractYi',
                type: 'text',
                required: false,
                value: contractValue && contractValue.length ? contractValue[0].files.contractYi : '',
                number: 6
            },
            {
                title: '累积确认产值',
                checkerId: 'cumulativelyOutputValue',
                type: 'money',
                required: false,
                value: paramFile.files.cumulativelyOutputValue || contractValue[0].files.cumulativelyOutputValue || '',
                number: 1
            },
            {
                title: '本次产值金额',
                checkerId: 'percentOutputValue',
                type: 'money',
                required: true,
                value: contractValue && contractValue.length ? contractValue[0].files.percentOutputValue : '',
                number: 6
            },
            {
                title: '本次付款性质',
                checkerId: 'payType',
                type: 'select',
                options: { ref: 'payType' },
                required: true,
                value: contractValue && contractValue.length ? contractValue[0].files.payType : '',
                number: 6
            },
            {
                title: '收款单位',
                checkerId: 'debtUnit',
                options: { readonly: true },
                required: false,
                type: 'text',
                value: contractValue[0].files.debtUnit || this.debtUnit || '',
                number: 4
            },
            {
                title: '申请付款单位',
                checkerId: 'projectCompany',
                required: false,
                options: { readonly: true },
                type: 'text',
                value: contractValue[0].files.projectCompany || this.projectCompany || '',
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
            },
        ];
        const params = {
            checkers,
            value: paramFile,
            title: '补充履约证明信息',
            isShow: false,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeViewContractModalComponent
            , params).subscribe((v: any) => {
                if (v.action === 'ok') {
                    this.items[0].files.cumulativelyOutputValue = v.contractType.cumulativelyOutputValue;
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
                    this.toValue();
                }
            });
    }

    /**
     *  初始化默认值，履约证明文件从数据库重新拉去[仅当总部公司为雅居乐时]
     */
    private fromValue() {
        if (this.headquartersCtrl.value && this.headquartersCtrl.value === HeadquartersTypeEnum[4]) {
            this.xn.api.post('/custom/vanke_v5/project/get_per_file', { mainFlowId: this.svrConfig.record.mainFlowId })
                .subscribe(res => {
                    if (res.data && res.data.data) {
                        const values = XnUtils.parseObject(res.data.data, []);
                        this.calcValue(values);
                    }
                }, () => {
                }, () => {
                    this.toValue();
                });
        } else {
            const values = XnUtils.parseObject(this.ctrl.value, []);
            this.calcValue(values);
            this.toValue();
        }
    }

    /**
     *  格式化数据
     * @param paramValue
     */
    private calcValue(paramValue: Array<any>): void {
        if (!paramValue.length) {
            return;
        }
        if (paramValue[0].hasOwnProperty('files')) {
            this.items = paramValue;
        } else {
            const item = {
                files: {
                    cumulativelyOutputValue: '',
                    img: paramValue
                }
            };
            this.items.push(item);
        }
    }

    /**
     * 保存修改值并格式化
     */
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.items));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
