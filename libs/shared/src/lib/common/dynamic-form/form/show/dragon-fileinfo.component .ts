import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from '../../dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { DragonViewContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-mfile-detail.modal';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';



@Component({
    template: `
    <div class="form-control xn-input-font xn-input-border-radius" style='height:auto;min-height:35px'>
      <div *ngFor="let item of items" class="label-line">
        <ng-container *ngIf="!!item.fileName">
          <a class="xn-click-a" (click)="onView(item)">{{item.fileName}}</a>
        </ng-container>
        <ng-container *ngIf="!!item.secret">
          <a class="xn-click-a" (click)="showContract(item)">{{item.label}}</a>
        </ng-container>
      </div>
    </div>
    `,
    // styleUrls: ['../../show-dragon-input.component.css']
})
@DynamicForm({ type: 'file', formModule: 'default-show' })
export class DragonFileComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public items: any[] = [];

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef, private uploadPicService: UploadPicService) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            const json = JSON.parse(data);
            this.items = [].concat(json);
            // for (const item of json) {
            //     if (item.secret) {
            //         this.items.push(item);
            //     } else {
            //         // this.items = json;
            //         // this.items.push({
            //         //     url: this.xn.file.view({ ...item, isAvenger: true }),
            //         //     label: item.fileName
            //         // });
            //     }
            // }
        }
    }

    /**
     *  查看文件
     * @param paramFile
     */
    public onView(paramFile: any): void {
        if (this.row.name === 'factoringOtherFile') {
            this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
                if (x.ret === 0) {
                    let datainfo = null;
                    if (x.data.data.contractName === undefined) {
                        datainfo = this.row.data;
                    } else {
                        datainfo = x.data.data;
                    }
                    datainfo.contractFile = this.row.data;
                    this.uploadPicService.viewDetail(datainfo, this.vcr, DragonViewContractModalComponent);
                }

            });
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
