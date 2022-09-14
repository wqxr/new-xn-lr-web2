/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：pdf-sign-modal.component.ts
 * @summary：审批放款人工放款回单匹配
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          审批放款回单匹配        2021-05-10
 * **********************************************************************
 */

import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { XnUtils } from '../../../common/xn-utils';
import { LoadingPercentService } from '../../../services/loading-percent.service';
import { UploadPicService } from '../../../services/upload-pic.service';
import { XnService } from '../../../services/xn.service';
import { MfilesViewModalComponent } from '../../modal/mfiles-view-modal.component';
import DragonInfos, { HeadsStyle } from '../components/bean/checkers.tab';
import { DragonMfilesViewModalComponent } from './mfiles-view-modal.component';

@Component({
    selector: 'person-loan-receipt-modal',
    templateUrl: './person-upload-loanreceipt-modal.component.html',
    styles: [`
    .table-head table,.table-body table{width:100%;border-collapse:collapse;margin-bottom: 0px;}
    .table-head{background-color:white}
    .table-body{width:100%; max-height:600px;overflow-y:auto;min-height:50px;}
    .table-body table tr:nth-child(2n+1){background-color:#f2f2f2;}
    .headstyle  tr th{
        border:1px solid #cccccc30;
        text-align: center;
    }
    table thead, tbody tr {
        display:table;
        width:100%;
        table-layout:fixed;
        word-wrap: break-word;
        word-break: break-all;
        }
    .table-body table tr td{
        border:1px solid #cccccc30;
        text-align: center;
        max-width: 70px;
        word-wrap:break-word
    }
    .table-head table tr th {
        border:1px solid #cccccc30;
        text-align: center;
    }
    .detailP {
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        color: #ccc;
    }
    `]
})

export class PersonUploadloanReceiptComponent {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public shows: HeadsStyle[] = DragonInfos.loanReceipt.heads;
    datalist01: any[] = [];
    public params: any;
    public alert = [];
    public alerts = '';
    public pageTitle = '';
    type: number;
    public files: FilesType[] = [];
    row = {
        options: { fileext: 'jpg, jpeg, png, pdf' }
    };
    systemRow = {
        options: { fileext: 'pdf' }
    };
    imgType = '';

    public constructor(public xn: XnService,
        public vcr: ViewContainerRef,
        private loading: LoadingPercentService,
        private uploadPicService: UploadPicService,) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.datalist01 = params.datainfo;
        this.type = params.datainfo.length === 0 ? 1 : 2; // 判断是2人工上传，1还是pdf切割
        this.pageTitle = this.type === 1 ? '系统匹配付款回单' : '付款回单上传';
        this.imgType = `请上传${this.systemRow.options.fileext}文件格式的文件`;
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    public handleCancel() {
        this.close({
            action: 'cancel'
        });
    }

    /**
 *  查看文件
 * @param paramFile
 */
    public onView(paramFile: { fileId: string, fileName: string, isAvenger: boolean }) {
        paramFile.isAvenger = true;
        const paramFiles = [];
        paramFiles.push(paramFile);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, paramFiles).subscribe(() => {
        });
    }
    public onUploadFile(e, id?, i?) {
        if (e.target.files.length === 0) {
            return;
        }
        this.alert[i] = '';
        const data = [];
        const rfile: FilesType[] = [];
        for (const file of e.target.files) {
            const err = this.validateFileExt(file.name);
            if (!XnUtils.isEmpty(err)) {
                this.alert[i] = err;
                // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
                $(e.target).val('');
                return;
            }
            data.push(file);
        }
        this.uploadPicService.compressImage(data[i], this.alert, this.row, (blob, file) => {
            const fd = new FormData();

            this.loading.open(1, 0);
            if (this.type === 2) {
                fd.append('checkerId', 'jdBackFile');
                // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
                fd.append('file_data', e.target.files[0], e.target.files[0].name);
                this.xn.file.upload(fd, true).subscribe(v => {
                    if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            rfile.push(
                                {
                                    mainFlowId: id,
                                    pdf: { fileName: v.data.data.fileName, fileId: v.data.data.fileId, filePath: v.data.data.filePath }
                                });
                            this.loading.close();
                        }
                        this.files[i] = rfile[0];
                    }
                });
            } else {
                // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
                fd.append('pdfBase64Str', e.target.files[0], e.target.files[0].name);
                this.xn.api.avenger.upload('/jd/payBackPDFSync', fd).subscribe({
                    next: v => {
                        if (v.type === 'progress') {
                            this.alerts = this.uploadPicService.onProgress(v.data.originalEvent);
                        } else if (v.type === 'complete') {
                            if (v.data.ret === 0) {
                                this.datalist01 = v.data.data;
                            } else {
                                this.xn.msgBox.open(false, v.data.msg);
                            }
                        } else {
                            this.xn.msgBox.open(false, v.data.msg);

                        }
                    },
                    error: errs => {
                        this.xn.msgBox.open(false, errs);
                    },
                    complete: () => {
                        this.loading.close();
                    }
                }
                )

            }
        })
    }
    viewMFiles(paramFile) {
        const params = JSON.parse(paramFile);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, params).subscribe();

    }
    public onBeforeUpload(e, i) {
        if (!!this.files[i]?.pdf?.fileName) {
            e.preventDefault();
            this.xn.msgBox.open(false, '请先删除已上传的文件，才能上传新文件');
            return;
        }
    }
    onRemove(mainFlowId, index: number) {
        this.files[index].pdf.fileName = '';
        this.files[index].pdf.fileId = '';
        this.files[index].pdf.filePath = '';
    }
    /**
   *  验证所选文件格式，根据文件后缀
   * @param s 文件全名
   */
    private validateFileExt(s: string) {
        if (isNullOrUndefined(this.row.options) || isNullOrUndefined(this.systemRow.options)) {
            return '';
        }
        if (this.type === 1) {
            if ('fileext' in this.systemRow.options) {
                const exts = this.systemRow.options.fileext
                    .replace(/,/g, '|')
                    .replace(/\s+/g, ''); // 删除所有空格
                if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                    return '';
                } else {
                    return `只支持以下文件格式: ${this.systemRow.options.fileext}`;
                }
            } else {
                return '';
            }
        } else {
            if ('fileext' in this.row.options) {
                const exts = this.row.options.fileext
                    .replace(/,/g, '|')
                    .replace(/\s+/g, ''); // 删除所有空格
                if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                    return '';
                } else {
                    return `只支持以下文件格式: ${this.row.options.fileext}`;
                }
            } else {
                return '';
            }
        }

    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
    onOk() {
        if (this.type === 2) {
            this.xn.api.avenger.post('/jd/payBackPDFUpload', { data: this.files }).subscribe(x => {
                if (x.ret === 0) {
                    this.close({ action: 'ok' });
                }
            });
        } else {
            this.close({ action: 'ok' });
        }

    }
    onCancel() {
        this.close({ action: 'cancel' });
    }
}

class FilesType {
    pdf: Files = new Files();
    mainFlowId: string;
    constructor() {
        this.mainFlowId = '';

    }
}
class Files {
    fileName: string;
    fileId: string;
    filePath: string;
    constructor() {
        this.fileName = '';
        this.fileId = '';
        this.filePath = '';

    }

}
