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
 * 1.0                 wangqing          查看文件方法修改     2019-04-18
 * **********************************************************************
 */

import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../../../common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { PdfViewService } from '../../../../services/pdf-view.service';
import { DomSanitizer } from '@angular/platform-browser';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'app-dragon-mfiles-view-modal',
    templateUrl: './file-view-modal.component.html',
    styles: [`
        .this-img {
            width: 60%;
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
            float: left;
            vertical-align: middle;
        }
        .edit-content {
            height: calc(100vh - 170px);
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
        .pdf-container {
            width: 100%;
            height: calc(100vh - 170px);
            border: none;
        }
        .display-content {
            height: calc(100vh - 170px);
            text-align: center;
            overflow-y: auto;
            background: #E6E6E6;
        }
    `],
    providers: [
        PdfViewService
    ]
})
export class ZdFileViewModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    public fileType: string;
    public fileSrc: string[] = [];
    public fSrc = '';
    public total: number;
    public pageSize = 1;
    private observer: any;
    public mainForm: FormGroup;
    public degree = 0;
    public params: any;
    pageTitle = '';
    public currentScale = .6;
    public shows: any[] = [];
    baseType: string;
    subject_id: string;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;

    public constructor(private pdfViewService: PdfViewService,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private xn: XnService) {
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
        // const file = this.params[e - 1];
        this.fileType = 'pdf';
        // if (this.fileType === 'img') {
        //     this.baseType = PicType[file.fileName.substr(-3).toLowerCase()];
        //     this.fSrc = `${this.baseType}${file.fileData}`;
        // } else {
        setTimeout(() => {
            this.pdfViewService.pdfToCanvas(this.params, 'cfca');
        });
        //}
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

    open(params: any): Observable<any> {
        this.params = params.files;
        // this.total = this.params.length;
        this.subject_id = params.id;

        this.onPage(1);

        this.cdr.markForCheck();
        this.modal.open(ModalSize.XXXLarge, 'bigModel');
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }

    downLoadFiles() {
        this.xn.api.download('/custom/zhongdeng/zd/download_annex',
            { subject_id: this.subject_id })
            .subscribe((con: any) => {
                this.xn.api.save(con._body, '中登附件.zip');
                this.xn.loading.close();
            });

    }
}
enum PicType {
    'jpg' = 'data:image/jpeg;base64,',
    'png' = 'data:image/png;base64,',
    'gif' = 'data:image/gif;base64,',
}
