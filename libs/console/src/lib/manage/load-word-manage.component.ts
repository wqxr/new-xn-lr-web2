import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';

@Component({
    templateUrl: './load-word-manage.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`
    ]
})
export class LoadWordManageComponent implements OnInit {

    pageTitle = '下载word';
    pageDesc = '';
    tableTitle = '下载word';
    cardNo = '';

    total = 0;
    pageSize = 10;
    items: any[] = [];


    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.onPage(1);
    }

    onPage(page: number) {
        page = page || 1;
        this.xn.api.post('/ljx/wk_info_word/?method=get', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.items = json.data.data;
        });
    }

    onUploadExcel(e) {
        if (e.target.files.length === 0) {
            return;
        }

        const fd = new FormData();
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        this.xn.api.upload('/ljx/word/upload_excel', fd).subscribe(json => {
        });
    }
}
