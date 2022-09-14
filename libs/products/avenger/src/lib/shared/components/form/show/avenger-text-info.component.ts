import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { AvengerPdfSignModalComponent } from 'libs/shared/src/lib/public/avenger/modal/pdf-sign-modal.component';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%">
            <tbody>
            <tr *ngIf='items.length!==0'>
                <td *ngFor='let item of items; let i=index'>
                <a class="xn-click-a" (click)="showContract(item)">
                    《{{item.label}}》
                </a>
                </td>
            </tr>
            <tr *ngIf='items.length===0'>
                <td style='padding:0px'>
                <input #input class="form-control xn-input-font xn-input-border-radius" type="text" autocomplete="off" />
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'text-info', formModule: 'avenger-show' })
export class AvengerTextInfoComponent implements OnInit {
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
        }
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
