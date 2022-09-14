/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：通用签章流程中上传模板组件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2021-06-22
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { CfcaSetTextContractModalComponent } from 'libs/console/src/lib/management/common-cfca-signlist/modal/cfca-set-text-contract.modal';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';
import { XnService } from 'libs/shared/src/lib/services/xn.service';



@Component({
    selector: 'cfca-add-contract',
    templateUrl: './cfca-contract-upload.component.html',
    styles: [
        `
            .button-reset-style {
                font-size: 12px;
                padding: 5px 35px;
                color: #3c8dbc;
            }

            .tip-memo {
                color: #9A9A9A;
            }
            .tag-color {
                color: #f20000;;
            }
        `
    ]
})
@DynamicForm({ type: 'cauploadTemplate', formModule: 'dragon-show' })
export class CfcaAddShowContractComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public alert = ''; // 提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public items: any[] = [];
    public isShowoperate: boolean = false; // 是否显示操作项

    constructor(private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef

    ) {
    }
    public ngOnInit() {
        this.items = JSON.parse(this.row.data);
        const curActions = this.svrConfig.actions[this.svrConfig.actions.length - 1].checkers;
        this.isShowoperate = curActions.filter(x => x.checkerId === 'signType')[0]?.data === '1' ? true : false;
        this.cdr.markForCheck();
    }
    setSignText(paramFile: any, index: number) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, // type：1  代表盖章位置可读
            CfcaSetTextContractModalComponent, { paramFiles: paramFile, type: 1 }).subscribe(x => {
            });
    }


    public fileView(paramFiles) {
        const paramsFiles = [];
        paramsFiles.push(paramFiles);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, JsonTransForm(paramsFiles))
            .subscribe(() => {
            });
    }
}
