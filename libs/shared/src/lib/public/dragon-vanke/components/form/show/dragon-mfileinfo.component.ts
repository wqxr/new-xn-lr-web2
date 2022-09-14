/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：view.component.component.ts
 * @summary：龙光供应商上传资料文件显示checker项
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-30
 * **********************************************************************
 */


import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import { FileViewModalComponent } from '../../../../../public/modal/file-view-modal.component';
import { DragonViewContractModalComponent } from '../../../modal/dragon-mfile-detail.modal';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { UploadPicService } from '../../../../../services/upload-pic.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';


@Component({
    template: `
    <div class="form-control xn-input-font xn-input-border-radius" style='height:auto;min-height:34px'>
      <div *ngFor="let item of items" class="label-line">
        <ng-container *ngIf="!item.secret">
          <a class="xn-click-a" (click)="onView(item)">{{item.fileName}}</a>
        </ng-container>
        <ng-container *ngIf="!!item.secret">
          <a class="xn-click-a" (click)="showContract(item)">{{item.label}}</a>
        </ng-container>
      </div>
    </div>
    `,
    styleUrls: ['../../show-dragon-input.component.css']
})
@DynamicForm({ type: 'mfile-info', formModule: 'dragon-show' })
export class DragonMultiFileComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    @Input() step?:any;
    public items: any[] = [];

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef, private uploadPicService: UploadPicService) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            if (this.row.name === 'otherFile' && !this.step) {
                if (JSON.parse(data)[0].otherFile === '') {
                    this.items = [];
                } else {
                    this.items = JSON.parse(JSON.parse(data)[0].otherFile);
                }

            } else {
                this.items = XnUtils.jsonFileToArry(data);
            }
        }
    }

    /**
     *  查看文件
     * @param paramFile
     */
    public onView(paramFile: any): void {
        if (this.row.name === 'otherFile') {
            this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
                if (x.ret === 0) {
                    let datainfo = null;
                    if (x.data.data.contractName === undefined) {
                        datainfo = JSON.parse(this.row.data);
                    } else {
                        datainfo = x.data.data;
                    }
                    datainfo.contractFile = JSON.parse(this.row.data)[0][this.row.name];
                    this.uploadPicService.viewDetail(datainfo, this.vcr, DragonViewContractModalComponent);
                }

            });
        } else if (this.row.name === 'companyDecision' || this.row.name === 'businessLicense' || this.row.name === 'projectBusinessLicense'
        ) {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe();
        }
    }

    /**
     *  查看合同
     * @param paramContract
     */
    public showContract(paramContract: any) {
        const params = Object.assign({}, paramContract, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe();
    }
}
