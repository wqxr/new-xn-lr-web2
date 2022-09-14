import { Component, ElementRef, Input, OnChanges, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import PlanTableConfig from '../../bean/plan-table-config';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

/**
 *  保理预录入-应收账款保理计划表(上海银行)
 */
@Component({
    selector: 'lib-oct-plan-table-input',
    templateUrl: './plan-table-input.component.html',
    styles: [`
        .table-display tr td {
            width: 200px;
            vertical-align: middle;
            background: #fff;
        }
        .tables {
            overflow-x: hidden;
        }
        .table {
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 0;
            word-break: break-all;
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
@DynamicForm({ type: 'octplan-table', formModule: 'dragon-input' })
export class OctPlanTableInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;    // 获取的上传的excel文件内容
    public ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    // 表格匹配字段
    heads = PlanTableConfig.getConfig('shanghai').sh_oct_financing_pre;
    // 应收账款保理计划表数据
    items: DebtOutputModel[] = [];
    alert = '';
    headLeft = 0;
    // 使用提单表格类型,默认''
    type = '';
    uploadCtr = true;
    // 固定第一列
    scrollX = 0;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
                public hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        // 暂存的总部公司
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

    // 水平滚动表头 水平滚动固定第一列
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
        // console.log(this.headLeft);
        const fixedColumn = $('.tables').find('.head-height tr td:nth-child(1),.table-height tr td:nth-child(1)');
        if ($event.srcElement.scrollLeft !== this.scrollX) {
            this.scrollX = $event.srcElement.scrollLeft;
            fixedColumn.each((index, col: any) => {
                col.style.transform = 'translateX(' + this.scrollX + 'px)';
            });
        }
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}

// 字段模型
export class DebtOutputModel {
    public index?: string;    // 应收账款序号
    public contractId: string; // 合同编号
    public headquarters: string; // 总部公司;长度[1;100]
    public projectCompany: string; // 申请付款单位;长度[1;100]
    public contractName: string; // 合同名称
    public preInvoiceNum: string; // 预录入发票号码
    public preInvoiceAmount: string; // 预录入发票金额
    public receive: number; // 应收账款金额
    public serviceRate: string; // 服务费率
    public debtUnit: string; // 收款单位;长度[1;100]
    public debtUnitAccount: string; // 收款单位账号
    public debtUnitBank: string; // 收款单位开户行
    public operatorName: string; // 运营部对接人 ;人名
    public marketName: string; // 市场部对接人 ;人名
    public cityCompany: string; // 城市公司
}
