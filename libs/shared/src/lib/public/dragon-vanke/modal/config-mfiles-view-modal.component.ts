/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mfiles-view-modal.component.ts
 * @summary：多文件信息查看(可选择文件查看)-支持配置化按钮
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason                 date
 * 1.0                 congying       中介机构查看-下载文件     2020-06-29
 * **********************************************************************
 */

import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { PdfViewService } from '../../../services/pdf-view.service';
import { XnService } from '../../../services/xn.service';

@Component({
    selector: 'app-dragon-config-mfiles-view-modal',
    templateUrl: './config-mfiles-view-modal.component.html',
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
            vertical-align: middle;
        }

        .edit-content {
            height: calc(100vh - 280px);
            display: flex;
        }

        .edit-content-flex {
            flex: 1;
            text-align: center;
            overflow-y: scroll;
            background: #E6E6E6;
        }

        .button-group {
            float: right;
            padding-top: 20px;
        }
    `],
    providers: [
        PdfViewService
    ]
})
export class DragonConfigMfilesViewModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    public fileType: string;
    public fileSrc: string[] = [];
    public fSrc: string;
    public total: number;
    public pageSize = 1;
    private observer: any;
    public mainForm: FormGroup;
    public degree = 0;
    public params: any; // 参数
    pageTitle = '';
    public currentScale = .6;
    public shows: any[] = [];

    public paramFiles: any[]; // 所有要查看的文件
    public paramIndex = 0; // 当前查看文件的下标
    /** 按钮配置 [{label: '', value: ''}]*/
    public leftButtons: any[];
    public rightButtons: any[] = [{ label: '取消', operate: 'cancel' }];

    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;

    public constructor(private pdfViewService: PdfViewService, private xn: XnService, private cdr: ChangeDetectorRef) {
    }

    public ngOnInit() {
    }

    /**
     *  打开弹窗
     * @param params 路由参数
     *
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.paramFiles = params.paramFiles || []; // 查看文件
        this.paramIndex = params.index + 1 || 1; // 当前文件下标
        this.leftButtons = params.leftButtons || [];
        this.rightButtons = params.rightButtons.length || this.rightButtons;
        this.total = this.paramFiles.length; // 文件总数
        if (this.paramFiles && this.paramFiles.length > 0) {
            this.onPage(this.paramIndex);
        }
        this.cdr.markForCheck();
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
    public onPage(e) {
        if (typeof e !== 'number') {
            return;
        }
        this.paramIndex = e || 1;
        this.pdfViewService.m_init = false;
        this.fSrc = this.fileSrc[e - 1];
        const file = this.paramFiles[e - 1];
        const fileType = file.fileName.substr(-3).toLowerCase()
        if (!!!file.filePath) {
            this.fileType = fileType === 'pdf' ? 'pdf' :
                ['jpg', 'jpeg', 'png'].includes(fileType) ? 'img' : 'excel';
        } else {
            this.fileType = fileType === 'pdf' ? 'pdf' :
                ['jpg', 'jpeg', 'png'].includes(fileType) ? 'img' : 'excel';
        }
        if (this.fileType === 'img') {
            this.fSrc = file.isAvenger ? this.xn.file.view(file) : this.xn.file.dragonView(file);
        } else if (this.fileType === 'pdf') {
            setTimeout(() => {
                file.isAvenger ? this.pdfViewService.pdfToCanvas(this.xn.file.view(file)) : this.pdfViewService.pdfToCanvas(this.xn.file.dragonView(file));
            });
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

    public onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    /**
     *  查看单个文件
     * @param fileInfo 文件信息
     * @param i 下标
    */
    public viewSingleFile(fileInfo: any, i: number) {
        this.paramIndex = i;
        this.onPage(i + 1);
    }

    /**
    * 底部按钮点击事件
    * @param btn
    */
    onBtnClick(btn: { laebl: string, operate: string }) {
        if (btn.operate === 'cancel') { this.onCancel(); } // 关闭
        if (btn.operate === 'downloadAll') {  // 下载所有文件
            this.xn.dragon.download('/project_manage/file_agency/download_agency_file',
                {
                    capitalPoolId: this.params.capitalPoolId,
                    fileType: this.params.fileType
                }
            ).subscribe((v: any) => {
                this.xn.dragon.save(v._body, '中介机构相关文件.zip');
            });
        }
        if (btn.operate === 'downloadNow') {  // 下载当前文件
            this.xn.file.saveFile(this.paramFiles[this.paramIndex - 1], this.paramFiles[this.paramIndex - 1].fileName, 'dragon');
        }
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }
}
