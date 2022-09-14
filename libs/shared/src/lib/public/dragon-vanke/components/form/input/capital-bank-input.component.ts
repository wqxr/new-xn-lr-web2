import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { BankPublicCommunicateService } from '../../../../../services/bank-public-communicate.service';
import { XnUtils } from '../../../../../common/xn-utils';


/**
 *  银行卡组件，单个三级选项
 */
@Component({
    selector: 'app-bank-card-single-input',
    templateUrl: './capital-bank-input.component.html',
    styles: [`
        .title {
            padding: 10px 0;
            font-weight: bold;
        }

        .title-text:after {
            content: '*';
            color: #df0000;
        }

        .select-editable {
            position: relative;
        }

        .select-editable select {
            z-index: 1000;
        }

        .select-editable input {
            position: absolute;
            top: 2px;
            left: 1px;
            width: 80%;
            height: 80%;
            border: none;
        }

        .form-group {
            height: 30px;
        }
    `]
})
@DynamicForm({ type: 'bank-input', formModule: 'dragon-input' })
export class CapitalBankCardSingleInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public bankLists: OutputModel[] = [];
    public bankCardItem: SelectItem[] = [];
    // 提交数据
    public data: InputModel = new InputModel();
    public ctrl: AbstractControl;
    public accountNameBool: boolean;
    public accountNumBool: boolean;
    public bankNameBool: boolean;

    public constructor(private xn: XnService,
                       private hwModeService: HwModeService,
                       private bankPublicCommunicateService: BankPublicCommunicateService) {
        // this.bankPublicCommunicateService.change.subscribe(x => {
        //     this.ctrl = this.form.get(this.row.name);
        //     this.data = x;
        //     this.data.accountNumber = this.data.accountNumber.replace(/\s/g, '').replace(/\D/g, '');
        //     this.ctrl.setValue(this.data);
        // });
    }

    /**
     *  如果后台获取的输入项是否可编辑
     */
    public ngOnInit() {
        const options = XnUtils.parseObject(this.row.options, []);
        this.accountNameBool = this.calcBool(options.accountName);
        this.accountNumBool = this.calcBool(options.accountNumber);
        this.bankNameBool = this.calcBool(options.bankName);
        this.ctrl = this.form.get(this.row.name);
        if (!!this.ctrl.value) {
            this.data = JSON.parse(this.ctrl.value);
        }
        this.toValue();
        this.initData();
    }

    /**
     *  加载银行卡列表
     */
    private initData() {
        this.hwModeService.getData().subscribe(x => {
            this.bankLists = x;
            this.bankCardItem = this.hwModeService.formatData(this.bankLists);
        });
    }

    // 输入户名
    public handleEdit1(e) {
        if (!this.accountNameBool) {
            return;
        }
        this.data.accountName = e.target.value;
        // this.ctrl.setValue(this.data);
        this.toValue();
    }

    // 输入账号
    public handleEdit2(e) {
        this.data.accountNumber = e.target.value;
        // this.ctrl.setValue(this.data);
        this.toValue();
    }

    // 输入开户行
    public handleEdit3(e) {
        this.data.bankName = e.target.value;
        // this.ctrl.setValue(this.data);
        this.toValue();
    }

    // // 选择自动填充
    // public onChange(e) {
    //     console.log('bank card single change :', e.target.value);
    //     const value = e.target.value;
    //     const find = this.bankLists.find((x: any) => x.cardCode === value);
    //     if (find) {
    //         if (this.row.checkerId === 'factoringBankInfo') {
    //             this.data.accountName = find.accountName;
    //         }
    //         this.data.accountNumber = value;
    //         this.data.bankName = find.bankName;
    //     } else {
    //         if (this.row.checkerId === 'factoringBankInfo') {
    //             this.data.accountName = value;
    //         }
    //         this.data.accountNumber = value;
    //         this.data.bankName = value;
    //     }
    //     // 设置值
    //     this.toValue();
    //     // this.ctrl.setValue(JSON.stringify(this.data));
    // }

    // 计算输入框状态
    private calcBool(val: any) {
        if (val !== undefined && val !== null && val !== '') {
            return val;
        }
        return true;
    }

    private toValue() {
        if (!!this.row.required && this.row.required === true) {
            if (this.data.bankName !== '' && this.data.accountNumber !== '' && this.data.bankName !== '') {
                this.ctrl.setValue(JSON.stringify(this.data));
            } else {
                this.ctrl.setValue('');
            }
        } else {
            this.ctrl.setValue(this.data);
        }
    }
}

// 银行账户信息模型
export class InputModel {
    public accountName = ''; // 户名
    public accountNumber = ''; // 账户
    public bankName = ''; // 开户行
}

// 银行账号信息输出数据
export class OutputModel {
    public accountName: string; // 账户名
    public appId: string;
    public bankCode: string; // 银行代码
    public bankName: string; // 开户行
    public cardCode: string; // 卡号
}

// 银行信息转换数据类型
export class SelectItem {
    public label: string;
    public value: string;
}
