import {Component, OnInit, Input, ElementRef, ViewContainerRef} from '@angular/core';
import {XnService} from '../../services/xn.service';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {InvoiceViewModalComponent} from '../modal/invoice-view-modal.component';
import { XnUtils } from '../../common/xn-utils';


declare let $: any;

@Component({
    selector: 'xn-order5-input',
    templateUrl: './order5-input.component.html',
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
        .fr { float: right }
        .xn-table-upload { padding-top: 5px; }
        .checkbox-select { width: 1.5rem; height: 1.5rem; }
        `
    ]
})
export class Order5InputComponent implements OnInit {

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

        if (this.items.length === 0) {
            this.getList();
        }
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private getList() {
        this.xn.api.post('/jzn/jd/get', {}).subscribe(json => {
            this.items = json.data.data;
            this.toValue();
        });
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

}
