import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
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
                <th>合同编号</th>
                <th *ngIf="row.checkerId==='contract'">上游客户合同编号</th>
                <th>应收账款类型</th>
                <th>合同扫描件</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let sub of items; let i=index">
                <td>{{i+1}}</td>
                <td>{{sub.contractId}}</td>
                <td *ngIf="row.checkerId==='contract'"></td>
                <td>
                {{(sub.receiveType|xnJson).firstValue | xnSelectTransform:'moneyType' }}-
                {{(sub.receiveType| xnJson).secondValue | xnSelectTransform:sub.twoselect}}-
                {{(sub.receiveType| xnJson).thirdValue | xnSelectTransform:sub.threeselect}}
                </td>
                <td><a href='javascript:void(0)' (click)="fileView(sub1.filePath)"
                    *ngFor="let sub1 of sub.contractFile | xnJson; let i=index">{{sub1.fileName}}</a></td>
            </tr>

            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'contract', formModule: 'avenger-show' })
export class AvengerShowContractComponent implements OnInit {
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
            this.items = JSON.parse(data);
            this.getcontracttype(this.items);
        }
    }

    getcontracttype(items) {
        this.row.selectOptions = SelectOptions.get('moneyType');
        items.map((item) => {
            this.row.selectOptions.map(itemone => {
                if (itemone.value === JSON.parse(item.receiveType).firstValue) {
                    itemone.children.map(itemtwo => {
                        if (itemtwo.value === JSON.parse(item.receiveType).secondValue) {
                            item.twoselect = itemone.children;
                        }
                    });
                }
            });
        });
        items.map(item => {
            item.twoselect.map(itemone => {
                if (itemone.value === JSON.parse(item.receiveType).secondValue) {
                    itemone.children.map(itemtwo => {
                        if (itemtwo.value === JSON.parse(item.receiveType).thirdValue) {
                            item.threeselect = itemone.children;
                        }
                    });
                }
            });
        });
    }

    public fileView(paramFiles) {
        const files = [{ fileId: paramFiles, isAvenger: true }];
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, JsonTransForm(files))
            .subscribe(() => {
            });
    }
}
