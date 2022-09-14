import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {BankCreditOutputModel} from '../model/bank-credit';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

/**
 *  银行授信新增、修改弹框
 */
@Component({
    selector: 'app-bank-credit-modal',
    templateUrl: './bank-credit-modal.component.html',
    styles: [`
        .required-star::after {
            content: '*';
            color: #ff5500;
        }
    `]
})
export class BankCreditModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    observer: any;
    entry: BankCreditOutputModel = new BankCreditOutputModel;
    pageTitle = '';
    textObj = {text: ''};
    yearSelectItem: Array<{ label: string, value: string }>;

    constructor() {
    }

    ngOnInit() {
        this.yearSelectItem = this.generateYearItem(); // 生成年份
    }

    open(params: any): Observable<any> {
        this.entry = params.value;
        this.pageTitle = params.title;
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    onSubmit() {
        this.entry.creditLimit = this.entry.creditLimit.toString().replace(/,/g, '');
        this.entry.creditUsed = this.entry.creditUsed.toString().replace(/,/g, '');
        this.close({action: 'ok', value: this.entry});
    }

    inputMoney(label, value) {
        // this.entryCache[label] = value;
        this.entry[label] = XnUtils.formatMoney(value);
        const money = parseFloat(this.entry[label].toString().replace(/,/g, ''));
        if (isNaN(money)) { // 不是数字
            this.textObj.text = '<div>请输入正确数字</div>';
        } else { this.textObj.text = ''; }
    }

    // 计算授信额度必须大于使用额度
    calcMoney() {
        if (this.entry.creditUsed && this.entry.creditLimit) {
            const creditLimit = parseFloat(this.entry.creditLimit.toString().replace(/,/g, '')); // 授信额度
            const creditUsed = parseFloat(this.entry.creditUsed.toString().replace(/,/g, '')); // 使用额度
            if (!isNaN(creditLimit) && !isNaN(creditUsed)) {
                if (creditLimit >= creditUsed) { return {bool: true, html: ''}; }
                else { return {bool: false, html: '<div>使用额度不能大于授信额度</div>'}; }
            } else {
                return {bool: false, html: ''};
            }
        }
        return {bool: true, html: ''};
    }

    onCancel() {
        this.close(null);
    }

    close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    // 生成年份-当前年分上二十年
    generateYearItem(): Array<{ label: string, value: string }> {
        const selectItems = [];
        const currentYear = parseInt(new Date().getFullYear().toString(), 0);
        for (let i = currentYear - 20; i <= currentYear; i++) {
            selectItems.push({label: `${i}年`, value: i});
        }
        return XnUtils.distinctArray2(selectItems, 'value').sort((a: any, b: any): any => a.value > b.value);
    }
}
