import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    ViewEncapsulation,
    Input
} from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    ModalComponent,
    ModalSize
} from 'libs/shared/src/lib/common/modal/components/modal';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from '../xn-input.options';
import { isNullOrUndefined } from 'util';

@Component({
    templateUrl: './contract-new-modal.component.html',
    styles: [
        `
            .flex-row {
                display: flex;
                margin-bottom: -15px;
            }
        `,
        `
            .this-left {
                width: 300px;
            }
        `,
        `
            .this-right {
                flex: 1;
                padding-left: 10px;
            }
        `,
        `
            .this-title {
                display: block;
                font-size: 12px;
                margin-bottom: 5px;
            }
        `,
        `
            .this-text {
                display: block;
                width: 60px;
                text-align: left;
                margin-bottom: 3px;
            }
        `,
        `
            .this-control {
                display: block;
                vertical-align: top;
                font-size: 13px;
                width: 230px;
                margin-bottom: 5px;
            }
        `,
        `
            .pdf-container {
                border: 0;
            }
        `,
        `
            .this-img {
                width: 100%;
            }
        `,
        `
            .this-pdf {
                width: 100%;
                height: calc(100vh - 240px);
                border: none;
            }
        `,
        `
            .ng-invalid {
                border-color: #e15f63;
            }
        `,
        `
            .xn-money-alert {
                color: #8d4bbb;
                font-size: 12px;
                padding-bottom: 10px;
            }
        `,
        `
            .red {
                color: #e15f63;
            }
        `,
        `
            .not-invalid {
                border-color: #e15f63;
            }
        `,
        `
            .btn-ro {
                display: inline-block;
                position: relative;
                vertical-align: middle;
                width: 120px;
                height: 40px;
            }
        `,
        `
            .button-rotate {
                position: absolute;
                top: 0px;
                cursor: pointer;
                z-index: 10;
            }
        `,
        `
            .rotate-left {
                right: 60px;
            }
        `,
        `
            .rotate-right {
                right: 10px;
            }
        `,
        `
            .row {
                padding: 0 20px;
            }
        `,
        `
            .img-container {
                max-height: calc(100vh - 260px);
                overflow-x: hidden;
                text-align: center;
                position: relative;
            }
        `,
        `
            .img-wrapper {
                transition: all 0.5s ease-in-out;
            }
        `,
        `
            .page {
                display: inline-block;
                vertical-align: middle;
            }
        `,
        `
            .pagination {
                margin: 0 !important;
            }
        `,
        `
            .modal-footer {
                padding: 0px 15px 0px 0px;
            }
        `,
        `
            .form-control {
                height: 30px;
                padding: 3px 10px;
                font-size: 12px;
            }
        `,
        `
            .table-box {
                width: 300px;
                height: 120px;
                overflow: scroll;
            }
        `,
        `
            .table {
                width: 400px;
                max-width: 600px;
                vertical-align: center;
                overflow: scroll;
                font-weight: normal;
                font-size: 12px;
            }
        `,
        `
            .table tr th {
                padding: 2px 0px;
                font-size: 12px;
                font-weight: normal;
            }
        `,
        `
            .table tr td {
                font-size: 12px;
                font-weight: normal;
                padding: 0px;
            }
        `,
        // `.contract-info { margin-bottom: 20px; }`,
        `
            .btn-add {
                padding: 3px 0px;
                width: 290px;
                font-size: 12px;
                margin-top: 2px;
            }
        `,
        `
            .btn-remove {
                padding: 0px;
                font-size: 12px;
            }
        `,
        `
            .fa-s {
                font-size: 34px;
            }
        `,
        `
            .inline {
                display: inline;
            }
        `,
        `
            .inline-block {
                display: inline-block;
            }
        `,
        `
            .v-top {
                vertical-align: top;
            }
        `,

        // ?????????
        `
            .table-box::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
        `,
        `
            .table-box::-webkit-scrollbar-track,
            .editor::-webkit-scrollbar-thumb {
                border-right: 1px solid transparent;
                border-left: 1px solid transparent;
            }
        `,
        `
            .table-box::-webkit-scrollbar-button:start:hover {
                background-color: #eee;
            }
        `,
        `
            .table-box::-webkit-scrollbar-button:end {
                background-color: #eee;
            }
        `,
        `
            .table-box::-webkit-scrollbar-thumb {
                -webkit-border-radius: 8px;
                border-radius: 8px;
                background-color: rgba(0, 0, 0, 0.2);
            }
        `,
        `
            .table-box::-webkit-scrollbar-corner {
                display: block;
            }
        `,
        `
            .table-box::-webkit-scrollbar-track:hover {
                background-color: rgba(0, 0, 0, 0.15);
            }
        `,
        `
            .table-box::-webkit-scrollbar-thumb:hover {
                -webkit-border-radius: 8px;
                border-radius: 8px;
                background-color: rgba(0, 0, 0, 0.5);
            }
        `,

        `
            @media (max-height: 1000px) {
                .table-box {
                    height: 280px;
                }
            }
        `,
        `
            @media (max-height: 900px) {
                .table-box {
                    height: 230px;
                }
            }
        `,
        `
            @media (max-height: 800px) {
                .table-box {
                    height: 180px;
                }
            }
        `,
        `
            @media (max-height: 700px) {
                .table-box {
                    height: 120px;
                }
            }
        `,

        `
            .zichan-input {
                display: inline-block;
                width: 140px;
            }
        `,
        `
            .select-options {
                display: inline-block;
                width: 85px;
                height: 28px;
                color: #555;
                border-color: #d2d6de;
                border-radius: 3px;
                background-color: white;
            }
        `,
        `
            .in-one-line {
                width: 80px;
            }
        `,
        `
            .in-one-line-unit {
                width: 100px;
            }
        `,
        `
            .in-one-line-member {
                width: 85px;
            }
        `,
        `
            .number-text {
                width: 36px;
            }
        `,
        `
            .right {
                text-align: right;
            }
        `,
        `
            .btn-line {
                margin-bottom: 10px;
            }
        `,
        `
            .sm-unit {
                width: 80px;
            }
        `,
        `
            .unit-cont {
                width: 150px;
            }
        `,
        `.same-width {
        width: 80px
    }

    }`,
        `
            .inline-block {
                display: inline-block;
            }
        `,

        `
            .table > tbody + tbody {
                border-top: 0;
            }
        `,
        `
            .table tr.displayNone {
                background: #eee;
            }
        `,

        `
            .xn-control-label {
                text-align: left;
                padding-top: 0px;
                padding-bottom: 3px;
                font-size: 12px;
            }
        `,

        `
            .show-input {
                width: 230px;
                margin-bottom: 5px;
            }

            .hide-select {
                display: none;
            }
            .this-control ::ng-deep .xn-input-font {
                font-size: 12px;
            }
        `
    ]
})
export class BankContractNewModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;

    @ViewChild('moneyInput') moneyInput: ElementRef;
    @ViewChild('dateInput') dateInput: ElementRef;
    @ViewChild('moneyAlertRef') moneyAlertRef: ElementRef;
    @ViewChild('dateAlertRef') dateAlertRef: ElementRef;

    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    @Input() form: FormGroup;
    @Input() rows: any;
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
    files: any;

    errorMsg = '';

    fileSrc;
    pageSize = 1;
    total = 0;
    fileType = 'img';
    moneyFormatCheck = false;
    dateCheckTemp = false;
    dateAlert: any;
    degree = 0;
    deal = '0';
    dealShow = false;
    property = '';
    unit = '';
    member = '';
    dealunit = '';
    specifications = '';
    sort = 'manage';
    supplier = '';
    items: any = [];
    classifys: any[] = [
        {
            value: 'manage',
            label: '?????????'
        },
        {
            value: 'transaction',
            label: '?????????'
        }
    ];
    classify = 'manage';
    info = '';
    supplierInit = '';
    asset = false;
    map = false;
    itemsAssetOriginal: any = [];
    itemsAsset: any = [];
    allFiles: any = [];
    shows: any = [];
    mainForm: FormGroup;
    formValid = false;

    // ???????????????
    commodity: any;
    // ???????????????????????????(?????????)
    public isDisplay: false;
    // ????????????????????????????????????
    public debtReceivableValue: string;
    // ????????????????????????
    public commodityDispaly: boolean;

    public newMap = new Map();

    public commodityTypeCache;
    // ????????????
    public business: any;
    public commodityTypelist: any;

    fileImg = '';

    constructor() {}

    ngOnInit() {
        this.rows = [
            {
                title: '??????????????????',
                checkerId: 'contractFile',
                type: 'mfile',
                options: {
                    // showWhen: ['fileType', 'img'],
                    filename: '??????????????????',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500'
                }
            }
        ];

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);

        this.mainForm.valueChanges.subscribe(v => {
            // ????????????
            this.files = JSON.parse(v.contractFile);
            const fileId = this.files && this.files[0].fileId;
            this.fileSrc = fileId ? `/api/attachment/view?key=${fileId}` : '';

            this.total = this.files.length;
        });

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    open(): Observable<any> {
        this.rows = [
            {
                title: '??????????????????',
                checkerId: 'contractFile',
                type: 'mfile',
                options: {
                    // showWhen: ['fileType', 'img'],
                    filename: '??????????????????',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500'
                }
            }
        ];

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
        // this.mainForm.valueChanges.subscribe(v => {
        //     // ????????????
        //     const fileId = v.contractFile && JSON.parse(v.contractFile).fileId;
        //     this.fileSrc = fileId ? `/api/attachment/view?key=${fileId}` : '';
        // });

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
        const data = {
            contractTitle: this.contractTitle,
            contractNum: this.contractNum,
            contractDate: this.contractDate,
            contractAmount: this.contractAmount,
            contractBuyer: this.contractBuyer,
            supplier: this.supplier
        };
        if (v.fileType === 'pdf') {
            this.close(
                Object.assign(data, {
                    files: [JSON.parse(v.pdf)]
                })
            );
        } else {
            this.close(
                // Object.assign(data, {
                //     files: JSON.parse(v.contractFile)
                // })
                Object.assign(data, { files: this.files })
            );
        }
    }

    onCancel() {
        this.close(null);
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
            let tempValue = this.moneyInput.nativeElement.value.replace(
                /,/g,
                ''
            );
            tempValue = parseFloat(tempValue).toFixed(2);
            this.contractAmount = tempValue.toString();
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

    rotateImg(direction: string) {
        this.degree = XnUtils.rotateImg(
            direction,
            this.degree,
            this.innerImg.nativeElement,
            this.outerImg.nativeElement,
            this.imgContainer.nativeElement
        );
    }

    // ??????????????????
    private buildcommodityType(ret: any, comm: any, commChildren: any[]) {
        ret.first.push({ label: comm, value: comm });

        const second = [];
        for (const child of commChildren) {
            second.push({ label: child.label, value: child.label });
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
        // for (const key of Object.keys(this.business)) {
        //     const o = {} as any;
        //     o[key] = this.business[key];
        //     businessLists.push(o);
        // }
        // console.log('businessLists:', businessLists);
        // businessLists.map(x => {
        //     //
        // });
        val.map(item => {
            this.buildcommodityType(ret, item.label, item.children);
        });
        this.commodityTypeCache = ret;
        return ret;
    }

    onPage(index) {
        this.fileSrc = `/api/attachment/view?key=${
            this.files[index - 1].fileId
        }`;
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
            && this.fileSrc
            ;
    }
}
