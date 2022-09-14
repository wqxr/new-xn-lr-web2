/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mfiles-view-modal.component.ts
 * @summary：查看文件信息,多张
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          查看文件方法修改     2019-04-18
 * **********************************************************************
 */

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'app-public-avenger-show-modal',
    templateUrl: './avenger-invoice-show-modal.component.html',
    styles: [`
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
            overflow-y: scroll;
            background: #E6E6E6;
        }

        .button-group {
            float: right;
            padding: 20px 15px 0 15px;
        }
    `],
    providers: [
        PdfViewService
    ]
})
export class AvengerInvoiceShowModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    public fileType: string;
    public fileSrc: string;
    public contractfileSrc: string;
    public total: number;
    public pageSize = 1;
    private observer: any;
    public mainForm: FormGroup;
    public degree = 0;
    public params: any;
    pageTitle = '';
    public currentScale = .6;
    public shows: any[] = [];
    public files: any[] = [];
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;

    public constructor(private pdfViewService: PdfViewService, private xn: XnService) {
    }

    public ngOnInit() {
    }

    /**
     *  翻页查看文件
     * @param e 当先文件所在页码
     * this.pdfViewService.m_init = false; 将类的m_init值设置为false
     */
    public onPage(e) {
        if (typeof e !== 'number') {
            return;
        }
        this.pdfViewService.m_init = false;
        const file = this.files[e - 1];
        if (this.params.isPerson && this.params.isPerson === 1){
            this.fileType = file.filePath.substr(-3).toLowerCase() === 'pdf' ? 'pdf' : 'img';
        } else {
            this.fileType = file.fileId.substr(-3).toLowerCase() === 'pdf' ? 'pdf' : 'img';
        }
        const params1 = { ...file, isAvenger: this.params.isAvenger, isInvoice: this.params.isInvoice};
        if (this.fileType === 'img') {
            this.fileSrc = this.xn.file.view(params1);
        } else {
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(this.xn.file.view(params1));
            });
        }
    }

    open(params: any): Observable<any> {
        this.params = params;
        if (this.params.file && JSON.parse(this.params.file).length > 0) {
            this.files = JSON.parse(this.params.file);
            this.total = this.files.length;
            this.onPage(1);
        }
        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  下载航天发票pdf
     */
    public downloadFiles() {
        if (this.params.isPerson && this.params.isPerson === 1){
            this.xn.file.download(
                this.files,
                this.params.mainFlowId,
                true
            ).subscribe((v: any) => {
                this.xn.api.save(v._body, `${this.files[0].fileId}.zip`);
            });
        } else {
            this.xn.avenger.downLoad('/file/nuonuofp', {
                mainFlowId: this.files[0].filePath,
                id: Number(this.files[0].fileId.replace(/\.pdf/, ''))
            }).subscribe((v: any) => {
                this.xn.api.save(v._body, `${this.files[0].filePath}发票.pdf`);
            });
        }
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

    public onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }
}
