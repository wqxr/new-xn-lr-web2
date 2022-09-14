import { Component, Inject, InjectionToken, Input, OnInit, Optional, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import TableHeadConfig from '../../../../../config/table-head-config';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from '../../../../modal/invoice-data-view-modal.component';

@Component({
    template: `
        <div class="height">
            <div class="head-height">
                <table
                    class="table table-data-content table-bordered table-hover text-center table-display relative"
                    [style.left.px]="headLeft"
                >
                    <thead>
                        <tr>
                            <ng-container *ngFor="let item of heads">
                                <td>
                                    <span style="word-wrap: break-word;">{{
                                        item.label
                                    }}</span>
                                </td>
                            </ng-container>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="table-height" (scroll)="onScroll($event)">
                <table
                    class="table table-data-content table-bordered table-hover text-center table-display"
                >
                    <tbody>
                        <ng-container *ngFor="let item of items">
                            <tr>
                                <td *ngFor="let head of heads">
                                    <ng-container *ngIf="head?.options">
                                        <span
                                            *ngIf="head.options.type==='rate'" [ngClass]="head.options.style">
                                            {{item[head.value] ? item[head.value] + '%' : ''}}
                                        </span>
                                        <span
                                            *ngIf="
                                                head.options.type === 'money'
                                            "
                                            [ngClass]="head.options.style"
                                            >{{
                                                item[head.value]
                                                    | number: '1.2-3'
                                            }}</span
                                        >
                                        <span
                                            *ngIf="head.options.type === 'def'"
                                            [ngClass]="head.options.style"
                                            >{{ item[head.value] }}</span
                                        >
                                        <span *ngIf="head.options.type==='boolean'"
                                         [ngStyle]="{'color':item[head.value]===0?'red':'black'}">{{item[head.value]===1?'是':'否'}}</span>

                                        <!--当有多张内容时-->
                                        <div
                                            *ngIf="
                                                head.options.type === 'multiple'
                                            "
                                        >
                                            <ng-container
                                                *ngIf="
                                                    hwModeService.arrayLength(
                                                        item[head.value]
                                                    );
                                                    else block2
                                                "
                                            >
                                                <a
                                                    class="xn-click-a"
                                                    href="javaScript:void(0)"
                                                    (click)="
                                                        viewMoreDetailInfo(
                                                            item[head.value]
                                                        )
                                                    "
                                                    [innerHtml]="
                                                        item[head.value]
                                                            | xnStringToArray
                                                                : 2
                                                                : '等;'
                                                    "
                                                >
                                                </a>
                                            </ng-container>
                                            <ng-template #block2>
                                                <div
                                                    [innerHtml]="
                                                        item[head.value]
                                                            | xnStringToArray
                                                                : 2
                                                                : '等;'
                                                    "
                                                ></div>
                                            </ng-template>
                                        </div>
                                    </ng-container>
                                    <span *ngIf="!head.options">{{
                                        item[head.value]
                                    }}</span>
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
@DynamicForm({ type: 'data-content', formModule: 'dragon-show' })
export class DataContentComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    items: any[] = [];

    // 左移动距离
    public headLeft = 0;

    // 表格字段对应
    heads: any[];

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        public hwModeService: HwModeService,
        @Optional() @Inject(ShowDataContentConfig) config: IShowDataContentConfig
    ) {
        if (config) {
            this.heads = config.headText;
        } else {
            this.heads = TableHeadConfig.getConfig('龙光提单').深圳市龙光控股有限公司
              .headText;
        }

        console.log('inject [show]DataContentConfig', config);
    }

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

export interface IShowDataContentConfig {
    /** 表格配置 */
    headText: any[];
}

export const ShowDataContentConfig = new InjectionToken<IShowDataContentConfig>('showDataContent.config');
