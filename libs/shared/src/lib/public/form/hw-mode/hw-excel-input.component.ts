import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {isNullOrUndefined} from 'util';

declare let $: any;

/**
 *  excel上传组建
 */
@Component({
    selector: 'app-hw-mode-hw-excel-input',
    templateUrl: './hw-excel-input.component.html'
})
export class HwExcelInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public label = '';
    public myClass = '';
    public alert = '';
    public ctrl: AbstractControl;
    public files: any[] = [];

    public constructor(private xn: XnService) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.formatLabelByFiles();
    }

    public onUploadExcel(e) {
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
        this.xn.api.upload('/attachment/upload', fd).subscribe(json => {
            if (json.type === 'progress') {
                //
            }
            if (json.type === 'complete') {
                this.files.push(json.data.data);
                this.formatLabelByFiles();
                this.setValueByFiles();
            }
            $(e.target).val('');
            this.ctrl.markAsDirty();
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
    }

    /**
     *  根据文件在服务器中的地址，预览
     *  https://view.officeapps.live.com/op/view.aspx?src=https://www.dujin.org/file/ppt/dujin.xls
     *  https://view.officeapps.live.com/op/view.aspx
     *  src=https://www.dujin.org/file/ppt/dujin.xls 文档在服务器中的地址
     * @param item
     */
    public onView(item: any) {
        console.log(`https://view.officeapps.live.com/op/view.aspx?src=/api/attachment/view?key=${item.url}`);
        const src = item.url;
        const a = document.createElement('a');
        a.href = `https://view.officeapps.live.com/op/view.aspx?src=${src}`;

    }

    public onRemove(fileId) {
        this.xn.api.post(`/attachment/delete`, {key: fileId}).subscribe(json => {
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

    private formatLabelByFiles() {
        if (this.files.length === 0) {
            this.label = '请点击右边按钮上传文件';
        } else {
            this.label = `已上传${this.files.length}个文件`;
        }
    }

    private setValueByFiles() {
        if (this.files.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.files.map(v => {
                return {
                    fileId: v.fileId,
                    fileName: v.fileName
                };
            })));
        }
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
