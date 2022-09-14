import { Component, ElementRef, Input, OnChanges, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import TableHeadConfig from './table-head-config';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
declare const $: any

/**
 *  新雅居乐-恒泽-保理预录入-应收账款保理计划表
 */
@Component({
    templateUrl: './data-content-yjl.component.html',
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
@DynamicForm({ type: 'data-content-yjl', formModule: 'dragon-input' })
export class DataContentYjlComponent implements OnInit, OnChanges {
    @Input() row: any;
    @Input() form: FormGroup;    // 获取的上传的excel文件内容
    @Input() svrConfig?: any;
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    // 表格匹配字段
    heads = TableHeadConfig.getConfig('雅居乐提单');
    // 应收账款保理计划表数据
    items: DebtOutputModel[] = [];
    alert = '';
    // 判断是否是excel格式
    isExcel = false;
    unfill = false;
    headLeft = 0;
    // 使用提单表格类型,默认'雅居乐-恒泽'
    type = HeadquartersTypeEnum[4];

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
        this.row.options = { excelext: 'xlsx,xls' };
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
        this.xn.dragon.upload(this.heads[this.type].excel_up_url, fd).subscribe(json => {
            if (json.type === 'complete') {
                if (json.data.ret === 0) {
                    if (json.data.data.length > 0) {
                        this.items = json.data.data;
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

// 字段模型
export class DebtOutputModel {
    public index?: string;    // 应收账款序号
    public headquarters: string; // 总部公司;长度[1;100]
    public projectCompany: string; // 申请付款单位;长度[1;100]
    public projectName: string; // 项目名称
    public payConfirmId: string; // 付款确认书编号
    public contractId: string; // 合同编号
    public contractName: string; // 合同名称
    public preInvoiceNum: string; // 预录入发票号码
    public preInvoiceAmount: string; // 预录入发票金额
    public receive: number; // 应收账款金额
    public debtUnit: string; // 收款单位;长度[1;100]
    public debtUnitAccount: string; // 收款单位账号
    public debtUnitBank: string; // 收款单位开户行
    public linkMan: string; // 联系人，人名
    public linkPhone: string; // 联系电话
    public factoringOrgName: string; // 应收账款受让方;长度[1;100]
    public discountRate: string; // 资产转让折扣率
    public qrsProvideTime: string; // 确认书出具日期
    public factoringEndDate: string; // 保理融资到期日
    public operatorName: string; // 运营部对接人 ;人名
    public operatorPhone: string; // 运营部对接人手机号
    public marketName: string; // 市场部对接人 ;人名
    public marketPhone: string; // 市场部对接人手机号
    public projectCity: string; // 申请付款单位归属城市
    public projectProvince: string; // 申请付款单位省份
    public isRegisterSupplier: string;    // 收款单位是否注册:0表示未注册 1表示已注册
    public depositBank: string; // 托管行
    public headPreDate: string; // 总部提单日期
}
