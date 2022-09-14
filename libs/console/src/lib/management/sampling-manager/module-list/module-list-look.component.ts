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
 * 1.0                   hcy            抽样模型管理-查看抽样模型       2020-04-30
 * **********************************************************************
 */


import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { TabListOutputModel, SubTabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';


@Component({
    templateUrl: `./module-list-look.component.html`,
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
export class ModuleListLookComponent implements OnInit {
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
    public formValue: any; // 表单值
    public ruleList: any[] = []; // 抽样规则列表
    public queryParams: any; // 路由参数



    constructor(private xn: XnService,
                private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef,
                private router: ActivatedRoute, ) {
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
                this.getModelRule({ modelId: Number(this.queryParams.modelId) });
            }
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
      *  获取模型下对应的规则列表
      * @param modelId 模型id
      * @param
      */
    public getModelRule(params: { modelId: number }) {
        this.xn.loading.open();
        // 采购融资 ：avenger,  地产abs ：api, 龙光: dragon
        this.xn.dragon.post('/rule/rule_model_list', params).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
                this.ruleList = x.data.data;
            }
        }, () => {
            this.xn.loading.close();
        });
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
       * 查看抽样规则
       * @param item 规则信息
       */
    toLookRule(item: any) {
        this.xn.router.navigate(['/console/manage/sampling/look-newRule'], {
            queryParams: {
                ruleId: item.ruleId,
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
        this.xn.router.navigate(['/console/manage/sampling/management-list'], {
            queryParams: {
                defaultValue: 'A',
                pageing: this.queryParams.pageing
            }
        });
    }

    /**
    * *  修改抽样模型
    * @param
    */
    toEditModule(): void {
        this.xn.router.navigate(['/console/manage/sampling/add-newModule'],
            { queryParams: { modelName: this.queryParams.modelName, modelId: this.queryParams.modelId } }
        );
    }

}
