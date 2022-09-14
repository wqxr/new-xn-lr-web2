/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：edit.component.ts
 * @summary：流程编辑公用组件 ，包含【上步提交内容，当前编辑内容，提交，签署合同】
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          代码格式化         2019-04-03
 * **********************************************************************
 */

import {
    Component, AfterViewInit, ChangeDetectorRef,
    ViewContainerRef,
    Output,
    EventEmitter, AfterViewChecked
} from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { HtmlModalComponent } from 'libs/shared/src/lib/public/modal/html-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { VankeAuditStandardModalComponent } from 'libs/shared/src/lib/public/modal/audit-standard-modal.component';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { Observable, of } from 'rxjs';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
    selector: 'xn-edit',
    templateUrl: './zd-change-edit-component.html',
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
        .labelcss{
            margin-right:20px;
        }
        `,
    ],
})
export class ZdEditComponent implements AfterViewInit, AfterViewChecked {

    @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();
    // 流程记录id
    recordId: string;
    svrConfig: any;
    cancelChecker: any = { name: 'cancelChecker', type: 'textarea', required: false };
    // 表单组
    mainForm: FormGroup;
    mainForms: FormGroup;
    // 标题
    pageTitle = '处理流程记录';
    // 标题描述
    pageDesc = '';
    // 流程配置
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
    invoiceList: any[] = [];
    contractList: any[] = [];
    debtorList: any[] = [];
    // 当前步骤数据
    newSvrConfig: any;
    zhondengOptions = SelectOptions.get('zhongDengInvoiceType');
    buttonDisabled: boolean = false;
    constructor(private xn: XnService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private vcr: ViewContainerRef,
        private loading: LoadingService,
        private localStorageService: LocalStorageService,
        public hwModeService: HwModeService,
        private publicCommunicateService: PublicCommunicateService) {
    }

    ngAfterViewInit() {
        // 路由传参
        this.mainForms = new FormGroup({
            innvoiceInfo: new FormGroup({
                invoiceList: new FormControl(),
                contractList: new FormControl(),
                debtorList: new FormControl(),
            }, Validators.required),
        });
        this.route.params.subscribe((params: Params) => {
            this.recordId = params.id;
            this.showSubmit(this.recordId);
        });
        this.publicCommunicateService.change.subscribe(x => {
            this.contractList = x.contractList.filter(x => x.contractName !== '' || x.contractId !== '');
            this.debtorList = x.debtorList.filter(x => x.debtor !== '');
            this.invoiceList = x.invoiceList.filter(x => x.invoiceCode !== '' || x.invoiceMoney !== '' || x.invoicechangePrice !== '');
            this.mainForm.get('invoiceList').setValue(JSON.stringify(this.invoiceList));
            this.mainForm.get('contractList').setValue(JSON.stringify(this.contractList));
            this.mainForm.get('debtorList').setValue(JSON.stringify(this.debtorList));
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
            return of(null);
        });
    }

    private innerSubmit(fn) {
        fn().subscribe(v => {
            if (!(v && v.action)) {
                this.doSubmit();
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
        if (action.operator === 1) {
            return 'panel panel-info xn-panel-sm';
        } else if (action.operator === 2 || action.operator === 3) {
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
        return this.svrConfig.rejectType !== 0;
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
            this.flowProcess = XnFlowUtils.calcFlowProcess(flowId);
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
            const titleObj = {
                name: 'title',
                required: true,
                type: 'text',
                title: '流程标题',
                value: ''
            };
            this.shows = [titleObj].concat(this.svrConfig.checkers);
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

            }
        }
        const formValue: any = this.mainForm.value;
        const params: any = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(this.svrConfig.checkers, formValue),
        };
        XnUtils.checkLoading(this);
        this.xn.api.post(`/record/record?method=submit`, params).subscribe(json => {
                this.loading.close();
                this.xn.user.navigateBack();
                return;
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
