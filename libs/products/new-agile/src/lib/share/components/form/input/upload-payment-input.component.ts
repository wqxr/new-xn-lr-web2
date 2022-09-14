import { Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import TableHeadConfig from 'libs/shared/src/lib/config/table-head-config';


/**
 *  vanke-上传付款确认书
 */
@Component({
    templateUrl: './upload-payment-input.component.html',
})
@DynamicForm({ type: 'upload-payment', formModule: 'new-agile-input' })
export class UploadPaymentInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    // 数组字段
    heads = TableHeadConfig.getConfig('上传付款确认书');
    // 应收账款保理计划表数据
    items: UploadPaymentOutputModel[] = [];

    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    selectItems: UploadPaymentOutputModel[] = []; // 已经上传的即包含有图片的项
    picFormat = { type: 'jpg, jpeg, png,pdf', picSize: '500' };

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
                private loading: LoadingPercentService,
                private uploadPicService: UploadPicService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }


    // 查看文件
    viewFile(sub) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, sub).subscribe(() => {
        });
    }

    // 上传付款确认书
    onUpload(e, index) {
        // 暂存文件
        const cacheLists = [];
        if (e.target.files.length === 0) {
            return;
        }
        for (let i = 0; i < e.target.files.length; i++) {
            const err = this.validateFileExt(e.target.files[i].name);
            if (err.length > 0) {
                this.alert = err;
                // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
                $(e.target).val('');
                this.loading.close();
                return;
            }
            this.loading.open(e.target.files.length, i);
            // callback带回一个file是为了用到file.name
            this.uploadPicService.compressImage(e.target.files[i], this.alert, { options: { picSize: this.picFormat.picSize } },
                (blob, file) => {
                    // console.log(blob);
                    const fd = new FormData();
                    fd.append('checkerId', this.row.checkerId);
                    // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
                    fd.append('file_data', blob, file && file.name);
                    this.xn.api.upload('/attachment/upload', fd).subscribe({
                        next: v => {
                            if (v.type === 'progress') {
                                this.alert = this.uploadPicService.onProgress(v.data.originalEvent);
                            } else if (v.type === 'complete') {
                                if (v.data.ret === 0) {
                                    cacheLists.push(v.data.data); // 暂时存储在数组中
                                    this.items[index].pdfProjectFiles = JSON.parse(JSON.stringify(cacheLists));
                                    this.toValue();
                                } else {
                                    // 上传失败
                                    this.xn.msgBox.open(false, v.data.msg);
                                }
                            }
                        },
                        error: err2 => {
                            this.xn.msgBox.open(false, err2);
                        },
                        complete: () => {
                            this.ctrl.markAsDirty();
                            if (e.target.files.length === i) {
                                this.loading.close();
                            }
                        }
                    });
                });
        }

        // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
        $(e.target).val('');
    }


    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.items.forEach(x => {
            if (x.pdfProjectFiles !== '' && typeof x.pdfProjectFiles === 'string') {
                x.pdfProjectFiles = JSON.parse(x.pdfProjectFiles);
            }
        });
        this.toValue();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    // 上传完后取回值
    private toValue() {
        if (this.items.length) {
            const data = [...this.selectItems, ...this.items.filter(val => val.pdfProjectFiles.length)];
            this.selectItems = data.length > 1
                ? XnUtils.distinctArray2(data, 'payConfirmId')
                : data;
        }
        if (this.items.length !== this.selectItems.length) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.items));
        }

        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    // 验证格式 只支持图片，pdf
    private validateFileExt(s: string): string {
        const exts = this.picFormat.type.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
        if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
            return '';
        } else {
            return `只支持以下文件格式: ${this.picFormat.type}`;
        }
    }
}
class UploadPaymentOutputModel {
    order: number;
    payConfirmId: string;
    debtUnit: string;
    receivable: any;
    pdfProjectFiles: any;
}
