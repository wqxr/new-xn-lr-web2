import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

@Component({
    templateUrl: './home.component.html',
    styles: [
        `.table-max {width: 100%; font-size: 12px;}`,
        `.table-max td { text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}`,
        `.sub-title { text-indent: 2px; margin-bottom: 6px; font-weight: bold; color: #1c87d8}`,
    ]
})
export class HomeComponent implements OnInit {

    ledgerId: string;
    peers: any[] = [];
    blocks: any;
    maxBlockHeight: number;

    blockId: string;
    blockInfo: any = {} as any;
    blockPeers: any[] = [];
    blockTransactions: any[] = [];

    pages: number[] = [];

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        this.xn.api.post('/explorer/home', {}).subscribe(json => {
            this.ledgerId = json.data.ledgerId;
            this.peers = json.data.peers;
            this.maxBlockHeight = this.peers[0].blockHeight;
            this.fillBlocks(json.data.blocks);
        });
    }

    private fillBlocks(blocks) {
        this.blocks = blocks;

        this.pages = [];
        let start, end;
        if (this.blocks.pageCount < 5) {
            start = 1;
            end = this.blocks.pageCount;
        } else {
            if (this.blocks.pageIndex < 3) {
                start = 1;
                end = 5;
            } else if (this.blocks.pageIndex > this.blocks.pageCount - 2) {
                end = this.blocks.pageCount;
                start = end - 4;
            } else {
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
}
