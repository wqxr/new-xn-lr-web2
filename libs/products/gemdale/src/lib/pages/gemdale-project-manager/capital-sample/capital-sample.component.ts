import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import CapitalSampleConfig from 'libs/shared/src/lib/public/dragon-vanke/components/bean/capital-sample';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'capital-sample',
    templateUrl: './capital-sample.component.html',
    styleUrls: ['./capital-sample.component.css']
})
export class CapitalSampleComponent implements OnInit {
    formModule = 'dragon-input';  //表单模块
    mainForm: FormGroup;  //表单类
    svrConfig: any;  //流程配置项
    rows: any[] = [];  //控件配置项
    queryParams: any; // 路由数据
    lastMainFlowIdList: any[] = [];  //资产池内最新一次所有数据
    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private er: ElementRef,
        public hwModeService: HwModeService, ) {
    }

    ngOnInit() {
        // this.router.params.subscribe((params: Params) => {
        //     if (XnUtils.isEmptyObject(params)) {
        //         return;
        //     }
        //     this.doShow();
        // });
        this.router.queryParams.subscribe(params => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }
            this.queryParams = { ...params };
            if (this.localStorageService.caCheMap.get('assetSampleList')) {
                this.lastMainFlowIdList = JSON.parse(this.localStorageService.caCheMap.get('assetSampleList'));
            }
        });
        this.doShow();
    }

    /**
     * 在ngAfterViewInit里打开模态框，实际体验效果会好些
     */
    ngAfterViewInit() {
    }

    /**
     *  根据配置渲染form
     */
    private doShow() {
        //svrConfig需携带抽样资产池编号、资产池交易笔数、资产池应收账款金额汇总
        let config = CapitalSampleConfig.setValue({ sampleCapital: this.queryParams.capitalPoolId });
        config['params'] = this.queryParams;
        this.svrConfig = XnFlowUtils.handleSvrConfig(config);
        this.buildRows();
    }


    /**
     * 把svrConfig.checkers转换为rows对象，方便模板输出
     */
    private buildRows(): void {
        this.rows = this.svrConfig.checkers;
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
    }

    /**
     * other信息处理-点击以excel导出抽样结果
     */
    descClick(params) {
        let sampleMainFlowId = this.mainForm.value[params.checkerId] ?
            JSON.parse(this.mainForm.value[params.checkerId]).map(x => x.mainFlowId) : [];
        const param = {
            mainFlowIdList: sampleMainFlowId,  //已抽样结果
        };
        this.xn.loading.open();
        this.xn.api.dragon.download('/sample/download_sample', param).subscribe((v: any) => {
            this.xn.api.dragon.save(v._body, '抽样结果清单.xlsx');
        }, () => {
            this.xn.loading.close();
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  提交
     */
    public onSubmit() {
        const formValue: any = this.mainForm.value;
        let compareParam = {
            capitalPoolId: this.queryParams.capitalPoolId,		// 资产池id
            lastMainFlowIdList: this.lastMainFlowIdList,	// 资产池交易id列表
        }
        this.xn.dragon.post(`/sample/compare_sample`, compareParam).subscribe(result => {
            if (result.ret === 0 && result.data) {
                let sampleList = formValue.sampleResult ? JSON.parse(formValue.sampleResult) : [];
                //[{mainFlowId: '', isSample: 1}] 1人工 2系统
                let mainIdList = sampleList.map(x => {
                    return { mainFlowId: x.mainFlowId, isSample: x.isSample };
                });
                //调用接口提交
                let param = {
                    capitalPoolId: this.queryParams.capitalPoolId || '',		// 资产池id
                    mainFlowIdList: mainIdList || [],
                    type: parseInt(this.queryParams.selectSample)
                }
                if (result.data.tipType === 1 || result.data.tipType === 2) {
                    // 提示 0=无  1=交易发生变化 2=抽样标记发生变化
                    let msg = result.data.tipType === 1 ? `资产池内交易数量、具体交易ID有变化，确定继续吗？` : `资产池内交易的“抽样业务”标记有变化，确定继续吗？`;
                    this.xn.msgBox.open(true, msg, () => {
                        this.sampleSubmit(param);
                    }, () => {
                    });
                } else {
                    this.sampleSubmit(param);
                }
            }
        });
    }

    /**
     * 抽样提交
     * @param param
     */
    sampleSubmit(param){
        this.xn.dragon.post(`/sample/submit_sample`, param).subscribe((response: any) => {
            if (response && response.ret === 0) {
                this.xn.msgBox.open(true, [
                    '抽样完成！',
                    '请在资产池【尽职调查】列表中查看。'
                ], () => {
                    this.onCancel();
                });
            }
        });
    }

    /**
     *  取消并返回
     */
    public onCancel() {
        this.xn.router.navigate(['/gemdale/assets-management/capital-pool'], {
            queryParams: {
                ...this.queryParams
            }
        });
    }

}
