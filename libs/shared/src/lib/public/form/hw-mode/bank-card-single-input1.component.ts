import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {HwModeService} from 'libs/shared/src/lib/services/hw-mode.service';
import {BankPublicCommunicateService} from 'libs/shared/src/lib/services/bank-public-communicate.service';
import {OutputModel, SelectItem} from './bank-card-single-input.component';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

/**
 *  银行卡组件，单个三级选项 - 不可编辑
 */
@Component({
    selector: 'app-bank-card-single-input1',
    templateUrl: './bank-card-single-input1.component.html',
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
export class BankCardSingleInput1Component implements OnInit {
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
        this.bankPublicCommunicateService.change.subscribe(x => {
            this.ctrl = this.form.get(this.row.name);
            this.data = x;
            this.ctrl.setValue(this.data);
        });
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
        // if (!!this.ctrl.value) {
        //     this.data = JSON.parse(this.ctrl.value);
        // }
        // this.ctrl.setValue(JSON.stringify(this.data));
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
        this.ctrl.setValue(this.data);
    }

    // 输入账号
    public handleEdit2(e) {
        this.data.accountNumber = e.target.value;
        this.ctrl.setValue(this.data);
    }

    // 输入开户行
    public handleEdit3(e) {
        this.data.bankName = e.target.value;
        this.ctrl.setValue(this.data);
    }

    // 选择自动填充
    public onChange(e) {
        const value = e.target.value;
        const find = this.bankLists.find((x: any) => x.cardCode === value);
        if (find) {
            if (this.row.checkerId === 'capitalBankInfo') {
                this.data.accountName = find.accountHolder;
            }
            this.data.accountNumber = value;
            this.data.bankName = find.bankName;
        } else {
            if (this.row.checkerId === 'capitalBankInfo') {
                this.data.accountName = value;
            }
            this.data.accountNumber = value;
            this.data.bankName = value;
        }
        // 设置值
        this.ctrl.setValue(this.data);
    }

    private calcBool(val: any) {
        if (val !== undefined && val !== null && val !== '') {
            return val;
        }
        return true;
    }

}

// 银行账户信息模型
export class InputModel {
    public accountName?: string | ''; // 户名
    public accountNumber?: string | ''; // 账户
    public bankName?: string | ''; // 开户行
}
