/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-edit-modal.component
 * @summary：查看ocr信息弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                    yu          查看ocr信息弹窗       2019-08-30
 * **********************************************************************
 */

import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup, AbstractControl } from '@angular/forms';
import { PdfViewService } from '../../../services/pdf-view.service';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { XnUtils } from '../../../common/xn-utils';
import { DragonPdfViewService } from 'libs/products/bank-puhuitong/src/lib/services/pdf-view.service';

@Component({
    selector: 'app-dragon-ocr-mfile-show-modal',
    templateUrl: './dragon-ocr-mfile-show.modal.html',
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
        .ocr-alert {
            float: left;
            font-size: 12px;
            color: #ec5b5b;
            margin: 1px 0px 1px 0px;
        }
    `],
    providers: [
        PdfViewService
    ]
})
export class DragonOcrMfileShowModalComponent {
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
    public qrsType?: any;
    private currentScale = .6; // 初始缩放
    public originalItem: any;
    public isShowOcrAlert = false;
    public ocrClass = '';
    public copies = 0;
    public constructor(private pdfViewService: DragonPdfViewService, private xn: XnService,
                       private cdr: ChangeDetectorRef) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.value;
        this.total = this.params.length;
        this.copies = params.copies;
        this.shows = params.checkers || [];
        this.pageTitle = params.title;
        this.isShow = params.isShow;
        this.pageTitle = params.title;
        this.qrsType = params.qrsType || '';
        this.buildFormGroup();
        if (this.params[0].files && this.params[0].files.length > 0) {
            this.onPage(1);
        }
        this.cdr.markForCheck();
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
        this.shows.map((el) => {
            el.value = this.params[e - 1][el.checkerId] || '';
            el.options = { readonly: true };
        });
        this.originalItem = this.params[e - 1].newInfo;
        this.isShowOcrAlert = JSON.stringify(this.params[e - 1].newInfo) !== '{}';

        this.pdfViewService.m_init = false;
        const file = this.params[e - 1].files[0];
        this.fileType = file.filePath.substr(-3).toLowerCase() === 'pdf' ? 'pdf' : 'img';
        if (this.fileType === 'img') {
            this.fileSrc = this.xn.file.view(file);
        } else {
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(this.xn.file.view(file));
            });
        }
        this.cdr.markForCheck();
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
    /**
     *  下载合同
     */
    public onDownLoad() {
        const allFiles = [].concat(...this.params.map((it) => it.files));
        this.xn.api.AvengerDownload('/file/downFile', {
            files: allFiles,
        }).subscribe((v: any) => {
            this.xn.api.save(v._body, `${this.qrsType}.zip`);
        });
    }
    public handleSubmit() {
        this.close({
            action: 'ok'
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
    private deepCopy(obj, c) {
        c = c || {};
        for (const i in obj) {
          if (typeof obj[i] === 'object') {
              c[i] = obj[i].constructor === Array ? [] : {};
              this.deepCopy(obj[i], c[i]);
          } else {
              c[i] = obj[i];
          }
        }
        return c;
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
/***
 *  付确类型
 */
export enum QrsTypeEnum {
    /** 万科 */
    vanke = 3,
    /** 雅居乐 */
    yjl1 = 4,
    yjl2 = 5,
    /** 龙光 */
    dragon1 = 1,
    dragon2 = 2,
    /**默认 */
    default = 100
}
export enum QrsFileTypeEnum {
    /** 万科 */
    '《付款确认书》' = 3,
    /** 雅居乐 */
    // '《付款确认书(总部致保理商)》' = 4,
    /** 龙光 */
    '《付款确认书(总部致保理商)》' = 1,
    '《付款确认书(总部致劵商)》' = 2,
}
