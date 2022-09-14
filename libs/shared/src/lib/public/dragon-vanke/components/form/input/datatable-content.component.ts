import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import TableHeadConfig from '../../../../../config/table-head-config';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


/**
 *  表格
 */
@Component({
    templateUrl: './datatable-content.component.html',
    styles: [`

    table {
        table-layout: fixed;
        margin: 0;
    }

    table tr td:first-child, table tr th:first-child {
        width: 300px;
    }

    table tr td:nth-child(2), table tr th:nth-child(2) {
        width: 350px;
    }

    .scroll-height {
        max-height: calc(100vh - 450px);
        overflow-y: auto
    }

    .scroll-height > table {
        border-top: none;
    }

    .scroll-height > table tr:first-child td {
        border-top: 0;
    }
    `]
})
@DynamicForm({ type: 'data-table-content', formModule: 'dragon-input' })
export class DataTableContentComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;    // 获取的上传的excel文件内容
    public ctrl: AbstractControl;
    // 表格匹配字段
    heads = TableHeadConfig.getConfig('龙光提单');
    // 应收账款保理计划表数据
    items: ItemModel[] = [];
    alert = '';
    headLeft = 0;
    params: any;
    // 使用提单表格类型,默认''
    type = '';
    uploadCtr = true;
    public data: any;

    constructor() {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);

        this.uploadCtr = this.type === '' || this.type === undefined;

        this.fromValue();
    }

    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
        console.log(this.headLeft);
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }


}

// 字段模型
export class ItemModel {
    public mainFlowId: string;           // 交易ID
    public poolTradeCode: string;        // 资产编号
    public debtUnit: string;             // 收款单位
    public projectCompany: string;       // 申请付款单位
    public headquarters: string;         // 总部公司
    public receive: string;              // 交易金额
    public factoringEndDate: string;      // 保理融资到期日,
    public priorityLoanDate: string;      // 优先放款日期,
}
