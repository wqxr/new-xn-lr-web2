/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：pdf-sign-modal.component.ts
 * @summary：单个合同签署
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          合同盖章检测         2019-05-10
 * **********************************************************************
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as md5 from 'js-md5';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { PdfViewService } from '../../../services/pdf-view.service';


@Component({
    templateUrl: './pdf-sign-modal.component.html',
    styles: [
        `.modal-dialog {
            position: fixed
        }

        .flex-row {
            display: flex;
            margin-bottom: -15px;
        }

        .pdf-container {
            width: 100%;
            height: calc(100vh - 280px);
            border: none;
        }
        .display-content {
            height: calc(100vh - 280px);
            text-align: center;
            overflow-y: auto;
            background: #E6E6E6;
        }

        .this-pdf {
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
        }`
    ]
})
export class AvengerPdfSignModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('szca') szca: ElementRef;

    private observer: any;
    private ocx: any;

    public params: any; // { id: '', secret: '', config: '' }  config是盖章的配置
    // 是否只读
    public isReadonly = false;
    // 是否是生产
    public isProduction = true;
    // 当前合同签署印章时文件流md5
    public currentContractPreSignMd5: any;

    constructor(private xn: XnService, private er: ElementRef, private pdfViewService: PdfViewService) {
        this.isProduction = this.xn.user.env === 'production';
    }

    ngOnInit() {
    }

    /**
     * 打开查看窗口
     * @param params
     * @returns {Observable}
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.isReadonly = this.params.readonly || false;
        // const div = document.createElement('div');
        // div.style.width = '100%';
        // div.style.height = '100%';
        // if (navigator.userAgent.indexOf('MSIE') > 0) {
        //     div.innerHTML = `<object id="PDFReader" align="middle"
        //         style="left: 0; top: 0; width: 100%; height:100%;" classid="clsid:27DD22AC-F026-49FB-8733-AABB4DA82B8C"></object>`;
        // } else if (navigator.userAgent.indexOf('Chrome') > 0) {
        //     div.innerHTML = `<embed id="PDFReader" type="application/x-lrscft-activex"
        //         style="left: 0; top: 0; width: 100%; height:100%;" clsid='{27DD22AC-F026-49FB-8733-AABB4DA82B8C}'>`;
        // } else if (navigator.userAgent.indexOf('Firefox') > 0) {
        //     div.innerHTML = `<object id="PDFReader" type="application/x-lrscft-activex" align='baseline' border='0'
        //         style="left: 0; top: 0; width: 100%; height:100%;" clsid="{27DD22AC-F026-49FB-8733-AABB4DA82B8C}"></object>`;
        // } else {
        //     div.innerHTML = `<object id="PDFReader" align="middle"
        //         style="left: 0; top: 0; width: 100%; height:100%;" classid="clsid:27DD22AC-F026-49FB-8733-AABB4DA82B8C"></object>`;
        // }


        // this.szca.nativeElement.appendChild(div);

        // this.ocx = document.getElementById('PDFReader');

        // this.showOrHide();
        this.xn.avenger.post('/contract/contract/json', {
            id: params.id,
            secret: params.secret
        }).subscribe(json => {
            try {
                this.pdfViewService.m_init = true;
                this.pdfViewService.pdfToCanvas(json.data, 'cfca');
            } catch (error) {
                console.warn(error);
            }
        });
        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    public onOk() {
        this.close({
            action: 'ok'
        });
    }

    /**
     *  签章
     */
    public onSign() {
        // 检查usbkey的公司名称
        const orgName = this.ocx.SZCA_GetCurrCertInfo(23).trim();
        const orgName2 = this.xn.user.orgName.trim();
        if (orgName !== orgName2) {
            if (this.isProduction) {
                alert(`数字证书与当前用户的公司名称不一致，无法签署PDF，证书使用者的公司名称：${orgName}，当前登录者公司名称：${orgName2}`);
                return;
            } else {
                alert(`【测试模式】数字证书与当前用户的公司名称不一致，证书使用者的公司名称：${orgName}，当前登录者公司名称：${orgName2}`);
            }
        }

        // 用户可能在签章输入PIN时点击了取消，此时通过签章数量来判断用户是否盖章了
        const sealCount = this.ocx.SZCA_GetSealCount();

        // 盖章
        let ret;
        if (this.params.config.position) {
            ret = this.ocx.SZCA_DoSealByPage(this.handlePageConfig());
        } else {
            ret = this.ocx.SZCA_MakeSealBySearchText('', this.params.config.text);
        }
        if (ret !== 0) {
            alert(this.ocx.SZCA_GetErrMsg(ret));
            return;
        }

        // 间隔1秒后再检查印章数量
        setTimeout(() => {
            const sealCount2 = this.ocx.SZCA_GetSealCount();
            const data = this.ocx.SZCA_GetCurPdfString();
            if (sealCount2 <= sealCount || data === '') {
                // 认为没盖章
                alert(this.ocx.SZCA_GetErrMsg(this.ocx.SZCA_GetLastErrCode()));
                return;
            }
            // 二次检查合同签署
            if (sealCount2 <= sealCount || data === '') {
                alert(this.ocx.SZCA_GetErrMsg(this.ocx.SZCA_GetLastErrCode()));
                return;
            }
            // 判断盖章是否成功
            if (this.currentContractPreSignMd5 === md5(data)) {
                alert('盖章未成功！，请重新签署。');
                return;
            }
            this.xn.api.post3('/contract/upload', {
                id: this.params.id,
                secret: this.params.secret,
                data
            }).subscribe(() => {
                alert('数字签章成功');
                this.close({
                    action: 'ok',
                });
            });
        }, 1000);
    }

    /**
     *  下载合同
     */
    public onSave() {
        const orgName = this.xn.user.orgName;
        this.xn.api.AvengerDownload('/file/downFile', {
            files: [this.params],
        }).subscribe((v: any) => {
            this.xn.api.save(v._body, `${orgName}合同文件.zip`);
        });
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }

    private handlePageConfig(): string {
        const pageCount = this.ocx.SZCA_GetPageCount();
        const retPage = [];

        // 如果this.params.config中有页码是负数的，则转换为实际页码
        const pages = this.params.config.position.split('#');
        for (const page of pages) {
            const items = page.split(',');
            const pageNum = parseInt(items[items.length - 1], 0);
            if (pageNum < 0) {
                items[items.length - 1] = pageCount + 1 + pageNum;
            }
            retPage.push(items.join(','));
        }

        return retPage.join('#');
    }

    /**
     *  显示工具
     */
    private showOrHide() {
        try {
            const tools = [
                { index: 1, show: 0 },
                { index: 2, show: 0 },
                { index: 3, show: 1 },
                { index: 4, show: 0 },
                { index: 5, show: 0 },
                { index: 6, show: 0 },
                { index: 7, show: 0 },
                { index: 8, show: 0 },
                { index: 9, show: 0 },
                { index: 10, show: 0 }
            ];
            tools.forEach(tool => {
                this.ocx.SZCA_SetToolButtomShowHide(tool.index, tool.show);
            });
        } catch {
            //
        }
    }
}
