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

// import { BankPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
// import { BanksMfilesViewModalComponent } from '../../../modal/bank-mfiles-view-modal.component';

declare let $: any;
import * as moment from 'moment';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { LoadingPercentService } from '../../../../../services/loading-percent.service';
import { UploadPicService } from '../../../../../services/upload-pic.service';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';

@Component({
    selector: 'dragon-xn-mfile-table-input',
    templateUrl: './mfile-table-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
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
@DynamicForm({ type: 'mfile-table', formModule: 'dragon-input' })
export class DragonMfileTableInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    @Input() mainFlowId?: string;

    public label;
    public files: any[];
    // 上传的文件
    public allFiles = {
        vanke: [],  // 万科
        yjl1: [],  // 雅居乐
        yjl2: [],
        dragon1: [], // 龙光
        dragon2: [],
        // 匹配数量
        vk: {
            upCount: 0,
            successCount: 0,
            failCount: 0
        },
        yj1: {
            upCount: 0,
            successCount: 0,
            failCount: 0
        },
        yj2: {
            upCount: 0,
            successCount: 0,
            failCount: 0
        },
        dg1: {
            upCount: 0,
            successCount: 0,
            failCount: 0
        },
        dg2: {
            upCount: 0,
            successCount: 0,
            failCount: 0
        },
        /**默认 */
        default: []
    };
    ocr_result = [];
    public myClass = '';
    public alert = '';
    public ctrl: AbstractControl;
    public ctrl_type: AbstractControl;
    public ctrl_headquarters: AbstractControl;
    public ctrl_file: AbstractControl;
    public ctrl_upCount: AbstractControl;
    public ctrl_successCount: AbstractControl;
    public ctrl_failCount: AbstractControl;
    public xnOptions: XnInputOptions;
    // 删除按钮的状态
    public delButtonStatus: boolean;
    public showP = true;
    public imgType = '';
    public ocrInterval: any;
    public stopPost = false;

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

        this.ctrl_type = this.form.get('type');
        this.ctrl_headquarters = this.form.get('headquarters');
        this.ctrl_file = this.form.get('fileUpload');
        this.ctrl_upCount = this.form.get('upCount');
        this.ctrl_successCount = this.form.get('successCount');
        this.ctrl_failCount = this.form.get('failCount');

        this.ctrl.statusChanges.subscribe(v => {
            this.calcAlertClass();
        });
        this.ctrl.valueChanges.subscribe((x) => {
            if (this.ctrl_file.value) {
                this.allFiles[QrsTypeEnum[this.ctrl_file.value]] = x ? JSON.parse(x) : [];
            }
            this.cdr.markForCheck();
            this.calcAlertClass();
        });
        this.ctrl_file.valueChanges.subscribe((f) => {
            if (f !== '') {
                const ctrVal = XnUtils.parseObject(this.allFiles[QrsTypeEnum[f]], []);
                this.allFiles[QrsMatchEnum[f]].upCount = ctrVal.length;
                this.allFiles[QrsMatchEnum[f]].successCount = ctrVal.filter((item) => item.isMatching === 1 || item.isMatching === 2).length;
                this.allFiles[QrsMatchEnum[f]].failCount = ctrVal.filter((item) => item.isMatching === 0).length;
                this.ctrl_upCount.setValue(JSON.stringify(this.allFiles[QrsMatchEnum[f]].upCount));
                this.ctrl_successCount.setValue(JSON.stringify(this.allFiles[QrsMatchEnum[f]].successCount));
                this.ctrl_failCount.setValue(JSON.stringify(this.allFiles[QrsMatchEnum[f]].failCount));
                this.allFiles[QrsTypeEnum[f]].length > 0 ? this.ctrl.setValue(JSON.stringify(this.allFiles[QrsTypeEnum[f]])) : this.ctrl.setValue('');
            } else {
                this.ctrl_upCount.setValue('0');
                this.ctrl_successCount.setValue('0');
                this.ctrl_failCount.setValue('0');
                this.ctrl.setValue('');
            }
            this.cdr.markForCheck();
            this.calcAlertClass();
        });
        this.imgType = '请上传';
        if (this.row.options.fileext.split(',').includes('pdf')) {
            this.imgType += 'PDF';
        }
        if (this.row.options.fileext.split(',').includes('zip')) {
            this.imgType += '或zip';
        }
        if (this.row.options.fileext.split(',').length > 2) {
            this.imgType += '或图片';
        }

        // 设置初始值
        this.files = XnUtils.parseObject(this.ctrl.value, []);

        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onBeforeSelect(e) {
        if (!this.ctrl_type.value || !this.ctrl_headquarters.value || !this.ctrl_file.value) {
            e.stopPropagation();
            e.preventDefault();
            const msg = `请先选择${!this.ctrl_type.value ? '业务类型' : !this.ctrl_headquarters.value ? '总部公司' : '文件类型'}`;
            this.xn.msgBox.open(false, msg);
            return;
        }
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
        this.files = [];   // 记录每次上传的文件
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
            this.setValueByOcrRes();

            // 已上传完毕关闭
            // this.loading.close();
            return;
        }
        // 打开loading,传入上传的总数，和当前上传的图片
        this.loading.open(0, 0);
        // this.loading.open(files.length, index);
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
                    this.loading.close();
                    this.xn.msgBox.open(false, errs);
                },
                complete: () => {
                    this.ctrl.markAsDirty();
                    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                }
            });
        });
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
    /**
     * orc识别
     * @param file
     */
    private setValueByOcrRes() {
        // console.log("files",this.files);
        // 调用ocr接口
        let fileType = 0;
        switch (this.ctrl_file.value) {
            case '1':
                fileType = 2;
                break;
            case '2':
                fileType = 3;
                break;
            case '3':
                fileType = 1;
                break;
            case '4':
                fileType = 4;
                break;
            case '5':
                fileType = 5;
                break;
        }
        const postObjs = {
            fileId: this.files[0].fileId,	// 文件id
            fileName: this.files[0].fileName,  // 文件名字
            filePath: this.files[0].filePath,	// 文件路径
            modelType: Number(HeadquartersEnum[this.ctrl_headquarters.value]),	  // 模式类型 1=龙光 2=万科 3=雅居乐
            // fileType 1=付款确认书（万科） 2=付款确认书（总部致保理商）（龙光） 3=付款确认书（总部致券商）（龙光）
            fileType    // Number(this.ctrl_file.value) 3=付款确认书（万科） 1=付款确认书（总部致保理商）（龙光） 2=付款确认书（总部致券商）（龙光）
        };
        this.getOcrResult(0, 0, postObjs);
    }

    /**
     * 获取ocr解析详情
    * @param files
     * @param index
     */
    getOcrResult(total: number, index: number, postObjs: any) {
        if (total !== 0) {
            if (total === index) {
                // 关闭
                this.loading.close();
                this.xn.msgBox.open(false, 'ocr识别成功');
                return;
            }
            // 打开loading,传入上传的总数，和当前上传的图
            this.loading.open(total, index);
        }
        this.xn.api.avenger.post2('/sub_system/ocr/get_ocr_result', postObjs).subscribe(res => {
            if (res.ret === 0){
                // 1=执行中 2=失败 3=完成
                if (res.data.status === 3){
                    setTimeout(() => {
                        // 关闭
                        this.loading.close();
                        this.xn.msgBox.open(false, 'ocr识别成功');
                    }, 500);
                    const ocrResult = res.data.orcList;
                    this.allFiles[QrsTypeEnum[this.ctrl_file.value]] = this.allFiles[QrsTypeEnum[this.ctrl_file.value]].concat(ocrResult);
                    this.allFiles[QrsMatchEnum[this.ctrl_file.value]].upCount += res.data.orcList.length;
                    this.allFiles[QrsMatchEnum[this.ctrl_file.value]].successCount += res.data.successCount;
                    this.allFiles[QrsMatchEnum[this.ctrl_file.value]].failCount += res.data.failCount;

                    if (this.allFiles[QrsTypeEnum[this.ctrl_file.value]].length === 0) {
                        this.ctrl.setValue('');
                    } else {
                        this.ctrl.setValue(JSON.stringify(this.allFiles[QrsTypeEnum[this.ctrl_file.value]]));
                        this.ctrl_upCount.setValue(JSON.stringify(this.allFiles[QrsMatchEnum[this.ctrl_file.value]].upCount));
                        this.ctrl_successCount.setValue(JSON.stringify(this.allFiles[QrsMatchEnum[this.ctrl_file.value]].successCount));
                        this.ctrl_failCount.setValue(JSON.stringify(this.allFiles[QrsMatchEnum[this.ctrl_file.value]].failCount));
                    }
                } else if (res.data.status === 1 || res.data.status === 2) {
                    // 执行中
                    setTimeout(() => {
                        this.getOcrResult(res.data.count, res.data.nowCount, postObjs);
                    }, 2000);
                }
            } else {
                this.loading.close();
                this.xn.msgBox.open(false, `${res.msg}`);
            }
        });
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
/***
 *  付确类型
 */
export enum QrsTypeEnum {
    /** 万科 */
    vanke = 3,
    /** 雅居乐 */
    yjl1 = 4,
    yjl2 = 5,
    /** 龙光 */
    dragon1 = 1,
    dragon2 = 2,
    /**默认 */
    default = 100
}
export enum QrsMatchEnum {
    /** 万科 */
    vk = 3,
    /** 雅居乐 */
    yj1 = 4,
    yj2 = 5,
    /** 龙光 */
    dg1 = 1,
    dg2 = 2
}
/***
 *  总部类型
 */
export enum HeadquartersEnum {
    /** 万科 */
    '万科企业股份有限公司' = 2,
    /** 雅居乐 */
    '雅居乐集团控股有限公司' = 3,
    /** 龙光 */
    '深圳市龙光控股有限公司' = 1,
    /** 碧桂园 */
    '碧桂园地产集团有限公司' = 4,
    '深圳华侨城股份有限公司' = 5,
}
