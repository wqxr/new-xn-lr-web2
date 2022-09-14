import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    templateUrl: './blocks.component.html',
    styles: [
        `.table-max {width: 100%; font-size: 12px;}`,
        `.table-max td { text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}`,
        `.xn-panel-sm { margin-bottom: 10px;}`,
        `.xn-panel-sm .panel-heading { padding: 5px 15px;}`,
        `.xn-panel-sm .panel-heading .panel-title { font-size: 14px }`,
        `.sub-title { text-indent: 2px; margin-bottom: 6px; font-weight: bold; color: #1c87d8}`,
    ]
})
export class BlocksComponent implements OnInit {

    ledgerId: string;
    id: string;

    blocks: any;
    maxBlockHeight = 0;

    blockId: string;
    blockInfo: any = {} as any;
    blockPeers: any[] = [];
    blockTransactions: any[] = [];

    pages: number[] = [];

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.ledgerId = params.ledger;
            this.id = params.id;

            this.xn.api.post('/explorer/order', {
                ledgerId: this.ledgerId,
                transactionType: 3,
                dataKey: this.id
            }).subscribe(json => {
                // console.log(json);
                if (json.data.total > 0) {
                    this.maxBlockHeight = json.data.data[0].blockNumber;
                }
                this.fillBlocks(json.data);
            });

        });
    }

    private fillBlocks(blocks) {
        this.blocks = blocks;

        this.pages = [];
        let start, end;
        if (this.blocks.pageCount < 5) {
            start = 1;
            end = this.blocks.pageCount;
        }
        else {
            if (this.blocks.pageIndex < 3) {
                start = 1;
                end = 5;
            }
            else if (this.blocks.pageIndex > this.blocks.pageCount - 2) {
                end = this.blocks.pageCount;
                start = end - 4;
            }
            else {
                start = this.blocks.pageIndex - 2;
                end = this.blocks.pageIndex + 2;
            }
        }
        for (let i = start; i <= end; ++i) {
            this.pages.push(i);
        }
    }

    onView(ledgerId: string, blockId: string) {
        this.xn.api.post('/explorer/transactions', {
            ledgerId,
            blockId
        }).subscribe(json => {
            this.blockId = blockId;
            this.blockInfo = json.data.blockInfo;
            this.blockPeers = json.data.blockPeers;
            this.blockTransactions = json.data.blockTransactions;
        });
    }

    onPage(page) {
        if (page < 1 || page > this.blocks.pageCount) {
            return;
        }

        this.xn.api.post('/explorer/list', {
            pageIndex: page
        }).subscribe(json => {
            this.fillBlocks(json.data);
        });
    }

    onPageHead() {
        this.onPage(1);
    }

    onPageTail() {
        this.onPage(this.blocks.pageCount);
    }

    onCssClass(page) {
        if (page === 'head') {
            return this.blocks.pageIndex === 1 ? 'disabled' : '';
        }
        if (page === 'tail') {
            return this.blocks.pageIndex === this.blocks.pageCount ? 'disabled' : '';
        }

        return page === this.blocks.pageIndex ? 'active' : '';
    }

    onBack() {
        this.xn.user.navigateBack();
    }
}
