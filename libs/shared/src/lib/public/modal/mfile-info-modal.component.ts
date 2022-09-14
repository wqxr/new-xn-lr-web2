/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-edit-modal.component
 * @summary：注册流程中授权确认函信息弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason                       date
 * 1.0                 wangqing     注册流程中授权确认函信息弹窗       2021-05-25
 * **********************************************************************
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { XnFormUtils } from '../../common/xn-form-utils';
import { PdfViewService } from '../../services/pdf-view.service';
import { XnService } from '../../services/xn.service';



@Component({
    selector: 'app-mfile-info',
    templateUrl: './mfile-info-modal.component.html',
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
            float: left;
            vertical-align: middle;
            margin-top: -20px;
            margin-right: 10px;
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
            min-height: 300px;
             max-height: 100%;
        }

        .button-group {
            float: right;
        }

    `],
    providers: [
        PdfViewService
    ]
})
export class AppFileInfoModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    public fileType: string;
    public fileSrc: any[] = [];
    public fSrc: string;
    public total: number;
    public pageSize = 1;
    private observer: any;
    public mainForm: FormGroup;
    public shows: any[];
    public degree = 0;

    public params: any;
    public pageTitle = '';
    private currentScale = .6; // 初始缩放
    fileIndex = 1;
    public ctrl: AbstractControl;
    public constructor(private pdfViewService: PdfViewService, private xn: XnService) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.total = JSON.parse(this.params.paramFiles).length;
        this.shows = params.checker || [];
        this.buildFormGroup();
        if (JSON.parse(this.params.paramFiles) && this.total > 0) {
            const file = JSON.parse(this.params.paramFiles);

            if (file && file.length > 0) {
                file.forEach(x => {
                    this.fileType = (x.filePath.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';
                    if (this.fileType === 'img') {

                        this.fileSrc.push({ picType: 0, url: this.xn.file.dragonView(x), fileId: x.fileId });
                    } else {
                        const self = this;
                        new Promise((resolve, reject) => {
                            self.fileSrc.push({ picType: 1, url: self.xn.file.dragonView(x), fileId: x.fileId });
                        }).then(() => {
                        });
                    }
                });
                this.onPage(1);
            }
        }
        this.modal.open(ModalSize.XXLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
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
        if (this.fileSrc[e - 1].picType === 0) {
            this.fileType = 'img';
            this.fSrc = this.fileSrc[e - 1].url;
        } else {
            this.fileType = 'pdf';
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(this.fileSrc[e - 1].url);
            }, 0);
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

    /**
     *  构建表单控件
     */
    private buildFormGroup() {
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
