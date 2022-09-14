/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mfiles-view-modal.component.ts
 * @summary：设置合同文本
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  wangqing         设置文本弹窗     2021-06-24
 * **********************************************************************
 */

import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalSize, ModalComponent } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';

@Component({
    templateUrl: './cfca-set-text-contract.modal.html',
    styles: [`

        .pdf-container {
            width: 100%;
            overflow-y: auto;
            height: calc(100vh - 280px);
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
        .keyword{
            display:flex;
            align-items: center;
            margin-bottom:20px;
        }
        .keyword span {
            width:120px;
        }
        .keyword a{
            width: 60px;
            margin-left: 10px;
        }
        .button-group {
            float: right;
            padding: 20px 15px 0 15px;
        }
        .addkey{
            text-align:right;
        }
    `],
    providers: [
        PdfViewService
    ]
})
export class CfcaSetTextContractModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    public fileType: string;
    public fileSrc: string;
    public total: number;
    public pageSize = 1;
    private observer: any;
    public mainForm: FormGroup;
    public degree = 0;
    public params: any;
    pageTitle = '';
    public currentScale = .6;
    public shows: any[] = [];
    paging: number;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    signTextList: SignText[] = [{
        label: '关键字', keyword: '',
    }];
    setTextParams: SetTextParam[] = [];
    isReadonly = false;

    public constructor(private pdfViewService: PdfViewService, private xn: XnService) {
    }

    public ngOnInit() {
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
        this.paging = e;
        this.pdfViewService.m_init = false;
        this.fileType = (this.params.fileName.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';
        setTimeout(() => {
            this.pdfViewService.pdfToCanvas(this.xn.file.dragonView(this.params), 'urlallPdf');
        });

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

    open(params: any): Observable<any> {
        this.params = params.paramFiles;
        console.log('params==>', this.params);
        this.isReadonly = params.type === 1 ? true : false;
        if (this.params.keyword.length > 0) {
            this.signTextList = [];
            this.params.keyword.forEach((x, index) => {
                this.signTextList.push({
                    label: '关键字' + (index + 1), keyword: x,
                });
            });
        }
        this.onPage(1);
        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }
    addText() {
        this.signTextList.push({
            label: '关键字', keyword: '',
        });
    }
    clearText(paramIndex: number) {
        this.signTextList.splice(paramIndex, 1);
    }

    /**
     *  提交
     */
    public onSubmit() {
        const keyText = this.signTextList.map(x => x.keyword);
        this.xn.dragon.post('/cfca/is_pfd_keyword', {fileId:this.params.fileId,fileName:this.params.fileName,keyword:keyText}).subscribe(x => {
            if (x.ret === 0) {
                const alert = [];
                const detail = x.data.details;
                let keywords = []; //关键字
                detail.forEach(v => {
                    if (v.count === 0) {
                        keywords.push(v.keyword);
                    }
                    if (v.count >= x.data.maxKeywordCount) {
                        alert.push(`${alert.length + 1}、您设置的'${v.keyword}'关键字在文本中不得超过${x.data.maxKeywordCount}次，请检查后再提交`)
                    }
                });
                if (keywords.length!==0) {
                    alert.push(`${alert.length + 1}、您设置的‘${keywords.join(',')}’等关键字查找不到，请检查后再提交`)
                }
                if (alert.length === 0) {
                    this.close({ action: 'ok', setTextParams: keyText });
                } else {
                    this.xn.msgBox.open(false, alert);
                }
            }

        })
    }

    valid(): boolean {
        return this.signTextList.some(x => x.keyword.trim().length === 0);
    }
}
interface SignText {
    label: string;
    keyword: string;
}
interface SetTextParam {
    files: any[];
    keyword: string[];
}
