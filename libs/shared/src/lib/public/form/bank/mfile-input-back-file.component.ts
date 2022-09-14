import {
    Component,
    ElementRef,
    ViewContainerRef,
    Input,
    OnInit
} from '@angular/core';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {FileViewModalComponent} from '../../modal/file-view-modal.component';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {isNullOrUndefined} from 'util';
import {XnInputOptions} from '../xn-input.options';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {AbstractControl, FormGroup} from '@angular/forms';
import {UploadPicService} from 'libs/shared/src/lib/services/upload-pic.service';
import {PublicCommunicateService} from 'libs/shared/src/lib/services/public-communicate.service';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import {LoadingPercentService} from 'libs/shared/src/lib/services/loading-percent.service';

/**
 * 与 mfile 相同，重新造一份是由于后台在提交审核时会删除附件，不想在后台修改规则，而使用此法饶过其规则
 */
@Component({
    selector: 'back-file-input',
    template: `
        <div class="input-group" [formGroup]="form">
            <span class="form-control xn-input-font xn-input-first-border-radius" [ngClass]="myClass">{{label}}</span>
            <div class="input-group-btn">
                <div class="btn btn-default btn-file" [ngClass]="myClass">
                    <span class="hidden-xs xn-input-font">选择...</span>
                    <input type="hidden" [formControlName]="row.name">
                    <input type="file" (change)="onSelect($event)" (click)="onBeforeSelect($event)" multiple>
                </div>
            </div>
        </div>
        <span class="xn-input-alert">{{alert}}</span>
        <table class="table table-hover file-row-table" *ngIf="files.length > 0">
            <tbody>
            <tr *ngFor="let file of files">
                <td>
                    <!--<a class="xn-input-font" href="/api/attachment/view?key={{file.fileId}}" >{{file.fileName}}</a>-->
                    <a class="xn-click-a" (click)="onView(file)">{{file.fileName}}</a>
                </td>
                <td>
                    <button type="button" class="close" (click)="onRemove(file.fileId)"><span>&times;</span></button>
                </td>
            </tr>
            </tbody>
        </table>
    `,
    styles: [
            `
            .file-row-table {
                margin-bottom: 0;
            }

            .file-row-table td {
                padding: 6px;
            }

            .file-row-table button:focus {
                outline: none;
            }
        ` // 去掉点击后产生的边框
    ]
})
export class BackFileComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    label;
    files: any[];

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(
        private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private loading: LoadingPercentService,
        private uploadPicService: UploadPicService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(v => {
            this.calcAlertClass();
        });

        // 设置初始值
        this.files = XnUtils.parseObject(this.ctrl.value, []);

        this.formatLabelByFiles();
        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(
            this.row,
            this.form,
            this.ctrl,
            this.er
        );
    }

    private formatLabelByFiles() {
        if (this.files.length === 0) {
            this.label = '请点击右边按钮上传文件';
        } else {
            this.label = `已上传${this.files.length}个文件`;
        }
    }

    onBeforeSelect(e) {
        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    private validateFileExt(s: string): string {
        if (!isNullOrUndefined(this.row.options)) {
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
        } else {
            return '';
        }
    }

    onSelect(e) {
        if (e.target.files.length === 0) {
            // console.log('file-row', '没有选择文件');
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

    // 上传图片
    private uploadImg(files: any[], index: number) {
        if (files.length === index) {
             this.files.sort((a: any, b: any): number => {
                if (Number(a.prevName.substr(0, a.prevName.lastIndexOf('.'))) > Number(b.prevName.substr(0, b.prevName.lastIndexOf('.')))) {
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
            this.xn.api.upload('/attachment/upload', fd).subscribe({
                next: v => {
                    if (v.type === 'progress') {
                        this.alert = this.uploadPicService.onProgress(v.data.originalEvent);
                    } else if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            const prevFileName = (file && file.name) || (blob && blob.name); // filename不存在则检测blobname
                            v.data.data.prevName = prevFileName;
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
            this.ctrl.setValue(
                JSON.stringify(
                    this.files.map(v => {
                        return {
                            fileId: v.fileId,
                            fileName: v.fileName
                        };
                    })
                )
            );
        }
    }

    onProgress(e) {
        if (e.lengthComputable) {
            this.label = `正在上传... ${Math.floor(
                (e.loaded * 100) / e.total
            )}%`;
        }
    }

    onRemove(fileId) {
        // console.log(`onRemove ${fileId}`);
        this.xn.api
            .post(`/attachment/delete`, {key: fileId})
            .subscribe(json => {
                // 从this.files里删除fileId
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

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    onView(item: any) {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            FileViewModalComponent,
            item
        ).subscribe(() => {
        });
    }
}
