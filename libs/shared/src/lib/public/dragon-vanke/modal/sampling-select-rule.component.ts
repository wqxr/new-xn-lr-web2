
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：选择抽样规则弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   hcy               添加            2020-04-28
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnUtils } from '../../../common/xn-utils';
import { Observable, of } from 'rxjs';
import { SortablejsOptions } from 'ngx-sortablejs';

@Component({
    templateUrl: `./sampling-select-rule.component.html`,
    selector: 'sampling-edit-rules',
    styles: [`
        .modal-title{
            height:50px;
        }
        .title {
            font-weight:bold;
        }
        .left-hd{
            display: flex;
            justify-content: space-between;
            padding: 5px;
            height: 43px;
            line-height: 43px;
        }
        .table-body table tr td{
            border:1px solid #cccccc30;
            text-align: center;
            word-break: break-all;
        }
        .table-display tr td {
            vertical-align: middle;
        }
        .height {
            overflow-x: hidden;
        }
        .relative {
            position: relative
        }
        .head-height {
            position: relative;
            overflow: hidden;
        }
        .table-height {
            max-height: 400px;
            overflow: scroll;
        }
        .table {
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 0;
        }
        .table-display {
            margin: 0;
        }
        table{
            border-collapse: separate;
            border-spacing: 0;
        }
        table thead th{
            vertical-align: middle
        }
        table thead td{
            vertical-align: middle;
            word-break: break-all;
        }

    `]
})
export class SamplingSelectRuleComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    // 数据
    private observer: any;
    public moduleList: any[] = [];      // 待选择规则
    public ruleList: any[] = [];        // 已选择规则
    public showRuleList: any[] = [];    // 已选择规则 表格数据
    public params: any;                 // 参数
    public selectItem: any[] = [];      // 勾选项
    public ruleName = '';       // 规则名称
    public options: SortablejsOptions;

    // 页码配置
    public pageConfig = {
        pageSize: 5,
        first: 0,
        total: 0,
    };

    // 页码配置(已选规则)
    public pageConfig2 = {
        pageSize: 5,
        first: 0,
        total: 0,
    };

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, private cdr: ChangeDetectorRef, ) {
    }

    ngOnInit(): void {
        this.selectItem = [];
    }

    /**
    *  列表排序前
    */
    getData() {
    }
    /**
     *  列表排序后
     */
    setData() {
        // console.info('showRuleList=>', this.showRuleList);
    }


    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.asyncFunc({ ruleName: '' }).then(res => {
            this.moduleList = res;
            this.moduleList.forEach(t => {
                t.type = '';
            });
            this.params = params;
            const showRuleList = JSON.parse(this.params.ruleList); // 上次选择的规则
            if (showRuleList.length > 0) {
                showRuleList.forEach(x => {
                    x.checked = true; // 对上次选择的规则处理
                    this.moduleList.forEach(v => {
                        if (x.ruleNum === v.ruleNum) {
                            v.checked = true;
                            this.selectItem.push(x); // 反显上次勾选的规则
                            this.selectItem = XnUtils.distinctArray2(this.selectItem, 'ruleNum'); // 去除相同的项
                        }
                    });
                });
                this.selectItem.forEach(t => {
                    this.showRuleList.push(t);
                });
            }
            this.modal.open(ModalSize.XXLarge);
        });
        return Observable.create(observer => {
            this.observer = observer;
        });

    }

    /**
     * 执行异步操作
     */
    public async asyncFunc(params: { ruleName: string}) {
        const ruleList = await this.initData(params);
        return ruleList;
    }

    /**
     *  获取规则列表
     * @param
     */
    initData(params: { ruleName: string}): any {
        return new Promise((resolve, reject) => {
            this.xn.loading.open();
            this.xn.dragon.post('/rule/rule_no_page_list', params).subscribe(res => {
                this.xn.loading.close();
                if (res.ret === 0 && res.data) {
                    resolve(res.data.data);
                }

            }, (err) => {
                this.xn.loading.close();
                reject(err);
            }, () => {
                this.xn.loading.close();
            });
        });
    }

    /**
  * 搜索 规则名称
  * @param e 失去焦点事件
  *
  */
    public searchRouleName(e: any) {
        this.asyncFunc({ ruleName: this.ruleName}).then(x => {
            this.moduleList = x;
        });

    }

    /**
    *  判断列表项是否全部选中
    */
    public isAllChecked(): boolean {
        return !(this.moduleList.some(x => !x.checked || x.checked && x.checked === false) || this.moduleList.length === 0);
    }

    /**
     *  全选
     */
    checkAll() {
        if (!this.isAllChecked()) {
            this.moduleList.forEach(item => item.checked = true);
            this.selectItem = XnUtils.distinctArray2([...this.selectItem, ...this.moduleList], 'ruleNum');
            this.selectItem.forEach(x => {
                this.showRuleList.push(x);
            });
            this.showRuleList = XnUtils.distinctArray2(this.showRuleList, 'ruleNum');

        } else {
            this.moduleList.forEach(item => item.checked = false);
            this.selectItem = [];
            this.showRuleList = [];
        }
    }

    /**
     *  单选
     */
    public singleChecked(paramItem, index) {
        if (paramItem.checked && paramItem.checked === true) {
            paramItem.checked = false;
            this.selectItem = this.selectItem.filter((x: any) => x.ruleNum !== paramItem.ruleNum);
            this.showRuleList = this.showRuleList.filter((x: any) => x.ruleNum !== paramItem.ruleNum);
        } else {
            paramItem.checked = true;
            this.selectItem.push(paramItem);
            this.selectItem = XnUtils.distinctArray2(this.selectItem, 'ruleNum'); // 去除相同的项
            this.selectItem.forEach(x => {
                this.showRuleList.push(x);
            });
            this.showRuleList = XnUtils.distinctArray2(this.showRuleList, 'ruleNum');
        }



    }

    /**
     *  清空所有选择规则
     */
    clearRuleList() {
        this.ruleList = [];
        this.showRuleList = [];
        this.pageConfig2.total = 0;
        this.selectItem.forEach(item => {
            item.checked = false;
        });
        this.moduleList.forEach(t => {
            t.checked = false;
        });
        this.selectItem = [];
    }

    /**
     *  取消
     */
    oncancel() {
        this.close({ action: 'cancel', ruleList: [] });
    }

    /**
     *  确定
     */
    onOk() {
        this.close({ action: 'ok', ruleList: JSON.stringify(this.showRuleList) });
    }

    /**
     *  关闭
     *  @param value
     */
    close(value: { action: string, ruleList: any }) {
        this.selectItem.forEach(item => {
            item.checked = false;
        });
        this.moduleList.forEach(x => {
            x.checked = false;
        });
        this.selectItem = [];
        this.modal.close();
        this.observer.next(value);
    }

}
