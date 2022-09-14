import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import ViewRemindConfig from './view-remind';

@Component({
    selector: 'view-remind',
    templateUrl: './view-remind.component.html',
})
export class ViewRemindComponent implements OnInit {
    formModule = 'dragon-input';  //表单模块
    mainForm: FormGroup;  //表单类
    svrConfig: any;  //流程配置项
    rows: any[] = [];  //控件配置项
    queryParams: any; // 路由数据
    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,
        private er: ElementRef,
        public hwModeService: HwModeService,) {
    }

    ngOnInit() {
        this.router.params.subscribe((params: Params) => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }
            this.doShow();
        });

        this.router.queryParams.subscribe(params => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }
            this.queryParams = JSON.parse(params.params);
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
        const { title, remindTime, remindContent,remindFiles, remindMemo, feedback, remindStatus } = this.queryParams
        let param = {
            remindName: title,            // 提醒事项名称
            remindDate: remindTime,       // 提醒日期
            remindContent: remindContent, // 提醒内容
            remindMemo: remindMemo,       // 备注信息
            remindFiles: remindFiles,     // 备注信息
        }
        // remindStatus是否反馈 0=否 1=是 已反馈的只需要查看提醒
        //页面上“点击下载清单、文件回传”，不是每个提醒页面都会有。
        //仅当该提醒的“提醒反馈feedback”为“下载清单1、上传/下载3”时，页面上才会有这两个字段
        let remindType = [];
        if (feedback === 2) { remindType.push(RemindType[1]) };
        if (feedback === 1 || feedback === 3) { remindType.push(RemindType[2]) };
        let config = ViewRemindConfig.setValue(param, remindType, remindStatus);
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
     * other信息处理-点击下载清单
     */
    descClick(params) {
        this.xn.loading.open();
        const param = { id: this.queryParams.id };
        this.xn.api.dragon.download('/remind/download_remind', param).subscribe((v: any) => {
            this.xn.api.dragon.save(v._body, '资产池清单.xlsx');
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
        const { remindFiles, remindMemo } = formValue
        //调用接口提交
        //  加上loading
        this.xn.loading.open();
        this.xn.api.dragon.post(`/remind/alter_remind_wait`,
            { id: this.queryParams.id, remindFiles, remindMemo }).subscribe(json => {
                this.xn.loading.close();
                if (json.ret === 0) {
                    this.xn.msgBox.open(false, '提交成功！', () => {
                        this.xn.user.navigateBack()
                    });
                    // this.xn.msgBox.open(false, '提交成功！');

                }
            }, () => {
                this.xn.loading.close();
            });
    }

    /**
     *  取消并返回
     */
    public onCancel() {
        this.xn.user.navigateBack();
    }

}

export enum RemindType {
    // 回传文件
    returnFiles = 1,
    // 下载清单
    downloadList = 2,
}
