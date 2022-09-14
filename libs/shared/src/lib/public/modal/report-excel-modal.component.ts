import {Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

@Component({
    templateUrl: './report-excel-modal.component.html',
    styles: [

        `.panel { margin-bottom: 0 }`,
        `.form-group .input { height: 28px; line-height: normal }`,

    ]
})
export class ReportExcelModalComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('modal') modal: ModalComponent;

    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    files: any[];
    articalParams: any = {} as any;


    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.params = params;
        this.modal.open(ModalSize.XLarge);

        // 处理数据
        this.shows = [];

        const selectOptionsArr = [
            {label: '流程记录id', value: 'mainFlowId'},
            {label: '流程步骤', value: 'mainFlowSeq'},
            {label: '融资总金额', value: 'contractAmount'},
            {label: '贴现价格', value: 'price'},
            {label: '签订合同日期', value: 'signContractTime'},
            {label: '放款日期', value: 'payTime'},
            {label: '订单截止日期', value: 'orderEndTime'},
            {label: '最后一次还款日期', value: 'lastPayBackTime'},
            {label: '订单状态', value: 'status'},
            {label: '还款方式', value: 'payBackType'},
            {label: '贴现类型', value: 'isProxy'},
            {label: '供应商区块链ID', value: 'supplierOrgId'},
            {label: '供应商appId', value: 'supplierAppId'},
            {label: '供应商名称', value: 'supplierOrgName'},
            {label: '核心企业区块链ID', value: 'enterpriseOrgId'},
            {label: '核心企业appId', value: 'enterpriseAppId'},
            {label: '核心企业名称', value: 'enterpriseOrgName'},
            {label: '保理区块链ID', value: 'factoringOrgId'},
            {label: '保理appId', value: 'factoringAppId'},
            {label: '保理名称', value: 'factoringOrgName'},
            {label: '区块链账本ID', value: 'bcLedgerId'},
            {label: '区块链上的orderId', value: 'bcOrderId'},
            {label: '区块链上的orderNO', value: 'bcOrderNO'},
            {label: '创建时间', value: 'createTime'},
            {label: '最后时间', value: 'updateTime'},
            {label: '商票号码', value: 'honourNum'},
            {label: '商票图片id', value: 'fileId'},
            {label: '商票图片名字', value: 'fileName'},
            {label: '商票金额', value: 'honourAmount'},
            {label: '开票时间', value: 'honourDate'},
            {label: '到期时间', value: 'dueDate'},
            {label: '保理到期时间', value: 'factoringDate'},
            {label: '商票承兑人', value: 'acceptorName'},
            {label: '承兑行行号', value: 'honourBankNum'},
            {label: '保理金额', value: 'repaymentAmount'},
        ];

        this.shows.push({
            name: 'field',
            required: false,
            type: 'checkbox',
            title: '请选择导出项',
            selectOptions: selectOptionsArr,
        });

        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        this.mainForm.valueChanges.subscribe((v) => {
            this.formValid = this.mainForm.valid;
        });

        this.formValid = this.mainForm.valid;

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    cssClass(step): string {
        if (step === this.steped) { return 'current'; }
        if (step > this.steped) { return 'disabled'; }
        else { return 'success'; }
    }

    onOk() {
        this.close('ok');
    }

    onSubmit() {
        if (!this.mainForm.value.field || this.mainForm.value.field === '') {
            return;
        }
        const fields = this.mainForm.value.field.split(',').filter(v => v !== '');
        // 拼接文件名
        const appId = this.xn.user.appId;
        const orgName = this.xn.user.orgName;
        const time = new Date().getTime();
        const filename = this.params.mainFlowId + '-' + orgName + '-' + time + '.xlsx';
        appId + '-' + orgName + '-' + time + '.zip';
        this.xn.api.download('/flow/bill_main/excel_export', {
            field: fields
        }).subscribe((v: any) => {
            this.xn.api.save(v._body, filename);
        });
    }

}
