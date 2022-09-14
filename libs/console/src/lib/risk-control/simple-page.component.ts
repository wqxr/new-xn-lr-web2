import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

/**
 *  公用分页组件
 */
@Component({
    selector: 'app-simple-page-component',
    template: `
        <div class="text-right page">
            <span>共 {{total}} 条记录</span>
            <a href="JavaScript:void(0)" (click)="previous()" [ngClass]="btnStatus.btn1">上一页</a>
            第<span class="page-color">{{currentPage}}</span>
            /<span>{{pageSize}}</span>页
            <a href="JavaScript:void(0)" [ngClass]="btnStatus.btn2" (click)="next()">下一页</a>
        </div>
    `,
    styles: [`
        .page {
            padding: 5px 0;
        }

        .page-color {
            color: red;
        }

        a {
            display: inline-block;
            padding: 0 10px;
        }

        a.click-disabled {
            color: #333;
            pointer-events: none;
        }

        a.click-disabled:hover {
            color: #333;
        }
    `]
})
export class SimplePageComponent implements OnInit, OnChanges {
    @Input() size: number;
    @Input() total: number;
    @Input() inputCurrentPage: number;
    @Output() change: EventEmitter<number> = new EventEmitter(true);
    currentPage = 1;
    pageSize = 0;
    btnStatus = {btn1: '', btn2: ''};

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.pageSize = parseInt((this.total / this.size).toString(), 0) + 1 || 1;
        this.currentPage = this.inputCurrentPage || 1;
        this.calcBtn();
    }

    previous() {
        this.currentPage = this.currentPage - 1;
        this.change.emit(this.currentPage);
        this.calcBtn();
    }

    next() {
        this.currentPage = this.currentPage + 1;
        this.change.emit(this.currentPage);
        this.calcBtn();
    }

    // 计算按钮的状态
    calcBtn() {
        if (this.pageSize === 1) {
            this.btnStatus = {btn1: 'click-disabled', btn2: 'click-disabled'};
        } else if (this.pageSize > 1) {
            switch (this.currentPage) {
                case 1:
                    this.btnStatus.btn1 = 'click-disabled';
                    this.btnStatus.btn2 = '';
                    break;
                case this.pageSize:
                    this.btnStatus.btn2 = 'click-disabled';
                    this.btnStatus.btn1 = '';
                    break;
                default:
                    this.btnStatus = {btn1: '', btn2: ''};
            }
        }
    }
}
