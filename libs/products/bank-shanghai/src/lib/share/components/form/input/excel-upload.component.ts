import { ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ShangHaiMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { FileAdapterService } from 'libs/shared/src/lib/services/file-adapter.service';

/**
 *  上传excel组件
 */
@Component({
    templateUrl: './excel-upload.component.html',
    styles: [`
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
    }`]
})
@DynamicForm({ type: 'excel-upload', formModule: 'dragon-input' })
export class ExcelUploadComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public myClass = '';
    public alert = '';
    public ctrl: AbstractControl;
    public files: any[] = [];

    public constructor(private xn: XnService, private vcr: ViewContainerRef, private cdr: ChangeDetectorRef,
                       private fileService: FileAdapterService ) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
    }

    onBeforeUpload(e: any) {
        console.log('onBeforeUpload', e);
    }

    /**
     * 上传excel
     */
    public onUploadExcel(e: any) {
        if (e.target.files.length === 0) {
            return;
        }
        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;
            $(e.target).val('');
            return;
        }

        const fd = new FormData();
        fd.append('checkerId', this.row.checkerId);
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        // 上传excel
        // this.fileService.dragonUpload(fd).subscribe(json => {
        this.xn.api.upload(this.row.options.others.uploadUrl, fd).subscribe(json => {
            if (json.type === 'progress') {
                this.onProgress(json.data.originalEvent);
            }
            if (json.type === 'complete') {
                this.files.push(json.data.data);
                this.setValueByFiles();
            }
            $(e.target).val('');
            this.ctrl.markAsDirty();
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
    }

    /**
     *  预览
     * @param file
     */
    public onView(file: any) {
        const paramFiles = [];
        const fileType: string = file.filePath.substring(file.filePath.lastIndexOf('.') + 1);
        if (['xlsx', 'xls'].includes(fileType)) {
            this.xn.api.download(this.row.options.others.downloadUrl, {...file}).subscribe((v: any) => {
                this.xn.api.save(v._body, file.fileName);
                // this.fileService.download([file]).subscribe((v: any) => {
                // this.fileService.saveFile(v._body, file.fileName, 'dragon');
            });
        } else {
            paramFiles.push(file);
            XnModalUtils.openInViewContainer( this.xn, this.vcr, ShangHaiMfilesViewModalComponent, paramFiles).subscribe(() => {
            });
        }
    }

    /**
     * 上传进度
     */
    public onProgress(e) {
        if (e.lengthComputable) {
            this.alert = `正在上传... ${Math.floor(
                (e.loaded * 100) / e.total
            )}%`;
            this.cdr.detectChanges();
        }
    }

    /**
     * 删除文件
     */
    public onRemove(fileId: string) {
        this.xn.api.post(`/attachment/delete`, {key: fileId}).subscribe(json => {
        // this.fileService.dragonRemove(fileId).subscribe(json => {
            // 从this.files里删除fileId
            const fielIndex = this.files.findIndex((x: any) => x.fileId === fileId);
            this.files.splice(fielIndex, 1);
            this.setValueByFiles();
            this.ctrl.markAsDirty();
            this.calcAlertClass();
        });
    }

    /**
     * 校验文件是否存在
     */
    private validateExcelExt(s: string): string {
        if (isNullOrUndefined(this.row.options)) {
            return '';
        }
        if ('excelext' in this.row.options) {
            const exts = this.row.options.excelext.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `只支持以下文件格式: ${this.row.options.excelext}`;
            }
        } else {
            return '';
        }
    }

    // 下载模板
    downloadTp() {
        const a = document.createElement('a');
        a.href = this.row.options.others.templateUrl;
        a.click();
    }

    /**
     * 组件设值
     */
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
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}

