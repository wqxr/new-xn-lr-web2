import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

@Component({
    templateUrl: './ca-status.component.html',
    styles: [
            `.table {
            font-size: 13px;
        }`,
    ]
})
export class CaStatusComponent implements OnInit {

    total = 0;
    pageSize = 10;
    items: any[] = [];
    paging = 0;
    public btnText: boolean;

    constructor(private xn: XnService) {
    }

    public ngOnInit() {
        this.onPage(1);
    }

    public onPage(page: number) {
        this.paging = page || 1;
        this.onUrlData();
        this.xn.api.post('/ca/list', {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.items = json.data.data;
            this.items.map(x => {
                if (x.status === 'AUDITFAIL' || x.status === 'DISABLE') {
                    x.btnBool = true;
                }
            });
            // 如果整页没有需要修改的就不显示操作栏
            this.btnText = this.items.some((x: any) => x.btnBool && x.btnBool === true);
        });
    }

    // 查看详情
    public viewDetail(item: any) {
        // 当业务驳回或者作废时可跳转至详情页查看和修改
        this.xn.router.navigate([`./console/szca/ca-status/detail/${item.appId}`]);
    }

    // 回退操作
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageSize = urlData.data.pageSize || this.pageSize;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                pageSize: this.pageSize,
                paging: this.paging,
            });
        }
    }
}
