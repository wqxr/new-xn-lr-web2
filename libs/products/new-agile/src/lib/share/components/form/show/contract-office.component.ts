import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { VankeViewContractModalComponent } from 'libs/shared/src/lib/public/modal/contract-vanke-mfile-detail.modal';


@Component({
    template: `
    <table class="table table-bordered table-hover text-center file-row-table">
    <thead>
      <tr>
        <th>合同编号</th>
        <th>合同金额</th>
        <th>合同名称</th>
        <th>合同类型</th>
        <th>图片文件</th>
        <th>合同签署时间</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items">
        <td>{{item?.files?.contractNum}}</td>
        <td>{{item?.files?.contractAmount | number :'1.2-3'}}</td>
        <td>{{item?.files?.contractName}}</td>
        <td>{{item?.files?.contractType}}</td>
        <td>
          <a href="javaScript:void (0)" (click)="viewFileCon(item)">文件</a>
        </td>
        <td>{{item?.files?.contractSignTime}}</td>
      </tr>
    </tbody>
  </table>
    `
})
@DynamicForm({ type: 'contract-office', formModule: 'new-agile-show' })
export class XnContractOfficeShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    @Input() action: any;
    items: any[];

    public orgType: number = this.xn.user.orgType;

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private localStorageService: LocalStorageService,
        ) {
    }

    ngOnInit(): void {
        const { data } = this.row;
        if (!!data) {
            this.items = JSON.parse(data);
        }
    }

        // 万科查看文件修改
    public viewFileCon(item: any) {
        const headquarters = this.localStorageService.caCheMap.get('headquarters');
        // 合同编号
        const debtUnits = this.action.checkers.filter((x: any) => x.checkerId === 'debtUnit');
        const paybables = this.action.checkers.filter((x: any) => x.checkerId === 'payables');
        const projectCompanys = this.action.checkers.filter((x: any) => x.checkerId === 'projectCompany');
        const debtUnit = debtUnits && debtUnits.length ? debtUnits[0].data : '';
        const paybable = paybables && paybables.length ? paybables[0] : '';
        const projectCompany = projectCompanys && projectCompanys.length ? projectCompanys[0].data : '';

        const checkers = [
            {
                title: '合同名称',
                checkerId: 'contractName',
                required: false,
                type: 'text',
                options: { readonly: true },
                value: item.files.contractName || '',
                number: 3
            },
            {
                title: '合同编号',
                checkerId: 'contractNum',
                type: 'text',
                required: false,
                options: { readonly: true },
                value: item.files.contractNum,
                number: 2
            },
            {
                title: '合同金额',
                checkerId: 'contractAmount',
                type: 'money',
                required: false,
                options: { readonly: true },
                value: item.files.contractAmount,
                number: 6
            },
            {
                title: '付款比例',
                checkerId: 'payRate',
                type: 'text',
                required: false,
                options: { readonly: true },
                value: item.files.payRate,
                number: 6
            },
            {
                title: '合同类型',
                checkerId: 'contractType',
                type: 'select',
                required: false,
                options: { ref: 'contractType_jban' },
                value: item.files.contractType,
                number: 6
            },
            {
                title: '合同签订时间',
                checkerId: 'contractSignTime',
                required: false,
                type: 'date-null',
                value: item.files.contractSignTime || '',
                placeholder: '',
                options: { readonly: true },
                number: 7
            },
            {
                title: '基础合同甲方名称',
                checkerId: 'contractJia',
                type: 'text',
                required: false,
                options: { readonly: true },
                value: item.files.contractJia,
                number: 6
            },
            {
                title: '基础合同乙方名称',
                checkerId: 'contractYi',
                type: 'text',
                required: false,
                options: { readonly: true },
                value: item.files.contractYi,
                number: 6
            },
            {
                title: '累积确认产值',
                checkerId: 'cumulativelyOutputValue',
                type: 'money',
                required: false,
                options: { readonly: true },
                value: item.files.cumulativelyOutputValue,
                number: 1
            },
            {
                title: '本次产值金额',
                checkerId: 'percentOutputValue',
                type: 'money',
                required: false,
                options: { readonly: true },
                value: item.files.percentOutputValue,
                number: 6
            },
            {
                title: '本次付款性质',
                checkerId: 'payType',
                type: 'select',
                options: { ref: 'payType' },
                value: item.files.payType,
                number: 6
            },
            {
                title: '收款单位',
                checkerId: 'debtUnit',
                required: false,
                type: 'text',
                options: { readonly: true },
                value: item.files.debtUnit || debtUnit,
                number: 4
            },
            {
                title: '申请付款单位',
                checkerId: 'projectCompany',
                required: false,
                type: 'text',
                options: { readonly: true },
                value: item.files.projectCompany || projectCompany,
                number: 5
            },
            {
                title: '应付账款金额',
                checkerId: 'payables',
                required: false,
                type: 'money',
                options: { readonly: true },
                value: paybable.data,
                number: 8
            }];

        const params = {
            checkers,
            value: item,
            title: '补充合同信息',
            isShow: true,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeViewContractModalComponent
            , params).subscribe((v: any) => {});
    }
}
