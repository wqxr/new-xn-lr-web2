/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mfile-input.component
 * @summary：批量上传文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          上传文件         2019-03-29
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { isNullOrUndefined } from 'util';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BankPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { BanksMfilesViewModalComponent } from '../../../modal/bank-mfiles-view-modal.component';



declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'puhuitong-xn-mfile-input',
    templateUrl: './mfile-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `.file-row-table {
            margin-bottom: 0;
            max-height: 100%;
        }

        .table-box {
            max-height: 165px;
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
            height: 25px;
            font-size: 14px;
            line-height: 25px;
            color: #ccc;
            margin-left: 30px;
        }

        .btn-td {
            outline: 0;
            border: none;
            background: transparent;
            padding: 0;
        }
        `
    ]
})
@DynamicForm({ type: 'bankMfile', formModule: 'bank-input' })
export class BankMfileInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    @Input() mainFlowId?: string;

    public label;
    public files: any[];

    public myClass = '';
    public alert = '';
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    // 删除按钮的状态
    public delButtonStatus: boolean;
    public showP = true;
    public imgType = '';


    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef,
                private loading: LoadingPercentService,
                private uploadPicService: UploadPicService,
                private publicCommunicateService: PublicCommunicateService) {
    }

    ngOnInit() {
        if (this.row.checkerId === 'fileUpload') {
            this.showP = false;
        }
        this.delButtonStatus = this.row.options && this.row.options.readonly && this.row.options.readonly === true;
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(v => {
            this.calcAlertClass();
        });
        //this.imgType = this.row.options.fileext;

        this.imgType = `请上传${this.row.options.fileext}文件格式的文件`;


        // if (this.row.options.fileext !== 'pdf') {
        //     const imgLength = this.imgType.split(',');
        //     if (this.imgType.includes('pdf') && imgLength.length > 1) {
        //         this.imgType = '请上传图片或PDF';
        //     } else if (!this.imgType.includes('pdf') && imgLength.length > 1) {
        //         this.imgType = '请上传图片';
        //     }
        // } else {
        //     this.imgType = '请上传PDF';
        // }



        // 设置初始值
        this.files = XnUtils.parseObject(this.ctrl.value, []);

        this.formatLabelByFiles();
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onBeforeSelect(e) {
        if (e.target.files.length === 0) {
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
            if(file.size===0){
                this.xn.msgBox.open(false,`很抱歉，您上传的${file.name}是个空文件，不能上传`);
                break;
            }
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
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BankPdfSignModalComponent, {
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
            this.xn.file.upload(fd, true).subscribe({
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



    /**
        *  查看文件
        * @param paramFile
        */
    public onView(paramFile: any): void {
        const paramFiles = [];
        paramFiles.push(paramFile);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BanksMfilesViewModalComponent, paramFiles).subscribe(x => {
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
            this.ctrl.setValue(JSON.stringify(this.files.map(v => {
                return {
                    fileId: v.fileId,
                    fileName: v.fileName,
                    filePath: v.filePath,
                };
            })));
        }
        this.cdr.detectChanges();
        // 中登登记传输文件数据
        // if (this.row.checkerId === 'registerFile') {
        //     let obj = {} as any;
        //     obj["value"] = this.ctrl.value;
        //     obj["type"] = this.row.checkerId;
        //     if (this.mainFlowId) {
        //         obj["mainFlowId"] = this.mainFlowId;
        //     }
        //     console.log(obj);
        //     this.publicCommunicateService.change.emit(obj);
        // }
    }


    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
