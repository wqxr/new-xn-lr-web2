import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BusinessDetailComponent } from 'libs/shared/src/lib/public/modal/businessLicense-view-modal.component';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';


@Component({
    template: `
<div class="height">
      <div class="head-height">
        <table class="table table-data-content table-bordered table-hover text-center table-display relative"
          [style.left.px]="headLeft">
          <thead>
            <tr>
              <th>收款单位</th>
              <th>组织机构代码</th>
              <th>工商注册号</th>
              <th>法定代表人</th>
              <th>所属行业</th>
              <th>注册地址</th>
              <th>文件名</th>
              <th>验证一致性</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="table-height" (scroll)="onScroll($event)">
        <table class="table table-data-content table-bordered table-hover text-center table-display">
          <tbody>
            <ng-container *ngFor="let item of items; let i = index;">
              <tr>
                <td>{{item['收款单位']}}</td>
                <td style="word-break: break-all;">{{item['组织机构代码']}}</td>
                <td style="word-break: break-all;">{{item['工商注册号']}}</td>
                <td>{{item['法定代表人']}}</td>
                <td>{{item['所属行业']}}</td>
                <td>{{item['注册地址']}}</td>
                <td style="word-break: break-all;">
                  <a class="xn-click-a" (click)="onViewFile(item.file)"
                    *ngIf="item['file'] && item['file']['fileName']">{{item['file']['fileName']}}</a>
                </td>
                <td>
                  <p [ngClass]="{'red': item.status === false}"
                    *ngIf="item.status !== '' && item.status !== undefined ">
                    {{item.status === false ? '主体信息不一致': '主体信息一致'}}
                  </p>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
    `,
    styles: [`
        ::ng-deep.table {
            margin-bottom: 0;
        }
        ::ng-deep th, ::ng-deep td {
            width: 100px;
        }
    `]
})
@DynamicForm({ type: 'assignor-info', formModule: 'new-agile-show' })
export class XnAssignorInfoShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    @Input() action: any;
    items: any[];

    // 左移动距离
    public headLeft = 0;

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

    public onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
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
