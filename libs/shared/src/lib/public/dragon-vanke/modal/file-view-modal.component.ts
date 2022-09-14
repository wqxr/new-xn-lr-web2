import { Component, ViewChild, ElementRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { PdfViewService } from '../../../services/pdf-view.service';
import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';

@Component({
    templateUrl: './file-view-modal.component.html',
    styles: [
        `.this-img {
            width: 60%;
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .pdf-container {
            width: 100%;
            min-height: 100%;
            border: 0;
            background: #E6E6E6;
        }

        .this-pdf {
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .img-container {
            width: 100%;
            min-height: 100%;
            background: #E6E6E6;
            border: 0;
            /*position: relative*/
        }

        .img-wrapper {
            transition: all 0.5s ease-in-out;
        }

        .button-group {
            padding: 20px 0 0 15px;
        }

        .display-content {
            height: calc(100vh - 280px);
            text-align: center;
            overflow-y: auto;
            background: #E6E6E6;
        }
        `,
    ],
    providers: [
        PdfViewService
    ]
})
export class FileViewModalComponent {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    private observer: any;
    public fileSrc: string;
    public fileType = '';
    // 默认文件显示角度
    public degree = 0;
    // 默认文件显示大小
    private currentScale = .6;

    constructor(private pdfViewService: PdfViewService, private xn: XnService) {
    }

    /**
     * 打开验证窗口
     * @param params
     * @returns {any}
     */

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.fileType = (params.fileName.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';
        const { t, sign } = this.xn.api.dragon.getSignInfo();
        if (this.fileType === 'img') {
            this.fileSrc = `/dragon/file/view?key=${params.filePath || params.fileId}&sign=${sign}&t=${t}`;
        } else {
            setTimeout(() => {
                const url = `/dragon/file/view?key=${params.filePath || params.fileId}&sign=${sign}&t=${t}`;
                this.pdfViewService.pdfToCanvas(url);
            }, 0);
        }
        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  关闭弹窗
     */
    public handleClose() {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next({ action: 'ok' });
        this.observer.complete();
    }

    /**
     *  文件旋转
     * @param direction 旋转方向 left:左转，right:右转
     */
    public rotateImg(direction: string) {
        if (this.innerImg && this.innerImg.nativeElement
            && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement
        ) {
            this.degree = this.pdfViewService.rotateImg(direction, this.degree,
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
}
