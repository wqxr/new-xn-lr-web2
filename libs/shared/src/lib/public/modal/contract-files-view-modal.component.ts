/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：ContractFilesViewModalComponent
 * @summary：文件信息查看
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          补录合同信息       2019-03-22
 * **********************************************************************
 */

import {Component, ElementRef, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {FormGroup} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';
import {PdfViewService} from '../../services/pdf-view.service';

@Component({
    templateUrl: './contract-files-view-modal.component.html',
    styles: [`
        .this-img {
            width: 100%;
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
            position: relative
        }

        .img-wrapper {
            transition: all 0.5s ease-in-out;
        }

        .button-group {
            float: right;
            padding: 20px 0 0 15px;
        }

        .display-content {
            height: calc(100vh - 280px);
            text-align: center;
            overflow-y: auto;
            background: #E6E6E6;
        }

        .page {
            float: right;
            vertical-align: middle;
        }

    `],
    providers: [
        PdfViewService
    ]
})
export class ContractFilesViewModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    public fileType: string;
    public fileSrc: string;
    public total: number;
    public pageSize = 1;
    private observer: any;
    public mainForm: FormGroup;
    public shows: any[];
    public degree = 0;
    public params: any;
    public pageTitle = '';
    private currentScale = .6; // 初始缩放

    public constructor(private pdfViewService: PdfViewService) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.value;
        this.shows = params.checkers || [];
        this.pageTitle = params.title;
        this.total = this.params.files.img.length;
        if (this.params.files.img && this.params.files.img.length > 0) {
            this.onPage(1);
        }
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  翻页查看文件
     * @param e 当先文件所在页码
     *  this.pdfViewService.m_init = false; 将类的m_init值设置为false
     */
    public onPage(e) {
        if (typeof e !== 'number') {
            return;
        }
        this.pdfViewService.m_init = false;
        const file = this.params.files.img[e - 1];
        this.fileType = (file.fileId.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';
        if (this.fileType === 'img') {
            this.fileSrc = `/api/attachment/view?key=${file.fileId}`;
        } else {
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(`/api/attachment/view?key=${file.fileId}`);
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

    public handleCancel() {
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
