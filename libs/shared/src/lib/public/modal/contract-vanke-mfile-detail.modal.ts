/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-edit-modal.component
 * @summary：地产查看补录弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing      地产文件查看补录弹窗       2019-08-30
 * **********************************************************************
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { PdfViewService } from '../../services/pdf-view.service';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { DragonPdfViewService } from 'libs/products/bank-puhuitong/src/lib/services/pdf-view.service';
import { XnService } from '../../services/xn.service';
import { XnUtils } from '../../common/xn-utils';
import { XnFormUtils } from '../../common/xn-form-utils';



@Component({
    selector: 'app-public-contract-edit-modal',
    templateUrl: './contract-vanke-mfile-detail.modal.html',
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
            transform-origin:50% 50%;
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
            overflow: auto;
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
export class VankeViewContractModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    public fileType: string;
    public fileSrc: string;
    public fSrc: string;
    public total: number;
    public pageSize = 1;
    private observer: any;
    public mainForm: FormGroup;
    public shows: any[];
    public degree = 0;
    public isShow = false;
    public params: any;
    public pageTitle = '';
    private currentScale = .6; // 初始缩放
    public constructor(private pdfViewService: DragonPdfViewService, private xn: XnService) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.value;
        this.total = this.params.files.img.length;
        this.shows = params.checkers || [];
        this.pageTitle = params.title;
        this.isShow = params.isShow;
        this.pageTitle = params.title;
        this.buildFormGroup();
        if (this.params.files.img && this.params.files.img.length > 0) {
            this.onPage(1);
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
    onPagePdf(e) {
        if (typeof e !== 'number') {
            return;
        }
        this.pdfViewService.getTopage(e);
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

    public handleSubmit() {
        const obj = Object.assign({}, this.params.files, this.mainForm.value);
        this.close({
            action: 'ok',
            contractType: obj
        });

    }
    // 计算应收账款转让金额
    public ReceiveData(item: any) {
        let tempValue = item.replace(/,/g, '');
        tempValue = parseFloat(tempValue).toFixed(2);
        return Number(tempValue);
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
