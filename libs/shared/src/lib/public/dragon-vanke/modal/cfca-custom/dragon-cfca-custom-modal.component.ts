/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mfiles-view-modal.component.ts
 * @summary：查看文件信息,多张
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          查看文件方法修改     2019-04-18
 * **********************************************************************
 */

import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../../../common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { PdfViewService } from '../../../../services/pdf-view.service';
import { XnService } from '../../../../services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { CfcaCodeModalComponent } from '../../../modal/cfca-code-modal.component';

@Component({
    templateUrl: './dragon-cfca-custom-modal.component.html',
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

        .button-group {
            float: right;
            padding: 20px 15px 0 15px;
        }
    `],
    providers: [
        PdfViewService
    ]
})
export class DragonCfcaCustomModalComponent implements OnInit {
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
    signText = '';
    public currentScale = .6;
    public shows: any[] = [];
    paging: number;
    projectCode = '';
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    success: boolean = false;
    codeNumber = '';

    public constructor(private pdfViewService: PdfViewService, private xn: XnService, private vcr: ViewContainerRef) {
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
        this.success = false;
        this.paging = e;
        this.pdfViewService.m_init = false;
        const file = this.params[e - 1];
        this.fileType = (file.fileName.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';

        if (this.fileType === 'img') {
            this.fileSrc = this.xn.file.view(file);
        } else {
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(this.xn.file.dragonView(file));
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

    open(params: any): Observable<any> {
        this.params = params;
        this.total = this.params.length;
        if (this.params && this.params.length > 0) {
            this.onPage(1);
        }

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

    customCfca() {
        this.success = false;
        if (!this.projectCode) {
            this.xn.api.dragon.post('/cfca/cfca_custom_sms', {}).subscribe(x => {
                if (x.ret === 0) {
                    this.projectCode = x.data.projectCode;
                    const servicesParam = Object.assign({}, {
                        service: 'dragon', phone: '', reSign: true, keyword: this.signText,
                        fileId: this.params[this.paging - 1].fileId, projectCode: x.data.projectCode
                    });
                    XnModalUtils.openInViewContainer(this.xn, this.vcr, CfcaCodeModalComponent, servicesParam).subscribe(x => {
                        if (!!x.data) {
                            this.success = true;
                            this.codeNumber = x.code;
                            setTimeout(() => {
                                this.pdfViewService.pdfToCanvas(x.data, 'showpdf');
                            });
                        }
                    });
                }
            });
        } else {
            this.xn.api.dragon.post('/cfca/cfca_custom_sign', {
                keyword: this.signText,
                fileId: this.params[this.paging - 1].fileId, projectCode: this.projectCode, smsCode: this.codeNumber
            }).subscribe(x => {
                this.success = true;
                setTimeout(() => {
                    this.pdfViewService.pdfToCanvas(x.data, 'showpdf');
                });

            });
        }

    }
    /**
     *  下载保存合同-当前所有合同
     */
    public onSave() {
        let paramsFile=[];
        paramsFile.push(this.params[this.paging-1]);
        console.log('params==>',this.params[this.paging-1]);
        this.xn.api.dragon.download('/file/downFile', {
            files: paramsFile,
        }).subscribe((v: any) => {
            this.xn.dragon.save(v._body, `${this.params[this.paging-1].fileName}.zip`);
        });
    }
}
