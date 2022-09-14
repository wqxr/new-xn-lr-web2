import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';

@Component({
    selector: 'xn-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
    @Input()
    pageLinkSize = 5;

    @Output()
    pageChange: EventEmitter<any> = new EventEmitter();

    @Input()
    style: any;

    @Input()
    styleClass: string;

    @Input()
    alwaysShow = true;

    @Input()
    pageSizeOptions = [10, 20, 30, 50, 100, 500, 1000];
    pageLinks: Array<number>;

    _totalRecords = 0;

    _first = 0;

    _rows = 0;

    paginatorState: any;

    constructor() {
    }

    ngOnInit(): void {
        this.updatePaginatorState();
    }

    @Input()
    get totalRecords(): number {
        return this._totalRecords;
    }

    set totalRecords(val: number) {
        this._totalRecords = val;
        this.updatePageLinks();
    }

    @Input()
    get first(): number {
        return this._first;
    }

    set first(val: number) {
        this._first = val;
        this.updatePageLinks();
    }

    @Input()
    get rows(): number {
        if (this._rows === 0) {
            this._rows = this.pageSizeOptions[0];
        }

        return this._rows;
    }

    set rows(val: number) {
        this._rows = val;
        this.updatePageLinks();
    }

    isFirstPage(): boolean {
        return this.getPage() === 0;
    }

    isLastPage(): boolean {
        return this.getPage() === this.getPageCount() - 1;
    }

    getPageCount(): number {
        return Math.ceil(this.totalRecords / this.rows) || 1;
    }

    calculatePageLinkBoundaries(): Array<number> {
        const numberOfPages = this.getPageCount();
        const visiblePages = Math.min(this.pageLinkSize, numberOfPages);

        // calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2));
        const end = Math.min(numberOfPages - 1, start + visiblePages - 1);

        // check when approaching to last page
        const delta = this.pageLinkSize - (end - start + 1);
        start = Math.max(0, start - delta);

        return [start, end];
    }

    updatePageLinks(): void {
        this.pageLinks = [];
        const boundaries = this.calculatePageLinkBoundaries();
        const start = boundaries[0];
        const end = boundaries[1];

        for (let i = start; i <= end; i++) {
            this.pageLinks.push(i + 1);
        }
    }

    changePage(p: number): void {
        const pc = this.getPageCount();
        if (p >= 0 && p < pc) {
            this.first = this.rows * p;
            const state = {
                page: p + 1,
                first: this.first,
                pageSize: this.rows,
                pageCount: pc
            };
            this.updatePageLinks();

            this.pageChange.emit(state);
            this.updatePaginatorState();
        }
    }

    getPage(): number {
        return Math.floor(this.first / this.rows);
    }

    changePageToFirst(event): void {
        if (!this.isFirstPage()) {
            this.changePage(0);
        }

        event.preventDefault();
    }

    changePageToPrev(event): void {
        this.changePage(this.getPage() - 1);
        event.preventDefault();
    }

    changePageToNext(event): void {
        this.changePage(this.getPage() + 1);
        event.preventDefault();
    }

    changePageToLast(event): void {
        if (!this.isLastPage()) {
            this.changePage(this.getPageCount() - 1);
        }

        event.preventDefault();
    }

    onPageLinkClick(event, page): void {
        this.changePage(page);
        event.preventDefault();
    }

    onRppChange(event): void {
        this.rows = event;
        this.changePage(this.getPage());
    }

    updatePaginatorState(): void {
        this.paginatorState = {
            page: this.getPage(),
            rows: this.rows,
            first: this.first,
            totalRecords: this.totalRecords
        };
    }

    handleKeyDown(e: KeyboardEvent, input: HTMLInputElement): void {
        if (input.value.trim().length === 0) {
            return;
        }

        const target = input;
        const inputValue = Number(target.value);

        target.value = '';

        if (isNaN(inputValue) === false) {
            if (inputValue > this.getPageCount()) {
                this.changePageToLast(e);
            } else {
                const value = inputValue <= 0 ? 0 : inputValue - 1;
                this.onPageLinkClick(e, value);
            }
        }
    }

    trackByIndex(index, item): number {
        return index;
    }
    // [ngClass]="{'active': (pageLink - 1 == getPage())}"
    onClassCss(pink): string {
        // if (this.backPage > 1) {
        //     return pink === this.backPage ? 'active' : '';
        // } else {
        //     return (pink - 1) === this.getPage() ? 'active' : '';
        // }
        return (pink - 1) === this.getPage() ? 'active' : '';
    }
}
