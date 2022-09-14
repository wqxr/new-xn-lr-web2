/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-edit-modal.component
 * @summary：合同文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          采购补录合同信息       2019-06-13
 * 2.0                 wangqing          pdf查看           2019-06-13
 * **********************************************************************
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'app-public-contract-edit-modal',
    templateUrl: './avenger-bothcontract-view.modal.html',
    styles: [`
        .pdf-container {
            width: 100%;
            min-height: 100%;
            background: #E6E6E6;
        }

        .this-img {
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
            height:100%;
            transition: all 0.5s ease-in-out;
        }

        .page {
            clear: both;
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
            padding: 20px  0 15px;
        }
        .edit-img-flex{
            width: 100%;
            text-align: center;
            position: relative;
            background: #E6E6E6;
            overflow-y: scroll;
            height: 300px;
        }
        .buttonclass{
            width:54px;
            font-size: 12px;
            line-height: 1.5;
            border-radius: 3px;
        }

    `],
    providers: [
        PdfViewService
    ]
})
export class AvengerBothPlatContractModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    @ViewChild('innerImg1') innerImg1: ElementRef;
    @ViewChild('outerImg1') outerImg1: ElementRef;
    @ViewChild('imgContainer1') imgContainer1: ElementRef;
    public fileType: string;
    public fileSrc: string[] = [];
    public contractfileSrc: string;
    public upstreamFileSrcSingle: string;
    public upstreamfileSrc: string[] = [];
    public total = 0;
    public upstreamtotal = 0;

    public pageSize = 1;
    private observer: any;
    public mainForm: FormGroup;
    public shows: any[];
    public degree = 0;
    public params: any;
    public pageTitle = '';
    type = 0;
    private currentScale = .6; // 初始缩放

    public constructor(private pdfViewService: PdfViewService, private xn: XnService) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.value;
        this.shows = params.checkers || [];
        this.type = params.type;
        this.pageTitle = params.title;
        this.buildFormGroup();
        if (this.params.contractFile && JSON.parse(this.params.contractFile).length > 0) {
            JSON.parse(this.params.contractFile).forEach(x => {
                // let file = JSON.parse(this.params.contractFile)[0];
                this.fileType = (x.fileId.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';
                const params = { ...x, isAvenger: true, };
                if (this.fileType === 'img') {
                    this.fileSrc.push(this.xn.file.view(params));
                } else {
                    setTimeout(() => {
                        this.pdfViewService.pdfToCanvas(this.xn.file.view(params));
                    });
                }
            });
            this.total = this.fileSrc.length;
            this.onPage(1);
        }
        if (this.params.upstreamContractFile && JSON.parse(this.params.upstreamContractFile).length > 0) {
            JSON.parse(this.params.upstreamContractFile).forEach(x => {
                // let file = JSON.parse(this.params.contractFile)[0];
                this.fileType = (x.fileId.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';
                const params = { ...x, isAvenger: true, };
                if (this.fileType === 'img') {
                    this.upstreamfileSrc.push(this.xn.file.view(params));
                } else {
                    setTimeout(() => {
                        this.pdfViewService.pdfToCanvas(this.xn.file.view(params));
                    });
                }
            });
            this.upstreamtotal = this.upstreamfileSrc.length;
            this.onupstreamPage(1);
        }
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  翻页查看文件
     * @param e 当先文件所在页码
     * this.pdfViewService.m_init = false; 将类的m_init值设置为false
     */
    public onPage(e: number) {
        if (typeof e !== 'number') {
            return;
        }
        this.pdfViewService.m_init = false;
        this.contractfileSrc = this.fileSrc[e - 1];
    }
    public onupstreamPage(index) {
        if (typeof index !== 'number') {
            return;
        }
        this.pdfViewService.m_init = false;
        this.upstreamFileSrcSingle = this.upstreamfileSrc[index - 1];

    }

    /**
     *  文件旋转
     * @param val 旋转方向 left:左转，right:右转
     */
    public rotateImg(val, type: number) {
        if (type === 0) {
            if (this.innerImg && this.innerImg.nativeElement
                && this.outerImg && this.outerImg.nativeElement
                && this.imgContainer && this.imgContainer.nativeElement
            ) {
                this.degree = this.pdfViewService.rotateImg(val, this.degree,
                    this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement, this.currentScale);
            }
        } else if (type === 1) {
            if (this.innerImg1 && this.innerImg1.nativeElement
                && this.outerImg1 && this.outerImg1.nativeElement
                && this.imgContainer1 && this.imgContainer1.nativeElement
            ) {
                this.degree = this.pdfViewService.rotateImg(val, this.degree,
                    this.innerImg1.nativeElement, this.outerImg1.nativeElement, this.imgContainer1.nativeElement, this.currentScale);
            }
        }

    }


    /**
     *  文件缩放
     * @param params 放大缩小  large:放大，small:缩小
     */
    public scaleImg(params: string, type: number) {
        if (type === 0) {
            if (this.innerImg && this.innerImg.nativeElement
                && this.outerImg && this.outerImg.nativeElement
                && this.imgContainer && this.imgContainer.nativeElement
            ) {
                // 缩放图片
                this.currentScale = this.pdfViewService.scaleImg(params,
                    this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
            }
        } else if (type === 1) {
            if (this.innerImg1 && this.innerImg1.nativeElement
                && this.outerImg1 && this.outerImg1.nativeElement
                && this.imgContainer1 && this.imgContainer1.nativeElement
            ) {
                // 缩放图片
                this.currentScale = this.pdfViewService.scaleImg(params,
                    this.innerImg1.nativeElement, this.outerImg1.nativeElement, this.imgContainer1.nativeElement);
            }
        }

    }

    public handleCancel() {
        this.close({
            action: 'cancel'
        });
    }

    public handleSubmit() {
        const obj = Object.assign({}, this.params.files, this.mainForm.value);
        this.close({
            action: 'ok',
            contractType: obj
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
