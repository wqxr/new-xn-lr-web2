import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ShowViewModalComponent } from 'libs/shared/src/lib/public/modal/show-view-modal.component';
import { AvengerPdfSignModalComponent } from 'libs/shared/src/lib/public/avenger/modal/pdf-sign-modal.component';

@Component({
    template: `
    <div class="form-control xn-input-font xn-input-border-radius">
      <div *ngFor="let item of items" class="label-line" style='float:left ;margin-right:50px '>
        <ng-container *ngIf="!!item.url">
          <a class="xn-click-a" (click)="onView(item)">{{item.label}}</a>
        </ng-container>
        <ng-container *ngIf="!!item.secret">
          <a class="xn-click-a" (click)="showContract(item)">{{item.label}}</a>
        </ng-container>
      </div>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'guaranteePhotocopy', formModule: 'avenger-show' })
export class AvengerGuaranteePhotocopyComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    public items: any[] = [];

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            const json = JSON.parse(data);
            this.items = [];
            for (const item of json) {
                if (item.secret) {
                    this.items.push(item);
                } else {
                    this.items.push({
                        url: this.xn.file.view({ ...item, isAvenger: true }),
                        label: item.fileName
                    });
                }
            }
        }
    }

    /**
     *  查看文件
     * @param paramFile
     */
    public onView(paramFile: any): void {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShowViewModalComponent, paramFile).subscribe();
    }

    /**
     *  查看合同
     * @param paramContract
     */
    public showContract(paramContract: any) {
        const params = Object.assign({}, paramContract, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerPdfSignModalComponent, params).subscribe();
    }
}
