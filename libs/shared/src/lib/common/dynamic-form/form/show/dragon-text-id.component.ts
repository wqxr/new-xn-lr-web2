import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from '../../dynamic.decorators';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';


@Component({
    template: `
    <div style='width:100%'>
        <div class="form-control xn-input-font xn-input-border-radius" id="text-id">
            <a class="xn-click-a" (click)="onView(label, 50)">
                {{label}}
            </a>
        </div>
    </div>
    `,
    // styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'text-id', formModule: 'default-show' })
export class DragonTextIdComponent implements OnInit {
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
        if (this.row.checkerId === 'specialVerify') {
            if (this.row.flowId.startsWith('bgy')) { // 碧桂园查看流程详情
                this.xn.router.navigate([
                    `country-graden/record/todo/view/${paramMainFloId}`
                ]);
            } else if (paramMainFloId.startsWith('jd')) { // 金地查看流程详情
                this.xn.router.navigate([
                    `new-gemdale/record/todo/view/${paramMainFloId}`
                ]);
            } else {
                this.xn.router.navigate([`/logan/record/todo/view/${paramMainFloId}`]);
            }
        } else if (paramMainFloId.endsWith('bgy')) { // 碧桂园查看流程详情
            this.xn.router.navigate([
                `country-graden/main-list/detail/${paramMainFloId}`
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
            this.xn.router.navigate([
                `logan/main-list/detail/${paramMainFloId}`
            ]);
        }
    }
}
