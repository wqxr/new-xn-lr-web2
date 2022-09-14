import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

/**
 *  保理风控-客户调查
 */
@Component({
    template: `
        <section class="content-header">
            <h1>
                {{pageTitle}}
            </h1>
        </section>

        <app-search-list-component [searchName]="orgName" [currentPage]="paging"
                                   [size]="size" [type]="type" [list]="list" (change)="search($event)">
        </app-search-list-component>
        <xn-page [size]="size" [currentPage]="paging" [total]="total" (change)="onPage($event)"></xn-page>

    `,
})
export class SurveyIndexComponent implements OnInit {

    pageTitle = '客户调查';
    inputValue = '';
    tableTitle = '企业列表';
    type = 'survey';
    list: any[];
    size = 10;
    total = 0;
    orgName = '';
    paging = 0;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        this.onPage(1);
    }

    onPage(page, name?) {
        this.paging = page || 1;
        this.onUrlData();
        this.xn.api.post('/yb/risk2/league_registration/query', {
            start: (this.paging - 1) * this.size,
            length: this.size,
            where: {
                orgName: this.orgName !== '' ? ['like', '%' + this.orgName + '%'] : undefined,
            }
        }).subscribe(json => {
            if (json && json.data && json.data) {
                this.total = json.data.recordsTotal;
                this.list = json.data.data;
            }
        });
    }

    search(name: any) {
        this.orgName = name;
        this.onPage(1);
    }

    private onUrlData() {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.orgName = urlData.data.orgName || this.orgName;

        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                orgName: this.orgName
            });
        }
    }
}
