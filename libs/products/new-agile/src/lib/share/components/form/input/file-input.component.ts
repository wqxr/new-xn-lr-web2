import {
    Component,
    OnInit,
    Input,
    ElementRef,
    ViewContainerRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';

import { FormGroup, AbstractControl } from '@angular/forms';

import { isNullOrUndefined } from 'util';
import { MfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';


declare let $: any;

@Component({
    selector: 'dragon-file-input',
    templateUrl: './file-input.component.html',
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
            .disabled {
                pointer-events: none;
                opacity: 0.5;
            }
        `
    ]
})
@DynamicForm({ type: 'file', formModule: 'new-agile-input' })
export class FileInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() mainFlowId?: string;

    label: string;
    files: any[];
    public showP = true;


    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    delButtonStatus: boolean; // ??????????????????
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
        if (this.row.checkerId === 'assetFile' || this.row.checkerId === 'fileUpload') {
            this.showP = false;
        }

        this.delButtonStatus = this.row.options && this.row.options.readonly && this.row.options.readonly === true;
        this.files = [];
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        // this.imgType = this.row.options.fileext;
        if (!!this.row.options.fileext) {
            this.imgType = `?????????${this.row.options.fileext}?????????????????????`;
        } else {
            this.imgType = '';
        }
        // if (this.row.options.fileext !== 'pdf') {
        //     const imgLength = this.imgType.split(',');
        //     if (this.imgType.includes('pdf') && imgLength.length > 1) {
        //         this.imgType = '??????????????????PDF';
        //     } else if (!this.imgType.includes('pdf') && imgLength.length > 1) {
        //         this.imgType = '???????????????';
        //     }
        // } else {
        //     this.imgType = '?????????PDF';
        // }

        // ???????????????
        this.ctrl.valueChanges.subscribe(x => {
            this.setFiles(x);
            this.cdr.markForCheck();

        });
        this.setFiles(this.ctrl.value);
        this.formatLabelByFiles();
        this.xnOptions = new XnInputOptions(
            this.row,
            this.form,
            this.ctrl,
            this.er
        );
    }

    private setFiles(x: any) {
        const files = this.ctrl.value
            ? XnUtils.parseObject(x)
            : XnUtils.parseObject(this.ctrl.value, []);
        this.files = [].concat(files);
    }

    public onBeforeSelect(e) {
        if (this.files.length > 0) {
            e.preventDefault();
            this.xn.msgBox.open(false, '??????????????????????????????????????????????????????');
            return;
        }

        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    /**
     * ????????????
     * @param e
     */
    public onSelect(e) {
        if (e.target.files.length === 0) {
            return;
        }

        const err = this.validateFileExt(e.target.files[0].name);
        if (err.length > 0) {
            this.alert = err;

            // ???file input???????????????????????????????????????????????????????????????????????????
            $(e.target).val('');
            this.loading.close();
            return;
        }
        this.setValueByFiles();
        this.loading.open(e.target.files.length, 0);
        this.compressImage(e.target.files[0], (blob, file) => {
            const fd = new FormData();
            fd.append('checkerId', this.row.checkerId);
            // FormData.append??????????????????????????????????????????filename?????????blob, file && file.name???????????????file????????????
            fd.append('file_data', blob, file && file.name);
            this.xn.file.dragonUpload(fd).subscribe({
                next: v => {
                    if (v.type === 'progress') {
                        this.onProgress(v.data.originalEvent);
                    } else if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            // // ???????????????
                            // const upFileName =
                            //     this.row.options && this.row.options.filename;
                            // const prevFileName =
                            //     (file && file.name) || (blob && blob.name); // filename??????????????????blobname
                            // const dotPostion = prevFileName.lastIndexOf('.');
                            // const suffix = prevFileName.substring(dotPostion);

                            // const newFileName = upFileName
                            //     ? upFileName + suffix
                            //     : prevFileName;
                            // v.data.data.fileName = newFileName;
                            v.data.data.prevName = (file && file.name) || (blob && blob.name); // filename??????????????????blobname

                            this.files.push(v.data.data);
                            this.ctrl.setValue(JSON.stringify([v.data.data]));
                            this.cdr.detectChanges();
                            this.setValueByFiles();
                            this.loading.close();

                        } else {
                            // ????????????
                            this.xn.msgBox.open(false, v.data.msg);
                        }
                    }
                },
                error: errs => {
                    this.xn.msgBox.open(false, errs);
                },
                complete: () => {
                    this.ctrl.markAsDirty();
                    this.calcAlertClass();
                    this.formatLabelByFiles();
                }
            });
        });

        // ???file input???????????????????????????????????????????????????????????????????????????
        $(e.target).val('');
    }

    public onProgress(e) {
        if (e.lengthComputable) {
            this.label = `????????????... ${Math.floor(
                (e.loaded * 100) / e.total
            )}%`;
            this.cdr.detectChanges();
        }
    }

    private setValueByFiles() {
        if (this.files.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify([].concat(this.files).map(v => {
                return {
                    fileId: v.fileId,
                    fileName: v.fileName,
                    filePath: v.filePath,
                };
            })));
        }
        this.cdr.detectChanges();

    }
    public onRemove(fileId) {
        for (let i = 0; i < this.files.length; ++i) {
            if (this.files[i].fileId === fileId) {
                this.files.splice(i, 1);
                this.setValueByFiles();
                this.ctrl.setValue('');
                this.ctrl.markAsDirty();
                this.calcAlertClass();
                this.formatLabelByFiles();
                break;
            }
        }
        this.cdr.detectChanges();
        // });
    }

    /**
     * ?????????????????????
     * @param file
     * @param callback
     */
    private compressImage(file, callback) {

        // ??????????????????
        let picSize = this.row.options && this.row.options.picSize;
        if (!picSize) {
            callback(file, file);
            return;
        }
        picSize = parseInt(picSize, 10);

        if (/(PDF|pdf)$/.test(file.type) && file.size / 1024 > picSize) {
            if (file.size / (1024 * 1024) > 80) {
                this.xn.msgBox.open(false, '????????????????????????????????????????????????80M?????????');
                return;
            }
        }


        // ?????????????????????????????????????????????????????????????????????picSize KB??????????????????????????????
        if (
            /(gif|jpg|jpeg|png|GIF|JPG|JPEG|PNG)$/.test(file.type) &&
            file.size / 1024 > picSize
        ) {
            if (file.size / (1024 * 1024) > 80) {
                this.xn.msgBox.open(
                    false,
                    '????????????????????????????????????????????????80M?????????'
                );
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onprogress = evt => {
                // this.onProgress(evt);
                this.onProgress(evt);
            };

            // ??????canvas?????????????????????
            reader.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const image = new Image();
                image.src = reader.result as string;
                let data, bolbImg, quality; // ????????????????????????0.2
                const imgSize: number = file.size / 1000;
                // ?????????????????????????????????????????????????????????.2, ?????????0.8
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
                    // canvas??????png???jpg???????????????????????????canvas???????????????
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0, w, h);

                    // ???????????????????????????????????????????????????????????????picSize KB?????????????????????????????????????????????quality???????????????
                    (function goOnCompress(q) {
                        data = canvas.toDataURL('image/jpeg', q);
                        bolbImg = dataURLtoBlob(data);
                        // ????????????
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

                    // canvas??????????????????base64?????????????????????
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

                    // ????????????canvas??????????????????????????????
                    callback(bolbImg, file);
                };
            };
        } else {
            callback(file, file);
        }
    }

    /**
     *  ????????????
     * @param paramFile
     */
    public onView(paramFile: { fileId: string, fileName: string }) {
        const paramFiles = [];
        const fileType: string = paramFile.fileId.substring(paramFile.fileId.lastIndexOf('.') + 1);
        if (fileType === 'xlsx' || fileType === 'xls') { // ???excel
            this.xn.msgBox.open(false, '?????????????????????????????????????????????', () => {
                this.xn.api.dragon
                    .download('/attachment/download/index', {
                        key: paramFile.fileId
                    }).subscribe((v: any) => {
                        this.xn.api.save(v._body, paramFile.fileName);
                    });
            });
        } else {
            paramFiles.push(paramFile);
            XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                MfilesViewModalComponent,
                paramFiles
            ).subscribe(() => {
            });
        }

    }

    /**
     *  ?????????????????????????????????????????????
     * @param s ????????????
     */
    private validateFileExt(s: string) {
        if (isNullOrUndefined(this.row.options)) {
            return '';
        }
        if ('fileext' in this.row.options) {
            const exts = this.row.options.fileext
                .replace(/,/g, '|')
                .replace(/\s+/g, ''); // ??????????????????
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `???????????????????????????: ${this.row.options.fileext}`;
            }
        } else {
            return '';
        }
    }

    private calcAlertClass() {
        this.myClass = `${XnFormUtils.getClass(this.ctrl)} ${this.delButtonStatus ? 'disabled' : '' }`;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private formatLabelByFiles() {
        if (this.files.length === 0) {
            this.label = '?????????????????????????????????';
        } else {
            this.label = `?????????${this.files.length}?????????`;
        }
        this.cdr.detectChanges();
    }
}
