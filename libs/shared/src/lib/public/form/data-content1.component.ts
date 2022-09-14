import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';
import {XnFormUtils} from '../../common/xn-form-utils';
import {isNullOrUndefined} from 'util';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';
import {DebtOutputModel} from './data-content.component';
import TableHeadConfig from '../../config/table-head-config';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {InvoiceDataViewModalComponent} from '../modal/invoice-data-view-modal.component';
import {HwModeService} from '../../services/hw-mode.service';
import {LoadingService} from '../../services/loading.service';

/**
 *  定向收款保理提单组件
 */
@Component({
    selector: 'app-xn-data-content1',
    templateUrl: './data-content1.component.html',
    styles: [`

        .table-display tr td {
            width: 250px;
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
            overflow: auto;
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
    `]
})
export class DataContent1Component implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;    // 获取的上传的excel文件内容
    heads = TableHeadConfig.getConfig('定向支付提单');
    // 应收账款保理计划表数据
    public items: DebtOutputModel[] = [];
    //
    public alert = '';
    // 判断是否是excel格式
    public isExcel = false;
    public unfill = false;
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    public headLeft = 0;
    type = '华为';

    public constructor(private xn: XnService,
                       private er: ElementRef,
                       public hwModeService: HwModeService,
                       private vcr: ViewContainerRef,
                       private loading: LoadingService) {

    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.row.options = {excelext: 'xlsx,xls'};
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }

    // 下载模板
    public downloadTp() {
        const a = document.createElement('a');
        a.href = this.heads[this.type].excel_down_url;
        a.click();
    }

    // 上传excel
    public uploadExcel(e) {
        XnUtils.checkLoading(this);
        if (e.target.files.length === 0) {
            this.loading.close();
            return;
        }

        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;

            // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
            $(e.target).val('');
            this.loading.close();
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
                    this.xn.msgBox.open(false, json.data.msg);
                }
                $(e.target).val('');
                this.ctrl.markAsDirty();
                this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                this.loading.close();
            }
        });
    }

    // 查看更多
    public viewMore(item) {
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
