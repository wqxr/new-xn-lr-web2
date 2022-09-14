import { Component, ElementRef, Input, OnChanges, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { isNullOrUndefined } from 'util';
import TableHeadConfig from 'libs/shared/src/lib/config/table-head-config';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

/**
 *  vanke-保理预录入-应收账款保理计划表
 */
@Component({
    selector: 'app-xn-data-content',
    templateUrl: './data-content.component.html',
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
@DynamicForm({ type: 'data-content', formModule: 'new-agile-input' })
export class DataContentComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;    // 获取的上传的excel文件内容
    public ctrl: AbstractControl;
    public ctrl_headType: AbstractControl;
    private xnOptions: XnInputOptions;
    // 表格匹配字段
    heads = TableHeadConfig.getConfig('万科提单');
    // 应收账款保理计划表数据
    items: DebtOutputModel[] = [];
    alert = '';
    // 判断是否是excel格式
    isExcel = false;
    unfill = false;
    headLeft = 0;
    // 提单总部公司
    enterprise = '';
    // 使用提单表格类型,默认''
    type = '';
    uploadCtr = false;  // false 不可上传

    constructor(private xn: XnService,
                private er: ElementRef,
                private publicCommunicateService: PublicCommunicateService,
                private localStorageService: LocalStorageService,
                private vcr: ViewContainerRef,
                public hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl_headType = this.form.get('enterprise');
        // 暂存的总部公司
        // this.type = this.localStorageService.caCheMap.get('headquarters');
        if (!!this.ctrl_headType.value) {
            this.enterprise = this.ctrl_headType.value.includes('{')
            ? JSON.parse(this.ctrl_headType.value).enterprise
            : this.ctrl_headType.value;
            this.type = this.ctrl_headType.value.includes('{') ? JSON.parse(this.ctrl_headType.value).wkType : '';
        }

        // this.uploadCtr = this.enterprise === '' || this.enterprise === undefined;
        this.uploadCtr = (this.enterprise === HeadquartersTypeEnum[4]);
        // 设置可上传的格式
        this.row.options = { excelext: 'xlsx,xls' };
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        this.ctrl_headType.valueChanges.subscribe((x) => {
            if (!!x) {
                this.enterprise = x.includes('{') ? JSON.parse(x).enterprise : x;
                this.type = x.includes('{') ? JSON.parse(x).wkType : '';
                this.alert = '';
                this.uploadCtr = (this.enterprise === HeadquartersTypeEnum[4]);
            } else {
                this.enterprise = '';
                this.type = '';
                this.alert = '请选择总部公司';
                this.uploadCtr = false;
            }

            this.items = [];
            this.ctrl.setValue('');
            this.ctrl.markAsTouched();
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    // 查看更多
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

    // 下载模板
    downloadTp() {
        const a = document.createElement('a');
        if (!this.uploadCtr) {
            this.alert = '请选择总部公司';
            this.xn.msgBox.open(false, '请选择总部公司');
            return;
        }
        a.href = this.heads[this.enterprise].excel_down_url;
        a.click();
    }

    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
        // console.log(this.headLeft);
    }

    beforeUpload(e) {
        if (!this.uploadCtr) {
            this.alert = '请选择总部公司';
            this.xn.msgBox.open(false, '请选择总部公司');
            this.uploadCtr = false;
            // e.stopPropagation();
            e.preventDefault();
            return;
        }
       // this.uploadExcel(e);
    }

    // 上传excel
    uploadExcel(e) {
        if (!this.uploadCtr) {
            this.alert = '请选择总部公司';
            this.uploadCtr = false;
            return;
        }
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
        fd.append('headquarters', this.enterprise);
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        /**
         *  应收款保理计划表上传
         */
        this.xn.api.upload(this.heads[this.enterprise].excel_up_url, fd).subscribe(json => {
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

// 字段模型
export class DebtOutputModel {
    public num?: string; // 应付账款序号
    public projectCompany: string; // 申请付款单位
    public paymenNotice: string; // 付款通知
    public contractId?: string; // 合同号
    public invoiceNum?: string; // 发票号
    public invoiceAmount?: number; // 发票金额
    public receivable?: number; // 应付账款金额
    public debtUnit?: string; //  债权人
    public debtAccount?: string; // 收款单位账号
    public debtBank?: string; // 收款单位开户行
    public debtUser?: string; // 债务人
    public debtUserMobile?: string; // 联系人手机号
    public debtOwner?: string; // 付款单位;
    public factoringBeginDate?: string; // 保理融资起起始日;
    public receivableAssignee?: string; // 应收账款受让方
    public assigneePrice?: number; // 受让价格
    public originalSingleEencoding?: string; // 核心企业付款确认书编号
    public confirmationIssuanceTime?: string; // 确认书出具日期
    public confirmationExpiryTime?: string; // 确认书到期日期
    public factoringUser?: string;	     // 保理商联系人
    public factoringUserMobile?: string; //  手机号
    public raPaybackAccount?: string; //  应收账款受让方回款账号
    public raPaybackAccountBankName?: string; //  应收账款受让方回款账号开户行
    public yearRatesUser?: string; //  年化保理使用费率
    public yearRatesService?: string; //  年化保理服务费率
    public monthRatesService?: string; //  月化平台服务费率
    public platformServiceMonths?: string; //  平台服务月数
    public factoringEndDate?: string; //  保理到期日
    public registered?: boolean; //  是否注册
    public payConfirmId?: string; // 付款确认书编号
    public extension?: any; // 补充信息
    public correct?: any; // 是否需要更正
}
