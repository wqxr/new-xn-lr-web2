/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：supplement-file.modal.component
 * @summary：补充查看应收账款
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          修改pdf,图片的查看     2019-03-27
 * **********************************************************************
 */

import {Component, ElementRef, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {PdfViewService} from 'libs/shared/src/lib/services/pdf-view.service';

@Component({
    templateUrl: './supplement-file.modal.component.html',
    styles: [`
        .flex-row {
            display: flex;
            height: calc(100vh - 280px);
            padding: 15px 0;
            justify-content: center;
        }

        .this-left {
            height: 100%;
            width: 300px;
            overflow-y: auto;
            padding: 0 15px 0 0;
        }

        .this-right {
            height: 100%;
            flex: 1;
            overflow: auto;
            text-align: center;
            background: #E6E6E6;
        }

        .pdf-container {
            min-height: 100%;
            width: 100%;
            border: none;
            background: #E6E6E6;
        }

        .this-pdf {
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .this-img {
            width: 60%;
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .img-container {
            max-height: 100%;
            text-align: center;
            position: relative;
            overflow: auto;
            background: #E6E6E6;
        }

        .img-wrapper {
            transition: all 0.5s ease-in-out;
        }

        .page {
            display: inline-block;
            vertical-align: middle;
            float: right;
        }

        .required-star::after {
            content: '*';
            color: #ff5500;
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
export class SupplementFileModalComponent {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    private observer: any;
    public fileSrc;
    public pageSize = 1;
    public total = 0;
    public fileType = '';
    public degree = 0;
    public mainForm: FormGroup;
    public pageTitle = '';
    public rows: any[];
    // 操作
    public viewBool = false;
    public params: any;
    public excelDisplayBool: boolean;
    private currentPage = 1;
    private currentScale = 0.6; // 默认缩放大小

    constructor(private xn: XnService, private pdfViewService: PdfViewService) {
    }

    /**
     * 打开查看窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.pageTitle = params.title;
        this.rows = params.checker;
        this.viewBool = params.operating && params.operating === 'view';
        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
        this.total = params.data.files.length;
        if (this.params.data.files.length > 0) {
            this.onPage(1);
        }
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     * 翻页查看
     *  this.pdfViewService.m_init = false;
     * @param e
     */
    public onPage(e) {
        if (typeof e !== 'number') {
            return;
        }
        this.pdfViewService.setMemberValue('m_init', false);
        this.excelDisplayBool = false;
        const file = this.params.data.files[e - 1];
        const index = file.fileId.toString().lastIndexOf('.');
        this.fileType = file.fileId.substr(index + 1).toLowerCase();
        if (['jpg', 'jpeg', 'png'].includes(this.fileType)) {
            this.fileSrc = `/api/attachment/view?key=${file.fileId}`;
        } else if (this.fileType === 'pdf') {
            setTimeout(() => {
                // 将pdf转成canvas
                const url = `/api/attachment/view?key=${file.fileId}`;
                this.pdfViewService.pdfToCanvas(url);

            }, 0);
        } else {
            this.excelDisplayBool = true;
            this.currentPage = e;
        }
    }


    public handleSubmit() {
        let value = this.mainForm.value;
        if (typeof value === 'string') {
            value = JSON.parse(value);
        }
        this.close(value);
    }

    // 取消
    public handleCancel() {
        this.close(null);
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

    /**
     * 下载excel
     */
    public downFiles() {
        const file = this.params.data.files[this.currentPage - 1];
        this.xn.loading.open();
        this.xn.api
            .download('/file/down_capital_file', {files: [file]})
            .subscribe((x: any) => {
                this.xn.api.save(x._body, '应收账款证明.zip');
                this.xn.loading.close();
            });
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
