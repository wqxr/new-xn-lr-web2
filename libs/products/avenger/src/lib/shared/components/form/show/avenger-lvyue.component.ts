import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { AvengerMfilesViewModalComponent } from 'libs/shared/src/lib/public/avenger/modal/mfiles-view-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { MfilesViewModalComponent } from 'libs/shared/src/lib/public/modal/mfiles-view-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%">
        <thead>
        <tr>
            <th>序号</th>
            <th>单据类型</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody>
            <tr *ngFor="let sub of items; let i=index">
                <td>{{i+1}}</td>
                <td>
                {{sub.documentType | xnSelectTransform:'Certificateperformance' }}
                </td>
                <td><a href='javascript:void(0)' (click)="watchView(sub)">查看</a></td>
            </tr>
            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'lvyue', formModule: 'avenger-show' })
export class AvengerLvyueComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public documentType: string;

    items: any[] = [];

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.items = JSON.parse(data);
        }
    }

    public fileView(paramFiles) {
        const files = [{ fileId: paramFiles, isAvenger: true }];
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, JsonTransForm(files))
            .subscribe(() => {
            });
    }

    watchView(item) {
        item.contractFile = item.certificatecontractPic;
        const files = [{ file: item.contractFile, isAvenger: true }];
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerMfilesViewModalComponent, JsonTransForm(files))
            .subscribe(() => {
            });
    }

}
