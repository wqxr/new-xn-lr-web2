import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'dragonXn-page',
    templateUrl: './newpage.component.html',
    styles: [
        `.page-input {
            width: 22px;
            height: 20px;
            border: 1px solid #ddd;
        }`,
        `.go {
            cursor: pointer
        }`
    ]
})
export class DragonPageComponent implements OnInit, OnChanges {

    @Input() total: number;
    @Input() size: number;
    @Input() backPage = 0;
    @Input() showTotal = true;
    @Input() currentPage: number;
    @Input() isPdf = false;
    @Input() isInvoiceview = false;

    @Output() change: EventEmitter<number> = new EventEmitter(false);

    private pageIndex = 0;
    private pageCount = 0;
    pages: number[] = [];
    enterPage = '';
    defaultPage = 1;

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.isPdf) {
            this.enterPage = `${this.total}/份文件`;
        } else {
            if (this.total === undefined) {
                this.enterPage = `/页`;
            } else {
                this.enterPage = `${this.total}/页`;
            }
        }
        this.cdr.markForCheck();
        // 点击搜索框的时候，显示的结果从第一页开始展示，这里是为了控制页码
        if (this.backPage >= 1) {
            this.pageIndex = Number(this.backPage);
        } else {
            this.pageIndex = this.isInvoiceview === true ? this.currentPage : 1;
        }

        if (this.size === undefined || this.size === null || this.size <= 0) {
            this.size = 10;
        }
        if (this.total === undefined || this.total === null || this.total <= 0) {
            this.total = 0;
        }
        this.buildPages();
    }

    onPage(page) {
        if (page < 1 || page > this.pageCount || this.pageIndex === page) {
            return;
        }
        this.currentPage = null;
        this.pageIndex = page;
        this.buildPages();
        this.change.emit(page);
    }

    goPage(page) {
        if (isNaN(parseInt(page, 10))) { // 非数字不执行
            return;
        }
        this.onPage(parseInt(page, 10));
    }

    private buildPages() {
        this.pageCount = Math.ceil(this.total / this.size);
        if (this.pageIndex < 1) {
            this.pageIndex = 1;
        }
        if (this.pageIndex > this.pageCount) {
            this.pageIndex = this.pageCount;
        }

        this.pages = [];
        let start, end;
        if (this.pageCount < 4) {
            start = 1;
            end = this.pageCount;
        } else {
            if (this.pageIndex < 3) {
                start = 1;
                end = 3;
            } else if (this.pageIndex > this.pageCount - 1) {
                end = this.pageCount;
                start = end - 2;
            } else {
                start = this.pageIndex - 1;
                end = this.pageIndex + 1;
            }
        }
        for (let i = start; i <= end; ++i) {
            this.pages.push(i);
        }
    }

    onPageHead() {
        this.onPage(1);
    }

    onPageTail() {
        this.onPage(this.pageCount);
    }

    onCssClass(page, index?: number) {
        if (page === 'head') {
            return this.pageIndex === 1 ? 'disabled' : '';
        }
        if (page === 'tail') {
            return this.pageIndex === this.pageCount ? 'disabled' : '';
        }
        if (!!this.currentPage) {
            if (this.currentPage - 1 === index) {
                return 'active';
            } else {
                return page === this.pageIndex && this.isInvoiceview === true ? 'active' : '';
            }
        } else {
            return page === this.pageIndex ? 'active' : '';
        }
    }
}
