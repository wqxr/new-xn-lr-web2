import {
    Component,
    OnInit,
    ViewContainerRef,
    AfterViewInit
} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {ActivatedRoute, Params} from '@angular/router';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import {FormGroup} from '@angular/forms';
import {IFlowCustom, FlowCustom} from '../flow.custom';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {HtmlModalComponent} from 'libs/shared/src/lib/public/modal/html-modal.component';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {BankFormService} from './bank.form.service';
import {LocalStorageService} from 'libs/shared/src/lib/services/local-storage.service';
import {HwModeService} from 'libs/shared/src/lib/services/hw-mode.service';

@Component({
    selector: 'xn-bank-edit',
    templateUrl: './edit.component.html'
})
export class BankEditComponent implements OnInit, AfterViewInit {
    recordId: string;

    svrConfig: any;
    cancelChecker: any = {
        name: 'cancelChecker',
        type: 'textarea',
        required: false
    };

    mainForm: FormGroup;

    pageTitle = '处理流程记录';
    pageDesc = '';

    flowCustom: IFlowCustom;

    baseInfo: any[] = [];
    shows: any[] = [];
    hasActions: boolean;
    loadingback = false;
    processing = false;

    flowProcess = {
        show: false,
        proxy: 0,
        steped: 0
    };

    constructor(
        private xn: XnService,
        private route: ActivatedRoute,
        // private cdr: ChangeDetectorRef,
        private vcr: ViewContainerRef,
        private loading: LoadingService,
        private bankFormService: BankFormService,
        private localStorageService: LocalStorageService,
        public hwModeService: HwModeService
    ) {
    }

    ngOnInit() {
        //
    }

    ngAfterViewInit() {
        this.route.params.subscribe((params: Params) => {
            this.recordId = params.id;
            this.xn.api
                .post('/record/record?method=show_submit', {
                    recordId: this.recordId
                })
                .subscribe(json => {
                    this.svrConfig = json.data;
                    const flowId = this.svrConfig.flow.flowId;
                    this.localStorageService.setCacheValue('current_flow', flowId); // 存储流程
                    this.flowProcess = XnFlowUtils.calcFlowProcess(flowId);
                    this.flowCustom = FlowCustom.build(
                        flowId,
                        this.xn,
                        this.vcr,
                        this.loading
                    );
                    this.flowCustom.postGetSvrConfig(this.svrConfig);
                    this.svrConfig = XnFlowUtils.handleSvrConfig(
                        this.svrConfig
                    );
                    this.buildRows();

                    // 为了解决Angular 2 Expression Changed After It Has Been Checked Exception的问题
                    // this.cdr.markForCheck();
                });
        });
    }

    // 把svrConfig.checkers转换为rows对象，方便模板输出
    private buildRows(): void {
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
                title: (titleConfig && titleConfig.titleName) || '流程标题',
                value:
                    this.svrConfig.record.title ||
                    (titleConfig && titleConfig.def) ||
                    ''
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

        this.copyDraft(this.shows, hides);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows, hides);

        this.BankOperate();

        this.onAfterBuildFormGroup();
    }

    private BankOperate() {
        if (
            this.svrConfig.procedure.procedureId === 'operate' &&
            this.svrConfig.procedure.procedureName === '银行初审'
        ) {
            // 银行初审 “线下签署” 才显示 highestFile 和 reverseFile
            this.shows = this.shows.filter(
                x =>
                    x.checkerId !== 'highestFile' &&
                    x.checkerId !== 'reverseFile'
            );
            this.mainForm.get('nosignContracts').valueChanges.subscribe(val => {
                if (!val) {
                    return;
                }
                const isOffline = JSON.parse(val).type === 'offline';
                if (!isOffline) {
                    this.shows = this.shows.filter(
                        x =>
                            x.checkerId !== 'highestFile' &&
                            x.checkerId !== 'reverseFile'
                    );
                    const highestFileCtrl = this.mainForm.get('highestFile');
                    if (highestFileCtrl) {
                        highestFileCtrl.reset('');
                        highestFileCtrl.clearValidators();
                        highestFileCtrl.setErrors(null);
                    }
                    const reverseFileCtrl = this.mainForm.get('reverseFile');
                    if (reverseFileCtrl) {
                        reverseFileCtrl.reset('');
                        reverseFileCtrl.clearValidators();
                        reverseFileCtrl.setErrors(null);
                    }
                } else {
                    if (
                        this.shows.some(
                            x =>
                                x.checkerId === 'highestFile' ||
                                x.checkerId === 'reverseFile'
                        )
                    ) {
                        return;
                    }
                    this.shows.splice(
                        1,
                        0,
                        this.svrConfig.checkers.find(
                            (x: any) => x.checkerId === 'highestFile'
                        )
                    );
                    this.shows.splice(
                        2,
                        0,
                        this.svrConfig.checkers.find(
                            (x: any) => x.checkerId === 'reverseFile'
                        )
                    );
                }
            });
        }
    }

    private copyDraft(shows: any[], hides: any[]) {
        // 如果有草稿，就把草稿内容复制过来
        // console.log("this.svrConfig.actions: ", this.svrConfig.actions);
        // console.log("shows: ", shows)
        for (const action of this.svrConfig.actions) {
            if (
                action.operator === 0 &&
                action.procedureId === this.svrConfig.procedure.procedureId
            ) {
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

                // memo字段
                for (const item of shows) {
                    if (item.name === 'memo') {
                        // item.value = action.memo.split(";")[1];
                        item.value = action.memo;
                        break;
                    }
                }
            } else {
                this.hasActions = true;
            }
        }
    }

    onSubmit() {
        this.innerSubmit(() => {
            // 将onlyread的值手动塞进去
            for (const checker of this.svrConfig.checkers) {
                if (checker.options && checker.options.readonly) {
                    this.mainForm.value[checker.checkerId] = checker.value;
                }
            }
            return this.flowCustom.preSubmit(
                this.svrConfig,
                this.mainForm.value
            );
        });
    }

    private innerSubmit(fn) {
        fn().subscribe(v => {
            if (!(v && v.action)) {
                this.doSubmit();
                return;
            }

            if (v.action === 'tips') {
                XnModalUtils.openInViewContainer(
                    this.xn,
                    this.vcr,
                    HtmlModalComponent,
                    {
                        type: v.tipsType,
                        title: v.tipsTitle,
                        html: v.tipsData,
                        size: v.tipsSize
                    }
                ).subscribe(v2 => {
                    if (
                        (v.tipsType === 'yesno' && v2 === 'yes') ||
                        v.tipsType === 'ok'
                    ) {
                        this.doSubmit();
                    } else {
                        // 不同意就啥也不做
                    }
                });
                return;
            }

            if (v.action === 'modal') {
                XnModalUtils.openInViewContainer(
                    this.xn,
                    this.vcr,
                    v.modal,
                    v.params
                ).subscribe(v2 => {
                    if (v2 === 'ok') {
                        this.doSubmit();
                    }
                });
                return;
            }
        });
    }

    onCancel() {
        this.xn.user.navigateBack();
    }

    onReject() {
        this.processing = true;

        const params: any = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: this.mainForm.value.cancelChecker
        };

        // 审核不通过，打回到上一步或上一个节点（后台自己处理）
        this.xn.api.post(`/record/record?method=reject`, params).subscribe(
            json => {
                this.xn.user.navigateBack();
            },
            error => (this.processing = false),
            () => (this.processing = false)
        );
    }

    onRejectBack() {
        this.processing = true;

        const params: any = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: this.mainForm.value.cancelChecker
        };

        // 银行复核的拒绝操作
        this.xn.api.post(`/llz/financing/pay_back`, params).subscribe(
            json => {
                this.xn.user.navigateBack();
            },
            error => (this.processing = false),
            () => (this.processing = false)
        );
    }

    onTerminate() {
        this.processing = true;

        const params = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: this.mainForm.value.cancelChecker
        };
        this.xn.api.post('/record/record?method=cancel', params).subscribe(
            json => {
                this.xn.user.navigateBack();
            },
            error => (this.processing = false),
            () => (this.processing = false)
        );
    }

    doSubmit() {
        // 将onlyread的值手动塞进去
        for (const checker of this.svrConfig.checkers) {
            if (checker.options && checker.options.readonly) {
                this.mainForm.value[checker.checkerId] = checker.value;
            }
        }

        const formValue: any = this.mainForm.value;
        this.bankFormService.prepareData(formValue);

        const params: any = {
            recordId: this.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(
                this.svrConfig.checkers,
                formValue
            ),
            contracts: this.svrConfig.contracts
        };

        // 加上loading
        XnUtils.checkLoading(this);
        this.xn.api
            .post(`/record/record?method=submit`, params)
            .subscribe(json => {
                this.xn.user.navigateBack();
            });
    }

    panelCssClass(action) {
        if (action.operator === 1) {
            return 'panel panel-info xn-panel-sm';
        } else if (action.operator === 2 || action.operator === 3) {
            return 'panel panel-warning xn-panel-sm';
        } else {
            return '';
        }
    }

    onAfterBuildFormGroup() {
        if (!this.mainForm.get('businessType')) {
            // 查看模式
            return;
        }

        // 业务类型
        this.mainForm
            .get('businessType')
            .setValue('向保理商申请保证付款，向银行申请商品融资');

        // 核心企业
        const enterpriseCtrl = this.mainForm.get('enterprise');
        if (enterpriseCtrl.value) {
            enterpriseCtrl.setValue(JSON.parse(enterpriseCtrl.value)[0].value);
        }

        this.bankFormService.onValueChanges(this.mainForm, this.shows);
    }
}
