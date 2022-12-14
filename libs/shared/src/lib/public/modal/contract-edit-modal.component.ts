import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {XnService} from '../../services/xn.service';
import {FormGroup, AbstractControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {XnUtils} from '../../common/xn-utils';
import {XnInputOptions} from '../form/xn-input.options';
import {XnFormUtils} from '../../common/xn-form-utils';
import {PublicCommunicateService} from '../../services/public-communicate.service';
import {isNullOrUndefined} from 'util';
import {PdfViewService} from '../../services/pdf-view.service';

@Component({
    templateUrl: './contract-edit-modal.component.html',
    styleUrls: ['./contract-view-modal.component.css'],
    providers: [
        PdfViewService
    ]
})
export class ContractEditModalComponent {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('moneyInput') moneyInput: ElementRef;
    @ViewChild('dateInput') dateInput: ElementRef;
    @ViewChild('moneyAlertRef') moneyAlertRef: ElementRef;
    @ViewChild('dateAlertRef') dateAlertRef: ElementRef;

    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    @Input() form: FormGroup;
    @Input() row: any;
    supplierChange: AbstractControl;
    numberChange: AbstractControl;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    contractTitle = '';
    contractNum = '';
    contractAmount = '';
    contractDate = '';
    contractBuyer = '';
    moneyAlert = '';


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
    dealunit = '';
    specifications = '';
    sort = 'manage';
    supplier = '';
    items: any = [];
    info = '';
    supplierInit = '';
    asset = false;
    map = false;
    itemsAsset: any = [];
    allFiles: any = [];
    shows: any = [];
    mainForm: FormGroup;
    formValid = false;

    // ???????????????
    commodity: any;
    // ????????????????????????
    public commodityDispaly: boolean;

    public newMap = new Map();

    public commodityTypeCache;
    // ????????????
    public business: any;
    public commodityTypelist: any;
    private currentScale = .6;

    constructor(private xn: XnService,
                private er: ElementRef,
                private publicCommunicateService: PublicCommunicateService,
                private pdfViewService: PdfViewService) {
        // ???????????????????????????????????????
        this.publicCommunicateService.change.subscribe(x => {
                this.commodityDispaly = x === '??????';
                if (!this.commodityDispaly) {
                    //
                    this.shows = this.shows.filter(item => item.title !== '??????');
                } else {
                    this.shows = [
                        {
                            title: '????????????',
                            checkerId: 'appName',
                            required: false, type: 'text',
                            validators: {insName: true, display: false},
                            value: this.params.appName
                        },
                        {
                            title: '????????????',
                            checkerId: 'orgType',
                            required: false, type: 'select',
                            options: {ref: 'orgType', display: false},
                            value: this.params.orgType
                        },
                        {
                            title: '??????',
                            checkerId: 'orgIndustry',
                            required: false,
                            type: 'dselect',
                            options: {ref: 'orgIndustry', display: false},
                            value: this.params.orgIndustry
                        },
                        {
                            title: '????????????',
                            checkerId: 'orgCity',
                            required: false,
                            type: 'dselect',
                            options: {ref: 'chinaCity', display: false},
                            value: this.params.orgCity
                        }, {
                            title: '??????????????????',
                            checkerId: 'debtReceivableType',
                            required: true,
                            type: 'select',
                            options: {ref: 'debtReceivableType', display: true},
                            value: this.params.debtReceivableType
                        }, {
                            title: '??????',
                            checkerId: 'commodity',
                            required: true,
                            // type: 'dselect',
                            type: 'enter-select',
                            options: {ref: this.commodityTypelist, display: true},
                            value: this.params.commodity,
                        }
                    ];
                    XnFormUtils.buildSelectOptions(this.shows);
                    this.buildChecker(this.shows);
                }
            }
        );
    }

    /**
     * ??????????????????
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.xn.api.post('/tool/commodity_type', {}).subscribe((busInfo) => {
            const business = busInfo.data;
            const commodityType = this.buildCommodityType(business);
            // ??????????????????
            this.commodityTypelist = commodityType;
            this.buildShow(commodityType, params);
        });
        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    buildShow(commodityType, params) {
        this.params = params;

        // ??????????????????disabled
        this.asset = params && params.asset === true || false;

        this.allFiles = params && params.allFiles;
        this.items = params.items || [];
        this.itemsAsset = this.asset === true ? params && params.itemsAsset || [] : [];

        // ??????????????????
        this.map = params && params.map === true || false;

        this.supplier = params.supplier || '';
        this.contractTitle = params.contractTitle || '';
        this.contractNum = params.contractNum || '';
        this.contractAmount = params.contractAmount || '';
        this.moneyInput.nativeElement.value = params.contractAmount || '';
        this.supplierInit = params.supplierInit || '';

        if (params.supplierInit && params.supplierInit !== '') {
            this.supplier = params.supplierInit;
        }

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

        // ??????????????????
        // if (this.map === true) {
        this.shows = [];

        this.shows = [
            {
                title: '????????????',
                checkerId: 'appName',
                required: false, type: 'text',
                validators: {insName: true},
                value: this.params.appName
            },
            {
                title: '????????????',
                checkerId: 'orgType',
                required: false, type: 'select',
                options: {ref: 'orgType'},
                value: this.params.orgType
            },
            {
                title: '??????',
                checkerId: 'orgIndustry',
                required: false,
                type: 'dselect',
                options: {ref: 'orgIndustry'},
                value: this.params.orgIndustry
            },
            {
                title: '????????????',
                checkerId: 'orgCity',
                required: false,
                type: 'dselect',
                options: {ref: 'chinaCity'},
                value: this.params.orgCity
            }, {
                title: '??????????????????',
                checkerId: 'debtReceivableType',
                required: true,
                type: 'select',
                options: {ref: 'debtReceivableType', display: true},
                value: this.params.debtReceivableType
            }, {
                title: '??????',
                checkerId: 'commodity',
                required: true,
                // type: 'dselect',
                type: 'enter-select',
                options: {ref: this.commodityTypelist, display: true},
                value: this.params.commodity,
            }
        ];
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        this.mainForm.valueChanges.subscribe((v) => {
            this.formValid = this.mainForm.valid;
        });

        this.formValid = this.mainForm.valid;
    }

    /**
     *  ????????????
     * @param val ???????????? left:?????????right:??????
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
     *  ????????????
     * @param params ????????????  large:?????????small:??????
     */
    public scaleImg(params: string) {
        if (this.innerImg && this.innerImg.nativeElement
            && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement
        ) {
            // ????????????
            this.currentScale = this.pdfViewService.scaleImg(params,
                this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
        }
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // commodity????????????
    isValid() {
        if (this.map === true) {
            return this.formValid;
        }

        // ????????????this.mainForm.value???????????????????????????????????????????????????
        // ???mainForm??????value???
        if (this.mainForm && this.mainForm.value) {
            for (const key in this.mainForm.value) {
                if (this.mainForm.value.hasOwnProperty(key)) {
                    this.newMap.set(key, this.mainForm.value[key]);
                }
            }
            if (this.newMap.get('commodity') === '') {
                return this.formValid;
            }
            if (this.newMap.get('debtReceivableType') === '') {
                return this.formValid;
            }
            this.newMap.delete('commodity');
            this.newMap.delete('debtReceivableType');
            for (const item of Array.from(this.newMap.values())) {
                if (item !== '') {
                    return this.formValid;
                }
            }
        }

        return !!this.contractBuyer
            && !!this.contractDate
            && !!this.contractAmount
            && !!this.contractNum
            && !!this.contractTitle
            && !!this.supplier
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
                $('iframe.this-pdf').prop('src', `/api/attachment/view?key=${file.fileId}`);
            }, 0);
        }
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }

    public onOk() {
        if (this.supplierInit !== '') {
            if (this.supplierInit !== this.supplier) {
                this.xn.msgBox.open(false, '?????????????????????????????????????????????');
                return;
            }
        }
        this.params.contractTitle = this.contractTitle;
        this.params.contractNum = this.contractNum;
        this.params.contractAmount = this.contractAmount;
        this.params.contractDate = this.contractDate;
        this.params.contractBuyer = this.contractBuyer;

        // if (this.map === true) {
        this.params.appName = this.mainForm.value.appName;
        this.params.orgType = this.mainForm.value.orgType;
        this.params.orgIndustry = this.mainForm.value.orgIndustry;
        this.params.orgCity = this.mainForm.value.orgCity;
        this.params.commodity = this.mainForm.value.commodity;
        this.params.debtReceivableType = this.mainForm.value.debtReceivableType;
        // }

        // ???allFiles?????????????????????????????????????????????
        this.params && this.params.allFiles ? delete this.params.allFiles : '';


        this.params.items = this.items; // ??????????????????
        // this.params.itemsAsset = this.asset === true ? this.itemsAsset : []; // ??????????????????
        this.params.supplier = this.supplier;

        this.params.action = 'ok';
        this.close(this.params);
    }


    onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    onInput() {
        this.moneyFormat(); // ????????????????????????money?????????
        this.toValue();
    }

    moneyFormat() {
        let num = this.moneyInput.nativeElement.value;
        num = XnUtils.formatMoney(num);
        this.moneyInput.nativeElement.value = num;
    }

    toValue() {
        if (!this.moneyInput.nativeElement.value) {
            this.contractAmount = '';
        } else {
            let tempValue = this.moneyInput.nativeElement.value.replace(/,/g, '');
            tempValue = parseFloat(tempValue).toFixed(2);
            this.contractAmount = tempValue.toString();
        }
        this.moneyAlert = XnUtils.convertCurrency(this.moneyInput.nativeElement.value)[1];
        console.log('moneyInputValue: ' + this.contractAmount);
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

    onDateInput() {
        this.dateCheck();
    }

    dateCheck() {
        this.dateCheckTemp = XnUtils.toDateFromString(this.contractDate);
        if (!this.dateCheckTemp) {
            $(this.dateInput.nativeElement).addClass('not-invalid');
            this.dateAlert = '????????????????????????????????????20170731?????????';
        } else {
            $(this.dateInput.nativeElement).removeClass('not-invalid');
            this.dateAlert = '';
        }
    }

    // ??????????????????
    private buildcommodityType(ret: any, comm: any, commChildren: any[]) {
        ret.first.push({label: comm, value: comm});

        const second = [];
        for (const child of commChildren) {
            second.push({label: child.label, value: child.label});
        }
        ret.second[comm] = second;
    }

    // ????????????????????????
    private buildCommodityType(val: any[]): {} {
        if (!isNullOrUndefined(this.commodityTypeCache)) {
            return this.commodityTypeCache;
        }
        const ret = {
            firstPlaceHolder: '?????????????????????',
            secondPlaceHolder: '???????????????',
            first: [],
            second: {}
        };
        val.map(item => {
            this.buildcommodityType(ret, item.label, item.children);
        });
        this.commodityTypeCache = ret;
        return ret;
    }

}

/**
 *  ??????????????????
 */
export class OutputModel {
    public remitAccount: string; // ??????
    public remitBank: string; // ?????????
    public remitName: string; // ?????????
}
