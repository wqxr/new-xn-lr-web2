import {Component, OnInit, Input, ElementRef, ViewContainerRef} from '@angular/core';
import {XnService} from '../../services/xn.service';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {isNullOrUndefined} from 'util';
import {XnUtils} from '../../common/xn-utils';
import {InvoiceViewModalComponent} from '../modal/invoice-view-modal.component';
import {InvoiceUtils} from '../../common/invoice-utils';
import {setTimeout} from 'core-js/library/web/timers';

declare let $: any;

@Component({
    selector: 'xn-order-input',
    templateUrl: './order-input.component.html',
    styles: [
            `
            .file-row-table {
                margin-bottom: 0
            }

            .file-row-table td {
                padding: 6px;
                border-color: #d2d6de;
                font-size: 12px;
            }

            .file-row-table th {
                font-weight: normal;
                border-color: #d2d6de;
                border-bottom-width: 1px;
                line-height: 100%;
                font-size: 12px;
            }

            .table-bordered {
                border-color: #d2d6de;
            }

            .table > thead > tr > th {
                padding-top: 7px;
                padding-bottom: 7px;
            }

            .widthMax {
                width: 120px;
            }

            .widthMiddle {
                width: 80px;
            }

            .gray {
                color: #666;
            }

            .fr {
                float: right
            }

            .xn-table-upload {
                padding-top: 5px;
            }

            .checkbox-select {
                width: 1.5rem;
                height: 1.5rem;
            }
        `
    ]
})
export class OrderInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    // 全选框选择状态
    public checkedAllStatus = false;
    // 选中的项
    public selectedItems: any[] = [];
    // 上传的数据- 初始状态
    public items: any[] = [];
    public mode: string;

    public alert = '';
    // 判断是否是excel格式
    public isExcel = false;
    // 总数
    public amountAll = 0;
    public sentItems: any[] = [];
    public unfill = false;
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

        console.log('items: ', this.items);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    // 上传完后取回值
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            console.log('toValue items: ', this.items);
            this.ctrl.setValue(JSON.stringify(this.items));
        }

        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private validateFileExt(s: string): string {
        if (isNullOrUndefined(this.row.options)) {
            return '';
        }
        if ('fileext' in this.row.options) {
            const exts = this.row.options.fileext.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `只支持以下文件格式: ${this.row.options.fileext}`;
            }
        } else {
            return '';
        }
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

    onRemoveExcel(invoiceNum: string) {
        // 从this.files里删除invoiceNum
        for (let i = 0; i < this.items.length; ++i) {
            if (this.items[i].invoiceNum === invoiceNum) {
                this.items.splice(i, 1);
                this.sentItems = this.sentItems.filter(v => v !== invoiceNum); // 删除已经上传过的
                // 删除未选中的，剩下视为全选状态
                const find = this.items.find((x: any) => x.clicked === undefined || x.clicked === false);
                if (!find) {
                    this.checkedAllStatus = true;
                } else {
                    this.checkedAllStatus = false;
                }
                this.toValue();
                return;
            }
        }
    }

    onCssClass(mode) {
        if (mode === 'upload_lack') {
            return 'widthMax';
        } else {
            return 'widthMiddle';
        }
    }

    onUploadExcel(e) {
        if (e.target.files.length === 0) {
            return;
        }

        // for (let i = 0; i < e.target.files.length; i++) {
        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;

            // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
            $(e.target).val('');
            return;
        }

        const fd = new FormData();
        fd.append('checkerId', this.row.checkerId);
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        this.xn.api.upload('/jzn/jd_project/order_check', fd).subscribe(json => {
            console.log('excel: ', json);
            if (json.type === 'complete') {
                if (json.data.ret === 0) {
                    if (json.data.data.data.length > 0) {
                        this.items = json.data.data.data;
                    }
                    this.isExcel = true;

                    this.toValue();
                } else {
                    // this.isExcel = false;
                    this.xn.msgBox.open(false, json.data.msg);
                }
                $(e.target).val('');
                this.ctrl.markAsDirty();
                this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
            }
        });
        // }
    }

    // 数组去重
    private arrUnique(arrs) {
        if (!arrs || arrs.length === 0) {
            return;
        }
        const hash = {} as any;
        arrs = arrs.reduce(function(item, next) {
            hash[next] ? '' : hash[next] = true && item.push(next);
            return item;
        }, []);
        return arrs;
    }

    /**
     *  删除选中项
     */
    deleteAll() {
        // 删除选中项
        this.items = this.items.filter((x: any) => x.clicked === undefined || x.clicked === false);
        this.toValue();
    }

    // 点击选中
    public handleSelect(index) {
        if (this.items[index].clicked && this.items[index].clicked === true) {
            this.items[index].clicked = false;
        } else {
            this.items[index].clicked = true;
        }
        // 当数组中不具有clicked 且为false。没有找到则表示全选中。
        const find = this.items.find((x: any) => x.clicked === undefined || x.clicked === false);
        if (!find) {
            this.checkedAllStatus = true;
        } else {
            this.checkedAllStatus = false;
        }

    }

    // 全选，取消全选
    public handleAllSelect() {
        this.checkedAllStatus = !this.checkedAllStatus;

        if (this.checkedAllStatus) {
            this.items.map(item => item.clicked = true);
        } else {
            this.items.map(item => item.clicked = false);
        }
    }
}
