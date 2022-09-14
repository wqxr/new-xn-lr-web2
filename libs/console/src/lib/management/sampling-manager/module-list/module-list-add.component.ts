/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：comfirm-information-index-component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author               reason                       date
 * 1.0                   hcy            抽样模型管理-新增抽样模型       2020-04-28
 * **********************************************************************
 */


import { Component, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { SamplingSelectRuleComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/sampling-select-rule.component';
import { TabListOutputModel, SubTabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';


@Component({
    templateUrl: `./module-list-add.component.html`,
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
    `]
})
export class ModuleListAddComponent implements OnInit {
    public mount: AbstractControl;
    public ctrl: AbstractControl;
    public tabConfig: any;
    public form: FormGroup;
    public currentTab: any;              // 当前标签页
    public formValue: any = {} as any;              // 表单值
    public queryParams: any = {} as any;              // 路由参数
    public ruleList: any[] = [];       // 抽样规则列表

    public shows: any[] = [];                           // 搜索项
    public defaultValue = 'A';                          // 默认激活第一个标签页
    public searches: any[] = [];                           // 面板搜索配置项项
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel();  // 当前子标签页
    public subDefaultValue = 'DOING';                      // 默认子标签页
    public formModule = 'dragon-input';
    public arrObjs = {} as any;                           // 缓存后退的变量
    public checkBoxData: any[] = [];                           // 合同类型选择框
    public unSubmit = true;                         // 禁止提交

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,) {
    }

    ngOnInit(): void {

        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.initData();
        });

        // 路由参数
        this.router.queryParams.subscribe(v => {
            this.queryParams = v;
            if (this.queryParams.modelId) {
                this.form.setValue({ modelName: this.queryParams.modelName });
                this.tabConfig.title = '修改抽样模型';
                this.getModelRule();
            }
            if (this.queryParams.moduleInfo) {
                const queryParams = JSON.parse(v.moduleInfo);
                this.form.setValue({ modelName: queryParams.modelName });
                this.ruleList = queryParams.ruleList;
                this.tabConfig.title = queryParams.title;
            }
        });

    }

    /**
      * 获取模型对应规则列表
      * @param
      */
    public getModelRule() {
        this.xn.loading.open();
        const params = { modelId: this.queryParams.modelId };
        this.xn.dragon.post('/rule/rule_model_list', params).subscribe(res => {
            this.xn.loading.close();
            if (res.ret === 0) {
                this.ruleList = res.data.data;
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

        this.shows = this.searches;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);

        // 表单值改变
        this.form.valueChanges.subscribe((v: any) => {
            this.arrObjs = v;
            this.formValue = v;
            this.cdr.markForCheck();
        });


    }

    /**
       * 选择规则
       * @param
       */
    selectRule() {
        const params = {
            type: 'edit',
            ruleList: JSON.stringify(this.ruleList)
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SamplingSelectRuleComponent, params)
            .subscribe((v: any) => {
                if (v.action === 'ok') {
                    this.ruleList = JSON.parse(v.ruleList);
                }
            });
    }

    /**
       * 选择抽样方式
       * @param e event
       * @data item 规则
       */
    selectChange(e: any, item: any) {
        item.select = e.target.value;
    }

    /**
       * 检查所有规则抽样方式 是否已选择
       * @param
       */
    allSelect(): boolean {
        if (this.ruleList.length < 1) {
            return false;
        }
        const valid = this.ruleList.every(v => {
            return (v.type !== '' && v.type !== undefined);
        });
        return valid;
    }

    /**
       * 查看抽样规则
       * @param item 规则信息
       */
    toLookRule(item: any) {
        const { modelName } = this.formValue;
        this.xn.router.navigate(['/console/manage/sampling/look-newRule'], {
            queryParams: {
                ruleId: item.ruleId,
                moduleInfo: JSON.stringify(
                    {
                        title: this.tabConfig.title,
                        modelName: modelName || '',
                        ruleList: this.ruleList
                    })
            }
        });
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
        // if (this.queryParams.modelId || this.queryParams.moduleInfo) {
        //     window.history.go(-1);
        // } else {
            this.xn.router.navigate(['/console/manage/sampling/management-list'], {
                queryParams: {
                    defaultValue: 'A',
                    pageing: this.queryParams.pageing
                }
            });
        }
    // }


    /**
    * *  提交
    * @param
    */
    toSubmit(): void {
        const ruleList = this.ruleList.map(x => ({ ruleId: x.ruleId, type: Number(x.type) }));
        const params = { modelName: this.form.value.modelName, ruleList, } as any;
        if (!!this.queryParams.modelId) {
            params.modelId = Number(this.queryParams.modelId);
            this.requset('/rule/alter_model', params); // 修改模型
        } else {
            this.requset('/rule/add_model', params); // 新增模型
        }
    }

    /**
    * *  发起请求
    * @param url 请求api
    * @param params 请求参数
    */
    requset(url: string, params: any) {
        this.xn.loading.open();
        this.xn.dragon.post(url, params).subscribe(res => {
            this.xn.loading.close();
            if (res.ret === 0) {
                this.xn.router.navigate(['/console/manage/sampling/management-list'], {
                    queryParams: {
                        defaultValue: 'A',
                        pageing: 1
                    }
                });
            }
        }, () => {
            this.xn.loading.close();
        });
    }

}
