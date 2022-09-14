import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {CalendarData} from 'libs/shared/src/lib/config/calendar';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

/**
 * 查看合同信息的模态框
 */
@Component({
    templateUrl: './contract-view-modal.component.html',
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
        `.form-control { height: 28px; padding: 3px 10px; font-size: 12px;}`,
        `.table-box { width: 300px; height: 120px; overflow: scroll}`,
        `.table {  width: 400px ; max-width: 600px; vertical-align: center; overflow: scroll; font-weight: normal; font-size: 12px; }`,
        `.table tr th { padding: 2px 0px; font-size: 12px; font-weight: normal; }`,
        `.table tr td { font-size: 12px; font-weight: normal;  padding: 0px;}`,
        `.contract-info { margin-bottom: 20px; }`,
        `.btn-add { padding: 3px 12px; font-size: 12px; margin-top: 2px}`,
        `.btn-remove { padding: 0px; font-size: 12px;}`,
        `.fa-s { font-size: 34px }`,
        `.table tr { background: #eee }`,
        `.table>tbody+tbody { border-top: 0 }`,
        `.inline { display: inline }`,
        `.inline-block { display: inline-block }`,

        // 滚动条
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

        `.xn-control-label { text-align: left; padding-bottom: 5px; }`,
        `.page { display: inline-block; vertical-align: middle; }`,
        `.pagination { margin: 0 !important; } `,
    ]
})
export class BankContractViewModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    @ViewChild('moneyInput') moneyInput: ElementRef;

    private observer: any;

    params: any;
    fileImg: any; // 合同图像
    degree = 0;
    moneyAlert = '';
    holidayAlert = '';
    dateEndAlert = '';

    pageSize = 1;
    total = 0;

    constructor() {
    }

    ngOnInit() {
    }

    /**
     * 打开查看窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.params = params;

        // 显示合同图像
        if (!!params.files && params.files.length && !!params.files[0].fileId) {
            this.fileImg = `/api/attachment/view?key=${params.files[0].fileId}`;
            this.total = this.params.files.length;
        } else if (!!params.fileId) {
            this.fileImg = `/api/attachment/view?key=${params.fileId}`;
        }

        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    onOk() {
        this.modal.close();
        this.observer.next({action: 'ok'});
        this.observer.complete();
    }

    rotateImg(direction: string) {
        this.degree = XnUtils.rotateImg(direction, this.degree, this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
    }

    onConsistent(isConsistent: boolean) {
        this.observer.next({consistent: isConsistent});
        this.observer.complete();
        this.modal.close();
    }

    onPage(index) {
        this.fileImg = `/api/attachment/view?key=${
            this.params.files[index - 1].fileId
        }`;
    }

}
