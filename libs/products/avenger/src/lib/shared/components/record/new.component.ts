/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：new.component.ts
 * @summary：新创建流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          代码规范         2019-04-08
 * **********************************************************************
 */

import { Component, OnInit, AfterViewInit, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DataTablePicker } from 'libs/shared/src/lib/common/data-table-picker';
import { isNullOrUndefined } from 'util';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { FlowCustom, IFlowCustom } from 'libs/products/avenger/src/lib/flow/flow-custom';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import * as _ from 'lodash';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';

@Component({
    templateUrl: './new.component.html',
    styles: [
        `.app-flow-process {
            border: 1px solid #ddd;
            padding: 4px;
            margin-bottom: 10px;
            border-radius: 3px;
            background-color: #fff;
        }`,
    ]
})
export class AvengerNewComponent implements OnInit, AfterViewInit {

    flowId: string;
    Relate = {
        flowId: '',
        relate: '', // 关联流程名
        relateValue: ''
    };

    mainForm: FormGroup;

    svrConfig: any;
    rows: any[] = [];

    pageTitle = '发起新流程';
    pageDesc = '';

    flowCustom: IFlowCustom;

    loadingback = false;
    invoiceReplaceParams = {} as any;
    mainFlowId: string;
    isshowProgress: boolean; // 是否显示导航进度条

    @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();

    constructor(private xn: XnService,
        private route: ActivatedRoute,
        private vcr: ViewContainerRef,
        private loading: LoadingService,
        private localStorageService: LocalStorageService,
        public hwModeService: HwModeService, public communicateService: PublicCommunicateService) {
    }

    ngOnInit() {
        // 在ngAfterViewInit里打开模态框，实际体验效果会好些
        this.route.params.subscribe((params: Params) => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }
            this.flowId = params.id;
            this.isshowProgress = this.flowId.startsWith('sub');

        });
        this.route.queryParams.subscribe(params => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }

            // financing_download 流程传输字段可能过长，使用localStorage临时传递
            this.Relate = {
                flowId: params.id,
                relate: params.relate, // 关联流程名
                relateValue: params.relateValue || JSON.parse(sessionStorage.getItem('relate_value'))
            };
            if (params.nextDate && params.nowReplaceMoney) {
                this.invoiceReplaceParams = {
                    nextDate: params.nextDate,
                    nowReplaceMoney: params.nowReplaceMoney
                };
            }

            this.localStorageService.setCacheValue('current_flow', this.flowId);
        });
        this.getPreShow();
    }

    ngAfterViewInit() {

        // // 在ngAfterViewInit里打开模态框，实际体验效果会好些
        // this.route.params.subscribe((params: Params) => {


        //     if (XnUtils.isEmptyObject(params)) {
        //         return;
        //     }
        //     this.flowId = params['id'];
        //     this.getPreShow();
        // });

        // this.route.queryParams.subscribe(params => {
        //     if (XnUtils.isEmptyObject(params)) {
        //         return;
        //     }
        //     this.Relate = {
        //         flowId: params.id,
        //         relate: params.relate, // 关联流程名
        //         relateValue: params.relateValue
        //     };
        //     this.flowId = params['id'];
        //     this.getPreShow();
        // });
    }

    /**
     *  提交
     */
    public onSubmit() {
        this.innerSubmit(() => {
            return this.flowCustom.preSubmit(this.svrConfig, this.mainForm.value);
        });
    }

    /**
     *  取消并返回
     */
    public onCancel() {
        this.xn.user.navigateBack();
    }

    /**
     *  中等登记 todo 暂留
     */
    public onRegistration() {
    }

    /**
     *  提交前特殊处理
     */
    public doSubmit() {
        this.request('new');
    }

    private getPreShow() {
        setTimeout(() => {
            this.flowCustom = FlowCustom.build(this.flowId, this.xn, this.vcr, this.loading,
                this.communicateService, this.localStorageService);
            this.preShow();
        }, 0);
    }

    private preShow() {
        this.flowCustom.preShow(this.svrConfig).subscribe((v: any) => {
            this.handleAction(v, () => {
                this.doShow();
            });
        });
    }

    /**
     *  根据配置，流程id渲染
     */
    private doShow() {
        const postObj = {} as any;
        postObj.flowId = this.flowId;
        this.Relate.flowId !== '' && this.Relate.relate ? postObj[this.Relate.relate] = this.Relate.relateValue : postObj.toString();
        if (this.Relate.flowId === 'sub_nuonuocs_blue' || this.Relate.flowId === 'sub_nuonuocs_red' || this.Relate.flowId === 'sub_nuonuocs_blue_offline') {
            // resolve mainIds isnot array error
            if (this.Relate.relate && !_.isArray(this.Relate.relateValue)) {
                postObj[this.Relate.relate] = [this.Relate.relateValue];
            }
        }
        this.xn.avenger.post('/flow/showNew', postObj).subscribe(json => {
            this.svrConfig = json.data;
            this.flowCustom.postGetSvrConfig(this.svrConfig);
            this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
            this.buildRows();
        }, () => {

        });
    }

    private postShow() {
        // 需要填相关流程，弹出picker框
        if (!XnUtils.isEmpty(this.svrConfig.flow.relatedFlowId)) {
            new DataTablePicker(this.xn).open('请选择要处理的相关流程记录',
                'list-related',
                obj => this.onRelatedRecordIdSelected(obj),
                () => this.onRelatedRecordIdNoSelected(), // 没选择就后退
                { relatedFlowId: this.svrConfig.flow.relatedFlowId }
            );
        }

        this.afterBuildFormGroup.emit();
    }

    /**
     * 没选择相关流程记录时
     */
    private onRelatedRecordIdNoSelected() {
        this.xn.msgBox.open(false, '请先选择要处理的相关流程记录，才能进行后续处理',
            () => this.xn.user.navigateBack()
        );
    }

    /**
     * 选择了相关流程记录时
     * @param obj
     */
    private onRelatedRecordIdSelected(obj) {

        // 去请求该recordId的具体字段
        this.xn.avenger.post('/record/get_related', {
            flowId: this.flowId,
            relatedRecordId: obj.recordId
        }).subscribe((json) => {
            // 把选择的值放入不变参数中
            this.svrConfig.constParams = {
                relatedRecordId: obj.recordId,
                checkers: []
            };
            for (const checkerId in json.data) {
                if (json.data.hasOwnProperty(checkerId)) {
                    const ctrl = this.mainForm.get(checkerId);
                    if (!isNullOrUndefined(ctrl)) {
                        ctrl.setValue(json.data[checkerId]);
                        this.svrConfig.constParams.checkers[checkerId] = json.data[checkerId];
                    }
                }
            }
        });
    }

    /**
     * 把svrConfig.checkers转换为rows对象，方便模板输出
     */
    private buildRows(): void {
        const others = [];
        const titleConfig = this.flowCustom.getTitleConfig();
        const titleObj = {
            name: 'title',
            required: true,
            type: 'text',
            title: titleConfig.titleName || '流程标题',
            value: titleConfig.def || ''
        };
        if (titleConfig && titleConfig.hideTitle) {
            // mainForm里有titleRow，但this.rows里没有，这样就是个隐藏提交的值
            others.push(titleObj);
            this.rows = [].concat(this.svrConfig.checkers);
        } else {
            this.rows = [titleObj].concat(this.svrConfig.checkers);
        }

        this.rows = this.rows.concat({
            name: 'memo',
            required: false,
            type: 'textarea',
            title: this.svrConfig.procedure.procedureId === '@begin' ? '备注' : '审核意见'
        });
        this.mainForm = XnFormUtils.buildFormGroup(this.rows, others);
        this.flowCustom.postShow(this.svrConfig).subscribe((v: any) => {
            this.handleAction(v, () => {
                this.postShow();
            });
        });

    }


    /**
     *  提交时根据配置进行处理
     * @param fn
     */
    private innerSubmit(fn) {
        fn().subscribe(v => {
            this.handleAction(v, () => {
                this.doSubmit();
            });
        });
    }

    private request(method: string) {
        for (const checker of this.svrConfig.checkers) {
            if (checker.options && checker.options.readonly) {
                if (checker.checkerId === 'deputeMoney') {
                    // 特殊过滤：替换发票流程 中 委托付款金额 过滤
                    this.mainForm.value[checker.checkerId] = XnUtils.formatMoney(this.mainForm.controls.deputeMoney.value);
                } else if (checker.checkerId === 'deputeLeft') {
                    // 特殊过滤：替换发票流程 中 托管账户余额 过滤
                    this.mainForm.value[checker.checkerId] = XnUtils.formatMoney(this.mainForm.controls.deputeLeft.value);
                } else {
                    this.mainForm.value[checker.checkerId] = checker.value;
                }
            }
        }

        const formValue: any = this.mainForm.value;

        const params: any = {
            flowId: this.flowId,
            procedureId: this.svrConfig.procedure.procedureId,
            title: formValue.title,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(this.svrConfig.checkers, formValue),
            recordId: this.svrConfig.record && this.svrConfig.record.recordId || '',
            contracts: this.svrConfig.contracts
        };
        params.toString();
        if (this.svrConfig.constParams) {
            params.relatedRecordId = this.svrConfig.constParams.relatedRecordId || '';
            if (this.svrConfig.constParams.checkers) {
                for (const key in this.svrConfig.constParams.checkers) {
                    if (this.svrConfig.constParams.checkers.hasOwnProperty(key)) {
                        params.checkers[key] = this.svrConfig.constParams.checkers[key];
                    }
                }
            }
        }

        // 加上loading
        XnUtils.checkLoading(this);
        params.factoringAppId = applyFactoringTtype['深圳市柏霖汇商业保理有限公司'];
        this.xn.avenger.post(`/flow/${method}`, params).subscribe(json => {
            this.afterSubmitandGettip(this.svrConfig);
            this.xn.router.navigate([`/console/record/avenger/record/${this.flowId}`]);
        });
    }

    /**
     *  对流程checkers 项的值进行处理
     * @param v v{null:不做处理，v.action{navigate-back:返回，const-params: 对流程所有项重新赋值}}
     * @param fn
     */
    private handleAction(v, fn) {
        if (!(v && v.action)) {
            fn();
            return;
        }

        if (v.action === 'navigate-back') {
            this.xn.user.navigateBack();
            return;
        }
        // 收款登记
        if (v.action === 'const-params') {
            this.svrConfig.constParams = this.svrConfig.constParams || { checkers: [] };
            // 赋值
            for (const checkerId in v.data) {
                if (v.data.hasOwnProperty(checkerId)) {
                    const ctrl = this.mainForm.get(checkerId);
                    this.svrConfig.constParams.checkers[checkerId] = v.data[checkerId];
                    if (!isNullOrUndefined(ctrl)) {
                        ctrl.setValue(v.data[checkerId]);
                    }
                }
            }
            return;
        }
    }

    /**
     * 提交后提示信息
     */
    public afterSubmitandGettip(svrConfig: any) {
        if (svrConfig.flow.flowId === 'sub_nuonuocs_blue' || svrConfig.flow.flowId === 'sub_nuonuocs_red') {
            this.xn.msgBox.open(false, '提交成功！下一步请财务复核人在【首页 - 待办任务】中完成【复核】的待办任务。');
        }
        if (svrConfig.flow.flowId === 'sub_nuonuocs_blue_offline' && svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, '提交成功！下一步请复核人在【首页 - 待办任务】中完成【复核】的待办任务');
        }
        if (svrConfig.flow.flowId === 'sub_factoring_change_520' || svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, '提交成功！下一步请复核人完成【复核】的待办任务');
        }
        if (svrConfig.flow.flowId === 'sub_factoring_change_yjl_520' || svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, '提交成功！下一步请复核人完成【复核】的待办任务');
        }
    }
}
