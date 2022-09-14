import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { of, Observable } from 'rxjs';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { query } from '@angular/animations';
import { map } from 'rxjs/operators';

/**
 * 发票展示列表/ 查看详情
 */
@Component({
    selector: 'app-risk-warning-invoice-show-list',
    template: `
        <section class="content-header">
            <h1>
                发票详情
            </h1>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-body">
                    <table class="table table-bordered table-hove text-center" width="100%">
                        <thead>
                        <tr>
                            <th>主流程ID</th>
                            <th>发票号码</th>
                            <th>发票代码</th>
                            <th>开票日期</th>
                            <th>销方名称</th>
                            <th>购方名称</th>
                            <th>税额合计</th>
                            <th>价税合计</th>
                            <th>金额合计</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr *ngFor="let item of items">
                            <td>
                                <a class="xn-click-a" (click)="viewFlow(item.mainFlowId)">{{mainFlowId}}</a>
                            </td>
                            <td>{{item.invoiceNum || ''}}</td>
                            <td>{{item.invoiceCode || ''}}</td>
                            <td>{{ item.invoiceDate}}</td>
                            <td>{{ item.supplierOrgName }}</td>
                            <td>{{ item.enterpriseOrgName }}</td>
                            <td>{{calc(item.invoiceAmount, item.amount) | number:'1.2-3'}}</td>
                            <td>{{ item.invoiceAmount | number:'1.2-3' }}</td>
                            <td>{{ item.amount | number:'1.2-3' }}</td>
                            <td>
                                <a class="xn-click-a" (click)="handleClick(item)">查看</a>
                            </td>
                        </tr>
                        <!--<tr *ngIf="amountAll > 0">-->
                        <!--<td>合计</td>-->
                        <!--<td>/</td>-->
                        <!--<td>/</td>-->
                        <!--<td>/</td>-->
                        <!--<td>{{amountAll}}</td>-->
                        <!--<td>/</td>-->
                        <!--<td>/</td>-->
                        <!--</tr>-->
                        </tbody>
                    </table>
                    <xn-pagination [rows]="pageSize" [first]="first" [totalRecords]="total" [pageSizeOptions]="[10,20,30,50,100]"
                                   (pageChange)="onPage($event)"></xn-pagination>
                </div>
                <div class="box-footer">
                    <button class="btn btn-default" type="button" (click)="xn.user.navigateBack()">返回</button>
                </div>
            </div>
        </section>
    `
})
export class InvoiceShowListComponent implements OnInit {
    items: any[];
    amountAll = 0;
    resCache = new Map<string, Array<any>>(); // 分页暂存值
    first = 0;
    total = 0;
    pageSize = 10; // 默认加载十项
    paging = 0;
    mainFlowId = '';
    isNew: string;

    public constructor(public xn: XnService, private vcr: ViewContainerRef,
                       private localStorageService: LocalStorageService, private activatedRoute: ActivatedRoute) {
    }

    public ngOnInit() {
        this.mainFlowId = this.localStorageService.caCheMap.get('invoices_mainFlowId');
        this.activatedRoute.queryParams.subscribe(queryParames => {
            this.isNew = queryParames.isNew;
        });
        if (this.isNew === 'true') {
            this.xn.avenger.post('/invoice/all_invoice/list', { mainFlowId: this.mainFlowId })
                .subscribe(res => {
                    const invoice = res.data;
                    this.items = invoice || [];
                    this.total = invoice.length || 0;
                });
        } else {
            this.onPage({ page: 1 }); // 默认加载第一页
        }
    }

    onPage(e) {
        this.paging = e.page || 1;
        this.pageSize = e.pageSize ? e.pageSize : 10;
        this.first = e.first ? e.first : 0;
        this.onUrlData();
        this.splitPage('/llz/risk_warning/invoice_management/invoice_all',
            { mainFlowId: this.mainFlowId }, this.paging, this.pageSize).subscribe(x => {
                this.items = x.list || [];
                this.total = x.total || 0;
                // 求和
                if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
                    this.amountAll = this.computeSum(this.items.filter(v => v && v.invoiceAmount)
                        .map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
                }
            });
    }

    viewFlow(item) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    // 查看发票详情
    handleClick(item) {
        this.xn.router.navigate([`/console/invoice-display/detail/${item.invoiceNum}`]);
    }

    // 具体到单个数组的求和
    computeSum(array) {
        if (array.length <= 0) {
            return;
        }
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }

    /**
     * @param total 总额
     * @param pre 价格
     */
    calc(total, pre) {
        if (!!total && !!pre) {
            return parseFloat(total.toString()) - parseFloat(pre.toString());
        } else if (!!total && !pre) {
            return parseFloat(total.toString());
        } else if (!!pre && !total) {
            return 0;
        }
        return 0;
    }

    private splitPage(url, params, start, length): Observable<any> {
        if (this.resCache.has('data')) {
            const data = this.resCache.get('data');
            if (this.resCache.get('data').length) {
                return of({ list: data.slice((start - 1) * length, start * length), total: data.length });
            }
            return of({ list: [], total: 0 });
        } else {
            return this.xn.api.post(url, params).pipe(map(x => {
                this.resCache.set('data', x.data);
                if (x.data.length) {
                    return { list: x.data.slice((start - 1) * length, start * length), total: x.data.length };
                }
                return { list: [], total: 0 };
            }));
        }
    }

    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageSize = urlData.data.pageSize || this.pageSize;
            this.first = urlData.data.first || this.first;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageSize: this.pageSize,
                first: this.first,
            });
        }
    }
}
