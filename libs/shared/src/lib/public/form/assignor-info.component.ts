import { FileViewModalComponent } from './../modal/file-view-modal.component';
import { Component, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { XnService } from '../../services/xn.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnInputOptions } from './xn-input.options';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { XnUtils } from '../../common/xn-utils';


declare let $: any;

@Component({
    selector: 'xn-assignor-info',
    templateUrl: './assignor-info.component.html',
    styles: [
        `
        .file-row-table { margin-bottom: 0}
        .file-row-table td { padding: 6px; border-color: #d2d6de; font-size: 12px; }
        .file-row-table th { font-weight: normal; border-color: #d2d6de; border-bottom-width: 1px; line-height: 100%; font-size: 12px;}
        .table-bordered {border-color: #d2d6de; }
        .table > thead > tr > th { padding-top: 7px; padding-bottom: 7px; }
        .widthMax { width: 120px;}
        .widthMiddle { width: 80px; }
        .gray { color: #666; }
        .red {color: #f20000}
        .fr { float: right }
        .xn-table-upload { padding-top: 5px; }
        .checkbox-select { width: 1.5rem; height: 1.5rem; }
        `
    ]
})
export class AssignorInfoComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    // 上传的数据- 初始状态
    public items: any[] = [];

    alert = '';
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(v => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    // 上传完后取回值
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.items));
        }

        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onUploadExcel(e, i) {
        // console.log('ok', e);
        if (e.target.files.length === 0) {
            return;
        }

        const fd = new FormData();
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        this.xn.api.upload('/attachment/upload/pdf_wk', fd).subscribe(v => {
            if (v.type === 'complete') {
                if (v.data.ret === 0) {
                    this.items[i].file = {
                        fileName: v.data.data.fileName,
                        fileId: v.data.data.fileId,
                    };
                    this.items[i].status = v.data.data.orgName === this.items[i].收款单位;
                    this.toValue();
                }
            }
        });
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, item).subscribe(() => {
        });
    }
}
