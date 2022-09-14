/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：new.component.ts
 * @summary：新创建流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 congying          代码规范         2019-08-28
 * **********************************************************************
 */

import { Component, OnInit, AfterViewInit, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { DataTablePicker } from 'libs/shared/src/lib/common/data-table-picker';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import * as _ from 'lodash';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { FlowCustom, IFlowCustom } from '../flow/flow-custom';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';

@Component({
    selector: 'pslogan-new',
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
export class PsLoganNewComponent implements OnInit, AfterViewInit {

    formModule = 'dragon-input';
    flowId: string;
    Relate = {
        flowId: '',
        relate: '', // 关联流程名
        relateValue: '',
    };
    productType: string;
    fitProject: string;
    selectBank: string;
    mainForm: FormGroup;

    svrConfig: any;
    rows: any[] = [];

    pageTitle = '发起新流程';
    pageDesc = '';

    flowCustom: IFlowCustom;

    /** 定向支付-替换发票-额外参数 */
    invoiceReplaceParams = {} as any;

    loadingback = false;

    showProgress = false;

    flowProcess = {
        show: false,
        proxy: 0,
        steped: 0
    };
    billNumberList: string[] = [];
    headquarters: string;
    // todo 定向收款保理-经办显示合同
    public contracts: any;
    @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();

    constructor(private xn: XnService,
                private route: ActivatedRoute,
                private vcr: ViewContainerRef,
                private loading: LoadingService,
                private localStorageService: LocalStorageService,
                public hwModeService: HwModeService, public communicateService: PublicCommunicateService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // 在ngAfterViewInit里打开模态框，实际体验效果会好些
        this.route.params.subscribe((params: Params) => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }
            this.flowId = params.id;
            this.localStorageService.setCacheValue('current_flow', this.flowId); // 存储流程
            this.localStorageService.setCacheValue('headquarters', params.headquarters); // 存储流程
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

            this.productType = params.productType || '';
            this.selectBank = params.selectBank || '';
            this.fitProject = params.fitProject || '';
            this.billNumberList = params.billNumberList || [],
                this.headquarters = params.headquarters || '',

                this.flowId = params.id || this.flowId;
            this.localStorageService.setCacheValue('current_flow', this.flowId);
        });
        this.getPreShow();

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
     * 下载授权文件
     */
    public authorizationFile() {
        console.error('未实现');
    }

    /**
     *  提交前特殊处理
     */
    public doSubmit() {
        this.request('new');
    }

    private getPreShow() {
        setTimeout(() => {
            this.flowProcess = XnFlowUtils.calcFlowProcess(this.flowId);
            this.flowCustom = FlowCustom.build(this.flowId, this.xn,
                this.vcr, this.loading, this.communicateService, this.localStorageService);
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
        if (this.flowId === 'dragon_financing_pre') {
            postObj.productType = this.productType;
            postObj.selectBank = this.selectBank;
            postObj.fitProject = this.fitProject;
            postObj.headquarters = this.headquarters;
        }
        this.Relate.flowId !== '' && this.Relate.relate ? postObj[this.Relate.relate] = this.Relate.relateValue : postObj.toString();
        if (['sub_change_start', 'sub_replace_qrs', 'sub_change_capital', 'sub_person_match_qrs', 'sub_vanke_system_hand_verify',
            'sub_system_match_qrs'].includes(this.Relate.flowId)) {
            if (!_.isArray(this.Relate.relateValue)) {
                const newArrary = [];
                newArrary.push(this.Relate.relateValue);
                postObj[this.Relate.relate] = newArrary;
            }
        } else if (['sub_agency_user_delete', 'sub_agency_user_modify'].includes(this.Relate.flowId)) {
            if (!!this.Relate.relateValue) {
                postObj[this.Relate.relate] = JSON.parse(this.Relate.relateValue);
            }
        }
        if (this.invoiceReplaceParams) {
            Object.assign(postObj, this.invoiceReplaceParams);
        }
        this.xn.api.dragon.post('/flow/showNew', postObj).subscribe(json => {
            this.svrConfig = json.data;
            this.svrConfig = this.flowCustom.postGetSvrConfig(this.svrConfig);
            this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
            this.buildRows();
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
        console.error('未实现');
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
        this.flowCustom.postShow(this.svrConfig, this.mainForm).subscribe((v: any) => {
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
            if (checker.checkerId === 'redeemReceive') {
                this.mainForm.value[checker.checkerId] = String(this.mainForm.value[checker.checkerId]).replace(/\D/g, '');
            }
            if (this.flowId === 'sub_dragon_book_change' && (checker.checkerId === 'receive' || checker.checkerId === 'changePrice')) {
                this.mainForm.value[checker.checkerId] = String(this.mainForm.controls[checker.checkerId].value).replace(/\,/g, '');
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
        // 新增一次转让合同
        if (this.flowId === 'sub_first_contract_add') {
            delete params.checkers['factorName'];
        }
        params.isLgBoShi = 1; // 0=非龙光博时资本 1=龙光博时资本
        params.factoringAppId = applyFactoringTtype.深圳市柏霖汇商业保理有限公司;

        // 加上loading
        XnUtils.checkLoading(this);
        this.xn.api.dragon.post(`/flow/${method}`, params).subscribe(json => {
            this.flowCustom.afterSubmitandGettip(this.svrConfig, this.mainForm.value);
            this.xn.router.navigate([`/pslogan/record/record/${this.flowId}`]);
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
        if (!!v && !!v.svrConfigs) {
            this.svrConfig = v.svrConfigs;
        }
        if (v.action === 'stop') {
            return;
        }
        if (v.action === 'navigate-back') {
            this.xn.user.navigateBack();
            return;
        }
        if (v.action === 'modal') {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, v.modal, v.params).subscribe(v2 => {
                if (v2.action === 'cancel' || !!v2) {
                    fn();
                    return;
                } else if (v2 === null) {
                    // this.goDistance();
                    return;
                }
            });
            // return;
        }
        // 收款登记
        if (v.action === 'const-params') {
            this.svrConfig.constParams = this.svrConfig.constParams || { checkers: [] };
            // 经办显示的合同
            this.contracts = v.data.contracts;
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
  * checker项是否隐藏
  * @param row
  * @returns boolean
  */
   showRow(row: any): boolean {
    /** 如果options 配置了nodisplay=true则意为隐藏该checker项 */
    if (row?.options && row?.options?.nodisplay) {
      return false
    } else {
      return true
    }
  }
}
