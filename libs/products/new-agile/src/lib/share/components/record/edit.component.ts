import {
    Component, AfterViewInit, ChangeDetectorRef,
    ViewContainerRef,
    Output,
    EventEmitter, AfterViewChecked
} from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { IFlowCustom, FlowCustom } from '../flow/config/flow.custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { HtmlModalComponent } from 'libs/shared/src/lib/public/modal/html-modal.component';
import { VankeAuditStandardModalComponent } from 'libs/shared/src/lib/public/modal/audit-standard-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { OperateType } from 'libs/shared/src/lib/config/enum/common-enum';

@Component({
    selector: 'xn-new-agile-edit',
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
        `,
    ],
})
export class EditComponent implements AfterViewInit, AfterViewChecked {

    @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();
    // 流程记录id
    recordId: string;
    svrConfig: any;
    cancelChecker: any = { name: 'cancelChecker', type: 'textarea', required: false };
    // 表单组
    mainForm: FormGroup;
    // 标题
    pageTitle = '处理流程记录';
    // 标题描述
    pageDesc = '';
    // 流程配置
    flowCustom: IFlowCustom;
    baseInfo: any[] = [];
    // 显示checker项
    shows: any[] = [];
    // 是否前一步提交项
    hasActions: boolean;
    loadingback = false;
    // 流程进度
    flowProcess = {
        show: false,
        proxy: 0,
        steped: 0
    };
    // 当前步骤数据
    newSvrConfig: any;

    constructor(private xn: XnService,
                private route: ActivatedRoute,
                private cdr: ChangeDetectorRef,
                private vcr: ViewContainerRef,
                private loading: LoadingService,
                private localStorageService: LocalStorageService,
                public hwModeService: HwModeService) {
    }

    ngAfterViewInit() {
        // 路由传参
        this.route.params.subscribe((params: Params) => {
            this.recordId = params.id;
            this.showSubmit(this.recordId);
        });
    }

    /**
     * 为了解决Angular 2 Expression Changed After It Has Been Checked Exception的问题
     */
    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    /**
     *  面板展开合并
     * @param item
     */
    public collapse(item) {
        const items = this.newSvrConfig.actions;
        if (!item.collapse || item.collapse === false) {
            items.forEach((x: any) => x.collapse = false); // 所有都至false
            item.collapse = true;
        } else if (item.collapse === true) {
            item.collapse = false;
        }
    }

    /**
     *  提交数据，将只读数据过滤，最终提交只读数据的初始值
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

    private innerSubmit(fn) {
        fn().subscribe(v => {
            if (!(v && v.action)) {
                this.doSubmit();
                return;
            }
            if (v.action === 'stop') {
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
                    }
                });
                return;
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
     * 审核不通过，打回到上一步或上一个节点（逻辑后台处理）
     */
    public onReject() {
        const params: any = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: this.mainForm.value.cancelChecker
        };

        this.xn.api.post(`/record/record?method=reject`, params)
            .subscribe(() => {
                this.xn.user.navigateBack();
            });
    }

    /**
     *  todo [暂留] 中登登记
     */
    public onRegistration() {
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

    /**
     *  todo 查看审核标准
     */
    public showAuditStandard() {
        let contractObj = [];
        // 发票
        let invCheckers = [];
        let step = '';
        if (this.svrConfig.record.nowProcedureId === 'operate') {
            step = 'value';
            invCheckers = this.svrConfig.checkers;
            contractObj = this.localStorageService.caCheMap.get('contractFile');
        } else if (this.svrConfig.record.nowProcedureId === 'review') {
            step = 'data';
            invCheckers = this.svrConfig.actions.filter((action) => {
                return action.recordSeq === this.svrConfig.record.recordSeq;
            })[0].checkers;
            const contractTemp = invCheckers.filter((invc) => {
                return invc.checkerId === 'contractFile';
            });
            if (contractTemp && (contractTemp.length === 1) && contractTemp[0][step]
                && JSON.parse(contractTemp[0][step]) && this.judgeDataType(JSON.parse(contractTemp[0][step]))) {
                contractObj = JSON.parse(contractTemp[0][step]);
            }
        }

        const invoiceObj = invCheckers.filter((item) => {
            return item.checkerId === 'invoiceFile';
        });
        const invoiceArray = [];
        if (invoiceObj && (invoiceObj.length === 1) && invoiceObj[0][step]
            && JSON.parse(invoiceObj[0][step]) && this.judgeDataType(JSON.parse(invoiceObj[0][step]))) {
            const invoiceArr = JSON.parse(invoiceObj[0][step]);
            invoiceArr.forEach((invoice) => {
                invoiceArray.push({
                    invoiceNum: invoice.invoiceNum,
                    invoiceCode: invoice.invoiceCode,
                    isHistory: invoice.mainFlowIds && this.judgeDataType(invoice.mainFlowIds) && invoice.mainFlowIds.length ? true : false
                });
            });
        }
        const params: any = {
            mainFlowId: this.svrConfig.record.mainFlowId,
            invoice: invoiceArray,
            contractJia: contractObj[0].files.contractJia || '',   // 基础合同甲方名称
            contractYi: contractObj[0].files.contractYi || '',   // 基础合同乙方名称
            payType: contractObj[0].files.payType || '',    // 合同类型
            percentOutputValue: contractObj[0].files.percentOutputValue || '',   // 本次产值金额
            payRate: contractObj[0].files.payRate || '',    // 付款比例
            contractSignTime: contractObj[0].files.contractSignTime || ''      // 合同签订时间
        };
        this.xn.api.post('/custom/vanke_v5/list/checker_list_box', params).subscribe(x => {
            if (x.ret === 0 && x.data && x.data.length > 0) {
                const params1 = Object.assign({}, { value: '', checkers: x.data });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeAuditStandardModalComponent, params1).subscribe(() => {
                });
            }
        });
    }

    /**
     *  中止流程
     */
    public onTerminate() {
        const params = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: this.mainForm.value.cancelChecker
        };
        this.xn.api.post('/record/record?method=cancel', params)
            .subscribe(() => {
                this.xn.user.navigateBack();
            });
    }


    /**
     *  面板样式动态修改
     * @param action
     */
    public panelCssClass(action) {
        if (action.operator === OperateType.PASS) {
          return 'panel panel-info xn-panel-sm';
        } else if (action.operator === OperateType.REJECT || action.operator === OperateType.SUSPENSION) {
          return 'panel panel-warning xn-panel-sm';
        } else {
          return '';
        }
      }

    /**
     *  fresh 刷新的时候则不拉取actions的最后一个
     */
    public onFresh() {
        this.showSubmit(this.recordId, true);
    }

    /**
     * 计算保证金初审的时候不需要返回上一步
     */
    public calcBackButton(): boolean {
        if ((this.svrConfig.record.flowId === 'enterprise_sign_contract' ||
            this.svrConfig.record.flowId === 'factoring_sign_contract' ||
            this.svrConfig.record.flowId === 'enterprise_pay_deposit' ||
            this.svrConfig.record.flowId === 'factoring_confirm_deposit')
            && this.svrConfig.record.nowProcedureId === 'operate') {
            return false;
        } else {
            return this.svrConfig.rejectType !== 0;
        }
    }

    /**
     *  草稿
     * @param shows
     * @param hides
     * @param fresh  true刷新的时候则不拉取actions的最后一个
     */
    private copyDraft(shows: any[], hides: any[], fresh: boolean) {
        const draft = this.svrConfig.actions.slice(0, fresh ? this.svrConfig.actions.length - 1 : this.svrConfig.actions.length);
        // 如果有草稿，就把草稿内容复制过来
        for (const action of draft) {
            if (action.operator === 0 && action.procedureId === this.svrConfig.procedure.procedureId) {
                // 是草稿
                for (const checker of action.checkers) {
                    if (checker.type === 'sms' || checker.type === 'password') {
                        // sms/password字段不保留草稿
                        continue;
                    }

                    let find = false;
                    for (const item of shows) {
                        if (item.checkerId === checker.checkerId) {
                            item.value = checker.data;
                            find = true;
                            break;
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
    }

    /**
     *  加载数据
     * @param recordId 流程id
     * @param fresh fresh 为可选，true的时候则刷新，不拉取actions的最后一项，拉checker
     */
    private showSubmit(recordId, fresh?) {  // fresh 为可选，true的时候则刷新，不拉取actions的最后一项，拉checker
        this.xn.api.post('/record/record?method=show_submit', {
            recordId
        }).subscribe(json => {
            this.svrConfig = json.data;
            const flowId = this.svrConfig.flow.flowId; // 当前流程id
            // 特殊处理内容-存储mainFlowId、flowId
            this.localStorageService.setMainFlowId(this.svrConfig.record.mainFlowId);
            this.localStorageService.setFlowId(flowId); // 特殊处理
            this.localStorageService.setCacheValue('current_flow', flowId); // 存储流程
            //////////////////////////////////////////////////////////////////////////
            this.flowProcess = FlowCustom.calcFlowProcess(flowId);
            this.flowCustom = FlowCustom.build(flowId, this.xn, this.vcr, this.loading);
            this.flowCustom.postGetSvrConfig(this.svrConfig);
            this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
            this.buildRows(fresh);
            // 拷贝对象
            // this.newSvrConfig = this.deepCopy(this.svrConfig, {});
            this.newSvrConfig = JSON.parse(JSON.stringify(this.svrConfig));
        });
    }

    /**
     * 把svrConfig.checkers转换为rows对象，方便模板输出
     * @param fresh
     */
    private buildRows(fresh?: boolean): void {
        if (!fresh) {
            this.baseInfo.push({
                type: 'text',
                title: '流程记录ID',
                data: this.svrConfig.record.recordId
            });
        }

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
                // mainForm里有titleRow，但this.rows里没有，这样就是个隐藏提交的值
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
                title: '备注'
            });
        } else {
            this.shows.push({
                name: 'memo',
                required: false,
                type: 'textarea',
                title: '审核意见'
            });
        }
        this.copyDraft(this.shows, hides, fresh);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows, hides);
        this.afterBuildFormGroup.emit();
    }

    /**
     *  对提交的数据进行处理
     */
    private doSubmit() {
        // 将onlyread的值手动塞进去
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
        // **** 特殊处理 ****
        // **** 某些金额字段被添加了千分位符号，传递给后台会出现异常 ****
        // **** 采用了流程ID和字段keys来定位需要特殊修改的字段 ****
        if (this.svrConfig.flow.flowId === 'financing18' && 'payables' in this.mainForm.value) {
            // financing18 - 应收账款金额
            this.mainForm.value.payables = parseFloat(this.mainForm.value.payables.toString()
                .replace(/,/g, '')).toFixed(2);
        }
        const formValue: any = this.mainForm.value;
        const params: any = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(this.svrConfig.checkers, formValue),
            contracts: this.svrConfig.contracts,
            companyinfo: this.svrConfig.companyinfo || '',
        };
        XnUtils.checkLoading(this);
        this.xn.api.post(`/record/record?method=submit`, params).subscribe(json => {
            // financing_download 下载流程 地产abs 付款管理 出纳，财务下载
            if (['financing_download', 'financing_download14'].includes(this.svrConfig.flow.flowId)) {
                const loadApi = {
                    financing_download: '/mdz/down_file/load_financing',
                    financing_download14: '/custom/jindi_v3/down_file/load_financing',
                    financing_download_times: '/mdz/main/finance_load_times',
                    financing_download14_times: '/custom/jindi_v3/pay_manage/finance_load_times'
                };
                this.xn.api.download(loadApi[this.svrConfig.flow.flowId], params)
                    .subscribe((v: any) => {
                        this.xn.api.save(v._body, '出纳下载表格.xlsx');
                        const mainFlowIds = JSON.parse(params.checkers.downInfo).map(c => {
                            return c.mainFlowId;
                        });
                        this.xn.api.post(loadApi[`${this.svrConfig.flow.flowId}_times`], { mainFlowIds })
                            .subscribe(data => {
                                this._afterSubmit(
                                    this.svrConfig.flow.flowId,
                                    this.svrConfig.record.mainFlowId,
                                    this.svrConfig.record.nowProcedureId
                                );
                                this.loading.close();
                            });
                    });
            } else if (this.svrConfig.flow.flowId === 'supplier_upload_information'
                && this.svrConfig.record.nowProcedureId === 'review') {
                if (json.ret === 0) {
                    this.xn.msgBox.open(false, '资料已提交成功，待平台审核通过后，资料即可生效');
                }
                this.loading.close();
                this._afterSubmit(this.svrConfig.flow.flowId,
                    this.svrConfig.record.mainFlowId, this.svrConfig.record.nowProcedureId);
            } else {
                this.loading.close();
                this._afterSubmit(this.svrConfig.flow.flowId,
                    this.svrConfig.record.mainFlowId, this.svrConfig.record.nowProcedureId);
            }
        });

    }

    /**
     *  只在基础模式，委托模式，回购模式进行处理financing_factoring、financing_factoring1、financing_factoring2
     * @param flowId 流程id
     * @param mainFlowId 主流程id
     * @param nowProcedureId 该流程下，当前流程操作
     * @private
     */
    private _afterSubmit(flowId, mainFlowId, nowProcedureId) {
        if (nowProcedureId !== 'windReview') {
            this.xn.user.navigateBack();
            return;
        }
        const model = ['financing_factoring', 'financing_factoring1', 'financing_factoring2'];
        if (model.indexOf(flowId) === -1) {
            this.xn.user.navigateBack();
            return;
        }
        this.xn.api.post('/yb/deposit/index/detail_deposit', {
            mainFlowId
        }).subscribe(v => {
            this.xn.msgBox.open(false, `本次业务需缴纳保证金${v.data.data.deposit}元，请提醒核心企业支付保证金`,
                () => {
                    this.xn.user.navigateBack();
                });
        });
    }
    deepCopy(obj, c) {
        c = c || {};
        for (const i in obj) {
            if (typeof obj[i] === 'object') {
                c[i] = obj[i].constructor === Array ? [] : {};
                this.deepCopy(obj[i], c[i]);
            } else {
                c[i] = obj[i];
            }
        }
        return c;
    }
}
