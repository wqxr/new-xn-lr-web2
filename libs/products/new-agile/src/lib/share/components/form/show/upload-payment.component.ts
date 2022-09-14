import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BusinessDetailComponent } from 'libs/shared/src/lib/public/modal/businessLicense-view-modal.component';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import TableHeadConfig from 'libs/shared/src/lib/config/table-head-config';


@Component({
    template: `
<table class="table table-bordered table-hover text-center table-striped">
      <thead>
        <tr>
          <th *ngFor="let head of  heads[row.checkerId]" style="border: 1px solid #f4f4f4">
            <span>{{head.label}}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngIf="items.length">
          <tr *ngFor="let item of items; let i = index;">
            <td *ngFor="let head of heads[row.checkerId]">
              <span *ngIf="head.type==='order'">{{i+1}}</span>
              <span *ngIf="head.type==='default'">{{item[head.value]}}</span>
              <span *ngIf="head.type==='money'">{{item[head.value] | number:'1.2-3'}}</span>
              <span *ngIf="head.type==='view'">
                <div *ngFor="let sub of item[head.value]">
                  <a href="javaScript:void(0)" class="xn-click-a" (click)="onViewFile(sub)">{{sub?.fileName}}</a>
                </div>
              </span>
            </td>
          </tr>
        </ng-container>
      </tbody>
    </table>
    `
})
@DynamicForm({ type: 'upload-payment', formModule: 'new-agile-show' })
export class XnUploadPaymentShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    @Input() action: any;
    items: any[];

    heads = {
        雅居乐集团控股有限公司: TableHeadConfig.getConfig('万科提单').雅居乐集团控股有限公司.headText,
    };

    public orgType: number = this.xn.user.orgType;

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        ) {
    }

    ngOnInit(): void {
        const { data } = this.row;
        if (!!data) {
            this.items = JSON.parse(data);
        }
    }

    public onViewFile(item: any) {
        // console.log(item,this.svrConfig);
        if (item.businessLicenseFile) {
            const orgName = this.action.checkers.filter((x: any) => x.checkerId === 'orgName')[0].data;
            const item1 = Object.assign({}, item, {orgName});
            XnModalUtils.openInViewContainer(this.xn, this.vcr, BusinessDetailComponent, item1).subscribe(() => {
            });
        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, item).subscribe(() => {
            });
        }
    }

}
