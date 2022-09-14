import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BankManagementService } from '../bank-mangement.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import TableHeadConfig from 'libs/shared/src/lib/config/table-head-config';

/**
 *  万科模式-合同模版管理
 */
@Component({
    templateUrl: './contract-template-index.component.html',
    styles: [`
        .title {
            padding: 7px 0 0 0;
            text-align: left;
        }
    `]
})
export class ContractTemplateIndexComponent implements OnInit {
    pageTitle = '合同模版管理';
    shows: any[] = [];
    mainForm: FormGroup;
    searches: any[] = [];
    data: any[] = []; // 合同列表
    pageSize = 10;
    first = 0;
    total = 0;
    currentPage: number;
    heads = TableHeadConfig.getConfig('合同规则').headText;
    headBtnStatus: boolean;
    // 自定义配置
    config = {
        edit: true,
        select: true,
        rows: [{ label: '编辑', value: 'edit' }, { label: '删除', value: 'delete' }]
    };

    constructor(private xn: XnService, private bankManagementService: BankManagementService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.buildForm();
        this.getData(1);
    }

    /**
     *  event.page: 新页码 event.pageSize: 页面显示行数 event.first: 新页面之前的总行数,下一页开始下标 event.pageCount : 页码总数
     *  param  {first:0  page :1 pageCount:3 pageSize:2}
     */
    onPage(event: { first: number; page: number; pageCount: number; pageSize: number }) {
        this.pageSize = event.pageSize;
        this.getData(event.page);
    }

    // 新增合同模版-新流程
    handleAdd() {
        this.xn.router.navigate(['console/record/new/contract_rule_add']);
    }

    // 下载附件-合同模板
    download(): void {
        let paramsItem = [];
        const items = this.data.filter((x: any) => x.checked === true).map(y => y.applyTemplate);
        if (items.length) {
            items.map(item => {
                if (typeof item === 'string') {
                    paramsItem = [...paramsItem, ...JSON.parse(item)];
                }
            });
            this.xn.api.download('/file/down_file', {
                files: paramsItem
            }).subscribe((v: any) => {
                this.xn.api.save(v._body, '合同模版');
                this.data.forEach(data => data.checkerId === false);
            });
        } else {
            this.xn.msgBox.open(false, '无可下载项');
        }

    }

    /**
     * @param obj {label:'',item:{}}
     */
    handleRow(obj) {
        if (obj.label === 'delete') {
            this.xn.msgBox.open(true, '确认删除', () => {
                this.xn.api.post('/custom/contract_template/contract_template/delete_contract_template', { contractTemplateId: obj.item.contractTemplateId })
                    .subscribe(() => {
                        this.getData(this.currentPage);
                    });
            });
        }
        if (obj.label === 'edit') {
            this.xn.router.navigate(['console/record/new'], {
                queryParams: {
                    id: 'contract_rule_edit',
                    relate: 'contractTemplateId',
                    relateValue: obj.item.contractTemplateId
                }
            });
        }
    }

    deleteRow() {
        const items = this.data.filter((x: any) => x.checked === true);
        this.xn.msgBox.open(true, '确认删除', () => {
            items.forEach((item, index) => {
                this.xn.api.post('/custom/contract_template/contract_template/delete_contract_template', { contractTemplateId: item.contractTemplateId })
                    .subscribe(() => {
                        if (index === items.length - 1) {
                            this.getData(this.currentPage);
                        }
                    });
            });
        });
    }

    // 重置
    reset(): void {
        this.mainForm.setValue({ specialSupplier: '', applyTemplate: '', headquarters: '', templateType: '' });
        this.getData(1);
    }

    headBtn(e) {
        this.headBtnStatus = e;
    }

    getData(page?) {
        page = page || 1;
        this.currentPage = page;
        const post = this.bankManagementService.searchFormat(page, this.pageSize, this.searches);
        this.xn.api.post(`/custom/contract_template/contract_template/contract_template_list `, post).subscribe(v => {
            if (v.data && v.data.data && v.data.data.length) {
                this.data = v.data.data;
                this.total = v.data.recordsTotal;
            } else {
                this.data = [];
            }
        });
    }

    // 构建表头搜索项
    private buildForm(): void {
        this.shows = [
            {
                title: '特殊供应商',
                checkerId: 'specialSupplier',
                type: 'text',
                required: false
            },
            {
                title: '适用合同模板',
                checkerId: 'applyTemplate',
                type: 'text',
                required: false
            },
            {
                title: '总部公司',
                checkerId: 'headquarters',
                type: 'select',
                required: false,
                options: {ref: 'abs_headquarters'}
            },
            {
                title: '合同规则类型',
                checkerId: 'templateType',
                type: 'select',
                required: false,
                options: { ref: 'contractRules' }
            }
        ];

        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe(v => {
            const search = [];
            for (const key in this.mainForm.value) {
                if (this.mainForm.value.hasOwnProperty(key)) {
                    if (this.mainForm.value[key] !== '') {
                        const obj = {} as any;
                        obj.key = key;
                        obj.value = this.mainForm.value[key];
                        search.push(obj);
                    }
                }
            }
            this.searches = search;
        });
    }

    private buildChecker(stepRows): void {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
