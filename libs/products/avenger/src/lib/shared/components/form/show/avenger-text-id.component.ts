import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

@Component({
    template: `
    <div style='width:100%'>
        <div class="form-control xn-input-font xn-input-border-radius">
            <a class="xn-click-a" (click)="hwModeService.viewProcess(label, 50)">
                {{label}}
            </a>
        </div>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'text-id', formModule: 'avenger-show' })
export class AvengerTextIdComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    public label = '';

    constructor(private xn: XnService, public hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.label = this.row.data;
    }

    // /**
    //  * 查看交易详情
    //  * @param paramMainFlowId
    //  */
    // public onView(paramMainFlowId: string) {
    //     this.xn.router.navigate([
    //         `console/main-list/detail/${paramMainFlowId}`
    //     ]);

    // }

    /**
     * 查看流程记录
     * @param paramMainFloId
     */
    public onView(paramMainFloId: string, isProxy?: any, currentStatus?: string) {
        if (paramMainFloId.endsWith('lg') || paramMainFloId.endsWith('wk')) {
            this.xn.router.navigate([
                `logan/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('bgy')) { // 碧桂园查看流程详情
            this.xn.router.navigate([
                `country-graden/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('oct')) { // 碧桂园查看流程详情
            this.xn.router.navigate([
                `oct/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('sh')) {
            this.xn.router.navigate([
                `bank-shanghai/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('jd')) { // 金地查看流程详情
            this.xn.router.navigate([
                `new-gemdale/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('yjl')) { // 雅居乐-星顺查看流程详情
            this.xn.router.navigate([
                `agile-xingshun/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('hz')) { // 雅居乐-恒泽查看流程详情
            this.xn.router.navigate([
                `agile-hz/main-list/detail/${paramMainFloId}`
            ]);
        } else {
            const routeparams = isProxy === undefined ? `${paramMainFloId}` : `${paramMainFloId}/${isProxy}/${currentStatus}`;
            this.xn.router.navigate([
                `console/main-list/detail/${routeparams}`
            ]);
        }
    }
}
