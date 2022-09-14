import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnUtils} from '../../common/xn-utils';
import {FormGroup} from '@angular/forms';
import {LocalStorageService} from '../../services/local-storage.service';
import {OutputModel} from './contract-edit-modal.component';
import {XnService} from '../../services/xn.service';
import {PdfViewService} from '../../services/pdf-view.service';

@Component({
    templateUrl: './contract-view1-modal.component.html',
    styleUrls: ['./contract-view-modal.component.css'],
    providers: [
        PdfViewService
    ]
})
export class ContractView1ModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('moneyInput') moneyInput: ElementRef;
    @ViewChild('dateInput') dateInput: ElementRef;
    @ViewChild('moneyAlertRef') moneyAlertRef: ElementRef;
    @ViewChild('dateAlertRef') dateAlertRef: ElementRef;

    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;

    contractTitle = '';
    contractNum = '';
    contractAmount = '';
    contractDate = '';
    contractBuyer = '';
    moneyAlert = '';
    contractLimitDate = '';

    private observer: any;
    params: any;

    errorMsg = '';

    fileSrc;
    pageSize = 1;
    total = 0;
    fileType = '';
    moneyFormatCheck = false;
    dateCheckTemp = false;
    dateAlert: any;
    degree = 0;
    deal = '0';
    property = '';
    unit = '';
    member = '';
    specifications = '';
    sort = '';
    supplier = '';
    debtReceivableType = '';
    items: any = [];

    info = '';
    asset = false;
    map = false;
    public bankInfo: OutputModel = new OutputModel();
    private currentScale = .6;

    constructor(private localStorageService: LocalStorageService,
                private xn: XnService,
                private pdfViewService: PdfViewService) {
    }

    ngOnInit() {
    }

    /**
     * 打开查看窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.xn.api.post('/yb/exam/exam/get_org_info', {mainFlowId: this.localStorageService.caCheValue.mainFlowId})
            .subscribe((bankInfo) => {
                if (bankInfo && bankInfo.data && bankInfo.data.accountInfo) {
                    this.bankInfo = JSON.parse(bankInfo.data.accountInfo);
                }
            });
        this.params = params;

        // 数字资产进行disabled
        this.asset = params && params.asset === true || false;

        this.items = params.items || [];
        this.supplier = params.supplier || '';
        this.contractTitle = params.contractTitle || '';
        this.contractNum = params.contractNum || '';
        this.contractAmount = params.contractAmount || '';
        this.moneyInput.nativeElement.value = params.contractAmount || '';
        this.debtReceivableType = params.debtReceivableType || '';
        this.contractLimitDate = params.contractLimitDate || '';

        // 补录客户地图
        this.map = params && params.map === true || false;

        this.moneyFormat();
        if (this.moneyInput.nativeElement.value !== '') {
            this.moneyFormatCheck = true;
        } else {
            this.moneyFormatCheck = false;
        }

        this.contractDate = params.contractDate || '';
        if (this.contractDate !== '') {
            this.dateCheckTemp = true;
        } else {
            this.dateCheckTemp = false;
        }

        this.contractBuyer = params.contractBuyer || '';

        this.total = params.files.length;
        if (params.files && params.files.length > 0) {
            this.onPage(1);
        }

        this.toValue();

        this.moneyAlert = '';

        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    isValid() {
        return !!this.contractBuyer
            && !!this.contractDate
            && !!this.contractAmount
            && !!this.contractNum
            && !!this.contractTitle
            && this.moneyFormatCheck
            && this.dateCheckTemp
            ;
    }

    onPage(e) {
        if (typeof e !== 'number') {
            return;
        }
        const file = this.params.files[e - 1];
        this.fileType = (file.fileId.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';

        if (this.fileType === 'img') {
            this.fileSrc = `/api/attachment/view?key=${file.fileId}`;
        } else {
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(`/api/attachment/view?key=${file.fileId}`);
            }, 0);
        }
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }

    public handleCancel() {
        this.close({
            action: 'cancel'
        });
    }

    public onInput() {
        this.moneyFormat(); // 将输入的数据进行money格式化
        this.toValue();
    }

    public moneyFormat() {
        let num = this.moneyInput.nativeElement.value;
        num = XnUtils.formatMoney(num);
        this.moneyInput.nativeElement.value = num;
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

    private toValue() {
        if (!this.moneyInput.nativeElement.value) {
            this.contractAmount = '';
        } else {
            let tempValue = this.moneyInput.nativeElement.value.replace(/,/g, '');
            tempValue = parseFloat(tempValue).toFixed(2);
            this.contractAmount = tempValue.toString();
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
}
