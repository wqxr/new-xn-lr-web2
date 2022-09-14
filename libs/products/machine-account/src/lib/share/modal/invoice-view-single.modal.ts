/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：invoice-view-modal.component.ts
 * @summary：查看发票文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          台账发票查看        2019-09-05
 * **********************************************************************
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ModalSize, ModalComponent } from 'libs/shared/src/lib/common/modal/components/modal';
@Component({
    templateUrl: './invoice-view-single.modal.html',
    styleUrls: ['./invoice-view-modal.component.css'],
    providers: [
        PdfViewService
    ]
})
export class ViewInvoiceSingleModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;

    private observer: any;

    fpdm: any; // 发票代码
    fphm: any; // 发票号码
    kprq: any; // 开票日期
    kpje: any; // 开票金额
    fileImg: any; // 发票图像
    isdiaplayPic = false;
    titleclick = '显示详情';
    sail = '';
    forsail = '';
    detailinfo = '';
    degree = 0;
    moneyAlert = '';
    pageTitle = '查看发票信息';
    // 金蝶验证数据
    public jindieDetail: any;
    private currentScale = .6;
    public mainForm: FormGroup;
    params: any;
    public total: number;
    public pageSize = 1;
    constructor(private xn: XnService, private pdfViewService: PdfViewService) {
    }

    ngOnInit() {
    }

    /**
     * 打开验证窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.params = params.value;
        this.fpdm = params.invoiceCode || '';
        this.fphm = params.invoiceNum || '';
        this.kprq = params.invoiceDate || '';
        this.kpje = params.invoiceAmount || '';

        if (params.invoiceAmount) {
            this.moneyAlert = XnUtils.convertCurrency(params.invoiceAmount)[1];
        }

        // 显示发票图像
        this.fileImg = params.fileId || params.filePath ? this.xn.file.dragonView({ fileId: params.fileId, filePath: params.filePath }) : '';

        this.modal.open(ModalSize.XLarge);
        this.showJdDetail(params.invoiceNum, params.invoiceCode);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public onOk() {
        this.modal.close();
        this.observer.next({ action: 'ok' });
        this.observer.complete();
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
     *  显示金蝶验证详情
     * @param paramInvoiceNum
     */
    public showJdDetail(paramInvoiceNum: string, paramInvoiceCode: string) {
        if (!!paramInvoiceNum) {
            this.xn.dragon.post('/file/invoice_message', { invoiceNum: paramInvoiceNum, invoiceCode: paramInvoiceCode }).subscribe(x => {
                if (x.data === '') {

                } else {
                    this.jindieDetail = x.data;
                    this.sail = x.data.list.find(item => {
                        return item.label === '购方名称';
                    }).value;
                    this.forsail = x.data.list.find(item => {
                        return item.label === '销方名称';
                    }).value;
                    this.detailinfo = x.data.list.find(item => {
                        return item.label === '备注';
                    }).value;
                }
            });
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
     *  表头文件查看按钮文字
     */
    public diaplayRecord() {
        this.isdiaplayPic = !this.isdiaplayPic;
        this.isdiaplayPic === false ? this.titleclick = '显示详情' : this.titleclick = '显示图片';

    }
    public handleSubmit() {
        const obj = Object.assign({}, this.params.files, this.mainForm.value);
        this.close({
            action: 'ok',
            contractType: obj
        });
    }
}
