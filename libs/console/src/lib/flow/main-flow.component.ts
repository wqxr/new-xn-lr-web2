import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {SelectOptions} from 'libs/shared/src/lib/config/select-options';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    templateUrl: './main-flow.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.table-head .sort {position: relative; cursor: pointer}`,
        `.table-head .sort:after { position: absolute;content: "\\E150";bottom: 8px;right: 8px;display: block;font-family: 'Glyphicons Halflings';opacity: 0.2; }`,
        `.search {float: right}`,
        `.form-control {display:inline-block; border-radius: 4px; box-shadow: inset 0 1px 1px rgba(0,0,0,.075); width: 200px}`,
        `.btn {vertical-align:top}`
    ]
})
export class MainFlowComponent implements OnInit {

    pageTitle = '所有交易';
    pageDesc = '';
    tableTitle = '记录列表';

    showSupplier = true;
    showFactoring = true;
    showEnterprise = true;

    total = 0;
    pageSize = 10;
    items: any[] = [];
    obj: any = {} as any; // 缓存asc desc
    words = '';
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    paging = 0; // 共享该变量
    DefaultPage = false;
    backPage = 1;

    constructor(private xn: XnService, private vcr: ViewContainerRef, private route: ActivatedRoute) {
    }

    ngOnInit() {
        switch (this.xn.user.orgType) {
            case 1:
                this.showSupplier = false;
                break;
            case 2:
                this.showEnterprise = false;
                break;
            case 3:
                this.showFactoring = false;
                break;
            default:
        }

        this.onPage(1, true);
    }

    onPage(page: number, init?: boolean) {
        let orders;
        this.paging = page || 1;
        if (this.sorting && this.naming) {
            orders = this.sorting + this.naming;
        }

        // if(window.location.href === this.xn.page.url && init === true) {
        //     console.log("getSatus");
        //     page = this.xn.page.page;
        //     this.pageSize = this.xn.page.pageSize;
        //     orders = this.xn.page.orders;
        //     this.words = this.xn.page.words;
        //     this.backPage = page;
        // }
        // if (!init) {
        //     console.log("setSatus");
        //     let pageData = {
        //         url: window.location.href,
        //         page: page,
        //         pageSize: this.pageSize,
        //         orders: orders,
        //         words: this.words
        //     }
        //     this.xn.page.setPageData(pageData);
        // }

        // console.log("backPage:::::****:", this.backPage);

        // console.log("url: ", this.xn.page.url);
        // console.log("page: ", this.xn.page.page);
        // console.log("pageSize: ", this.xn.page.pageSize);
        // console.log("orders: ", this.xn.page.orders);

        page = page || 1;

        this.xn.api.post('/flow/main/all', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize,
            order: orders ? [orders] : undefined,
            where: {
                mainFlowId: this.words ? ['like', '%' + this.words + '%'] : undefined,
                supplierOrgName: this.words ? ['like', '%' + this.words + '%'] : undefined,
                factoringOrgName: this.words ? ['like', '%' + this.words + '%'] : undefined,
                enterpriseOrgName: this.words ? ['like', '%' + this.words + '%'] : undefined,
                contractAmount: isNaN(parseFloat(this.words)) ? undefined : ['like', '%' + (this.words) + '%'],
                price: isNaN(parseFloat(this.words)) ? undefined : ['like', '%' + (this.words) + '%'],
                status: this.words ? ['like', '%' + (parseInt(SelectOptions.getConfValue('mainFlowStatus', this.words), 0) - 1) + '%'] : undefined,
                _logic: this.words ? 'OR' : undefined
            }
        }).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.items = json.data.data;
            this.DefaultPage = false;
        });

    }

    onView(mainFlowId: string) {
        this.xn.router.navigate([`/console/flow/detail/${mainFlowId}`]);
    }

    onTerminate(mainFlowId: string, index) {
        this.xn.api.post('/terminate_order/on_terminate', {
            mainFlowId
        }).subscribe(json => {
            console.log('terminate: ', json);
            if (json.ret === 0) {
                for (const item of this.items) {
                    item.mainFlowId === mainFlowId ? item.status = 8 : item.status;
                }
            }
        });
    }

    onSort(sort: string) {
        const page = 1;
        let orderName = '';
        // 如果已经点击过了，就切换asc 和 desc
        if (!this.obj[sort]) {
            this.obj[sort] = {} as any;
            this.obj[sort].order = false;
        }

        if (this.obj[sort].order === false) {
            orderName = ' asc';
            this.obj[sort].order = true;
        } else {
            orderName = ' desc';
            this.obj[sort].order = false;
        }

        this.sorting = sort;
        this.naming = orderName;

        this.onPage(this.paging);
    }

    search() {
        this.DefaultPage = true;
        this.onPage(1);
    }
}
