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
import { DragonPdfViewService } from 'libs/products/bank-puhuitong/src/lib/services/pdf-view.service';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { XnUtils } from '../../../common/xn-utils';

@Component({
    selector: 'app-dragon-ocr-mfile-detail-modal',
    templateUrl: './dragon-ocr-mfile-detail.modal.html',
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
export class DragonOcrMfileDetailModalComponent {
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
    public constructor(private pdfViewService: DragonPdfViewService, private xn: XnService,
                       private cdr: ChangeDetectorRef) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.value;
        this.total = this.params.files.length;
        this.shows = params.checkers || [];
        this.pageTitle = params.title;
        this.isShow = params.isShow;
        this.pageTitle = params.title;
        this.qrsType = params.qrsType || '';
        this.originalItem = params.value.newInfo;
        this.isShowOcrAlert = JSON.stringify(params.value.newInfo) !== '{}';
        this.buildFormGroup();
        if (this.params.files && this.params.files.length > 0) {
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
        this.pdfViewService.m_init = false;
        const file = this.params.files[e - 1];
        this.fileType = file.filePath.substr(-3).toLowerCase() === 'pdf' ? 'pdf' : 'img';
        if (this.fileType === 'img') {
            this.fileSrc = this.xn.file.view(file);
        } else {
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(this.xn.file.view(file));
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
    /**
     *  下载合同
     */
    public onDownLoad() {
        this.xn.api.AvengerDownload('/file/downFile', {
            files: this.params.files,
        }).subscribe((v: any) => {
            this.xn.api.save(v._body, `${QrsFileTypeEnum[this.qrsType]}.zip`);
        });
    }
    public handleSubmit() {
        // 龙光下两种模式只有当contractNum字段更新了才需要调该接口
        // 万科下 当contractNum，debtUnit，debtUnitAccount，debtUnitBank任一字段更新都都需要调该接口
        const param = {} as any;
        const changeInfo = {} as any;
        let postFalg = false;  // 标识是否需要调用更新接口
        switch (this.qrsType) {
            case '1':
                param.fileType = 2;
                break;
            case '2':
                param.fileType = 3;
                break;
            case '3':
                param.fileType = 1;
                break;
            // case '4':
            //     //雅居乐
            //     param['fileType'] = 4;
            //     break;
            // case '5':
            //     param['fileType'] = 5;
            //     break;
        }
        if (this.qrsType && QrsTypeEnum[this.qrsType] === 'vanke') {
            for (const key in this.mainForm.value) {
                if (key === 'contractNum'
                  && (this.params.contractNum !== this.mainForm.value.contractNum
                    || this.params.debtUnit !== this.mainForm.value.debtUnit
                    || this.params.debtUnitAccount !== this.mainForm.value.debtUnitAccount
                    || this.params.debtUnitBank !== this.mainForm.value.debtUnitBank)) {
                    param.modelType = 2;
                    param.contractNum = this.mainForm.value.contractNum;
                    param.debtUnit = this.mainForm.value.debtUnit;
                    param.debtUnitAccount = this.mainForm.value.debtUnitAccount;
                    param.debtUnitBank = this.mainForm.value.debtUnitBank;
                    postFalg = true;
                } else if (this.params[key] !== this.mainForm.value[key]) {
                    changeInfo[key] = this.mainForm.value[key];
                }
            }
        } else if (this.qrsType && QrsTypeEnum[this.qrsType] === 'dragon1' || this.qrsType && QrsTypeEnum[this.qrsType] === 'dragon2') {
            for (const key in this.mainForm.value) {
                if (key === 'contractNum' && this.params.contractNum !== this.mainForm.value.contractNum) {
                    param.modelType = 1;
                    param.contractNum = this.mainForm.value.contractNum;
                    postFalg = true;
                } else if (this.params[key] !== this.mainForm.value[key]) {
                    changeInfo[key] = this.mainForm.value[key];
                }
            }
        }
        const obj = Object.assign({}, this.mainForm.value);
        const allObj = this.deepCopy(this.params, {});
        for (const key in obj) {
            allObj[key] = obj[key];
        }
        if (postFalg) {
            this.xn.api.avenger.post('/sub_system/ocr/update_ocr_result', param).subscribe(x => {
                if (x.ret === 0) {
                    allObj.mainFlowId = x.data.mainFlowId;
                    allObj.isMatching = x.data.isMatching;
                    this.close({
                        action: 'ok',
                        updateObj: allObj
                    });
                }
            });
        } else if (JSON.stringify(changeInfo) !== '{}') {
            this.close({
                action: 'ok',
                updateObj: allObj
            });
        } else {
            this.close({
                action: 'cancel'
            });
        }
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
