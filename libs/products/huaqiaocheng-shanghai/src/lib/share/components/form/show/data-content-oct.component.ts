import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import PlanTableConfig from '../../bean/plan-table-config';


@Component({
    template: `
    <div class="height">
    <div class="head-height">
        <table class="table table-data-content table-bordered table-hover text-center table-display relative"
            [style.left.px]="headLeft">
            <thead>
                <tr>
                    <ng-container *ngFor="let item of heads.headText">
                        <td>
                            <span style="word-wrap: break-word;">{{item.label}}</span>
                        </td>
                    </ng-container>
                </tr>
            </thead>
        </table>
    </div>
    <div class="table-height" (scroll)="onScroll($event)">
        <table class="table table-data-content table-bordered table-hover text-center table-display">
            <tbody>
                <ng-container *ngFor="let item of items">
                    <tr>
                        <td *ngFor="let head of heads.headText">
                            <ng-container *ngIf="head?.options">
                                <span *ngIf="head.options.type === 'money'"
                                [ngClass]="head.options.style">{{item[head.value] | number: '1.2-3'}}</span>
                                <span *ngIf="head.options.type === 'def'"
                                    [ngClass]="head.options.style">{{ item[head.value] }}</span>
                                <span *ngIf="head.options.type==='boolean'"
                                    [ngStyle]="{'color':item[head.value]===0?'red':'black'}">{{item[head.value]===1?'是':'否'}}</span>

                                <!--当有多张内容时-->
                                <div *ngIf="head.options.type === 'multiple'">
                                    <ng-container *ngIf="hwModeService.arrayLength(item[head.value]);else block2">
                                        <a class="xn-click-a" href="javaScript:void(0)" (click)="viewMoreDetailInfo(item[head.value])"
                                            [innerHtml]="item[head.value] | xnStringToArray : 2 : '等;'">
                                        </a>
                                    </ng-container>
                                    <ng-template #block2>
                                        <div [innerHtml]="item[head.value] | xnStringToArray : 2 : '等;'"></div>
                                    </ng-template>
                                </div>
                                <span *ngIf="head.options.type==='date'">
                                    {{item[head.value] | xnDate: 'stringtodate'}}
                                </span>
                                <span *ngIf="head.options?.type==='rate'">
                                <div>{{item[head.value] | number: '1.2-2'}}%</div>
                                </span>
                            </ng-container>
                            <span *ngIf="!head.options">{{item[head.value]}}</span>
                        </td>
                    </tr>
                </ng-container>
            </tbody>
        </table>
    </div>
</div>
    `,
    styleUrls: ['./show.css']
})
@DynamicForm({ type: 'octdata-content', formModule: 'dragon-show' })
export class ShOctDataContentComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    items: any[] = [];

    // 左移动距离
    public headLeft = 0;

    // 表格字段对应
    heads = PlanTableConfig.getConfig('shanghai').深圳华侨城股份有限公司;

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        public hwModeService: HwModeService) { }

    ngOnInit() {
        if (!!this.row.data) {
            this.items = JSON.parse(this.row.data);
        }
    }

    public onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }

    /**
 *  查看更多信息
 * @param item 长字符串    122，3213，12313，
 */
    public viewMoreDetailInfo(item) {
        item = item.toString().split(',');
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }
}
