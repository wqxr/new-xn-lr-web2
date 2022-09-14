
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：获取公司所有资质文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2022-03-23
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { Observable, of, forkJoin } from 'rxjs';
import { HwModeService } from '../../../services/hw-mode.service';
import { OperateType, MediaFileTypeEnum } from '../../../config/enum/common-enum';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { PdfViewService } from '../../../services/pdf-view.service';
import * as moment from 'moment';

@Component({
    templateUrl: `./certify-getfile-plat-modal.component.html`,
    styles: [`
    .modal-title{
        height:50px;
    }
    ::ng-deep .cdk-overlay-container {
        z-index: 3000;
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
        background: #e6e6e6;
      }
      .page {
        float: right;
        vertical-align: middle;
      }
      .button-group {
        float: right;
        padding: 20px 15px 0 15px;
      }
      .info{
        max-height: 65vh;
        overflow: auto;
    }
    .icon{
        color: #e8060f;
    }
    .spanclass{
        float:right;
    }
    .td-link{
        margin-bottom:5px;
    }
    `]
})
export class CertifyGetFileEntryModal implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public mainForm: FormGroup;
    public fileType: string;
    public fileSrc = '';
    public fSrc: string;
    public params: any;
    public title = '获取资质信息';
    public total: number;
    public certificateNo = '';
    public companyName = '';
    public listInfo = [];
    public flowId = '';
    public alert = '';
    public paramType: number;
    public pageSize = 1;
    public paging = 1;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    public degree = 0;
    fileList = [];
    public currentScale = 1;
    get fileExt() {
        return MediaFileTypeEnum;
    }

    constructor(private cdr: ChangeDetectorRef,
        private xn: XnService, private pdfViewService: PdfViewService,
        public hwModeService: HwModeService, private er: ElementRef,) {
    }

    ngOnInit(): void {

    }
    onSubmit() {
        this.modal.close();
        this.observer.next({ fileList: this.params });
        this.observer.complete();
    }
    invalid() {
        return this.params.filter(x => x.checked === true).length;
    }
    onDownload() {
        const { fileName } = this.params[0];
        this.xn.dragon
            .download('/file/downFile', {
                files: this.params,
            })
            .subscribe((v: any) => {
                this.xn.dragon.save(v._body, `${fileName}.zip`);
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
        this.fSrc = this.fileSrc[e - 1];
        let file = this.params[e - 1];
        this.paging=e;
        console.log(this.paging,e);
        if (typeof file === 'string') {
            file = JSON.parse(file);
        }
        this.fileType = this.getFileType(file);
        if (this.fileType === MediaFileTypeEnum.IMG) {
            this.fSrc = file.isAvenger
                ? this.xn.file.view(file)
                : this.xn.file.dragonView(file);
        } else {
            setTimeout(() => {
                file.isAvenger
                    ? this.pdfViewService.pdfToCanvas(this.xn.file.view(file))
                    : this.pdfViewService.pdfToCanvas(this.xn.file.dragonView(file));
            });
        }
    }




    /**
      * 获取文件类型
      * @param file 文件
      */
    getFileType(file: any): string {
        const fileSubStr = file.fileName.substr(-3).toLowerCase();
        let fileType = '';
        if (!!!file.filePath) {
            fileType =
                fileSubStr === MediaFileTypeEnum.PDF
                    ? MediaFileTypeEnum.PDF
                    : MediaFileTypeEnum.IMG;
        } else {
            fileType =
                fileSubStr === MediaFileTypeEnum.PDF
                    ? MediaFileTypeEnum.PDF
                    : MediaFileTypeEnum.IMG;
        }
        return fileType;
    }



    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.fileList;
        this.total = this.params.length;
        if (this.params && this.params.length > 0) {
            this.onPage(1);
        }
        this.modal.open(ModalSize.XXXLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    onCancel() {
        this.modal.close();
    }
    singleChose(paramFile: { fileId: string, fileName: string, checked: boolean, filePath: string }, paramIndex: number) {
        paramFile.checked = !paramFile.checked;
        this.onPage(paramIndex + 1);
        this.paging = paramIndex + 1;
    }
    public stringLength(paramsString: string) {
        return paramsString.length;
    }
    /**
  *  文件旋转
  * @param val 旋转方向 left:左转，right:右转
  */
    public rotateImg(val) {
        if (
            this.innerImg &&
            this.innerImg.nativeElement &&
            this.outerImg &&
            this.outerImg.nativeElement &&
            this.imgContainer &&
            this.imgContainer.nativeElement
        ) {
            this.degree = this.pdfViewService.rotateImg(
                val,
                this.degree,
                this.innerImg.nativeElement,
                this.outerImg.nativeElement,
                this.imgContainer.nativeElement,
                this.currentScale
            );
        }
    }

    /**
     *  文件缩放
     * @param params 放大缩小  large:放大，small:缩小
     */
    public scaleImg(params: string) {
        if (
            this.innerImg &&
            this.innerImg.nativeElement &&
            this.outerImg &&
            this.outerImg.nativeElement &&
            this.imgContainer &&
            this.imgContainer.nativeElement
        ) {
            // 缩放图片
            this.currentScale = this.pdfViewService.scaleImg(
                params,
                this.innerImg.nativeElement,
                this.outerImg.nativeElement,
                this.imgContainer.nativeElement
            );
        }
    }

}
