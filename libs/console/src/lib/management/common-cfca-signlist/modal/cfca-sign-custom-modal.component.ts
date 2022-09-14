/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mfiles-view-modal.component.ts
 * @summary：针对通用签章的合同弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          通用签章盖章列表    2021-06-24
 * **********************************************************************
 */

import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { CfcaCodeModalComponent } from 'libs/shared/src/lib/public/modal/cfca-code-modal.component';
import { CfcaCommonSignCodeModalComponent } from './common-sign-cfca-code-modal.component';
import * as md5 from 'js-md5';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
@Component({
    templateUrl: './cfca-sign-custom-modal.component.html',
    styles: [`
    .pdf-container {
        width: 100%;
        height: calc(100vh - 380px);
        border: none;
        overflow:auto;
    }

    .text-padding {
        padding: 10px;
    }

    .fa-color {
        color: #ff0000;
    }

    .list-group-position {
        max-height: 500px;
        overflow-y: auto
    }
    .display-content {
        height: calc(100vh - 280px);
        text-align: center;
        overflow-y: auto;
        background: #E6E6E6;
    }
    `],

})
export class CfcaSignCustomModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('szca') szca: ElementRef;
    private ocx: any;
    public total: number;
    public pageSize = 1;
    private observer: any;
    private observable: any;
    public params: any;
    public recordId = ''; //
    private subject$: Subject<any>;
    pageTitle = '';
    signText = '';
    public currentScale = .6;
    paging: number;
    // 是否为生产模式
    public isProduction = true;
    // 默认激活的合同
    public activecaCode: number;
    codeNumber = '';
    public ableClick = true;
    public signSuccess = false;
    public caType = caType.CA; // 当前证书类型
    // 当前合同md5值
    private currentContractPreSignMd5: any;
    public constructor(private pdfViewService: PdfViewService, private xn: XnService, private vcr: ViewContainerRef) {
        this.isProduction = this.xn.user.env === 'production';
    }

    public ngOnInit() {
        this.observable = Observable.create(observer => {
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
        this.paging = e;
        const file = this.params[e - 1]?.fileObj ? this.params[e - 1].fileObj : this.params[e - 1];
        if (this.caType === caType.CA) {
            this.createOcx();
            this.caDisplay(file);
        } else {
            setTimeout(() => {
                this.pdfViewService.m_init = false;
                this.pdfViewService.pdfToCanvas(this.xn.file.dragonView(file), 'urlallPdf');
            }, 50);
        }


    }
    // blob转换成base64
    decode(base64Str) {
        let binary = '';
        const bytes = new Uint8Array(base64Str);
        for (let len = bytes.byteLength, i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        // 将二进制字符串转为base64字符串
        return window.btoa(binary);
    }
    /**
     *
     * @param file base64转换成blob
     */
    convertBase64ToBlob(dataurl) {
        const bstr = atob(dataurl);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: 'application/pdf' });
    }
    // 转成file
    blobToFile(Blob, fileName) {
        Blob.lastModifiedDate = new Date();
        Blob.name = fileName;
        return Blob;
    }
    private caDisplay(file: { fileId: string, fileName: string, filePath: string }) {
        this.subject$ = new Subject();
        this.subject$.subscribe(res => {
            try {
                const data = this.decode(res._body);
                const ret = this.ocx.SZCA_LoadFromString(data);
                this.ableClick = false;
                if (ret !== 0) {
                    alert(this.ocx.SZCA_GetErrMsg(ret));
                    return;
                }
                this.currentContractPreSignMd5 = md5(res._body); // 当前文件未签署前md5
            } catch (error) {
                alert(error);
            }
        });
        this.xn.api.assets(this.xn.file.dragonView(file), 'arraybuffer').subscribe(this.subject$);
    }



    public onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    open(params: any): Observable<string> {
        this.activecaCode = 0;
        this.recordId = params.recordId;
        this.caType = Number(params.caType);
        // 获取当前CA证书类型 2:深圳CA 1：为cfca
        delete params.recordId;
        delete params.flowId;
        delete params.caType;
        this.params = params;
        this.total = this.params.length;
        // if (this.caType === caType.CA) {
        //     this.createOcx();
        // }
        // this.createOcx();
        this.onPage(1);
        this.modal.open(ModalSize.XLarge);
        return this.observable;
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }

    customCfca() {
        if (this.caType === caType.CA) {
            this.oncaSign();
        } else {
            this.oncfcaSign();
        }

    }
    // cfca盖章
    private oncfcaSign() {
        this.xn.dragon.post('/cfca/try_ca_sign', {
            recordId: this.recordId,
            fileId: this.params[this.paging - 1].fileId
        }).subscribe(x => {
            if (x.ret === 0) {
                if (x.data.checkSms) {
                    const params = {
                        recordId: this.recordId,
                        phone: x.data.phone.substring(x.data.phone.length - 4),
                        fileId: x.data.id
                    };
                    XnModalUtils.openInViewContainer(this.xn, this.vcr, CfcaCommonSignCodeModalComponent, params).subscribe(v => {
                        if (v === null) {
                            return;
                        } else if (v.action === 'ok') {
                            this.signSuccess = true;
                            this.pdfViewService.m_init = false;
                            setTimeout(() => {
                                this.pdfViewService.pdfToCanvas(v.contract, 'cfca');
                            }, 50);
                            this.params[this.paging - 1].status = UploadType.Success;
                            this.params[this.paging - 1].fileObj = v.fileObj;
                            this.ableClick = true;
                        }
                    });
                } else {
                    this.signSuccess = true;
                    this.pdfViewService.m_init = false;
                    setTimeout(() => {
                        this.pdfViewService.pdfToCanvas(x.data.contract, 'cfca');
                    }, 50);
                    this.params[this.paging - 1].status = UploadType.Success;
                    this.params[this.paging - 1].fileObj = x.data.fileObj;
                    this.ableClick = true;
                }
            } else {
                this.ableClick = false;
            }

        });
    }

    private oncaSign() {
        const orgName = this.ocx.SZCA_GetCurrCertInfo(23).trim();
        const orgName2 = this.xn.user.orgName.trim();
        if (orgName !== orgName2) {
            if (this.isProduction) {
                alert(
                    `数字证书与当前用户的公司名称不一致，无法签署PDF，证书使用者的公司名称：${orgName}，当前登录者公司名称：${orgName2}`
                );
                return;
            } else {
                alert(
                    `【测试模式】数字证书与当前用户的公司名称不一致，证书使用者的公司名称：${orgName}，当前登录者公司名称：${orgName2}`
                );
            }
        }

        // 用户可能在签章输入PIN时点击了取消，此时通过签章数量来判断用户是否盖章了
        const sealCount = this.ocx.SZCA_GetSealCount();
        // 盖章
        const ret = this.ocx.SZCA_MakeSealBySearchText('', this.params[this.paging - 1].keyword[0]);
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
            const fd = new FormData();
            const blobs = this.convertBase64ToBlob(data);
            const resFile = this.blobToFile(blobs, this.params[this.paging - 1].fileName);
            fd.append('recordId', this.recordId);
            // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
            fd.append('file_data', resFile, resFile && resFile.name);
            this.xn.api.dragon.upload('/cfca/szca_upload', fd).subscribe({
                next: v => {
                    if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            this.params[this.paging - 1].status = UploadType.Success; // 1表示上传成功 后台返回ok
                            this.params[this.paging - 1].fileObj = v.data.data.fileObj;
                            this.ableClick = true;
                        } else if (v.type !== 'progress') {
                            this.xn.msgBox.open(false, v.data.msg);
                            // 上传失败
                        }
                    }
                },
                error: errs => {
                    this.xn.msgBox.open(false, errs);
                },
                complete: () => {
                }

            });

            // 盖章成功之后，修改该合同的状态

        }, 1000);
    }


    /**
 *  切换查看不同的合同，并签署
 * @param paramCurrentContract
 * @param index 当前合同所在下标
 */
    public switchView([paramCurrentContract, index]: [any, number]) {
        // 显示不同的合同
        this.ableClick = true;
        this.activecaCode = index;
        this.signSuccess = false;
        if (this.subject$) {
            this.subject$.unsubscribe();
        }
        this.onPage(index + 1);
    }
    /**
    * 检查所有合同是否全部签署完成
    */
    public invalid(params: any): boolean {
        if (params !== undefined) {
            return params.some(
                item => item.status === undefined || item.status !== 1);
        }
    }
    public contractSign() {
        setTimeout(() => {
            this.close('ok');
        }, 1000);
    }
    /**
     *  下载保存合同-当前所有合同
     */
    public onSave() {
        const paramsFile = [];
        this.params.forEach((x, index) => {
            if (x.fileObj !== undefined) {
                paramsFile.push(x.fileObj);
            }
            paramsFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
        });
        this.xn.api.dragon.download('/file/downFile', {
            files: paramsFile,
        }).subscribe((v: any) => {
            this.xn.dragon.save(v._body, `合同附件.zip`);
        });
    }
    /**
     *  创建ocx
     */
    private createOcx() {
        // szca的控件需要这样动态创建
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '100%';
        if (navigator.userAgent.indexOf('MSIE') > 0) {
            div.innerHTML = `<object id="PDFReader" align="middle"
                style="left: 0; top: 0; width: 100%; height:100%;" classid="clsid:27DD22AC-F026-49FB-8733-AABB4DA82B8C"></object>`;
        } else if (navigator.userAgent.indexOf('Chrome') > 0) {
            div.innerHTML = `<embed id="PDFReader" type="application/x-lrscft-activex"
                style="left: 0; top: 0; width: 100%; height:100%;"  clsid='{27DD22AC-F026-49FB-8733-AABB4DA82B8C}'>`;
        } else if (navigator.userAgent.indexOf('Firefox') > 0) {
            div.innerHTML = `<object id="PDFReader" type="application/x-lrscft-activex" align='baseline' border='0'
                style="left: 0; top: 0; width: 100%; height:100%;" clsid="{27DD22AC-F026-49FB-8733-AABB4DA82B8C}"></object>`;
        } else {
            div.innerHTML = `<object id="PDFReader" align="middle"
                style="left: 0; top: 0; width: 100%; height:100%;" classid="clsid:27DD22AC-F026-49FB-8733-AABB4DA82B8C"></object>`;
        }

        this.szca.nativeElement.appendChild(div);
        this.ocx = document.getElementById('PDFReader');
        this.showOrHide();
    }
    /**
   *  显示签章工具工具栏
   */
    private showOrHide(): void {
        /**
         *
         * id–对应相应的按钮 默认显现方式
        1：打开按钮 id 显示
        2：保存按钮 id 显示
        3：打印按钮 id 显示
        4：盖章按钮 id 显示
        5：骑缝章按钮 id 显示
        6：手写签名按钮 id 显示
        7：盖章定位按钮 id 隐藏
        8：指纹盖章按钮 id 隐藏
        9：批注盖章按钮 id 隐藏
        10：时间戳方式盖章按钮 id 隐藏
        show–按钮的显示与隐藏开关
        0：按钮隐藏
        1：按钮显示
         */

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
    };
    // 深圳CA时阅读并盖章是否可以点击
    invalidSign() {
        return this.ableClick && this.caType === caType.CA;
    }
}

enum caType { // 证书类型
    'CA' = 2,
    'CFCA' = 1,
}
enum UploadType {
    Fail = 0,
    Success = 1
}
