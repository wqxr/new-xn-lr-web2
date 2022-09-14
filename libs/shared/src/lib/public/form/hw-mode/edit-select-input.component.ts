import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {XnInputOptions} from '../xn-input.options';
import {BankCardCommunicateService} from 'libs/shared/src/lib/services/bank-card-communicate.service';
import {HwModeService} from 'libs/shared/src/lib/services/hw-mode.service';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

/**
 *  可编辑的选项框
 */
@Component({
    selector: 'app-hw-mode-edit-select-input',
    templateUrl: `./edit-select-input.component.html`,
    styles: [`
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
    `]
})
export class EditSelectInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    // 手动输入的值
    public handleInputValue = '';
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public alert = '';
    public myClass = '';
    // 银行卡列表
    public bankCardItem: any[] = [];
    public bankLists: any[] = [];

    public constructor(private er: ElementRef,
                       private bankCardCommunicateService: BankCardCommunicateService,
                       private xn: XnService,
                       private hwModeService: HwModeService) {
    }

    public ngOnInit() {
        this.hwModeService.getData().subscribe(x => {
            this.bankLists = x;
            this.bankCardItem = this.hwModeService.formatData(this.bankLists);
        });
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
    }

    // 选择
    public onChange(event: any) {
        const find = this.bankLists.find((x: any) => x.cardCode === event.target.value);
        if (find) {
            find.step = this.row.checkerId;
            this.bankCardCommunicateService.change.emit(find);
            this.handleInputValue = this.cardFormat(event.target.value);
            this.ctrl.setValue(event.target.value);
            this.calcAlertClass();
        }
    }

    // 手动输入
    public handleInput1(event: any) {
        this.handleInputValue = this.cardFormat(event.target.value);
        this.ctrl.setValue(this.cardFormat(event.target.value));
        this.calcAlertClass();
    }

    public calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private cardFormat(value) {
        return value.replace(/\s/g, '').replace(/\D/g, '').replace(/(\d{4})/g, '$1 ');
    }
}
