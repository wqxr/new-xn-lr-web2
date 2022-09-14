import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BanksMfilesViewModalComponent } from '../../../modal/bank-mfiles-view-modal.component';
import { BankPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';




@Component({
    template: `
    <div class="form-control xn-input-font xn-input-border-radius" style='min-height:110px;overflow-y:auto;'>
      <div *ngFor="let item of items" class="label-line">
        <ng-container *ngIf="!!item.fileName">
          <a class="xn-click-a" (click)="onView(item)">{{item.fileName}}</a>
        </ng-container>
        <ng-container *ngIf="!!item.secret">
          <a class="xn-click-a" (click)="showContract(item)">{{item.label}}</a>
        </ng-container>
      </div>
    </div>
    `
})
@DynamicForm({ type: 'bankMfile', formModule: 'bank-show' })
export class BanknMultiFileComponent implements OnInit {
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
            this.items = json;
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

            XnModalUtils.openInViewContainer(this.xn, this.vcr, BanksMfilesViewModalComponent, [paramFile]).subscribe();

    }

    /**
     *  查看合同
     * @param paramContract
     */
    public showContract(paramContract: any) {
        const params = Object.assign({}, paramContract, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BankPdfSignModalComponent, params).subscribe();
    }
}
