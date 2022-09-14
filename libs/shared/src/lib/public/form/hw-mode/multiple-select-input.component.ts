import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnInputOptions} from '../xn-input.options';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {isNullOrUndefined} from 'util';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {UploadPicService} from 'libs/shared/src/lib/services/upload-pic.service';
import {FileViewModalComponent} from '../../modal/file-view-modal.component';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {ContractTypeCommunicateService} from 'libs/shared/src/lib/services/contract-type-communicate.service';

declare let $: any;

@Component({
    selector: 'app-multiple-select-input',
    templateUrl: './multiple-select-input.component.html',
    styles: [`
        .memo {
            position: absolute;
            top: 5px;
            right: 200px;
        }
    `]
})
export class MultipleSelectInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    public label = '';
    public myClass = '';
    public alert = '';
    public files: any[] = [];
    public inputValue: any[];
    // 要显示的
    public typeList: any[] = [
        {type: '商品', memo: '运单、出库单、入库单等'},
        {type: '服务', memo: '工时确认单、交付确认单'},
    ];
    // 默认显示一条
    public currentLists: any[] = [{type: '商品', memo: '运单、出库单、入库单等'}];

    public constructor(private publicCommunicateService: ContractTypeCommunicateService,
                       private xn: XnService,
                       private uploadPicService: UploadPicService,
                       private vcr: ViewContainerRef) {
        this.publicCommunicateService.change.subscribe(x => {
            if (x !== null) {
                this.currentLists = this.typeList.filter(filter => x.find(z => filter.type === z));
            }
        });
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.formatLabelByFiles();
    }

    public onBeforeSelect(e) {
        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    onSelect(e, type: any) {
        if (e.target.files.length === 0) {
            return;
        }

        for (let i = 0; i < e.target.files.length; i++) {
            const err = this.validateFileExt(e.target.files[i].name);
            if (err.length > 0) {
                this.alert = err;

                // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
                $(e.target).val('');
                return;
            }

            // callback带回一个file是为了用到file.name
            this.uploadPicService.compressImage(e.target.files[i], alert, this.row, (blob, file) => {
                // console.log(blob);
                const fd = new FormData();
                fd.append('checkerId', this.row.checkerId);
                // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
                fd.append('file_data', blob, file && file.name);
                this.xn.api.upload('/attachment/upload', fd).subscribe({
                    next: v => {
                        if (v.type === 'progress') {
                            // this.label = this.uploadPicService.onProgress(v.data.originalEvent);
                        } else if (v.type === 'complete') {
                            if (v.data.ret === 0) {
                                const prevFileName = (file && file.name) || (blob && blob.name); // filename不存在则检测blobname
                                v.data.data.prevName = prevFileName;
                                v.data.data.type = type;
                                this.files.push(v.data.data);

                                this.files.sort(function(a: any, b: any): number {
                                    if (a.prevName > b.prevName) {
                                        return 1;
                                    } else {
                                        return -1;
                                    }
                                });
                                this.setValueByFiles();
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
                        this.calcAlertClass();
                        this.formatLabelByFiles();
                    }
                });
            });
        }

        // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
        $(e.target).val('');
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, item).subscribe(() => {
        });
    }

    public onRemove(fileId, type) {
        // console.log(`onRemove ${fileId}`);
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

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

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

    private formatLabelByFiles(arg?: any) {
        if (this.files.length === 0) {
            this.label = '请点击右边按钮上传文件';
        } else {
            // const filter = this.files.filter((x: any) => x.type === arg);
            // this.label = `已上传${filter.length}个文件`;
        }
    }

    private setValueByFiles() {
        if (this.files.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.files.map(v => {
                return {
                    fileId: v.fileId,
                    fileName: v.fileName,
                    type: v.type
                };
            })));
        }
    }

}
