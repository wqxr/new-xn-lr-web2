import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { BankPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import { BanksMfilesViewModalComponent } from '../../../modal/bank-mfiles-view-modal.component';

@Component({
    template: `
    <div class="form-control xn-input-font" style='height:auto;min-height: 35px;'>
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
    styleUrls: ['../../../components/show-bank-input.component.css']
})
@DynamicForm({ type: 'mfile-info', formModule: 'bank-show' })
export class BankMultiFileShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public items: any[] = [];
    public alert = ''; // 提示

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef, private uploadPicService: UploadPicService) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {

            const itemdata = JSON.parse(data);

            for (const item of itemdata) {
                if (item.secret) {
                    this.items.push(item);
                } else {
                    this.items = itemdata;
                }
            }
            // console.info('this.items', this.items);
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
