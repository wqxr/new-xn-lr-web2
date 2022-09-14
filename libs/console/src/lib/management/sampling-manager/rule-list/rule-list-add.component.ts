/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：comfirm-information-index-component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason                      date
 * 1.0                   hcy            抽样模型管理-新增规则       2020-04-15
 * **********************************************************************
 */


import { Component, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { TabListOutputModel, SubTabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

@Component({
    templateUrl: `./rule-list-add.component.html`,
    styles: [`
    .panel-footer {
        padding: 10px 15px;
        background-color: #f5f5f5;
        border-top: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        display:flex;
        justify-content: space-between;
    }
    .item-box {
        position: relative;
        display: flex;
        margin-bottom: 10px;
    }
    .item-label label {
        min-width: 150px;
        padding-right: 8px;
        font-weight: normal;
        line-height: 34px;
        text-align:right;
    }
    .item-control {
        flex: 1;
    }
    .item-control select {
        width: 100%
    }
    .operate-btn {
        min-width: 90px;
    }
    .input-check {
        width: 100px;
    }
    .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
        /*position: relative;*/
        cursor: pointer
    }
    .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
        font-family: 'Glyphicons Halflings';
        opacity: 0.5;
    }
    .table-head .sorting:after {
        content: "\\e150";
        opacity: 0.2
    }
    .table-head .sorting_asc:after {
        content: "\\e155"
    }
    .table-head .sorting_desc:after {
        content: "\\e156"
    }
    ul.sub-ul {
        margin-bottom: 5px;
        border-bottom: 1px solid #3c8dbc;
    }
    ul.sub-ul > li > a {
        padding: 5px 35px;
        border-top: none;
        background-color: #F2F2F2;
    }
    ul.sub-ul > li.active > a {
        background-color: #3c8dbc;
    }
    .center-block{
        clear: both;
        border-bottom: 1px solid #ccc;
        width: 43.9%;
        height: 1px;
    }
    .showClass{
        width: 12.5%;
        margin: 0 auto;
        border: 1px solid #ccc;
        text-align: center;
        border-top: 0px;
        clear:both;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    `]
})
export class RuleListAddComponent implements OnInit {
    public tabConfig: any;
    public defaultValue = 'A';  // 默认激活第一个标签页
    // 搜索项
    public shows: any[] = [];
    public form: FormGroup;
    public searches: any[] = []; // 面板搜索配置项项
    public currentTab: any; // 当前标签页
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
    public subDefaultValue = 'DOING'; // 默认子标签页
    public formModule = 'dragon-input';
    public arrObjs = {} as any; // 缓存后退的变量
    public showCheckBox = false; // 默认隐藏单选框
    public checkBoxData: any[] = []; // 合同类型选择框
    public unSubmit = true; // 禁止提交
    public formValue: any; // 表单值
    public queryParams: any; // 路由参数

    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        public bankManagementService: BankManagementService,
        private router: ActivatedRoute,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {

        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.initData();

        });

        // 修改规则 规则参数
        this.router.queryParams.subscribe(v => {
            this.queryParams = v;
            if (this.queryParams.ruleConfig) {
                this.setFormValue();
            }
        });
    }

    /**
      * 表单赋值
      * @param
      */
    public setFormValue() {
        this.tabConfig.title = '修改规则';
        const ruleConfig = JSON.parse(this.queryParams.ruleConfig);
        ruleConfig.ruleName = this.queryParams.ruleName;

        const formValue = this.form.value;
        // 表单赋值
        for (const checkId in formValue) {
            for (const key in ruleConfig) {
                if (checkId === key) {
                    if (checkId === 'requireScope') { // 其他要求
                        const { contractTypeList, formType, type, value } = ruleConfig[checkId];
                        this.form.get(checkId).setValue(formType.toString());

                        if (formType === 1) { // 合同类型
                            this.form.get(FormType[formType]).setValue(type);
                        } else { // 区域/企业要求
                            this.form.get(FormType[formType]).setValue({ type, value });
                        }

                        if (contractTypeList.length > 0) { // checkbox
                            contractTypeList.forEach((t: any) => {
                                const obj = { name: ContractType[t], checked: true };
                                this.checkBoxData.push(obj);
                            });
                        } else {
                            this.checkBoxData = [];
                        }

                    } else {
                        this.form.get(checkId).setValue(ruleConfig[checkId]);
                    }
                }
            }
        }
        this.checkBoxData.forEach(x => {
            this.form.get(x.name).setValue(true);
        });
        this.showCheckBox = this.checkBoxData.length > 0 ? true : false;
        this.unSubmit = false;
        this.cdr.markForCheck();
    }

    /**
      *  标签页，加载列表信息
      * @param
      * @param
      */
    public initData() {
        this.onPage();
    }


    /**
     * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
     * @summary
     */
    public onPage() {
        // 页面配置
        const find = this.tabConfig.tabList.find((tab: any) => tab.value === this.defaultValue);
        this.currentTab = !!find ? find : new TabListOutputModel();
        // 子页面配置
        const subFind = this.currentTab.subTabList.find((sub: any) => sub.value === this.subDefaultValue);
        this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
        this.searches = this.currentSubTab.searches; // 当前标签页的搜索项

        this.buildShow(this.searches);
    }

    /**
     * 构建搜索项
     * @param searches
     */
    private buildShow(searches: any) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }

    private buildChecker(stepRows: any) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    /**
     * 构建表单
     * @param searches
     */
    private buildCondition(searches: any) {
        const objList = [];
        this.searches = this.searches.concat(
            [{ checkerId: 'project', required: true },
            { checkerId: 'trade', required: true },
            { checkerId: 'design', required: true },
            { checkerId: 'supervise', required: true },]);
        for (let i = 0; i < this.searches.length; i++) {
            const obj = {} as any;
            obj.title = this.searches[i].title;
            obj.checkerId = this.searches[i].checkerId;
            obj.required = this.searches[i].required;
            obj.type = this.searches[i].type;
            obj.options = this.searches[i].options;
            obj.placeholder = this.searches[i].placeholder;
            obj.validators = this.searches[i].validators;
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        // 表单值改变
        this.form.valueChanges.subscribe((v: any) => {
            // console.log(v);
            this.arrObjs = v;
            this.formValue = v;
            this.validators(this.formValue);
            this.cdr.markForCheck();
        });
    }

    /**
     * 清空checkbox
     * @param
     */
    clearCheckBox() {
        this.checkBoxData.forEach((i: any) => {
            this.form.get(i.name).setValue('');
        });
        this.checkBoxData = [];
        this.cdr.markForCheck();
    }

    /**
     * 合同类型change
     * @param
     */
    private contractScopeChecked(e: any) {
        if (e.target.checked) {
            this.checkBoxData.push({ name: e.target.name, checked: e.target.checked });
        } else {
            const i = this.checkBoxData.findIndex((item: any, index: any) => {
                if (item.name == e.target.name) {
                    return index;
                }
            });
            this.checkBoxData.splice(i, 1);
        }
        const { ruleName, moduleConut, wayType } = this.formValue;
        this.unSubmit = ruleName === '' || moduleConut === '' || wayType === '' ? true : false;
        // this.unSubmit = this.checkBoxData.length > 0 ? this.unSubmit : true;
    }
    /**
       * 回退操作
       * @param data
       */
    private onUrlData(data?: any) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
    }

    /**
     * *  返回
     * @param
     * @summary
     */
    public back() {
        if (this.queryParams.pageing) {
            this.xn.router.navigate(['/console/manage/sampling/management-list'], {
                queryParams: {
                    defaultValue: 'F',
                    pageing: this.queryParams.pageing
                }
            });
        } else {
            this.xn.router.navigate(['/console/manage/sampling/management-list'], {
                queryParams: {
                    defaultValue: 'F',
                    pageing: 1
                }
            });
        }
    }

    /**
     * 提交
     * @param
     */
    toSubmit(): void {
        const params = this.buildParams();
        if (!!this.queryParams.ruleId) {
            params.ruleId = this.queryParams.ruleId;
            // 修改规则
            this.sendRequest('/rule/alter_rule', params);
        } else {
            // 新增规则
            this.sendRequest('/rule/add_rule', params);
        }
    }

    /**
     * 发送请求
     * @params url: 请求api
     * @params params: 请求参数
     */
    sendRequest(url: string, params: any) {
        this.xn.loading.open();
        this.xn.dragon.post(url, params).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
                this.xn.router.navigate(['/console/manage/sampling/management-list'], {
                    queryParams: {
                        defaultValue: 'F',
                        pageing: 1
                    }
                });
            }
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     * 构建参数
     */
    private buildParams(): any {
        const ruleConfig: any = {} as any;
        // 规则配置过滤
        for (const search of this.searches) {
            if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                ruleConfig[search.checkerId] = this.arrObjs[search.checkerId];

                switch (search.checkerId) {
                    case 'wayType': // 抽样方式
                        ruleConfig[search.checkerId] = Number(this.arrObjs[search.checkerId]);
                        break;

                    case 'receiveScope': // 金额要求
                        delete ruleConfig[search.checkerId].valid;
                        break;

                    case 'requireScope': // 其他要求
                        ruleConfig[search.checkerId] = {} as any;
                        const contractTypeList = []; // 合同列表
                        this.checkBoxData.forEach(x => {
                            contractTypeList.push(ContractType[x.name]);
                        });
                        ruleConfig[search.checkerId].formType = Number(this.arrObjs[search.checkerId]);
                        ruleConfig[search.checkerId].contractTypeList = contractTypeList;
                        break;

                    case 'contractScope': // 合同类型
                        delete ruleConfig[search.checkerId];
                        ruleConfig.requireScope.type = Number(this.arrObjs[search.checkerId]);
                        ruleConfig.requireScope.value = -1;
                        break;

                    case 'provinceScope': // 区域要求
                        delete ruleConfig[search.checkerId];
                        Object.assign(ruleConfig.requireScope, this.arrObjs[search.checkerId]);
                        break;

                    case 'companyScope': // 企业要求
                        delete ruleConfig[search.checkerId];
                        Object.assign(ruleConfig.requireScope, this.arrObjs[search.checkerId]);
                        break;

                    default:
                        break;
                }
            }
        }
        // 不分合同类型抽样
        if (ruleConfig.requireScope && ruleConfig.requireScope.formType === 1 && ruleConfig.requireScope.type === 1) {
            ruleConfig.requireScope.contractTypeList = [];
        }
        delete ruleConfig.ruleName;
        const params: any = {
            ruleName: this.arrObjs.ruleName,
            ruleConfig,
        };
        return params;
    }


    /**
     * *  表单校验
     * @param formValue 表单值
     */
    validators(formValue: any): void {
        const { contractScope, ruleName, numScope, wayType, provinceScope, companyScope, receiveScope, requireScope } = formValue;
        this.unSubmit = (ruleName !== '' && numScope !== '' && wayType !== '') ? false : true;

        this.showCheckBox = requireScope && (contractScope || provinceScope || companyScope) ? true : false;

        if (contractScope && Number(contractScope) === 1) {
            this.showCheckBox = false;
        }

        if (!!receiveScope) {
            this.unSubmit = (receiveScope.valid !== undefined && !receiveScope.valid) ? true : this.unSubmit;
        }

        if (!!requireScope) {
            this.unSubmit = (contractScope || provinceScope || companyScope) ? this.unSubmit : true;
        }

    }
}

/**合同类型*/
export enum ContractType {
    /** 工程 */
    'project' = 1,
    /** 贸易 */
    'trade' = 2,
    /** 设计 */
    'design' = 3,
    /** 监理 */
    'supervise' = 4,
}

/**其他要求类型*/
export enum FormType {
    /** 合同类型 */
    'contractScope' = 1,
    /** 区域要求 */
    'provinceScope' = 2,
    /** 企业要求 */
    'companyScope' = 3,
}
