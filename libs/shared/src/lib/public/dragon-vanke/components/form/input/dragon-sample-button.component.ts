import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { SingleListParamInputModel, SingleSearchListModalComponent } from '../../../modal/single-searchList-modal.component';
import CapitalSampleConfig from '../../bean/capital-sample';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';

@Component({
    selector: 'dragon-sample-result-list',
    template: `
    <div [formGroup]="form">
        <span><button type="button" class="btn btn-primary" (click)="btnClick('systemSample')">系统抽样</button></span>
        <span><button type="button" class="btn btn-primary" (click)="btnClick('manualSample')">人工抽样</button></span>
    </div>
    `,
    styles: [`
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@DynamicForm({ type: 'sample-button', formModule: 'dragon-input' })
export class DragonSampleButtonComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    public ctrl: AbstractControl;

    public Tabconfig: any;

    currentTab: any; // 当前标签页
    public xnOptions: XnInputOptions;
    public myClass = '';

    constructor(private xn: XnService, private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef, private er: ElementRef,
        public hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.currentTab = CapitalSampleConfig.sampleResult;
        this.ctrl.valueChanges.subscribe(() => {
            this.cdr.markForCheck();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     * 按钮点击事件
     * @param type
     */
    btnClick(type: string) {
        let sampleResult = this.form.get('sampleResult').value; // 已经人工抽样的结果
        sampleResult = sampleResult ? JSON.parse(sampleResult) : []
        sampleResult.forEach(x => { x.checked = true })
        let params: SingleListParamInputModel;
        if (type === 'manualSample') {
            params = {
                title: '人工抽样',
                get_url: '/project_manage/pool/trade_list',
                get_type: 'dragon',
                multiple: 'check',
                heads: CapitalSampleConfig.manualSampleList.heads,
                searches: CapitalSampleConfig.manualSampleList.searches,
                key: 'mainFlowId',
                data: sampleResult,
                total: 0,
                inputParam: {
                    capitalPoolId: this.svrConfig.params.capitalPoolId,
                    type: 1
                },
                rightButtons: [{ label: '取消', value: 'cancel' }, { label: '确定', value: 'submit' }],
                options: {
                    paramsType: 1
                },
                showTotal: true,
            };
        } else if (type === 'systemSample') {
            params = {
                title: '系统抽样',
                get_url: '/rule/select_model_rule',
                get_type: 'dragon',
                multiple: 'single',
                heads: CapitalSampleConfig.systemSampleList.heads,
                searches: CapitalSampleConfig.systemSampleList.searches,
                key: 'id',
                data: [],
                total: 0,
                inputParam: {
                },
                leftButtons: [{ label: '抽样模型管理', value: 'sample-model' }],
                rightButtons: [{
                    label: '取消', value: 'cancel'
                }, {
                    label: '确定', value: 'submit', url: '/sample/system_sample', urlType: 'dragon', id: 'systemSample'
                }],
                options: {
                    paramsType: 2,
                    capitalPoolId: this.svrConfig.params.capitalPoolId,
                },
            };
        }
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe(v => {
            if (v.action === 'ok' && v.value && v.value.length) {
                // 更新抽样方式组件值
                this.ctrl.setValue(type);
                // 结果更新到抽样结果列表
                const originalSampleResult = this.form.get('sampleResult').value ? JSON.parse(this.form.get('sampleResult').value) : [];
                v.value.forEach((list: any) => {
                    list.isSample = type === 'manualSample' ? 1 : 2;
                });
                const currentMainIds = v.value.map((x: any) => x.mainFlowId);
                // 去重 若相同，保留最新一条数据
                const _originalSampleResult = originalSampleResult.filter((y: any) => !currentMainIds.includes(y.mainFlowId));
                // const submitSampleResult = v.value.concat(_originalSampleResult);
                const submitSampleResult = v.value;

                // //去重
                // let uniqueArr = XnUtils.distinctArray2(submitSampleResult, params.key);
                this.form.get('sampleResult').setValue(JSON.stringify(submitSampleResult));
                // this.ctrl.markAsTouched();
            }
        });
    }

}
