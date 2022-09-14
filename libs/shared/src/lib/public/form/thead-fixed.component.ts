import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'xn-thead-fixed',
    template: `
        <table class="height">
            <div class="head-height">
                <table
                    class="table table-bordered table-hover text-center table-display relative"
                    [style.left.px]="headLeft"
                >
                    <thead>
                        <tr>
                            <ng-container *ngFor="let item of theadText">
                                <td>
                                    <span>{{ item }}</span>
                                </td>
                            </ng-container>
                            <td class="gutter"></td>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="table-height" (scroll)="onScroll($event)">
                <ng-container *ngTemplateOutlet="tableTemplate"></ng-container>
            </div>
            <div class="footer-height">
                <table
                    class="table table-bordered table-hover text-center table-display relative"
                    [style.left.px]="headLeft"
                >
                    <tfoot>
                        <tr>
                            <ng-container
                                *ngTemplateOutlet="footerTemplate"
                            ></ng-container>
                            <td class="gutter"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </table>
    `,
    styles: [
        `
            .height {
                overflow-x: hidden;
            }
            /** Header 右侧的空隙 */
            td.gutter {
                width: 17px;
                padding: 0;
            }
            ::ng-deep tr td {
                vertical-align: middle;
            }
            ::ng-deep .height .table {
                table-layout: fixed;
                width: 100%;
            }
            .table-height {
                max-height: 350px;
                overflow: scroll;
            }
            ::ng-deep .table-height .table {
                margin-bottom: 2px;
            }

            .head-height,
            .footer-height {
                position: relative;
                overflow: hidden;
            }

            .table-display {
                margin: 0;
            }

            .relative {
                position: relative;
            }
        `
    ]
})
export class THeadFixedComponent implements OnInit {
    @Input() theadText: Array<string>;
    @Input() tableTemplate: TemplateRef<any>;
    @Input() footerTemplate: TemplateRef<any>;

    headLeft = 0;

    constructor() {}

    ngOnInit() {}

    public onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }
}
