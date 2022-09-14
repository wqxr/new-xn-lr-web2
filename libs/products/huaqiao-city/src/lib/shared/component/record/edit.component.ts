/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：edit.component.ts
 * @summary：流程信息编辑页
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import {
    Component, AfterViewInit,
    ViewContainerRef,
    Output,
    EventEmitter, AfterViewChecked, OnInit, ChangeDetectorRef, HostListener, ElementRef, ViewChild, OnDestroy
} from '@angular/core';
import { Params, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { HtmlModalComponent } from 'libs/shared/src/lib/public/modal/html-modal.component';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { VankeViewChangeAccountComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-change-account.component';
import { NewVankeAuditStandardModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/audit-standard-modal.component';
import { VankeDataChangeModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-dataChange-modal.component';
import { Observable, Subscription } from 'rxjs';
import { of } from 'rxjs';
import { SingleListParamInputModel, SingleSearchListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { log } from 'util';
import { IntelligenceStandardModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/intelligence-standard-modal.component';
import { ModalComponent } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { RejectModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/reject-modal.component';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { IFlowCustom, FlowCustom } from '../flow/flow-custom';
import { OperateType } from 'libs/shared/src/lib/config/enum/common-enum';

class checkerDatas {
    mainFlowId = '';
    recordId = '';
    procedureId = '';
    memo = '';
    flowId = '';
    appType = '';
    checkerData = '';

}

@Component({
    templateUrl: './edit.component.html',
    styles: [
        `.box-title {
            font-size: 14px;

        }

        .xn-panel-sm {
            margin-bottom: 10px;
        }

        .xn-panel-sm .panel-heading {
            padding: 5px 15px;
        }

        .xn-panel-sm .panel-heading .panel-title {
            font-size: 14px
        }

        .panel-footer .btn + .btn {
            margin-left: 10px;
        }

        .app-flow-process {
            border: 1px solid #ddd;
            padding: 4px;
            margin-bottom: 10px;
            border-radius: 3px;
            background-color: #fff;
        }
        .helpUl li{
            text-align:left
        }
        .rejectClass{
            position: absolute;
            top: 15%;
            left: 80%;
        }
        .changesClass{
            position: absolute;
            top: 12%;
            left: 80%;
        }
        `,
    ],
})
export class HuaQiaoCityEditComponent implements AfterViewInit, AfterViewChecked, OnInit {
    @ViewChild('accountDistannce') accountDistannce: ElementRef;
    @ViewChild('cancelModal') cancelModal: ModalComponent;
    @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();
    public recordId: string;

    public svrConfig: any;
    public cancelChecker: any = { name: 'cancelChecker', type: 'textarea', required: false };

    public mainForm: FormGroup;

    public pageTitle = '处理流程记录';
    public pageDesc = '';

    public flowCustom: IFlowCustom;
    public flowId = '';

    public baseInfo: any[] = [];
    public shows: any[] = [];
    public hasActions: boolean;
    public loadingback = false;
    public newSvrConfig: any;
    public mainFlowId: string = this.svrConfig && this.svrConfig.record && this.svrConfig.record.mainFlowId || '';
    public rejectdata: string[] = [];
    public updatedata: checkerDatas[] = [];
    fromModule = 'dragon-input';
    isVanke: string;
    isshowProgress: boolean; // 是否显示导航进度条
    Showintelligence = false;
    // public isShow: boolean = false;
    public showIconReject = false;
    constructor(private xn: XnService,
        private route: ActivatedRoute, private router: Router,
        private cdr: ChangeDetectorRef,
        private vcr: ViewContainerRef,
        private loading: LoadingService,
        public hwModeService: HwModeService, public communicateService: PublicCommunicateService,
        private localStorageService: LocalStorageService,) {
    }

    ngAfterViewInit() {
    }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }
    ngOnInit() {
        this.updatedata = [new checkerDatas(), new checkerDatas()];
        this.route.params.subscribe((params: Params) => {
            this.recordId = params.id;
            this.showSubmit(this.recordId);
        });
    }
    // // 智能审单按钮是否显示
    // public intelligenceShow() {
    //     let invCheckers = [];
    //     let appName = '';
    //     // 获取供应商名称
    //     if (this.svrConfig.record.nowProcedureId === 'operate') {
    //         invCheckers = this.svrConfig.checkers;
    //         appName = invCheckers.filter((item) => {
    //             return item.checkerId === 'debtUnit';
    //         })[0].value;
    //     } else {
    //         invCheckers = this.svrConfig.actions.filter((action) => {
    //             return action.recordSeq === this.svrConfig.record.recordSeq;
    //         })[0].checkers;
    //         appName = invCheckers.filter((item) => {
    //             return item.checkerId === 'debtUnit';
    //         })[0].data;
    //     }

    //     this.xn.dragon.post('/rule_engine/whitelist/check', { appName: appName }).subscribe(x => {
    //         if (x.ret === 0) {
    //             this.Showintelligence = x.data.whiteList;
    //         }
    //     });
    // }



    /**
     *  拉取后台配置信息
     * @param recordId  流程记录id
     * @param fresh
     */
    private showSubmit(recordId, fresh?) {  // fresh 为可选，true的时候则刷新，不拉取actions的最后一项，拉checker
        this.xn.dragon.post('/flow/showSubmit', {
            recordId
        }).subscribe(json => {
            this.svrConfig = json.data;
            if (this.showRejectIcon()) {
                this.showRejectInfo();
            }
            this.showIconReject = (this.showRejectIcon() && this.showIconReject);
            this.flowId = this.svrConfig.flow.flowId;
            this.isshowProgress = this.flowId.startsWith('sub');
            this.flowCustom = FlowCustom.build(this.flowId, this.xn, this.vcr, this.loading,
                this.communicateService, this.localStorageService
            );
            this.isVanke = 'dragon';
            this.flowCustom.postGetSvrConfig(this.svrConfig);
            this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
            this.flowCustom.preShow(this.svrConfig);
            this.mainFlowId = this.svrConfig.record.mainFlowId === '' ? '1' : this.svrConfig.record.mainFlowId;
            const isfresh = this.svrConfig.checkers.filter((x: any) => x.checkerId === 'desc');
            if (isfresh.length !== 0) {
                this.buildRows(true);
            } else {
                this.buildRows(fresh);
            }

            // 拷贝对象
            this.newSvrConfig = JSON.parse(JSON.stringify(this.svrConfig));
            // this.intelligenceShow();

        });
    }

    // 是否显示退回原因图标
    showRejectIcon() {
        return ((
            this.svrConfig.record.flowId === 'oct_financing' || this.svrConfig.record.flowId === 'oct_platform_verify')
            && this.svrConfig.procedure.procedureId === 'operate');
    }



    /**
     *  历史提交版折叠
     * @param paramItem
     */
    public collapse(paramItem: any): void {
        const items = this.newSvrConfig.actions;
        if (!paramItem.collapse || paramItem.collapse === false) {
            items.forEach((x: any) => x.collapse = false); // 所有都至false
            paramItem.collapse = true;
        } else if (paramItem.collapse === true) {
            paramItem.collapse = false;
        }
    }

    /**
     *  提交同意
     *  提交数据前，回调该流程的个性配置，进行具体操作
     */
    public onSubmit() {
        this.innerSubmit(() => {
            for (const checker of this.svrConfig.checkers) {
                if (checker.options && checker.options.readonly) {
                    this.mainForm.value[checker.checkerId] = checker.value;
                }
            }
            return this.flowCustom.preSubmit(this.svrConfig, this.mainForm.value);
        });
    }

    /**
     * 获取other：用于必填项提示
     * @param row
     */
    public getOtherHelp(row) {
        if (row.other !== undefined && row.other !== '') {
            return JSON.parse(row.other);
        }
    }

    /**
     * 根据mainForm.value[row.name]判断是否显示必填提示
     * 平台审核流程
     * @param row
     */
    public otherJudge(row): boolean {
        const rowVal = this.mainForm.value[row.name];

        let flag = false;
        if (row.checkerId === 'dealContract' && row.flowId === 'oct_platform_verify') {
            flag = JSON.parse(rowVal).some(x => !(x.contractName && x.contractId && x.contractMoney && x.payRate && x.contractType && x.contractJia && x.contractYi));
            return flag;
        } else if (row.checkerId === 'dealContract' && row.flowId === 'oct_financing') { // 供应商上传资料-交易合同必填
            return !rowVal;
        } else if (row.checkerId === 'performanceFile' && row.flowId === 'oct_platform_verify') {
            flag = JSON.parse(rowVal).some(x => !(x.percentOutputValue && x.payType));
            return flag;
        } else if (row.checkerId === 'performanceFile' && row.flowId === 'oct_financing') { // 供应商上传资料-履约证明必填
            return !rowVal;
        } else if (['certificateFile', 'invoice', 'checkCertFile', 'registerCertFile'].includes(row.checkerId)) {
            return !rowVal;
        }
        return false;
    }


    changeAccount(value: string, row: any) {
        if (value === '申请变更账号') {
            this.flowClick();
        } else if (value === '查看账号变更记录' || value === '查看账号使用记录') {
            const cardCode = this.svrConfig.checkers.filter((x: any) => x.checkerId === 'debtInfo')[0].value;
            XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeViewChangeAccountComponent,
                { params: value, orgName: row.value, cardCode: JSON.parse(cardCode).cardCode }).subscribe(() => {
                });
        } else if (value === '下载更正函模板') {
            this.xn.api.dragon.download('/file/downloadCorrect', { mainFlowId: this.mainFlowId }).subscribe((v: any) => {
                this.xn.api.save(v._body, '更正函.zip');
            });
            // const a = document.createElement('a');
            // a.href = 'libs/shared/src/lib/../../assets/lr/doc/dragon-mode/更正函.docx';
            // a.click();
        }


    }
    flowClick() {
        this.temporaryflowStorage();
        this.xn.router.navigate([`/oct/record/new/`],
            {
                queryParams: {
                    id: 'sub_vanke_change',
                    relate: 'mainFlowId',
                    relateValue: this.svrConfig.record.mainFlowId,
                }
            });
    }
    /**
     *  取消
     */
    public onCancel() {
        this.xn.user.navigateBack();
    }

    /**
     *  刷新获取手机扫描二维码上传的文件
     */
    public onFresh(): void {
        this.showSubmit(this.recordId, true); // fresh 刷新的时候则不拉取actions的最后一个
    }
    /**
     *
     * @param row 当前checker项信息 获取帮助文档
     */
    gethelpDoc(row) {
        if (row.options && row.options.helpType) {

        }
    }
    /**
     *  中登登记，暂留
     */
    public onRegistration() {
    }
    // 显示暂存按钮
    showTempClick() {
        return (

            (this.svrConfig.flow.flowId === 'oct_platform_verify' && this.svrConfig.record.nowProcedureId === 'operate')
            || (this.svrConfig.flow.flowId === 'oct_financing' && this.svrConfig.record.nowProcedureId === 'operate')
            || (this.svrConfig.flow.flowId === 'sub_law_manager_survey' && this.svrConfig.record.nowProcedureId === 'review'));
    }

    /**
     * 把svrConfig.checkers转换为rows对象，方便模板输出
     * @param fresh
     */
    private buildRows(fresh?): void {
        this.baseInfo.push({
            type: 'text',
            title: '流程记录ID',
            data: this.svrConfig.record.recordId
        });

        if (!XnUtils.isEmpty(this.svrConfig.record.bcOrderId)) {
            this.baseInfo.push({
                type: 'text',
                title: '区块链账本ID',
                data: this.svrConfig.record.bcLedgerId
            });
            this.baseInfo.push({
                type: 'text',
                title: '区块链记录ID',
                data: this.svrConfig.record.bcOrderId
            });
        }
        this.shows = [];
        const hides = [this.cancelChecker];

        if (this.svrConfig.procedure.procedureId === '@begin') {
            // 起始步骤要处理下标题
            const titleConfig = this.flowCustom.getTitleConfig();
            const titleObj = {
                name: 'title',
                required: true,
                type: 'text',
                title: titleConfig && titleConfig.titleName || '流程标题',
                value: this.svrConfig.record.title || (titleConfig && titleConfig.def) || ''
            };

            if (!!titleConfig && titleConfig.hideTitle) {
                hides.push(titleObj);
                this.shows = [].concat(this.svrConfig.checkers);
            } else {
                this.shows = [titleObj].concat(this.svrConfig.checkers);
            }
        } else {
            this.shows = [].concat(this.svrConfig.checkers);
        }

        if (this.svrConfig.rejectType === 0) {
            this.shows.push({
                name: 'memo',
                required: false,
                type: 'textarea',
                title: '备注',
                other: '',
            });
        } else {
            this.shows.push({
                name: 'memo',
                required: false,
                type: 'textarea',
                title: '审核意见',
                other: '',
            });
        }
        this.copyDraft(this.shows, hides, fresh);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows, hides);
        this.afterBuildFormGroup.emit();
    }

    /**
     *  回退上一步，在历史记录中取到最近一次的提交值，即为草稿
     * @param shows
     * @param hides
     * @param fresh
     */
    private copyDraft(shows: any[], hides: any[], fresh: boolean): void {
        // 如果有草稿，就把草稿内容复制过来
        for (const action of this.svrConfig.actions.slice(0, fresh ? this.svrConfig.actions.length - 1 : this.svrConfig.actions.length)) {
            if (action.operator === 0 && action.procedureId === this.svrConfig.procedure.procedureId) {
                // 是草稿
                for (const checker of action.checkers) {
                    if (checker.type === 'sms' || checker.type === 'password') {
                        // sms/password字段不保留草稿
                        continue;
                    }

                    let find = false;
                    for (const item of shows) {
                        if (item.checkerId === 'preInvoiceNum' && item.checkerId === checker.checkerId) {
                            item.value = checker.data;
                            find = true;
                            break;
                        } else {
                            if (item.checkerId === checker.checkerId && !!!item.value) {
                                item.value = checker.data;
                                find = true;
                                break;
                            }
                        }

                    }
                    if (find) {
                        continue;
                    }
                    for (const item of hides) {
                        if (item.checkerId === checker.checkerId) {
                            item.value = checker.data;
                            find = true;
                            break;
                        }
                    }
                }

                // memo字段
                for (const item of shows) {
                    if (item.name === 'memo') {
                        item.value = action.memo;
                        break;
                    }
                }
            } else {
                this.hasActions = true;
            }
        }
        // memo字段赋值-万科数据对接 平台审核
        if (['oct_platform_verify'].includes(this.svrConfig.flow.flowId)
            && ['operate', '@begin'].includes(this.svrConfig.procedure.procedureId)) {
            for (const item of shows) {
                if (item.name === 'memo' && !!this.svrConfig.memo) {
                    item.value = this.svrConfig.memo;
                    break;
                }
            }
        }
    }

    private showRejectInfo() {
        this.xn.api.dragon.post('/flow/tips', {
            mainFlowId: this.svrConfig.record.mainFlowId,
            flowId: this.svrConfig.record.flowId
        }).subscribe(x => {
            if (x.ret === 0 && x.data.flag === 1) {
                this.showIconReject = true;
                const params = {
                    title: '平台拒绝信息',
                    checker: [
                        {
                            title: '退回修改内容',
                            checkerId: 'stopcontent',
                            type: 'text',
                            options: { readonly: true },
                            required: 0,
                            value: x.data.info,
                        },
                        {
                            title: '问题描述',
                            type: 'textarea',
                            checkerId: 'questiondetail',
                            options: { readonly: true },
                            required: 0,
                            value: x.data.desc,
                        },
                        {
                            title: '退回原因',
                            type: 'textarea',
                            checkerId: 'questionReason',
                            options: { readonly: true },
                            required: 0,
                            value: x.data.rejectReason,
                        }
                    ] as CheckersOutputModel[],
                    buttons: ['确定'],
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
                    .subscribe(v => {
                        if (v === null) {
                            return;
                        } else {
                        }
                    });
            } else {
                this.showIconReject = false;
            }
        });
    }

    private innerSubmit(fn) {
        fn().subscribe(v => {
            if (!!v && !!v.value) {
                return;
            }
            if (!(v && v.action)) {
                //  return;
                this.doSubmit();
                return;
            }
            if (v.action === 'stop') {
                return;
            }

            if (v.action === 'vankestop') {
                // this.isShow = true;
                return;
            }

            if (v.action === 'tips') {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, HtmlModalComponent, {
                    type: v.tipsType,
                    title: v.tipsTitle,
                    html: v.tipsData,
                    size: v.tipsSize
                }).subscribe((v2) => {
                    if (v.tipsType === 'yesno' && v2 === 'yes' || v.tipsType === 'ok') {
                        this.doSubmit();
                    }
                });
                return;
            }

            if (v.action === 'modal') {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, v.modal, v.params).subscribe(v2 => {
                    if (v2 === 'ok') {
                        this.doSubmit();
                    } else if (!!v2 && v2.hasOwnProperty('accountName')) {
                        this.doSubmit();
                    } else if (v2 === null) {
                        this.goDistance();
                    }
                });
                return;
            }

            if (v.action === 'msgBox') {
                if (this.svrConfig.wkType && this.svrConfig.wkType === 1) {
                    this.xn.dragon.post('/sub_system/vanke_system/get_vanke_change_status', {
                        mainFlowId: this.svrConfig.record.mainFlowId
                    }).subscribe(x => {
                        if (x.ret === 0 && x.data) {
                            const msg = [];
                            if (!!x.data.isChange) {
                                msg.push(`当前交易因万科资金中心审批通过产生数据变动，请注意查看。`);
                                if (x.data.factoringEndDate !== x.data.expiredDate) {
                                    msg.push(`其中【保理融资到期日】将在提交后由【${XnUtils.formatDate(x.data.factoringEndDate)}】更新为【${XnUtils.formatDate(x.data.expiredDate)}】，`);
                                }
                                msg.push(`是否确认提交？`);
                                this.xn.msgBox.open(true, msg, () => {
                                    this.doSubmit();
                                    return;
                                }, () => {
                                    return;
                                });
                            } else {
                                this.doSubmit();
                                return;
                            }
                        } else {
                            return;
                        }
                    });
                }
            }
        });
    }

    /**
     *  回退
     *  审核不通过，打回到上一步或上一个节点（后台自己处理）
     */
    private onReject(): void {
        const params: any = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: this.mainForm.value.cancelChecker
        };

        this.xn.api.dragon.post(`/flow/reject`, params)
            .subscribe(() => {
                this.xn.user.navigateBack();
            });
    }

    /**
     *  中止流程
     */
    private onTerminate(): void {
        const params = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: this.mainForm.value.cancelChecker
        };
        const agencyInfoMap = this.localStorageService.caCheMap.get('agencyInfo');
        const agencySession = { orgType: Number(window.sessionStorage.getItem('orgType')), agencyType: Number(window.sessionStorage.getItem('agencyType')) };
        const agencyInfo = !!agencyInfoMap ? JSON.parse(agencyInfoMap) : XnUtils.deepCopy(agencySession, {});
        this.xn.api.dragon.post('/flow/cancel', params).subscribe(json => {
            this.cancelModal.dismiss();
            if (this.svrConfig.record.flowId === 'sub_law_manager_survey') {
                let msg = [];
                if (Number(agencyInfo.agencyType) === 1) {
                    msg = [`已取消尽调。`];
                    this.xn.msgBox.open(false, msg, () => {
                        // 点击【确定】返回上一页
                        this.xn.user.navigateBack();
                    });
                } else if (Number(agencyInfo.agencyType) === 5) {
                    msg = [`已取消尽调。`];
                    this.xn.msgBox.open(false, msg, () => {
                        // 2、点击【确定】返回上一页
                        this.xn.user.navigateBack();
                    });
                }
            } else {
                this.xn.user.navigateBack();
            }
        });
    }



    /**
     *  提交资料，默认值为只读的再此直接读取，防止误操作修改
     */
    private doSubmit(): void {
        for (const checker of this.svrConfig.checkers) {
            if (checker.options && checker.options.readonly) {
                this.mainForm.value[checker.checkerId] = checker.value;
            }
            if (checker.checkerId === 'redeemReceive') {
                this.mainForm.value[checker.checkerId] = String(this.mainForm.value[checker.checkerId]).replace(/\D/g, '');
            }
        }
        const formValue: any = this.mainForm.value;
        const params: any = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(this.svrConfig.checkers, formValue),
            contracts: this.svrConfig.contracts,
        };
        if (this.flowId === 'sub_first_contract_add') {
            delete params.checkers.factorName;
        }
        XnUtils.checkLoading(this);
        this.xn.api.dragon.post(`/flow/submit`, params)
            .subscribe((x) => {
                this.loading.close();
                this.presubmitSpecial(params, x);
                this.afterSubmit(this.svrConfig.flow.flowId, this.svrConfig.record.mainFlowId, this.svrConfig.record.nowProcedureId, x);
            });

    }
    /**
    *  流程中暫存
    */
    temporaryflowStorage(type?: number): void {
        for (const checker of this.svrConfig.checkers) {
            if (checker.options && checker.options.readonly) {
                this.mainForm.value[checker.checkerId] = checker.value;
            }
        }
        const formValue: any = this.mainForm.value;
        const params: any = {
            recordId: this.recordId,
            flowId: this.svrConfig.flow.flowId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(this.svrConfig.checkers, formValue),
            contracts: this.svrConfig.contracts,
        };
        XnUtils.checkLoading(this);
        this.xn.api.dragon.post(`/flow/temporarySave`, params)
            .subscribe(() => {
                this.loading.close();
                if (type && type === 1) {
                    this.xn.user.navigateBack();
                }
            });
    }

    /**
     *  面版样式修改
     * @param paramAction
     */
    public panelCssClass(paramAction: any): string {
        if (paramAction.operator === OperateType.PASS) {
            return 'panel panel-info xn-panel-sm';
        } else if (paramAction.operator === OperateType.REJECT || paramAction.operator === OperateType.SUSPENSION) {
            return 'panel panel-warning xn-panel-sm';
        } else {
            return '';
        }
    }
    presubmitSpecial(params, x) {
        if ((this.svrConfig.flow.flowId === 'sub_change_start' || this.svrConfig.flow.flowId === 'sub_change_capital')
            && params.procedureId === '@begin') {
            if (x.ret === 0) {
                this.xn.msgBox.open(false, `提交成功！\n 下一步请客户经理复核人在【首页-待办任务】中完成【复核】的待办任务。`);
            }
        } else if ((this.svrConfig.flow.flowId === 'sub_change_start' || this.svrConfig.flow.flowId === 'sub_change_capital')
            && params.procedureId === 'review') {
            if (x.ret === 0) {
                this.xn.msgBox.open(false, `提交成功！\n 下一步请高级复核人在【首页-待办任务】中完成【高级复核】的待办任务。`);
            }
        } else if ((this.svrConfig.flow.flowId === 'sub_change_start')
            && params.procedureId === 'windReview') {
            if (x.ret === 0) {
                this.xn.msgBox.open(false, `提交成功！\n
                提交成功！\n
                交易将被限制发起审批，被限制推送数据到金蝶云
                下一步请客户经理在【首页 - 待办任务】中完成【填写保理融资到期日】的待办任务`
                );
            }
        } else if (this.svrConfig.flow.flowId === 'sub_change_capital' && params.procedureId === 'windReview') {
            if (x.ret === 0) {
                this.xn.msgBox.open(false, `提交成功！
                交易将可被手动移出资产池、签署《致项目公司通知书（二次转让）-补充协议）》、《项目公司回执（二次转让）-补充协议》。`);
            }
        } else if (this.svrConfig.flow.flowId === 'sub_factor_add_material' && params.procedureId === 'operate') {
            if (x.ret === 0) {
                this.xn.msgBox.open(false, [`提交成功！`, `下一步请尽调复核人在【首页-待办任务】中完成【尽调】的待办任务。`]);
            }
        }
    }
    private afterSubmitOperate(fn) {
        fn().subscribe(v => {

            if (!(v && v.action)) {
                //  return;
                // this.doSubmit();
                this.xn.user.navigateBack();
                return;
            }
            if (v.action === 'stop') {
                return;
            }
            if (v.action === 'modal') {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, v.modal, v.params).subscribe(v2 => {
                    // if (v2 === 'ok' || !!v2) {
                    // } else if (v2 === null) {
                    // }
                    this.xn.user.navigateBack();

                });
                return;
            }
        });

    }

    /**
     *  提交完成后操作
     * @param flowId    子流程id
     * @param mainFlowId 主流程id
     * @param nowProcedureId 当前操作角色id
     */
    private afterSubmit(flowId, mainFlowId, nowProcedureId, x) {
        this.afterSubmitOperate(() => {
            return this.flowCustom.afterSubmitandGettip(this.svrConfig, this.mainForm.value, x);
        });
    }
    /**
     * 智能审核标准查看
     */
    // public intelligenceStandard() {
    //     let standardInfo = [
    //         {
    //             "itemId": {
    //                 "leftIndex": {
    //                     "indexName": "contractDate",
    //                     "key": "合同日期",
    //                     "value": "20200609"
    //                 },
    //                 "rightIndex": {
    //                     "indexName": "invoiceDate",
    //                     "key": "发票日期",
    //                     "value": "20200809"
    //                 }
    //             },
    //             "referenceStandard": "早于",
    //             "relation": "晚于"
    //         },
    //         {
    //             "itemId": {
    //                 "leftIndex": {
    //                     "indexName": "contractPrice",
    //                     "key": "合同金额",
    //                     "value": 199347342
    //                 },
    //                 "rightIndex": {
    //                     "indexName": "invoicePrice",
    //                     "key": "发票金额",
    //                     "value": 4312341242
    //                 }
    //             },
    //             "referenceStandard": "早于",
    //             "relation": "晚于"
    //         }
    //     ];
    //     XnModalUtils.openInViewContainer(this.xn, this.vcr, IntelligenceStandardModalComponent, { params: standardInfo }).subscribe(() => {
    //     });
    // }

    /**
   *  todo 查看审核标准
   */
    public showAuditStandard(type: number) {
        let contractObj = [];
        // 发票
        let invCheckers = [];
        let step = '';
        if (this.svrConfig.record.nowProcedureId === 'operate') {
            step = 'value';
            invCheckers = this.svrConfig.checkers;
            contractObj = this.localStorageService.caCheMap.get('VankecontractFile');
        } else if (this.svrConfig.record.nowProcedureId === 'review') {
            step = 'data';
            invCheckers = this.svrConfig.actions.filter((action) => {
                return action.recordSeq === this.svrConfig.record.recordSeq;
            })[0].checkers;
            const contractTemp = invCheckers.filter((invc) => {
                return invc.checkerId === 'dealContract';
            });
            if (contractTemp && (contractTemp.length === 1) && contractTemp[0][step]
                && JSON.parse(contractTemp[0][step]) && this.judgeDataType(JSON.parse(contractTemp[0][step]))) {
                contractObj = JSON.parse(contractTemp[0][step]);
            }
        }
        const invoiceObj = invCheckers.filter((item) => {
            return item.checkerId === 'invoice';
        });
        const invoiceArray = [];
        if (invoiceObj && (invoiceObj.length === 1) && invoiceObj[0][step]
            && JSON.parse(invoiceObj[0][step]) && this.judgeDataType(JSON.parse(invoiceObj[0][step]))) {
            const invoiceArr = JSON.parse(invoiceObj[0][step]);
            invoiceArr.forEach((invoice) => {
                invoiceArray.push({
                    invoiceNum: invoice.invoiceNum,
                    invoiceCode: invoice.invoiceCode,
                    isHistory: invoice.mainFlowId && this.judgeDataType(invoice.mainFlowId) && invoice.mainFlowId.length ? true : false
                });
            });
        }
        const params: any = {
            mainFlowId: this.svrConfig.record.mainFlowId,
            invoice: invoiceArray,
            contractJia: contractObj[0].contractJia || '',   // 基础合同甲方名称
            contractYi: contractObj[0].contractYi || '',   // 基础合同乙方名称
            payType: contractObj[0].payType || '',    // 合同类型
            percentOutputValue: contractObj[0].percentOutputValue || '',   // 本次产值金额
            payRate: contractObj[0].payRate || '',    // 付款比例
            contractSignTime: contractObj[0].signTime || ''      // 合同签订时间
        };
        if (type === 1) {
            this.xn.dragon.post('/list/main/checker_list_box', params).subscribe(x => {
                if (x.ret === 0 && x.data && x.data.length > 0) {
                    const params1 = Object.assign({}, { value: '', checkers: x.data });
                    XnModalUtils.openInViewContainer(this.xn, this.vcr, NewVankeAuditStandardModalComponent, params1).subscribe(() => {
                    });
                }
            });
        } else {
            this.xn.dragon.post('/rule_engine/checker/checker_list_box', params).subscribe(x => {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, IntelligenceStandardModalComponent,
                    { params: x.data.standardInfo }).subscribe(() => {
                    });
            });
        }

    }


    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }
    openrejectplatWindow() {
        const detail = {
            projectCompany: '',
            debtUnit: '',
            receive: '',
        };
        detail.debtUnit = this.svrConfig.checkers.filter((x: any) => x.checkerId === 'debtUnit')[0].value;
        detail.projectCompany = this.svrConfig.checkers.filter((x: any) => x.checkerId === 'projectCompany')[0].value;
        detail.receive = this.svrConfig.checkers.filter((x: any) => x.checkerId === 'receive')[0].value;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, RejectModalComponent, detail).subscribe(v => {
            if (v.action === 'cancel') {
                return;
            }
            if (v.action === 'ok' && v.type === 1) {
                const params: any = {
                    recordId: this.recordId,
                    procedureId: this.svrConfig.procedure.procedureId,
                    memo: this.mainForm.value.cancelChecker,
                    rejectInfo: v.rejectInfo,
                };

                this.xn.api.dragon.post(`/flow/reject`, params)
                    .subscribe(() => {
                        window.history.back();
                    });
            } else if (v.action === 'ok' && v.type === 0) {
                this.onTerminate();
            }

        });

    }

    /**
     * 自定义页面锚点
     * scrollIntoView方法参数scrollIntoViewOptions可选
        behavior：定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"。
        block：定义垂直方向的对齐， "start", "center", "end", 或 "nearest"。默认为 "start"。
        inline：定义水平方向的对齐， "start", "center", "end", 或 "nearest"。默认为 "nearest"
     */
    goDistance() {
        if (this.accountDistannce.nativeElement) {
            this.accountDistannce.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        }
    }



}
