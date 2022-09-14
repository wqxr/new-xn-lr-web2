import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {XnUtils} from '../../common/xn-utils';
import {XnService} from '../../services/xn.service';
import {CalendarData} from '../../config/calendar';
import {Observable, of} from 'rxjs';
import {PdfViewService} from '../../services/pdf-view.service';

/**
 * 补充商票信息的模态框
 */
@Component({
    templateUrl: './honour-edit-modal.component.html',
    styles: [
            `.flex-row {
            display: flex;
            margin-bottom: 15px;
        }

        .this-title {
            width: 90px;
            text-align: right;
            padding-top: 7px;
        }

        .this-padding {
            padding-left: 10px;
            padding-right: 10px;
        }

        .this-flex-1 {
            flex: 1;
        }

        .this-flex-2 {
            flex: 2;
        }

        .this-flex-3 {
            flex: 3;
        }

        .this-img {
            width: 100%;
            border: none;
        }

        .xn-money-alert {
            color: #8d4bbb;
            font-size: 12px;
        }

        .red {
            color: #e15f63
        }

        .not-invalid {
            border-color: #e15f63;
        }

        .xn-holiday-alert {
            color: #8d4bbb;
            font-size: 12px;
        }

        .pdf-container {
            width: 100%;
            min-height: 100%;
            background: #E6E6E6;
        }

        .this-img {
            width: 60%;
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .this-pdf {
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .img-container {
            width: 100%;
            min-height: 100%;
            text-align: center;
            position: relative;
            background: #E6E6E6;
        }

        .img-wrapper {
            transition: all 0.5s ease-in-out;
        }

        .page {
            float: right;
            vertical-align: middle;
        }

        .edit-content {
            height: calc(100vh - 280px);
            display: flex;
            flex-flow: column;
        }

        .edit-content-flex {
            flex: 1;
            text-align: center;
            overflow: auto;
            background: #E6E6E6;
        }

        .button-group {
            float: right;
            padding: 20px 15px 0 15px;
        }
        `
    ],
    providers: [
        PdfViewService
    ]
})
export class HonourEditModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('moneyInput') moneyInput: ElementRef;
    @ViewChild('moneyAlertRef') moneyAlertRef: ElementRef;
    @ViewChild('dateStartInput') dateStartInput: ElementRef;
    @ViewChild('dateEndInput') dateEndInput: ElementRef;

    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    @ViewChild('factoringEndInput') factoringEndInput: ElementRef;
    @ViewChild('honourMan') honourMan: ElementRef;
    @ViewChild('honourNo') honourNo: ElementRef;

    moneyAlert = '';
    private observer: any;

    errorMsg = '';

    private params: any;

    honourNum = ''; // 商票号码
    honourAmount = ''; // 商票金额
    honourDate = ''; // 出票日期
    dueDate = ''; // 到期日期
    acceptorName = ''; // 商票承兑人
    honourBankNum = ''; // 承兑行行号
    factoringDate = ''; // 保理到期日

    imgSrc: string; // 商票图像
    moneyFormatCheck = false;
    dateStartCheckTemp = false;
    dateEndCheckTemp = false;
    factoringDateTemp = false;
    dateAlert: any;
    dateStartAlert: any;
    dateEndAlert: any;
    degree = 0;
    factoringEndAlert: any;
    holidayAlert: any;
    private currentScale = .6;

    constructor(protected xn: XnService, private pdfViewService: PdfViewService) {
    }

    ngOnInit() {
    }

    /**
     * 打开验证窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.honourNum = params.honourNum;
        this.moneyInput.nativeElement.value = params.honourAmount || '';
        this.honourDate = params.honourDate || '';
        this.dueDate = params.dueDate || '';
        this.acceptorName = params.acceptorName || '';
        this.honourBankNum = params.honourBankNum || '';
        this.factoringDate = params.factoringDate || '';

        // 初始化先判断保理到期日的详细信息
        if (this.factoringDate) {
            XnUtils.computeDay(this, CalendarData);
        }

        // 初始化已经填入的金额和日期
        this.moneyFormatCheck = !!params.honourAmount;
        this.dateStartCheckTemp = !!params.honourDate;
        this.dateEndCheckTemp = !!params.dueDate;
        this.factoringDateTemp = !!params.factoringDate;

        // 显示发票图像
        if (!!params.fileId) {
            this.imgSrc = `/api/attachment/view?key=${params.fileId}`;
        }

        // 将补充商票的按钮除了保理到期日设置为readonly
        const arrReadOnly = [
            this.moneyInput.nativeElement,
            this.dateStartInput.nativeElement,
            this.dateEndInput.nativeElement,
            this.honourMan.nativeElement,
            this.honourNo.nativeElement
        ];
        if (this.params && this.params.onlyEdit === 'factoringDate') {
            for (const row of arrReadOnly) {
                row.readOnly = true;
            }
        } else {
            for (const row of arrReadOnly) {
                row.readOnly = false;
            }
        }

        // 兼容IE，不然一打开的数据是空的，因为存在placeholder，所以会自动触发一次input
        this.onInput();

        this.moneyAlert = '';

        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  文件旋转
     * @param val 旋转方向 left:左转，right:右转
     */
    public rotateImg(val) {
        if (this.innerImg && this.innerImg.nativeElement
            && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement
        ) {
            this.degree = this.pdfViewService.rotateImg(val, this.degree,
                this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement, this.currentScale);
        }
    }


    /**
     *  文件缩放
     * @param params 放大缩小  large:放大，small:缩小
     */
    public scaleImg(params: string) {
        if (this.innerImg && this.innerImg.nativeElement
            && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement
        ) {
            // 缩放图片
            this.currentScale = this.pdfViewService.scaleImg(params,
                this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
        }
    }

    public isValid() {
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
            ;
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }

    public onOk() {

        // 回购模式问题，平台补录商票资料，当录入的保理结束时间 同商票到期日一致或晚于商票到期日后，进行提示："回购模式保理到期日应在商票到期日前"
        if (this.params && this.params.flowId && this.params.flowId === 'financing_platform1') {
            const milliseconds = 12 * 24 * 60 * 60 * 1000;
            if (XnUtils.toDate(this.factoringDate).getTime() >= XnUtils.toDate(this.dueDate).getTime() + milliseconds) {
                this.xn.msgBox.open(false, '回购模式保理到期日应在`商票到期日+12`天前。');
                return;
            }
        }

        // TODO 验证
        this.toValue();

        this.close({
            action: 'ok',
            honourNum: this.honourNum,
            honourAmount: this.honourAmount,
            honourDate: this.honourDate,
            dueDate: this.dueDate,
            factoringDate: this.factoringDate,
            acceptorName: this.acceptorName,
            honourBankNum: this.honourBankNum,
            fileId: this.params.fileId,
        });
    }

    public onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    public onInput() {
        this.moneyFormat(); // 将输入的数据进行money格式化
        this.toValue();
    }

    public moneyFormat() {
        if (this.moneyInput.nativeElement.value && this.moneyInput.nativeElement.value !== '') {
            let num = this.moneyInput.nativeElement.value;
            num = XnUtils.formatMoney(num);
            this.moneyInput.nativeElement.value = num;
        }
    }

    private toValue() {
        if (!this.moneyInput.nativeElement.value) {
            this.honourAmount = '';
        } else {
            let tempValue = this.moneyInput.nativeElement.value.replace(/,/g, '');
            tempValue = parseFloat(tempValue).toFixed(2);
            this.honourAmount = tempValue.toString();
        }
        this.moneyAlert = XnUtils.convertCurrency(this.moneyInput.nativeElement.value)[1];
        if (XnUtils.convertCurrency(this.moneyInput.nativeElement.value)[0] === false) {
            this.moneyFormatCheck = false;
            $(this.moneyAlertRef.nativeElement).addClass('red');
            $(this.moneyInput.nativeElement).addClass('not-invalid');
        } else {
            this.moneyFormatCheck = true;
            $(this.moneyAlertRef.nativeElement).removeClass('red');
            $(this.moneyInput.nativeElement).removeClass('not-invalid');
        }
    }

    public onDateStartInput() {
        this.dateStartCheck(this.honourDate);
    }

    public dateStartCheck(date) {
        this.dateStartCheckTemp = XnUtils.toDateFromString(date);
        if (!this.dateStartCheckTemp) {
            $(this.dateStartInput.nativeElement).addClass('not-invalid');
            this.dateStartAlert = '很抱歉，您需要输入格式为20170731的日期';
        } else {
            $(this.dateStartInput.nativeElement).removeClass('not-invalid');
            this.dateStartAlert = '';
        }
    }

    public onDateEndInput() {
        this.dateEndCheck(this.dueDate);
    }

    public dateEndCheck(date) {
        this.dateEndCheckTemp = XnUtils.toDateFromString(date);
        if (!this.dateEndCheckTemp) {
            $(this.dateEndInput.nativeElement).addClass('not-invalid');
            this.dateEndAlert = '很抱歉，您需要输入格式为20170731的日期';
        } else {
            $(this.dateEndInput.nativeElement).removeClass('not-invalid');
            this.dateEndAlert = '';
        }
    }

    public onFactoringEndInput() {
        this.FactoringEndCheck(this.factoringDate);
        // this.getDayRest(this.factoringDate); //查询是否是节假日
    }

    public FactoringEndCheck(date) {
        this.factoringDateTemp = XnUtils.toDateFromString(date);
        if (!this.factoringDateTemp) {
            $(this.factoringEndInput.nativeElement).addClass('not-invalid');
            this.factoringEndAlert = '很抱歉，您需要输入格式为20170731的日期';
        } else {
            $(this.factoringEndInput.nativeElement).removeClass('not-invalid');
            this.factoringEndAlert = '';
        }
    }

    public computeDay() {
        XnUtils.computeDay(this, CalendarData);
    }
}
