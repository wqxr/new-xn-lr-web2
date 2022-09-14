import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { apiRoot } from 'libs/shared/src/lib/config/config';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ShowViewModalComponent } from 'libs/shared/src/lib/public/modal/show-view-modal.component';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';


@Component({
    template: `
    <span class="form-control xn-input-font xn-input-border-radius" style="display: inline-table">
      <div *ngFor="let item of items" style="line-height: 24px;">
        <ng-container *ngIf="!!item.url">
          <a class="xn-click-a" (click)="onView(item)">{{item.label}}</a>
        </ng-container>
        <ng-container *ngIf="!!item.secret">
          <a class="xn-click-a" (click)="showContract(item.id, item.secret, item.label)">{{item.label}}</a>
        </ng-container>
      </div>
    </span>
    <div class="text-right"
      *ngIf="orgType===3 && svrConfig.record.flowId==='factoring_invoice_replace13'&& items.length">
      <a href="javaScript:void(0)" class="fa fa-download" (click)="downLoadReceivableFiles(items)">下载</a>
    </div>
    `
})
@DynamicForm({ type: 'mfile', formModule: 'new-agile-show' })
export class XnMFileShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    items: any[];

    public orgType: number = this.xn.user.orgType;

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private localStorageService: LocalStorageService,
        ) {
    }

    ngOnInit(): void {
        const { data } = this.row;
        if (data !== '') {
            const json = JSON.parse(data);
            this.items = [];
            for (const item of json) {
                if (item.secret) {
                    this.items.push(item);
                } else {
                    this.items.push({
                        url: `${apiRoot}/attachment/view?key=${item.fileId}`,
                        label: item.fileName
                    });
                }
            }
        }
    }

    public onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShowViewModalComponent, item).subscribe(() => {
        });
    }

    public showContract(id: string, secret: string, label: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id,
            secret,
            label,
            readonly: true
        }).subscribe(() => {
        });
    }

        /**
     *  下载应收账款金额
     *  paramFiles
     */
    public downLoadReceivableFiles(paramFiles: { url: string, label: string }[]) {
        const data = paramFiles.map((item: { url: string, label: string }) => {
            return {
                fileId: item.url.substring(item.url.lastIndexOf('=') + 1),
                fileName: item.label
            };
        });
        this.xn.loading.open();
        this.xn.api
            .download('/file/down_capital_file', { files: data })
            .subscribe((x: any) => {
                this.xn.api.save(x._body, '应收账款证明.zip');
                this.xn.loading.close();
            });
    }
}
