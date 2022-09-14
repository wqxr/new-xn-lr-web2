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
 * 1.0                 wangqing          代码格式化         2019-08-29
 * **********************************************************************
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';
import { PdfViewService } from '../../../services/pdf-view.service';
import { XnService } from '../../../services/xn.service';
import { XnUtils } from '../../../common/xn-utils';

@Component({
    templateUrl: './invoice-view-modal.component.html',
    styleUrls: ['./dragon-invoice-view-modal.component.less'],
    providers: [
        PdfViewService
    ]
})
export class VankeInvoiceViewModalComponent implements OnInit {

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
    params: any[] = [];
    public total: number;
    public pageSize = 1;
    public paging = 0;

    // 金蝶验证数据
    public jindieDetail: any;
    private currentScale = .6;

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
        this.params = params.fileList;

        this.total = params.fileList.length;
        this.paging = params.paramIndex + 1;
        this.onPage(this.paging);


        this.modal.open(ModalSize.XXLarge);

        //  this.showJdDetail(params[0].invoiceNum);
        return Observable.create(observer => {
            this.observer = observer;
        });

    }

    public onOk() {
        this.modal.close();
        this.pdfViewService.onDestroy();
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
                if (x.data && x.data !== '') {
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
                } else {
                    this.sail = '';
                    this.forsail = '';
                    this.detailinfo = '';
                }

            });
        }
    }

    /**
     *  表头文件查看按钮文字
     */
    public diaplayRecord() {
        this.isdiaplayPic = !this.isdiaplayPic;
        this.isdiaplayPic === false ? this.titleclick = '显示详情' : this.titleclick = '显示图片';

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
        // console.info('eee=>', e);
        // this.paging = e || 1;

        this.fpdm = this.params[e - 1].invoiceCode || '';
        this.fphm = this.params[e - 1].invoiceNum || '';
        this.kprq = this.params[e - 1].invoiceDate || '';
        this.kpje = this.params[e - 1].invoiceAmount || '';

        if (this.params[e - 1].invoiceAmount) {
            this.moneyAlert = XnUtils.convertCurrency(this.params[e - 1].invoiceAmount)[1];
        }

        // 显示发票图像
        this.fileImg = this.params[e - 1].fileId ? this.xn.file.dragonView(this.params[e - 1]) : '';
        this.showJdDetail(this.params[e - 1].invoiceNum, this.params[e - 1].invoiceCode);
    }
}
