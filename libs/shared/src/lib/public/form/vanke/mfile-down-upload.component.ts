/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mfile-input.component
 * @summary：批量上传文件新的checker项
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          上传文件         2019-08-30
 * **********************************************************************
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { isNullOrUndefined } from 'util';
import { NzDemoModalBasicComponent } from '../../modal/cfca-result-modal.component';
import { FileViewModalComponent } from '../../modal/file-view-modal.component';
import { PdfSignModalComponent } from '../../modal/pdf-sign-modal.component';
import { XnInputOptions } from '../xn-input.options';



declare let $: any;

@Component({
    selector: 'app-down-upload-file',
    templateUrl: './mfile-down-upload.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `.file-row-table {
            margin-bottom: 0;
            max-height: 100%;
        }

        .table-box {
            max-height: 350px;
            overflow-y: auto;
        }

        .file-row-table td {
            padding: 6px;
        }

        .file-row-table button:focus {
            outline: none
        }

        .btn-position {
            position: absolute;
            right: -100px;
            top: 5px
        }

        .span-disabled-bg {
            background-color: #eee
        }
        .detailP {
            float: left;
            height: 30px;
            font-size: 14px;
            line-height: 30px;
            color: #ccc;
            margin-left: 30px;
        }
        .newbutton{
            height: 30px;
            width: 84px;
            font-size: 14px;
            line-height: 10px;
            color: #1d67c7;
            border-radius: 2px;
            border: 1px solid #1D67C7;
            background: #FFFFFF;
            margin-right: 10px;
        }
        .newbuttons{
            height: 30px;
            width: 84px;
            font-size: 14px;
            color: #FFFFFF;
            border-radius: 2px;
            border: 1px solid #1D67C7;
            background: #1D67C7;
        }
        .payspan{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #375781;
            text-align: justify;
          }
        `
    ]
})
export class CommonFileDownUploadComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    ctrl: AbstractControl;
    public label;
    public files: any[];

    public myClass = '';
    public alert = '';
    public xnOptions: XnInputOptions;
    public currentParams = { idCard: '', phone: '', userName: '', type: 'changeCa', download: true };
    // 删除按钮的状态
    public delButtonStatus: boolean;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef,
                private loading: LoadingPercentService,
                private uploadPicService: UploadPicService) {
    }

    ngOnInit() {
        this.delButtonStatus = this.row.options && this.row.options.readonly && this.row.options.readonly === true;
        this.ctrl = this.form.get(this.row.name);
        // 设置初始值
        if (this.row.value) {
            this.files = (XnUtils.parseObject(this.row.value));
        } else {
            this.files = XnUtils.parseObject(this.row.value, []);
        }
        this.ctrl.statusChanges.subscribe(v => {
            this.calcAlertClass();
        });
        // 设置初始值
        // this.files = XnUtils.parseObject(this.ctrl.value, []);

        this.formatLabelByFiles();
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }






    public onBeforeSelectone(e) {
        if (this.files.length > 0) {
            e.preventDefault();
            this.xn.msgBox.open(false, '请先删除已上传的文件，才能上传新文件');
            return;
        }

        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    public onSelect(e) {
        if (e.target.files.length === 0) {
            return;
        }
        const data = [];
        for (const file of e.target.files) {
            const err = this.validateFileExt(file.name);
            if (!XnUtils.isEmpty(err)) {
                this.alert = err;
                // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
                $(e.target).val('');
                return;
            }
            data.push(file);
        }
        this.uploadImg(data, 0);
        $(e.target).val('');
    }


    /**
     *  查看合同
     * @param id
     * @param secret
     * @param label
     */
    public showContract(id: string, secret: string, label: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id,
            secret,
            label,
            readonly: true
        }).subscribe(() => {
        });
    }

    /**
     *  上传图片
     * @param files
     * @param index
     */
    private uploadImg(files: any[], index: number) {
        if (files.length === index) {
            this.files.sort((a: any, b: any): number => {
                if (Number(a.fileName.substr(0, a.fileName.lastIndexOf('.'))) > Number(b.fileName.substr(0, b.fileName.lastIndexOf('.')))) {
                    return 1;
                } else {
                    return -1;
                }
            });
            this.setValueByFiles();
            // 已上传完毕关闭
            this.loading.close();
            return;
        }
        // 打开loading,传入上传的总数，和当前上传的图片
        this.loading.open(files.length, index);
        this.uploadPicService.compressImage(files[index], this.alert, this.row, (blob, file) => {
            const fd = new FormData();
            fd.append('checkerId', this.row.checkerId);
            // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
            fd.append('file_data', blob, file && file.name);
            this.xn.file.upload(fd, this.row.isAvenger).subscribe({
                next: v => {
                    if (v.type === 'progress') {
                        this.alert = this.uploadPicService.onProgress(v.data.originalEvent);
                    } else if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            v.data.data.prevName = (file && file.name) || (blob && blob.name); // filename不存在则检测blobname
                            this.files.push(v.data.data);
                        } else {
                            this.xn.msgBox.open(false, v.data.msg);
                            // 上传失败
                        }
                        index++;
                        setTimeout(() => {
                            this.uploadImg(files, index);
                        }, 1000);
                    } else {
                        // 上传失败
                        this.xn.msgBox.open(false, v.data.msg);
                    }
                },
                error: errs => {
                    this.xn.msgBox.open(false, errs);
                },
                complete: () => {
                    this.ctrl.markAsDirty();
                    this.formatLabelByFiles();
                    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                }
            });
        });
    }

    /**
     *  删除文件
     * @param fileId
     */
    public onRemove(fileId) {
        this.xn.file.remove(fileId, this.row.isAvenger).subscribe(json => {
            for (let i = 0; i < this.files.length; ++i) {
                if (this.files[i].fileId === fileId) {
                    this.files.splice(i, 1);
                    this.setValueByFiles();
                    this.ctrl.markAsDirty();
                    this.calcAlertClass();
                    this.formatLabelByFiles();
                    break;
                }
            }
        });
    }

    onDownload() {
        console.log(this.row.options.value);
        if (this.row.options.type === 1) { // 修改ca证书管理员时下载授权确认书
            const params = JSON.parse(this.row.options.value);
            this.currentParams.idCard = params.idCard || params.certUserCardNo;
            this.currentParams.phone = params.phone || params.certUserMobile;
            this.currentParams.userName = params.userName || params.certUserName;
            this.xn.api.getFileDownload('/user/get_auth_confirm_file', this.currentParams).subscribe(x => {
                const fileName = this.xn.api.getFileName(x._body.headers);
                this.xn.api.save(x._body.body, `${fileName}`);
            });
        } else if (this.row.options.type === 2) { // 注册流程中下载授权确认书
            this.xn.api.getFileDownload('/user/get_auth_confirm_file',
                { cacheKey: this.row.options.value, type: 'applyCa', download: true }).subscribe(x => {
                    const fileName = this.xn.api.getFileName(x._body.headers);
                    this.xn.api.save(x._body.body, `${fileName}`);
                });
        } else if (this.row.options.type === 3) {

            const params = JSON.parse(this.row.options.value);
            if (params.adminUserName === '' || params.adminIdCard === '' || params.adminPhone === '' || params.adminEmail === '') {
                const successinfo = {
                    title: '提示',
                    okButton: '确定',
                    cancelButton: '取消',
                    img: '',
                    info: '缺少参数',
                    reason: ``,
                    text: '',
                    alertimg: '/assets/lr/img/remind-orange.png'
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, NzDemoModalBasicComponent, successinfo).subscribe(x => {
                });
                return;
            }
            const currentParams = Object.assign({}, params, { type: 'notApplyCa', download: true });
            this.xn.api.getFileDownload('/user/get_auth_confirm_file', currentParams).subscribe(x => {
                const fileName = this.xn.api.getFileName(x._body.headers);
                this.xn.api.save(x._body.body, `${fileName}`);
            });
        } else {
          const assetsUrl = this.row.options?.assetsUrl || ''
          if(assetsUrl){
            const a = document.createElement('a')
            a.href = assetsUrl
            a.click()
          }
        }
    }
    /**
     *  查看文件
     * @param item
     */
    public onView(item: any) {
        // console.log(this.row,this.files, this.svrConfig);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, item).subscribe(() => {

        });

    }

    /**
     *  格式化提示信息
     */
    private formatLabelByFiles() {
        if (this.files.constructor.name === 'Array') {
            if (this.files.length === 0) {
                this.label = '请点击右边按钮上传文件';
            } else {
                this.label = `已上传${this.files.length}个文件`;
            }
            this.cdr.detectChanges();
        }
    }

    /**
     *  验证文件格式
     * @param s
     */
    private validateFileExt(s: string): string {
        if (!isNullOrUndefined(this.row.options)) {
            if ('fileext' in this.row.options) {
                const exts = this.row.options.fileext.replace(/,/g, '|')
                    .replace(/\s+/g, ''); // 删除所有空格
                if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                    return '';
                } else {
                    return `只支持以下文件格式: ${this.row.options.fileext}`;
                }
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    private setValueByFiles() {
        if (this.files.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify({
                fileId: this.files[0].fileId,
                fileName: this.files[0].fileName,
                filePath: this.files[0].filePath,
            }
            ));
        }
        this.cdr.detectChanges();
    }
    onPrev() {

    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
