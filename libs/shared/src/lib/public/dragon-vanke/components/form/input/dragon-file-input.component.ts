/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-input.component.ts
 * @summary：上传文件  单选
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          添加注释         2019-09-20
 * **********************************************************************
 */

import {
    Component,
    OnInit,
    Input, EventEmitter, Output,
    ElementRef,
    ViewContainerRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';

import { FormGroup, AbstractControl } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { LoadingPercentService } from '../../../../../services/loading-percent.service';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


declare let $: any;

@Component({
    selector: 'dragon-selectfile-input',
    templateUrl: './dragon-file-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
        .detailP {
            float: left;
            height: 30px;
            font-size: 14px;
            line-height: 30px;
            color: #ccc;
            margin-left: 30px;
        }
            .file-row-table {
                margin-bottom: 0;
            }

            .file-row-table td {
                padding: 6px;
            }

            .file-row-table button:focus {
                outline: none;
            }

            .span-disabled-bg {
                background-color: #eee
            }
        `
    ]
})
@DynamicForm({ type: 'selectfile', formModule: 'dragon-input' })
export class DragonSelectFileInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() select: any;   // 文件类型
    @Input() allFiles: any;  // 上传的文件
    @Input() mainFlowId?: string;
    @Output() uploadEventEmitter = new EventEmitter<any>();

    label: string;
    files: any[];
    public showP = true;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    delButtonStatus: boolean; // 删除按钮状态
    public imgType = '';

    constructor(
        private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        private loading: LoadingPercentService,
        private publicCommunicateService: PublicCommunicateService
    ) {
    }

    ngOnInit() {
        if (this.row.checkerId === 'assetFile' || this.row.checkerId === 'fileUpload' && this.row.flowId !== 'sub_person_match_qrs') {
            this.showP = false;
        }

        this.delButtonStatus = this.row.options && this.row.options.readonly && this.row.options.readonly === true;
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        if (!!this.row.options.fileext) {
            this.imgType = `请上传${this.row.options.fileext}文件格式的文件`;
        } else {
            this.imgType = '';
        }

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
        this.ctrl.valueChanges.subscribe(x => {

            if (this.ctrl.value) {
                this.allFiles[selectType[this.select]] = (XnUtils.parseObject(x));
            } else {
                this.allFiles[selectType[this.select]] = XnUtils.parseObject(this.ctrl.value, []);
            }
            // this.uploadEventEmitter.emit(this.allFiles);
            this.cdr.markForCheck();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onBeforeSelect(e) {
        if (this.allFiles[selectType[this.select]].length > 0) {
            e.preventDefault();
            this.xn.msgBox.open(false, '请先删除已上传的文件，才能上传新文件');
            return;
        }
        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    /**
     * 上传文件
     * @param e
     */
    public onSelect(e) {
        if (e.target.files.length === 0) {
            return;
        }
        const err = this.validateFileExt(e.target.files[0].name);
        if (err.length > 0) {
            this.alert = err;
            // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
            $(e.target).val('');
            return;
        }
        this.loading.open(e.target.files.length, e.target.files.length - 1);
        this.compressImage(e.target.files[0], (blob, file) => {
            const fd = new FormData();
            fd.append('checkerId', this.row.checkerId);
            // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
            fd.append('file_data', blob, file && file.name);
            // this.xn.file.dragonUpload(fd).subscribe({
            this.xn.file.upload(fd, true).subscribe({
                next: v => {
                    if (v.type === 'progress') {
                        this.onProgress(v.data.originalEvent);
                    } else if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            // 文件名配置
                            // const upFileName = '';
                            //     // this.row.options && this.row.options.filename;
                            // const prevFileName =
                            //     (file && file.name) || (blob && blob.name); // filename不存在则检测blobname
                            // const dotPostion = prevFileName.lastIndexOf('.');
                            // const suffix = prevFileName.substring(dotPostion);

                            // const newFileName = upFileName
                            //     ? upFileName + suffix
                            //     : prevFileName;
                            // v.data.data.fileName = newFileName;

                            // this.files.push(v.data.data);
                            this.allFiles[selectType[this.select]].push(v.data.data);
                            this.setValueByFiles();
                        } else {
                            // 上传失败
                            this.xn.msgBox.open(false, v.data.msg);
                        }
                    }
                },
                error: errs => {
                    this.loading.close();
                    this.xn.msgBox.open(false, errs);
                },
                complete: () => {
                    this.loading.close();
                    this.ctrl.markAsDirty();
                    this.calcAlertClass();
                }
            });
        });
        // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
        $(e.target).val('');
    }

    public onProgress(e) {
        if (e.lengthComputable) {
            this.label = `正在上传... ${Math.floor(
                (e.loaded * 100) / e.total
            )}%`;
            this.cdr.detectChanges();
        }
    }

    private setValueByFiles() {
        if (this.allFiles[selectType[this.select]].length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.allFiles[selectType[this.select]].map(v => {
                return {
                    fileId: v.fileId,
                    fileName: v.fileName,
                    filePath: v.filePath,
                };
            })));
        }
        // this.cdr.detectChanges();
    }
    public onRemove(fileId) {
        for (let j = 0; j < this.allFiles[selectType[this.select]].length; ++j) {
            if (this.allFiles[selectType[this.select]][j].fileId === fileId) {
                this.allFiles[selectType[this.select]].splice(j, 1);
                this.setValueByFiles();
                // this.ctrl.setValue('');
                // this.ctrl.markAsDirty();
                // this.calcAlertClass();
                // this.formatLabelByFiles();
                break;
            }
        }
        // this.cdr.detectChanges();
    }

    /**
     * 上传并压缩图片
     * @param file
     * @param callback
     */
    private compressImage(file, callback) {

        // 图片压缩配置
        let picSize = this.row.options && this.row.options.picSize;
        if (!picSize) {
            callback(file, file);
            return;
        }
        picSize = parseInt(picSize, 10);
        if (/(PDF|pdf)$/.test(file.type) && file.size / 1024 > picSize) {
            if (file.size / (1024 * 1024) > 80) {
                this.xn.msgBox.open(false, '很抱歉，您允许上传的文件不能超过80M，谢谢');
                return;
            }
        }



        // 检查上传的文件是否是图片格式，并且大小是否超过picSize KB，否则不压缩直接上传
        if (
            /(gif|jpg|jpeg|png|GIF|JPG|JPEG|PNG)$/.test(file.type) &&
            file.size / 1024 > picSize
        ) {
            if (file.size / (1024 * 1024) > 80) {
                this.xn.msgBox.open(
                    false,
                    '很抱歉，您允许上传的图片不能超过80M，谢谢'
                );
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onprogress = evt => {
                // this.onProgress(evt);
                this.onProgress(evt);
            };

            // 利用canvas对图片进行压缩
            reader.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const image = new Image();
                image.src = reader.result as string;
                let data, bolbImg, quality; // 初始化压缩比率为0.2
                const imgSize: number = file.size / 1000;
                // 如果原图内存大小远大于配置要求尺寸默认.2, 接近则0.8
                const ratio = imgSize / picSize;
                if (ratio >= 2) {
                    quality = 0.2;
                } else if (1.5 < ratio && ratio < 2) {
                    quality = 0.6;
                } else {
                    quality = 0.8;
                }
                image.onload = () => {
                    const w = image.width;
                    const h = image.height;
                    canvas.width = w;
                    canvas.height = h;
                    // canvas中，png转jpg会变黑底，所以先给canvas铺一张白底
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0, w, h);

                    // 自调用函数，保证图片的大小被的压缩到默认是picSize KB以下，压缩的大小可以配置，参数quality为压缩比率
                    (function goOnCompress(q) {
                        data = canvas.toDataURL('image/jpeg', q);
                        bolbImg = dataURLtoBlob(data);
                        // 图片尺寸
                        if (bolbImg.size / 1000 > picSize && q > 0.1) {
                            goOnCompress((quality -= 0.1));
                        } else if (bolbImg.size / 1000 > picSize && q > 0.05) {
                            goOnCompress((quality -= 0.05));
                        } else if (bolbImg.size / 1000 > picSize && q > 0.02) {
                            goOnCompress((quality -= 0.02));
                        } else if (bolbImg.size / 1000 > picSize && q > 0.005) {
                            goOnCompress((quality -= 0.005));
                        }
                    })(quality);

                    // canvas生成的格式为base64，需要进行转化
                    function dataURLtoBlob(dataurl) {
                        const arr = dataurl.split(','),
                            mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]);
                        let n = bstr.length;
                        const u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return new Blob([u8arr], { type: mime });
                    }

                    // 回调，将canvas生成的图片保存到本地
                    callback(bolbImg, file);
                };
            };
        } else {
            callback(file, file);
        }
    }

    /**
     *  查看文件
     * @param paramFile
     */
    public onView(paramFile: { fileId: string, fileName: string, isAvenger?: boolean }) {
        const paramFiles = [];
        const fileType: string = paramFile.fileId.substring(paramFile.fileId.lastIndexOf('.') + 1);
        if (fileType === 'xlsx' || fileType === 'xls') { // 为excel
            this.xn.msgBox.open(false, '暂不支持在线预览，请下载查看！', () => {
                this.xn.api.dragon
                    .download('/attachment/download/index', {
                        key: paramFile.fileId
                    }).subscribe((v: any) => {
                        this.xn.api.save(v._body, paramFile.fileName);
                    });
            });
        } else {
            paramFile.isAvenger = true;
            paramFiles.push(paramFile);
            XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                DragonMfilesViewModalComponent,
                paramFiles
            ).subscribe(() => {
            });
        }

    }

    /**
     *  验证所选文件格式，根据文件后缀
     * @param s 文件全名
     */
    private validateFileExt(s: string) {
        if (isNullOrUndefined(this.row.options)) {
            return '';
        }
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

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private formatLabelByFiles() {
        if (this.files.length === 0) {
            this.label = '请点击右边按钮上传文件';
        } else {
            this.label = `已上传${this.files.length}个文件`;
        }
        this.cdr.detectChanges();
    }
}
enum selectType {
    factoringPayConfirmYyj = 1,    // 付款确认书（总部致保理商）影印件
    brokerPayConfirmYyj = 2,   // 付款确认书（总部致券商）影印件
    pdfProjectFiles = 3,     // 付款确认书影印件
}
