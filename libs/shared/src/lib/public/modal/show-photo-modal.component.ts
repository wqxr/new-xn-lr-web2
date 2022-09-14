import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnUtils} from '../../common/xn-utils';
import 'pdfjs-dist/build/pdf.js';

PDFJS.cMapUrl = 'assets/pdfjs/cmaps/';
PDFJS.cMapPacked = true;

// import 'pdfjs-dist/cmaps/GBK-EUC-H';
PDFJS.verbosity = (PDFJS as any).VERBOSITY_LEVELS.errors;

// declare var pdfjs: any;
declare var PDFJS: any;

/**
 * 查看发图片的模态框
 */
@Component({
    templateUrl: './show-photo-modal.component.html',
    styles: [
        `.this-img { width: 100%; border: none; }`,
        `.pdf-container { border: 0; }`,
        `.button-group{ position: absolute; left: 50%; transform: translate(-50%) }`,
        `.modal.in .modal-dialog{ height: 100%}`,
        `.pdf-container{ height: calc(100vh - 280px); width: 100%; overflow-y: scroll;}`,
        `.this-pdf { max-width: 100%; border: none; }`,
        `.button-rotate { position: absolute;  top: 10px; cursor: pointer; z-index: 10}`,
        `.rotate-left { right: 60px; }`,
        `.rotate-right { right: 10px; } `,
        `.row { padding: 0 20px }`,
        `.img-container { max-height: calc(100vh - 260px); overflow-x: hidden; text-align: center; position: relative}`,
        `.img-wrapper { transition: all 0.5s ease-in-out; }`,
    ]
})
export class ShowPhotoModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;

    private observer: any;

    fileImg: any; // 图像
    fileSrc: string;
    fileType = '';
    degree = 0;

    constructor() {
    }

    ngOnInit() {
    }

    /**
     * 打开验证窗口
     * @param params
     * @returns {any}
     */

    open(params: any): Observable<any> {

        $(this.innerImg.nativeElement).attr('src', 'data:image/' + params.ext + ';base64,' + params.data.data);

        this.modal.open(ModalSize.XLarge);

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
}
