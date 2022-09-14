/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：comfirm-information-index-component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author               reason                   date
 * 1.0                   hcy            抽样模型管理-查看规则       2020-04-02
 * **********************************************************************
 */



import { Component, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { TabListOutputModel, SubTabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { SamplingEditRuleComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/sampling-edit-rule.component';

@Component({
    templateUrl: `./rule-list-look.component.html`,
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
export class RuleListLookComponent implements OnInit {
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
    public formValue: any; // 表单值
    public queryParams: any = {} as any; // 路由参数

    constructor(private xn: XnService,
                private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef,
                private router: ActivatedRoute,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {

        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.initData();

        });

        // 查看规则 规则参数
        this.router.queryParams.subscribe(v => {
            if (v.ruleConfig) {
                this.queryParams = v;
                const ruleConfig = JSON.parse(this.queryParams.ruleConfig);
                return this.setFormValue(ruleConfig);
            }
            if (v.moduleInfo) { // 新增模型->查看规则
                this.queryParams.ruleId = v.ruleId;
                this.queryParams.moduleInfo = v.moduleInfo;
                return this.getRuleInfo(Number(v.ruleId));
            }
            if (v.ruleId && !v.ruleConfig) { // 查看模型->查看规则
                this.queryParams.ruleId = v.ruleId;
                return this.getRuleInfo(Number(v.ruleId));
            }
        });
    }

    /**
      *  表单赋值
      * @param ruleConfig 规则配置
      * @param
      */
    public setFormValue(ruleConfig: any) {
        this.tabConfig.title = '查看规则';
        ruleConfig.ruleName = this.queryParams.ruleName;
        const objList = [];
        this.searches = this.searches.concat(
            [{ checkerId: 'project', required: true },
            { checkerId: 'trade', required: true },
            { checkerId: 'design', required: true },
            { checkerId: 'supervise', required: true }, ]);

        for (let i = 0; i < this.searches.length; i++) {
            const obj = {} as any;
            obj.title = this.searches[i].title;
            obj.checkerId = this.searches[i].checkerId;
            obj.required = false;
            obj.type = this.searches[i].type;
            obj.options = this.searches[i].options;
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList); // 深拷贝，并排序;

        // 表单赋值
        this.shows.forEach(t => {
            if (!!ruleConfig[t.checkerId] || t.value) {
                if (t.value) {
                    return;
                }
                t.value = ruleConfig[t.checkerId]; // 有值取value 没有取ruleConfig
                if (t.checkerId === 'requireScope') { // 其他要求
                    const { contractTypeList, formType, type, value } = ruleConfig[t.checkerId];
                    t.value = formType.toString();

                    if (formType === 1) {
                        // 合同类型
                        this.shows.forEach(v => {
                            if (v.checkerId === FormType[formType]) {
                                v.value = type;
                            }
                        });
                    } else {
                        // 区域/企业要求
                        this.shows.forEach(v => {
                            if (v.checkerId === FormType[formType]) {
                                v.value = { type, value };
                            }
                        });
                    }

                    if (contractTypeList.length > 0) {
                        contractTypeList.forEach((t: any) => {
                            const obj = { name: ContractType[t], checked: true };
                            this.checkBoxData.push(obj);
                        });
                    } else {
                        this.checkBoxData = [];
                    }
                }
            } else {
                t.value = '';
            }
        });
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows); // 构建表单
        this.checkBoxData.forEach(x => {
            this.form.get(x.name).setValue(true);
        });
        this.showCheckBox = this.checkBoxData.length > 0 ? true : false;
        this.cdr.markForCheck();
    }

    /**
      *  获取单个规则详情
      * @param ruleId 规则id
      * @param
      */
    public getRuleInfo(ruleId: number) {
        this.xn.loading.open();
        this.xn.dragon.post('/rule/info_rule', { ruleId }).subscribe(res => {
            this.xn.loading.close();
            if (res.ret === 0) {
                const { ruleName, ruleConfig, ruleStatus } = res.data;
                this.queryParams.ruleName = ruleName;
                this.queryParams.ruleConfig = ruleConfig;
                this.queryParams.ruleStatus = ruleStatus;
                this.setFormValue(JSON.parse(ruleConfig));
            }
        }, () => {
            this.xn.loading.close();
        });
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
     * 获取页面配置
     * @param
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
    }

    private buildChecker(stepRows: any) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    /**
     *  修改规则
     * @param item 行信息
     * @param
     */
    toEditRule() {
        if (Number(this.queryParams.ruleStatus) === 0) { // 修改未使用规则
            this.xn.router.navigate(['/console/manage/sampling/add-newRule'],
                {
                    queryParams: {
                        ruleConfig: this.queryParams.ruleConfig,
                        ruleName: this.queryParams.ruleName,
                        ruleId: this.queryParams.ruleId,
                    }
                }
            );
        }
        if (Number(this.queryParams.ruleStatus) === 1) { // 修改使用中规则
            const params = {
                type: 'edit',
                ruleId: this.queryParams.ruleId,
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, SamplingEditRuleComponent, params)
                .subscribe((v: any) => {
                    if (v.action) {
                        this.xn.router.navigate(['/console/manage/sampling/add-newRule'],
                            {
                                queryParams: {
                                    ruleConfig: this.queryParams.ruleConfig,
                                    ruleName: this.queryParams.ruleName,
                                    ruleId: this.queryParams.ruleId,
                                }
                            }
                        );
                    }
                });
        }
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
        } else if (this.queryParams.moduleInfo) { // 返回新增模型页面
            this.xn.router.navigate(['/console/manage/sampling/add-newModule'], {
                queryParams: {
                    moduleInfo: this.queryParams.moduleInfo
                }
            });
        } else {
            window.history.go(-1);
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
