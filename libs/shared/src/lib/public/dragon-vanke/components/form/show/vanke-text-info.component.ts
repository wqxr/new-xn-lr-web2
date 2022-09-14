import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DragonPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';


@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%">
            <tbody>
            <tr>
                <td *ngFor='let item of items; let i=index'>
                <a class="xn-click-a" (click)="showContract(item)">
                    《{{item.label}}》
                </a>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    `,
})
@DynamicForm({ type: 'text-info', formModule: 'dragon-show' })
export class VankeTextInfoShowComponent implements OnInit {
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
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe();
    }
}
