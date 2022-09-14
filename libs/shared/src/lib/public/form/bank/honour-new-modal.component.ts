import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    ModalComponent,
    ModalSize
} from 'libs/shared/src/lib/common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CalendarData } from 'libs/shared/src/lib/config/calendar';

@Component({
    templateUrl: './honour-new-modal.component.html',
    styles: [
        `.flex-row { display: flex; margin-bottom: 15px;}`,
        `.this-title { width: 90px; text-align: right; padding-top: 7px;}`,
        `.this-padding { padding-left: 10px; padding-right: 10px;}`,
        `.this-flex-1 { flex: 1; }`,
        `.this-flex-2 { flex: 2; }`,
        `.this-flex-3 { flex: 3; }`,
        `.this-img { width: 100%; border: none; }`,
        `.xn-money-alert { color: #8d4bbb; font-size: 12px; }`,
        `.red { color: #e15f63 }`,
        `.not-invalid {border-color: #e15f63;}`,
        `.button-rotate { position: absolute;  top: 10px; cursor: pointer; z-index: 10}`,
        `.rotate-left { right: 60px; }`,
        `.rotate-right { right: 10px; } `,
        `.img-container {padding: 0 20px; max-height: calc(100vh - 440px); overflow-x: hidden; text-align: center; position: relative}`,
        `.img-wrapper { transition: all 0.5s ease-in-out; }`,
        `.xn-holiday-alert { color: #8d4bbb; font-size: 12px; }`,
    ]
})
export class BankHonourNewModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('moneyInput') moneyInput: ElementRef;

    @ViewChild('imgContainer') imgContainer: ElementRef;
    @ViewChild('moneyAlertRef') moneyAlertRef: ElementRef;

    @ViewChild('dateStartInput') dateStartInput: ElementRef;
    @ViewChild('dateEndInput') dateEndInput: ElementRef;

    @ViewChild('factoringEndInput') factoringEndInput: ElementRef;
    @ViewChild('honourMan') honourMan: ElementRef;
    @ViewChild('honourNo') honourNo: ElementRef;

    private observer: any;

    mainForm: FormGroup;
    rows: any[] = [];
    degree = 0;

    honourNum = ''; // 商票号码
    honourAmount = ''; // 商票金额
    honourDate = ''; // 出票日期
    dueDate = ''; // 到期日期
    acceptorName = ''; // 商票承兑人
    honourBankNum = ''; // 承兑行行号
    factoringDate = ''; // 保理到期日

    imgSrc: string; // 商票图像

    factoringEndAlert: any;
    holidayAlert: any;
    moneyAlert: any;
    dateStartAlert: any;
    dateEndAlert: any;

    moneyFormatCheck = false;
    dateCheckTemp = false;
    dateStartCheckTemp = false;
    dateEndCheckTemp = false;
    FactoringEndCheckTemp = false;
    factoringDateTemp = false;

    constructor() {}

    ngOnInit() {
        this.rows = [
            {
                title: '商票图片',
                checkerId: 'honourImg',
                type: 'file',
                options: {
                    filename: '商票图片',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500'
                }
            }
        ];

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);

        this.mainForm.valueChanges.subscribe(v => {
            // 显示商票图片
            const fileId = v.honourImg && JSON.parse(v.honourImg).fileId;
            this.imgSrc = fileId ? `/api/attachment/view?key=${fileId}` : '';
        });

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    open(): Observable<any> {
        this.mainForm.valueChanges.subscribe(v => {
            // 显示商票图片
            const fileId = v.honourImg && JSON.parse(v.honourImg).fileId;
            this.imgSrc = fileId ? `/api/attachment/view?key=${fileId}` : '';
        });

        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onSubmit() {
        const v = this.mainForm.value;
        const img = JSON.parse(v.honourImg);
        this.close({
            honourNum: this.honourNum.replace(/\s+/g, ''),
            acceptorName: this.acceptorName,
            honourDate: this.honourDate,
            dueDate: this.dueDate,
            honourAmount: this.honourAmount,
            honourBankNum: this.honourBankNum,
            fileId: img.fileId,
            fileName: img.fileName,
            factoringDate: this.factoringDate
        });
    }

    onCancel() {
        this.close(null);
    }

    rotateImg(direction: string) {
        this.degree = XnUtils.rotateImg(
            direction,
            this.degree,
            this.innerImg.nativeElement,
            this.outerImg.nativeElement,
            this.imgContainer.nativeElement
        );
    }

    onInput() {
        // console.log(event);
        // this.input.nativeElement.setCustomValidity("wrong");
        // console.log(this.input.nativeElement.validationMessage);
        // event.srcElement.validity.valid = false;
        this.moneyFormat(); // 将输入的数据进行money格式化
        this.toValue();
    }

    isValid() {
        return !!this.honourBankNum
            && !!this.acceptorName
            && !!this.dueDate
            && !!this.honourDate
            // && !!this.honourAmount
            && !!this.honourNum
            && this.moneyFormatCheck
            && this.dateStartCheckTemp
            && this.dateEndCheckTemp
            && this.factoringDateTemp
            && this.imgSrc
            ;
    }

    moneyFormat() {
        let num = this.moneyInput.nativeElement.value;
        num = XnUtils.formatMoney(num);
        this.moneyInput.nativeElement.value = num;
    }

    toValue() {
        if (!this.moneyInput.nativeElement.value) {
            this.honourAmount = '';
            // console.log("moneyNone")
        } else {
            // console.log("moneyOk")
            let tempValue = this.moneyInput.nativeElement.value.replace(
                /,/g,
                ''
            );
            tempValue = parseFloat(tempValue).toFixed(2);
            this.honourAmount = tempValue.toString();
            // console.log("toValue: " + this.input.nativeElement.value.replace(/,/g, ""));
        }
        this.moneyAlert = XnUtils.convertCurrency(
            this.moneyInput.nativeElement.value
        )[1];
        if (
            XnUtils.convertCurrency(this.moneyInput.nativeElement.value)[0] ===
            false
        ) {
            this.moneyFormatCheck = false;
            $(this.moneyAlertRef.nativeElement).addClass('red');
            $(this.moneyInput.nativeElement).addClass('not-invalid');
        } else {
            this.moneyFormatCheck = true;
            $(this.moneyAlertRef.nativeElement).removeClass('red');
            $(this.moneyInput.nativeElement).removeClass('not-invalid');
        }
    }

    onDateStartInput() {
        this.dateStartCheck(this.honourDate);
    }

    dateStartCheck(date) {
        this.dateStartCheckTemp = XnUtils.toDateFromString(date);
        if (!this.dateStartCheckTemp) {
            $(this.dateStartInput.nativeElement).addClass('not-invalid');
            this.dateStartAlert = '很抱歉，您需要输入格式为20170731的日期';
        } else {
            $(this.dateStartInput.nativeElement).removeClass('not-invalid');
            this.dateStartAlert = '';
        }
    }

    onDateEndInput() {
        this.dateEndCheck(this.dueDate);
    }

    dateEndCheck(date) {
        this.dateEndCheckTemp = XnUtils.toDateFromString(date);
        if (!this.dateEndCheckTemp) {
            $(this.dateEndInput.nativeElement).addClass('not-invalid');
            this.dateEndAlert = '很抱歉，您需要输入格式为20170731的日期';
        } else {
            $(this.dateEndInput.nativeElement).removeClass('not-invalid');
            this.dateEndAlert = '';
        }
    }

    onFactoringEndInput() {
        this.FactoringEndCheck(this.factoringDate);
        // this.getDayRest(this.factoringDate); //查询是否是节假日
    }

    FactoringEndCheck(date) {
        this.factoringDateTemp = XnUtils.toDateFromString(date);
        if (!this.factoringDateTemp) {
            $(this.factoringEndInput.nativeElement).addClass('not-invalid');
            this.factoringEndAlert = '很抱歉，您需要输入格式为20170731的日期';
        } else {
            $(this.factoringEndInput.nativeElement).removeClass('not-invalid');
            this.factoringEndAlert = '';
        }
    }

    computeDay() {
        XnUtils.computeDay(this, CalendarData);
    }
}
