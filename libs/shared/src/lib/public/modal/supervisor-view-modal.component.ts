import {Component, OnInit, ElementRef, Input, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {XnService} from '../../services/xn.service';
import {FormGroup, AbstractControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {XnUtils} from '../../common/xn-utils';
import {XnInputOptions} from '../form/xn-input.options';

@Component({
    templateUrl: './supervisor-view-modal.component.html',
    styles: [
        `.flex-row { display: flex; margin-bottom: -15px;}`,
        `.this-left { width: 300px;}`,
        `.this-right { flex: 1; padding-left: 10px; }`,
        `.this-title { display: block; font-size: 12px; margin-bottom: 5px; }`,
        `.this-text { display: block; width: 60px; text-align: left; margin-bottom: 3px}`,
        `.this-control {display: block; vertical-align: top; font-size: 13px; width: 230px; margin-bottom: 5px}`,
        `.pdf-container { border: 0; }`,
        `.this-img { width: 100%; }`,
        `.this-pdf { width: 100%; height: calc(100vh - 240px); border: none; }`,
        `.ng-invalid{ border-color: #e15f63;}`,
        `.xn-money-alert { color: #8d4bbb; font-size: 12px; padding-bottom: 10px}`,
        `.red { color: #e15f63 }`,
        `.not-invalid {border-color: #e15f63;}`,
        `.btn-ro { display: inline-block; position: relative; vertical-align: middle; width: 120px; height: 40px; }`,
        `.button-rotate { position: absolute;  top: 0px; cursor: pointer; z-index: 10}`,
        `.rotate-left { right: 60px; }`,
        `.rotate-right { right: 10px; } `,
        `.row { padding: 0 20px }`,
        `.img-container { max-height: calc(100vh - 260px); overflow-x: hidden; text-align: center; position: relative}`,
        `.img-wrapper { transition: all 0.5s ease-in-out; }`,
        `.page { display: inline-block; vertical-align: middle }`,
        `.pagination { margin: 0 !important }`,
        `.modal-footer { padding: 0px 15px 0px 0px;  }`,
        `.form-control { height: 30px; padding: 3px 10px; font-size: 12px;}`,
        `.table-box { width: 300px; height: 120px; overflow: scroll}`,
        `.table {  width: 400px ; max-width: 600px; vertical-align: center; overflow: scroll; font-weight: normal; font-size: 12px; }`,
        `.table tr th { padding: 2px 0px; font-size: 12px; font-weight: normal; }`,
        `.table tr td { font-size: 12px; font-weight: normal;  padding: 0px;}`,
        // `.contract-info { margin-bottom: 20px; }`,
        `.btn-add { padding: 3px 0px; width: 290px; font-size: 12px; margin-top: 2px}`,
        `.btn-remove { padding: 0px; font-size: 12px;}`,
        `.fa-s { font-size: 34px }`,
        `.inline { display: inline }`,
        `.inline-block { display: inline-block }`,
        `.v-top { vertical-align: top }`,

        // ?????????
        `.table-box::-webkit-scrollbar {width: 10px; height: 10px;}`,
        `.table-box::-webkit-scrollbar-track,.editor::-webkit-scrollbar-thumb {border-right: 1px solid transparent; border-left: 1px solid transparent; }`,
        `.table-box::-webkit-scrollbar-button:start:hover{background-color:#eee;}`,
        `.table-box::-webkit-scrollbar-button:end{background-color:#eee;}`,
        `.table-box::-webkit-scrollbar-thumb {-webkit-border-radius: 8px; border-radius: 8px; background-color: rgba(0, 0, 0, 0.2);}`,
        `.table-box::-webkit-scrollbar-corner {display: block;}`,
        `.table-box::-webkit-scrollbar-track:hover {background-color: rgba(0, 0, 0, 0.15);}`,
        `.table-box::-webkit-scrollbar-thumb:hover { -webkit-border-radius: 8px; border-radius: 8px; background-color: rgba(0, 0, 0, 0.5);}`,

        `@media(max-height: 1000px) { .table-box { height: 280px } }`,
        `@media(max-height: 900px) { .table-box { height: 230px } }`,
        `@media(max-height: 800px) { .table-box { height: 180px } }`,
        `@media(max-height: 700px) { .table-box { height: 120px } }`,

        `.zichan-input { display: inline-block; width: 140px; }`,
        `.select-options { display: inline-block;  width: 85px; height: 28px; color: #555; border-color: #d2d6de; border-radius: 3px; background-color: white }`,
        `.in-one-line { width: 80px }`,
        `.in-one-line-unit { width: 100px }`,
        `.in-one-line-member { width: 85px }`,
        `.number-text { width: 36px }`,
        `.right { text-align: right }`,
        `.btn-line { margin-bottom: 10px; }`,
        `.sm-unit { width: 80px; }`,
        `.unit-cont { width: 150px; }`,
        `.same-width {width: 80px}}`,
        `.inline-block { display: inline-block}`,

        `.table>tbody+tbody { border-top: 0 }`,
        `.table tr.displayNone{ background: #eee }`,

        `.xn-control-label { text-align: left; padding-top: 0px; padding-bottom: 3px; font-size: 12px;}`,

        `.show-input { width: 230px; margin-bottom: 5px; }`,
        `.flex { display: flex }`,
        `.amount { margin-bottom: 15px }`
    ]
})
export class SupervisorViewModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;

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

    fileSrc: string;
    pageSize = 1;
    total = 0;
    fileType = '';

    shows: any = [];
    mainForm: FormGroup;
    formValid = false;
    degree = 0;
    amount = '';

    constructor(private xn: XnService, private er: ElementRef) {
    }

    ngOnInit() {
    }

    /**
     * ??????????????????
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.params = params;

        if (params && params.amount && params.amount !== '') {
            this.amount = params.amount;
        }

        this.fileType = (params.fileId.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';

        if (this.fileType === 'img') {
            this.fileSrc = `/api/attachment/view?key=${params.fileId}`;
        } else {
            // ?????????????????????iframe????????????????????????????????????iframe??????????????????????????????setTimeout???????????????
            setTimeout(() => {
                $('iframe.this-pdf').prop('src', `/api/attachment/view?key=${params.fileId}`);
            }, 0);
        }

        this.toValue();

        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    isValid() {
        return !!(this.amount === '');
    }

    onPage(index) {
        this.fileSrc = `/api/attachment/view?key=${this.params.files[index - 1].fileId}`;
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onOk() {
        // this.toValue();

        this.params.action = 'ok';
        this.close('ok');
    }

    onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    toValue() {
        if (!this.amount || this.amount === '') {
            return;
        } else {
            this.params.amount = this.amount;
        }
    }

    rotateImg(direction: string) {
        this.degree = XnUtils.rotateImg(direction, this.degree, this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
    }

}
