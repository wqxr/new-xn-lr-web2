import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%">
            <tbody>
            <tr>
                <td style="width:10%">万科供应商企业名称</td>
                <td style="width:40%">{{suppliercomp.name}}</td>
                <td style="width:10%">上游客户企业名称</td>
                <td style="width:40%">{{ustreamcomp.name}}</td>
            </tr>
            <tr>
                <td>统一社会信用代码</td>
                <td>{{suppliercomp.CreditCode}}</td>
                <td>统一社会信用代码</td>
                <td>{{ustreamcomp.CreditCode}}</td>
            </tr>
            <tr>
                <th>法定代表人</th>
                <td>{{suppliercomp.OperName}}</td>
                <th>法定代表人</th>
                <td>{{ustreamcomp.OperName}}</td>
            </tr>
            <tr>
                <td>成立日期</td>
                <td>{{suppliercomp.StartDate}}</td>
                <td>成立日期</td>
                <td>{{ustreamcomp.StartDate}}</td>
            </tr>
            <tr>
                <td>注册资本</td>
                <td>{{suppliercomp.RegistCapi}}</td>
                <td>注册资本</td>
                <td>{{ustreamcomp.RegistCapi}}</td>
            </tr>
            <tr>
                <td>所属行业</td>
                <td>{{suppliercomp.industry}}</td>
                <td>所属行业</td>
                <td>{{ustreamcomp.industry}}</td>
            </tr>
            <tr>
                <td>企业类型</td>
                <td>{{suppliercomp.EconKind}}</td>
                <td>企业类型</td>
                <td>{{ustreamcomp.EconKind}}</td>
            </tr>
            <tr>
                <td>注册地址</td>
                <td>{{suppliercomp.address}}</td>
                <td>注册地址</td>
                <td>{{ustreamcomp.address}}</td>
            </tr>
            <tr>
                <td>营业期限</td>
                <td>{{suppliercomp.businessTerm}}</td>
                <td>营业期限</td>
                <td>{{ustreamcomp.businessTerm}}</td>
            </tr>
            <tr>
                <td>经营范围</td>
                <td>{{suppliercomp.Scope}}</td>
                <td>经营范围</td>
                <td>{{ustreamcomp.Scope}}</td>
            </tr>
            <tr>
                <td>登记机关</td>
                <td>{{suppliercomp.BelongOrg}}</td>
                <td>登记机关</td>
                <td>{{ustreamcomp.BelongOrg}}</td>
            </tr>
            <tr>
                <td>核准日期</td>
                <td>{{suppliercomp.approvalDate}}</td>
                <td>核准日期</td>
                <td>{{ustreamcomp.approvalDate}}</td>
            </tr>
            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'basicMsg', formModule: 'avenger-show' })
export class AvengerBasicMsgComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public items: any[] = [];

    public suppliercomp = {
        name: '', // 公司名称
        CreditCode: '', // 社会信用代码
        OperName: '', // 法人
        StartDate: '', // 成立时间
        RegistCapi: '', // 注册资本
        industry: '', // 所属行业
        EconKind: '', // 企业类型
        address: '',
        businessTerm: '', // 营业期限
        Scope: '', // 经营范围
        BelongOrg: '', // 登记机关
        approvalDate: '', // 核准日期
    };

    public ustreamcomp = {
        name: '', // 公司名称
        CreditCode: '', // 社会信用代码
        OperName: '', // 法人
        StartDate: '', // 成立时间
        RegistCapi: '', // 注册资本
        industry: '', // 所属行业
        EconKind: '', // 企业类型
        address: '',
        businessTerm: '', // 营业期限
        Scope: '', // 经营范围
        BelongOrg: '', // 登记机关
        approvalDate: '', // 核准日期

    };


    constructor(
        private xn: XnService,
        private localStorageService: LocalStorageService, private communicate: PublicCommunicateService, ) {
    }

    ngOnInit() {
        this.xn.avenger.post('/sub_system/qichacha/getCompanyMaster',
            { company: this.svrConfig.record.supplierName }).subscribe(x => {
                if (x.data && x.data.Result) {
                    const obj = x.data.Result;
                    this.suppliercomp.name = obj.Name;
                    this.suppliercomp.CreditCode = obj.CreditCode;
                    this.suppliercomp.address = obj.Address;
                    this.suppliercomp.StartDate = obj.StartDate;
                    this.suppliercomp.approvalDate = obj.CheckDate;
                    this.suppliercomp.OperName = obj.OperName;
                    this.suppliercomp.industry = obj.Industry.Industry;
                    this.suppliercomp.businessTerm = obj.TermStart + '-' + obj.TeamEnd;
                    this.suppliercomp.RegistCapi = obj.RegistCapi;
                    this.suppliercomp.BelongOrg = obj.BelongOrg;
                    this.suppliercomp.EconKind = obj.EconKind;
                    this.suppliercomp.Scope = obj.Scope;
                } else {
                    this.xn.msgBox.open(false, '未查到该企业信息');
                }
            });
        this.xn.avenger.post('/sub_system/qichacha/getCompanyMaster',
            { company: this.svrConfig.record.upstreamName }).subscribe(x => {
                if (x.data && x.data.Result) {
                    const obj = x.data.Result;
                    this.ustreamcomp.name = obj.Name;
                    this.ustreamcomp.CreditCode = obj.CreditCode;
                    this.ustreamcomp.address = obj.Address;
                    this.ustreamcomp.StartDate = obj.StartDate;
                    this.ustreamcomp.approvalDate = obj.CheckDate;
                    this.ustreamcomp.OperName = obj.OperName;
                    this.ustreamcomp.industry = obj.Industry.Industry;
                    this.ustreamcomp.businessTerm = obj.TermStart + '-' + obj.TeamEnd;
                    this.ustreamcomp.RegistCapi = obj.RegistCapi;
                    this.ustreamcomp.BelongOrg = obj.BelongOrg;
                    this.ustreamcomp.EconKind = obj.EconKind;
                    this.ustreamcomp.Scope = obj.Scope;
                } else {
                    this.xn.msgBox.open(false, '未查到该企业信息');
                }
            });



    }
}
