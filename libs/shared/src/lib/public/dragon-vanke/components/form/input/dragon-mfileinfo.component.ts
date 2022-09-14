import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';

import { DragonViewContractModalComponent } from '../../../modal/dragon-mfile-detail.modal';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { UploadPicService } from '../../../../../services/upload-pic.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { FileViewModalComponent } from '../../../../../public/modal/file-view-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';


@Component({
    template: `
    <div class="form-control xn-input-font xn-input-border-radius" style='height:auto;min-height: 35px;'>
    <ng-container *ngIf="items.length!==0">
      <div *ngFor="let item of items" class="label-line">
        <ng-container *ngIf="!item.secret">
          <a class="xn-click-a" (click)="onView(item)">{{item.fileName}}</a>
        </ng-container>
        <ng-container *ngIf="!!item.secret">
          <a class="xn-click-a" (click)="showContract(item)">{{item.label}}</a>
        </ng-container>
      </div>
      </ng-container>
    </div>
    `,
    styleUrls: ['../../show-dragon-input.component.css']
})
@DynamicForm({ type: 'mfile-info', formModule: 'dragon-input' })
export class DragonMultiFileComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    @Input() step?:any;
    public ctrl: AbstractControl;
    public items: any[] = [];
    public alert = ''; // 提示

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef, private uploadPicService: UploadPicService) {
    }

    ngOnInit() {
        const data = this.row.value;
        this.ctrl = this.form.get(this.row.name);
        if (data !== '') {
            if ((this.row.name === 'otherFile' || this.row.name === 'factoringOtherFile')&& !this.step) {
                if (JSON.parse(data)[0][this.row.name] === '') {
                    this.items = [];
                } else {
                    this.items = JSON.parse(JSON.parse(data)[0][this.row.name]);
                }

            } else {
                this.items = XnUtils.jsonFileToArry(data);
            }
        }
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
    }

    /**
     *  查看文件
     * @param paramFile
     */
    public onView(paramFile: any): void {
        if (this.row.name === 'otherFile' || this.row.name === 'factoringOtherFile') {
            this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
                if (x.ret === 0) {
                    let datainfo = null;
                    if (x.data.data.contractName === undefined) {
                        datainfo = JSON.parse(this.row.value);
                        datainfo[0].contractFile = JSON.parse(this.row.value)[0][this.row.name];
                        this.uploadPicService.viewDetail(datainfo[0], this.vcr, DragonViewContractModalComponent);
                    } else {
                        datainfo = x.data.data;
                        datainfo.contractFile = JSON.parse(this.row.value)[0][this.row.name];
                        this.uploadPicService.viewDetail(datainfo, this.vcr, DragonViewContractModalComponent);
                    }
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
