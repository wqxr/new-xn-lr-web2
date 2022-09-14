import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';


@Component({
    template: `
<table class="table table-bordered table-hover file-row-table" width="100%">
    <tbody>
      <tr>
        <td>
          <a class="xn-click-a" (click)="showContract(item.id, item.secret, item.label)">
            《{{item.label}}》
          </a>
        </td>
      </tr>
    </tbody>
  </table>
    `
})
@DynamicForm({ type: 'fixedfile', formModule: 'new-agile-show' })
export class XnFixedFileShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    item: any;

    public orgType: number = this.xn.user.orgType;

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        ) {
    }

    ngOnInit(): void {
        const { data } = this.row;
        if ((data !== '')) {
            this.item = JSON.parse(data);
        }
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
}
