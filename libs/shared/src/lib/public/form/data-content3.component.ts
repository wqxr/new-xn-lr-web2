import {Component, ElementRef, Input, OnChanges, OnInit, ViewContainerRef} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';
import {XnFormUtils} from '../../common/xn-form-utils';
import {isNullOrUndefined} from 'util';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';
import {PublicCommunicateService} from '../../services/public-communicate.service';
import TableHeadConfig from '../../config/table-head-config';
import {DebtOutputModel} from './data-content.component';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {InvoiceDataViewModalComponent} from '../modal/invoice-data-view-modal.component';
import {HwModeService} from '../../services/hw-mode.service';
import { HeadquartersTypeEnum } from '../../config/select-options';

/**
 *  金地-保理预录入-应收账款保理计划表
 */
@Component({
    selector: 'app-xn-data-content3',
    templateUrl: './data-content3.component.html',
    styles: [`

        .table-display tr td {
            width: 200px;
            vertical-align: middle;
        }

        .height {
            overflow-x: hidden;
        }

        .table {
            table-layout: fixed;
            width: 3000px;
        }

        .table-height {
            max-height: 600px;
            overflow: scroll;
        }

        .head-height {
            position: relative;
            overflow: hidden;
        }

        .table-display {
            margin: 0;
        }

        .relative {
            position: relative
        }

        .red {
            color: #f20000
        }

        .table tbody tr td:nth-child(5) {
            word-wrap: break-word
        }
    `]
})
export class DataContent3Component implements OnInit, OnChanges {
    @Input() row: any;
    @Input() form: FormGroup;    // 获取的上传的excel文件内容
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    // 表格匹配字段
    heads = TableHeadConfig.getConfig('金地提单');
    // 应收账款保理计划表数据
    items: DebtOutputModel[] = [];
    alert = '';
    // 判断是否是excel格式
    isExcel = false;
    unfill = false;
    headLeft = 0;
    // 使用提单表格类型,默认'金地'
    type = HeadquartersTypeEnum[2];

    constructor(private xn: XnService,
                private er: ElementRef,
                private publicCommunicateService: PublicCommunicateService,
                public hwModeService: HwModeService,
                private vcr: ViewContainerRef) {
    }

    ngOnChanges() {
        this.publicCommunicateService.change.subscribe(type => {
            this.type = type; // 更改模板
            this.items = [];
        });
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.row.options = {excelext: 'xlsx,xls'};
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    // 下载模板
    downloadTp() {
        const a = document.createElement('a');
        a.href = this.heads[this.type].excel_down_url;
        a.click();
    }

    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }

    // 上传excel
    uploadExcel(e) {
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
        /**
         *  应收款保理计划表上传
         */
        this.xn.api.upload(this.heads[this.type].excel_up_url, fd).subscribe(json => {
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
    }

    viewMore(item) {
        item = item.toString().split(',');
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }

    // 验证是否是excel
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

}
