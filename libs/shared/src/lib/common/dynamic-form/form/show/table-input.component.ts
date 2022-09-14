import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import VankeFactorTabConfig from '../../common/table.config';
import { DynamicForm } from '../../dynamic.decorators';
import { XNCurrency } from 'libs/shared/src/lib/common/xncurrency';
import { Observable, of, fromEvent } from 'rxjs';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

@Component({
    selector: 'dragon-table',
    templateUrl: './table-input.component.html',
    styles: [`
    .table-head table,.table-body table{width:100%;border-collapse:collapse;margin-bottom: 0px;}
    .table-head{background-color:white}
    .table-body{width:100%; max-height:600px;overflow-y:auto;min-height:50px;}
    .table-body table tr:nth-child(2n+1){background-color:#f2f2f2;}
    .headstyle  tr th{
        border:1px solid #cccccc30;
        text-align: center;
    }
    table thead, tbody tr {
        display:table;
        width:100%;
        table-layout:fixed;
        word-wrap: break-word;
        word-break: break-all;
        }
    .table-body table tr td{
        border:1px solid #cccccc30;
        text-align: center;
        max-width: 70px;
        word-wrap:break-word
    }
    .table-head table tr th {
        border:1px solid #cccccc30;
        text-align: center;
    }
    `]
})
@DynamicForm({
    type: [
        'paltformMsg',
        'businessFactor',
        'historyLoan',
        'holdersInfo',
        'litigationInfo',
    ], formModule: 'dragon-show'
})
export class DragonTableshowComponent implements OnInit, AfterViewInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    memo: any;
    tabConfig: any;
    subResize: any;
    public debtUnit = '';
    items: string[] = [];
    heads: any[] = [];
    allheads: any[] = [];
    public amountReceive: number;
    public averagePrice: number;

    constructor(private er: ElementRef, public hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.tabConfig = VankeFactorTabConfig[this.row.type];
        if (this.row.type === 'paltformMsg' || this.row.type === 'businessFactor') {
            this.heads = CommUtils.getListFields(this.tabConfig.heads);
        } else {
            const allheads = this.tabConfig.allheads;
            allheads.forEach((x, index) => {
                this.heads = CommUtils.getListFields(x.heads);
                this.allheads.push({ title: x.title, heads: this.heads, label: x.label });
            });

        }

        if (!!this.row.data) {
            console.log('row.data==>', this.row.data);
            this.items = JSON.parse(this.row.data);
            if (this.row.type === 'historyLoan') {
                let amount = new XNCurrency(0);
                this.debtUnit = this.items.map((x: any) => x.debtUnit)[0];
                this.items.forEach((x: any) => {
                    amount = amount.add(x.receive);
                });
                this.amountReceive = amount.value;
                const average = new XNCurrency(this.amountReceive / this.items.length);
                this.averagePrice = average.value;
            }

        }
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }
    ngAfterViewInit() {
        this.formResize();
    }
    ngOnDestroy() {
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize) {
            this.subResize.unsubscribe();
        }
    }
    formResize() {
        if (this.row.type === 'litigationInfo') {
            this.tabConfig.allheads.map((heads) => {
                const scrollBarWidth = $('.' + heads.label + '>.table-body', this.er.nativeElement).outerWidth(true) - $('.' + heads.label + '>.table-body>table').outerWidth(true);
                $('.' + heads.label + '>.table-head', this.er.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth}px`);
            });
        } else if (this.row.type === 'historyLoan') {
            const scrollBarWidth = $('.historyDetail>.table-body', this.er.nativeElement).outerWidth(true) - $('.historyDetail>.table-body>table').outerWidth(true);
            $('.historyDetail>.table-head', this.er.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth}px`);
        }
    }
}
