
import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

declare let $: any;

@Component({
    templateUrl: './mfile-input.component.html',
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
            height: 30px;
            font-size: 14px;
            line-height: 30px;
            color: #ccc;
        }
        `
    ]
})
@DynamicForm({ type: 'mfile', formModule: 'new-agile-input' })
export class MfileInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;

    public label;
    public files: any[];

    public myClass = '';
    public alert = '';
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    viewModal: any;
    // ?????????????????????
    public delButtonStatus: boolean;
    public imgType = '';

    constructor(private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private hwModeService: HwModeService,
        private cdr: ChangeDetectorRef,
        private loading: LoadingPercentService,
        private uploadPicService: UploadPicService,
        private publicCommunicateService: PublicCommunicateService
    ) {
    }

    ngOnInit() {
        this.delButtonStatus = this.row.options && this.row.options.readonly && this.row.options.readonly === true;
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(v => {
            this.calcAlertClass();
        });
        if (!!this.row.options.fileext) {
            this.imgType = `?????????${this.row.options.fileext}?????????????????????`;
        } else {
            this.imgType = '';
        }
        if (this.row.name === 'tripleAgreement') {
            const controls = this.form.controls[this.row.name].validator;
            this.publicCommunicateService.change.subscribe(x => {
                if (this.row.name === 'tripleAgreement' && x === '5') {
                    this.form.controls[this.row.name].setValidators(controls);
                    this.form.controls[this.row.name].updateValueAndValidity();
                    this.row.required = true;
                } else if (this.row.name === 'tripleAgreement') {
                    this.form.controls[this.row.name].setValidators(null);
                    this.form.controls[this.row.name].updateValueAndValidity();
                    this.row.required = false;
                    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
                }
            });
        }
        // ???????????????
        this.files = XnUtils.parseObject(this.ctrl.value, []);
        this.formatLabelByFiles();
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     * ???????????? - ???????????? ????????????
     */
    public down() {
        this.hwModeService.downContract('100006201806280314', 'DeazHL8HlwdqUpOq', '??????????????????');
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
                this.xn.msgBox.open(false,`????????????????????????${file.name}??????????????????????????????`);
                break;
            }
            const err = this.validateFileExt(file.name);
            if (!XnUtils.isEmpty(err)) {
                this.alert = err;
                // ???file input???????????????????????????????????????????????????????????????????????????
                $(e.target).val('');
                return;
            }
            data.push(file);
        }
        this.uploadImg(data, 0);
        $(e.target).val('');
    }

    /**
     * ????????????
     */
    public downloadTp01() {
        const a = document.createElement('a');
        a.href = '/assets/lr/doc/????????????????????????.doc';
        a.click();
    }

    /**
     * ????????????
     */
    public downloadTp02() {
        const a = document.createElement('a');
        a.href = '/assets/lr/doc/??????????????????????????????.doc';
        a.click();
    }

    /**
     *  ????????????
     * @param id
     * @param secret
     * @param label
     */
    public showContract(id: string, secret: string, label: string) {
        this.viewModal = PdfSignModalComponent;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, this.viewModal, {
            id,
            secret,
            label,
            readonly: true
        }).subscribe(() => {
        });
    }

    /**
     *  ????????????
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
            // ?????????????????????
            this.loading.close();
            return;
        }
        // ??????loading,????????????????????????????????????????????????
        this.loading.open(files.length, index);
        this.uploadPicService.compressImage(files[index], this.alert, this.row, (blob, file) => {
            const fd = new FormData();
            fd.append('checkerId', this.row.checkerId);
            // FormData.append??????????????????????????????????????????filename?????????blob, file && file.name???????????????file????????????
            fd.append('file_data', blob, file && file.name);
            this.xn.file.upload(fd, this.row.isAvenger).subscribe({
                next: v => {
                    if (v.type === 'progress') {
                        this.alert = this.uploadPicService.onProgress(v.data.originalEvent);
                    } else if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            v.data.data.prevName = (file && file.name) || (blob && blob.name); // filename??????????????????blobname
                            this.files.push(v.data.data);
                        } else {
                            this.xn.msgBox.open(false, v.data.msg);
                            // ????????????
                        }
                        index++;
                        setTimeout(() => {
                            this.uploadImg(files, index);
                        }, 1000);
                    } else {
                        // ????????????
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
     *  ????????????
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
     *  ????????????
     * @param item
     */
    public onView(item: any) {
        if (this.row.name === 'ipoFile') {
            this.row.isAvenger = false;
        }
        const params = { ...item, isAvenger: this.row.isAvenger };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, params).subscribe(() => {
        });

    }

    /**
     *  ?????????????????????
     */
    private formatLabelByFiles() {
        if (this.files.constructor.name === 'Array') {
            if (this.files.length === 0) {
                this.label = '?????????????????????????????????';
            } else {
                this.label = `?????????${this.files.length}?????????`;
            }
            this.cdr.detectChanges();
        }
    }

    /**
     *  ??????????????????
     * @param s
     */
    private validateFileExt(s: string): string {
        if (!isNullOrUndefined(this.row.options)) {
            if ('fileext' in this.row.options) {
                const exts = this.row.options.fileext.replace(/,/g, '|')
                    .replace(/\s+/g, ''); // ??????????????????
                if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                    return '';
                } else {
                    return `???????????????????????????: ${this.row.options.fileext}`;
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
            this.files = _.sortBy(this.files, 'fileName');
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


    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
