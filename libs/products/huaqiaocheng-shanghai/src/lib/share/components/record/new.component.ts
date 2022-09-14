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
 * 1.0                 wangqing          代码规范         2019-08-28
 * **********************************************************************
 */

import { Component, OnInit, AfterViewInit, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { FlowCustom, IFlowCustom } from '../flow/flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { DataTablePicker } from 'libs/shared/src/lib/common/data-table-picker';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';

@Component({
    selector: 'lib-oct-sh-bank-new',
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
export class OctNewComponent implements OnInit, AfterViewInit {
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

    /**
     * 显示之前处理
     */
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
        // if (['so_financing_pre'].includes(this.flowId)) {
        //     postObj.productType = this.productType;
        //     postObj.selectBank = this.selectBank;
        //     postObj.fitProject = this.fitProject;
        //     postObj.billNumberList = this.billNumberList;
        // }
        this.Relate.flowId !== '' && this.Relate.relate ? postObj[this.Relate.relate] = this.Relate.relateValue : postObj.toString();
        if (['sub_so_platform_check_retreat'].includes(this.Relate.flowId)) {
            if (!_.isArray(this.Relate.relateValue)) {
                const newArrary = [];
                newArrary.push(this.Relate.relateValue);
                postObj[this.Relate.relate] = newArrary;
            }
        }
        if (this.invoiceReplaceParams) {
            Object.assign(postObj, this.invoiceReplaceParams);
        }

        this.xn.api.dragon.post('/flow/showNew', postObj).subscribe(json => {
            this.svrConfig = json.data;
            this.flowCustom.postGetSvrConfig(this.svrConfig);
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
    private onRelatedRecordIdSelected(obj: any) {
        // 去请求该recordId的具体字段
        // this.xn.api.dragon.post('/record/get_related', {
        //     flowId: this.flowId,
        //     relatedRecordId: obj.recordId
        // }).subscribe((json) => {
        //     // 把选择的值放入不变参数中
        //     this.svrConfig.constParams = {
        //         relatedRecordId: obj.recordId,
        //         checkers: []
        //     };
        //     for (const checkerId in json.data) {
        //         if (json.data.hasOwnProperty(checkerId)) {
        //             const ctrl = this.mainForm.get(checkerId);
        //             if (!isNullOrUndefined(ctrl)) {
        //                 ctrl.setValue(json.data[checkerId]);
        //                 this.svrConfig.constParams.checkers[checkerId] = json.data[checkerId];
        //             }
        //         }
        //     }
        // });
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

    /**
     * 提交处理
     */
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
            if (checker.checkerId === 'checkType') {
                // 特殊过滤：万科数据对接-预审不通过、退单流程过滤
                const checkTypeVal = JSON.parse(this.mainForm.controls.checkType.value);
                const statusText = XnFlowUtils.fnTransform(JSON.parse(this.mainForm.controls.checkType.value), 'systemFail');
                this.mainForm.value[checker.checkerId] = JSON.stringify({ ...checkTypeVal, statusText });
            }
            if (checker.checkerId === 'redeemReceive') {
                this.mainForm.value[checker.checkerId] = String(this.mainForm.value[checker.checkerId]).replace(/\D/g, '');
            }
            if (checker.type === 'input-number') {
                // 特殊过滤：金额数据处理
                this.mainForm.value[checker.checkerId] = String(this.mainForm.controls[checker.checkerId].value).replace(/,/g, '');
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
        // 多保理-添加保理商
        if (['sub_so_supplementaryinfo_input', 'sub_dragon_book_stop', 'sub_so_system_check_reject', 'so_financing_pre',
            'sub_so_platform_check_retreat'].includes(this.flowId)) {
            params['factoringAppId'] = applyFactoringTtype['上海银行'];
        }

        // 加上loading
        XnUtils.checkLoading(this);
        console.log('params', params);
        this.xn.api.dragon.post(`/flow/${method}`, params).subscribe(json => {
            this.flowCustom.afterSubmitandGettip(this.svrConfig, this.mainForm.value);
            this.xn.router.navigate([`/oct-shanghai/record/record/${this.flowId}`]);
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
     * 获取other：用于必填项提示 type= 1仅显示提示 2可操作链接
     * @param row 表单数据
     */
    public getRowOther(row: any): any {
        return !!row.other ? XnUtils.parseObject(row.other, {}) : {};
    }

    /**
     * other提示-点击事件
     * @param value
     * @param row
     */
    public onRowOtherClick(value: string, row: any) {
        if (['orgLegalCertFile', 'profitsRecognitionFile', 'authorizeLetterFile'].includes(row.checkerId)) {
            const param = {
                appId: this.xn.user.appId,
                templateId: ShBankContractNoList[row.checkerId]
            };
            this.xn.api.dragon.download(CommonEnum['enterFileTpl'], param).subscribe((v: any) => {
                this.xn.api.save(v._body, `${FileNameEnum[row.checkerId]}.pdf`);
            });
        }
    }
}

enum CommonEnum {
    'enterFileTpl' = '/shanghai_bank/sh_supplier/dwTemplate',
}
enum FileNameEnum {
    'orgLegalCertFile' = '法定代表人证明书',
    'profitsRecognitionFile' = '受益所有人识别表',
    'authorizeLetterFile' = '征信授权书',
}
// 合同拟合编号列表
enum ShBankContractNoList {
    // 1.公司征信授权书
    authorizeLetterFile = '6000001',
    // 2.法人证明书
    orgLegalCertFile = '6000002',
    // 3.受益所有人信息表
    profitsRecognitionFile = '6000003',
    // 4.代扣授权书
    withholdAgreement = '6000004',
    // 5.应收账款转让明细表
    receivableTransferStatement = '6000005',
    // 6.链融科技供应链金融服务平台服务合同
    serviceAgreement = '6000006',
}
