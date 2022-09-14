import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { isNullOrUndefined } from 'util';
import { FormGroup, AbstractControl } from '@angular/forms';


import { FileViewModalComponent } from '../../../modal/file-view-modal.component';
import { DragonPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { LoadingPercentService } from '../../../../../services/loading-percent.service';
import { UploadPicService } from '../../../../../services/upload-pic.service';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


declare let $: any;

@Component({
    templateUrl: './mfile-process-input.component.html',
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
        `
    ]
})
@DynamicForm({ type: 'mfile-return', formModule: 'dragon-input' })
export class MultiFileProcessInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    public label;
    public files: any[];

    public myClass = '';
    public alert = '';
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    // 删除按钮的状态
    public delButtonStatus: boolean;
    public selectButtonStatus: boolean;

    public ocrInterval: any;
    public stopPost = false;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef,
                private loading: LoadingPercentService,
                private uploadPicService: UploadPicService) {
    }

    ngOnInit() {
        this.delButtonStatus = this.row.options && this.row.options.readonly && this.row.options.readonly === true;
        this.selectButtonStatus = this.row.options && this.row.options.readonly && this.row.options.readonly === true;
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
            this.calcAlertClass();
        });

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
        if (this.files.length >= 1){
            this.alert = '只支持上传一个文件，请删除文件后再上传!';
            this.selectButtonStatus = true;
            return ;
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
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, {
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
    }

    /**
     *  删除文件
     * @param fileId
     */
    public onRemove(fileId) {
        this.xn.api.dragon.post(`/file/delete`, { key: fileId }).subscribe(() => {
            for (let i = 0; i < this.files.length; ++i) {
                if (this.files[i].fileId === fileId) {
                    this.files.splice(i, 1);
                    this.selectButtonStatus = this.files.length >= 1 ? true : false;
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
     * @param item
     */
    public onView(item: any) {
        if (this.row.name === 'ipoFile') {
            this.row.isAvenger = false;
        }
        const params = item;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, params).subscribe(() => {
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

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
