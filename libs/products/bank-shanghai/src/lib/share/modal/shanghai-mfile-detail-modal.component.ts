/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-edit-modal.component
 * @summary：文件查看补录弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao      文件查看补录弹窗       2019-08-30
 * **********************************************************************
 */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    selector: 'lib-shanghai-mfile-detail-modal',
    templateUrl: './shanghai-mfile-detail-modal.component.html',
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
export class ShangHaiViewContractModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;

    private observer: any;
    public mainForm: FormGroup;
    public formModule = 'dragon-input';
    public svrConfig: any;
    public shows: any[];

    public params: any;
    public pageTitle = '';

    public fileType: string;
    public fileSrc: any[] = [];
    fileIndex = 1;
    choseFile: any[] = [];
    public fSrc: string;
    public total = 0;
    public pageSize = 1;
    public degree = 0;
    private currentScale = .6; // 初始缩放

    type = 0; // 1查看 2编辑
    public ctrl: AbstractControl;
    public constructor(private pdfViewService: PdfViewService, private xn: XnService) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.pageTitle = params.title;
        this.type = params.type;

        this.shows = params.checker || [];
        this.shows.forEach(checker => {
            if (['contractMoney', 'receive'].includes(checker.checkerId)) {
                checker.value = this.formatNum2Money(checker.value);
            }
        });
        this.buildFormGroup();
        this.ctrl = this.mainForm.get('index');

        if (!!this.params.contractFile) {
            const file = XnUtils.parseObject(this.params.contractFile, []) || [];
            this.total = file.length;
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
        if (!!this.params.inputFile) {
            this.choseFile = XnUtils.parseObject(this.params.inputFile, []);
            this.choseFile.forEach((x, index) => {
                XnUtils.parseObject(x, []).forEach(y => {
                    if (y.fileId === this.fileSrc[e - 1].fileId) {
                        this.ctrl.setValue(index + 1);
                    }
                });
            });
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
        if (this.innerImg && this.innerImg.nativeElement && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement) {
            this.degree = this.pdfViewService.rotateImg(val, this.degree,
                this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement, this.currentScale);
        }
    }

    /**
     *  文件缩放
     * @param params 放大缩小  large:放大，small:缩小
     */
    public scaleImg(params: string) {
        if (this.innerImg && this.innerImg.nativeElement && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement) {
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
        const formValue = this.mainForm.value || {};
        const obj = Object.assign({}, formValue, {
            mainFlowId: this.params.mainFlowId,
            debtUnit: this.params.debtUnit || '',
            projectCompany: this.params.projectCompany || '',
            receive: !XnUtils.isEmptys(this.params.receive, [0]) ? this.formatMoney2Num(this.params.receive) : '',
            contractMoney: !XnUtils.isEmptys(this.mainForm.value.contractMoney, [0]) ?
                this.formatMoney2Num(this.mainForm.value.contractMoney) : '',
            percentOutputValue: !XnUtils.isEmptys(this.mainForm.value.percentOutputValue, [0]) ?
                this.formatMoney2Num(this.mainForm.value.percentOutputValue) : '',
            totalReceive: !XnUtils.isEmptys(this.mainForm.value.totalReceive, [0]) ?
                this.formatMoney2Num(this.mainForm.value.totalReceive) : '',
        });
        if (['performanceFile'].includes(this.params.checkerId)) {
            obj.performanceFile = this.params.contractFile;
        } else if (['dealContract'].includes(this.params.checkerId)){
            obj.contractFile = this.params.contractFile;
            obj.inputFile = this.params.inputFile;
        }
        this.xn.dragon.post('/contract_temporary/save', obj).subscribe(x => {
            if (x.ret === 0) {
                this.close({
                    flag: x.data.flag,
                    action: 'ok',
                    contractInfo: {
                        ...this.mainForm.value,
                        receive: !XnUtils.isEmptys(this.params.receive, [0]) ? this.formatMoney2Num(this.params.receive) : '',
                        contractMoney: !XnUtils.isEmptys(this.mainForm.value.contractMoney, [0]) ?
                            this.formatMoney2Num(this.mainForm.value.contractMoney) : '',
                        percentOutputValue: !XnUtils.isEmptys(this.mainForm.value.percentOutputValue, [0]) ?
                            this.formatMoney2Num(this.mainForm.value.percentOutputValue) : '',
                        totalReceive: !XnUtils.isEmptys(this.mainForm.value.totalReceive, [0]) ?
                            this.formatMoney2Num(this.mainForm.value.totalReceive) : '',
                    }
                });
            }
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

    /**
     * @description: 数值格式转换
     * @param {string} val
     * @return {*}
     */
    private formatNum2Money(val: string | number = ''): string {
        const filterVal = Number(val.toString().replace(/,/g, '')).toFixed(2);
        const truncNum = filterVal.indexOf('.') > -1 ? filterVal.substring(0, filterVal.indexOf('.')) : filterVal;
        const integer = truncNum.toString().replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
        const decimal = filterVal.indexOf('.') > -1 ?
            filterVal.substring(filterVal.indexOf('.') + 1, filterVal.length) : '';
        const formatVal = `${integer}${!!decimal ? '.' : ''}${decimal}`;
        return formatVal;
    }

    /**
     * @description: 数值格式转换
     * @param {string} val
     * @return {*}
     */
    private formatMoney2Num(val: string | number = ''): number {
        const filterVal = Number(val.toString().replace(/,/g, '')).toFixed(2);
        return Number(filterVal);
    }
}
