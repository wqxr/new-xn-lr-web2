import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    selector: 'xn-page',
    templateUrl: './page.component.html',
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
export class PageComponent implements OnInit, OnChanges {

    @Input() total: number;
    @Input() size: number;
    @Input() backPage = 0;
    @Input() showTotal = true;
    @Input() currentPage: number;
    @Output() change: EventEmitter<number> = new EventEmitter(false);

    private pageIndex = 0;
    private pageCount = 0;
    pages: number[] = [];
    enterPage = 1;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        // 点击搜索框的时候，显示的结果从第一页开始展示，这里是为了控制页码
        if (this.backPage >= 1) {
            this.pageIndex = Number(this.backPage);
        } else {
            this.pageIndex = 1;
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
        
        if (page < 1 || page > this.pageCount) {
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
        if (this.pageCount < 5) {
            start = 1;
            end = this.pageCount;
        } else {
            if (this.pageIndex < 3) {
                start = 1;
                end = 5;
            } else if (this.pageIndex > this.pageCount - 2) {
                end = this.pageCount;
                start = end - 4;
            } else {
                start = this.pageIndex - 2;
                end = this.pageIndex + 2;
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
            }
        } else {
            return page === this.pageIndex ? 'active' : '';
        }
    }
}
