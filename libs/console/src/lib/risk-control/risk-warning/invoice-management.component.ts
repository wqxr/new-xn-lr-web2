import {Component, Input, OnInit, Output} from '@angular/core';
import {InvoiceInfoModel} from '../model/risk-warning-model';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {FormGroup} from '@angular/forms';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {LocalStorageService} from 'libs/shared/src/lib/services/local-storage.service';

/**
 * 发票管理
 */
@Component({
    selector: 'app-risk-warning-invoice-management',
    template: `
        <div style="padding-top: 3rem">
            <div class="form-group col-sm-6 flex" *ngFor="let row of shows">
                <div class="title xn-control-label">
                    {{row.title}}
                    <span *ngIf="row.required !== false" class="required-label">*</span>
                </div>
                <div class="label">
                    <xn-input [row]="row" [form]="mainForm"></xn-input>
                </div>
            </div>
            <div class="col-sm-12 form-group text-right">
                <button class="btn btn-primary" (click)="searchMsg()">查询</button>
                <button class="btn btn-danger" (click)="reset()">重置</button>
            </div>

            <table class="table table-bordered table-hover text-center">
                <thead>
                <tr class="label-text">
                    <th>交易ID</th>
                    <th>供应商</th>
                    <th>核心企业</th>
                    <th>保理金额(元)</th>
                    <th>利率(%)</th>
                    <th>交易模式</th>
                    <th>发票数量</th>
                    <th>发票金额</th>
                    <th>发票异常情况</th>
                    <th>管户人</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <ng-container *ngIf="lists && lists.length ;else block">
                    <tr *ngFor="let item of lists">
                        <td><a href="javaScript:void(0)" (click)="viewFlow(item.mainFlowId)">{{item.mainFlowId}}</a></td>
                        <td>{{item.supplierOrgName}}</td>
                        <td>{{item.enterpriseOrgName}}</td>
                        <td>{{item.contractAmount | number: '1.2-3'}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.isProxy | xnProxyStatus}}</td>
                        <td>{{item.invoiceNumber}}</td>
                        <td>{{item.invoiceAmount | number: '1.2-3'}}</td>
                        <td>{{item.invoiceStatus}}</td>
                        <td>{{item.operator}}</td>
                        <td><a *ngIf="item.invoiceNumber>0" href="javaScript:void(0)" (click)="handleClick(item)">发票详情</a></td>
                    </tr>
                    <tr>
                        <td colspan="3">合计：</td>
                        <td>{{contractAmountAll | number:'1.2-3'}}</td>
                        <td colspan="3"></td>
                        <td>{{invoiceAmountAll | number:'1.2-3'}}</td>
                        <td colspan="3"></td>
                    </tr>
                </ng-container>
                </tbody>
            </table>
            <app-simple-page-component [size]="pageSize" [total]="total" [inputCurrentPage]="paging"
                                       (change)="pageChange($event)"></app-simple-page-component>
        </div>
        <ng-template #block>
            <tr>
                <td colspan="11">
                    <div class="empty-message"></div>
                </td>
            </tr>
        </ng-template>
    `,
    styles: [`
        .title {
            width: 100px;
        }

        .label {
            font-weight: normal;
            flex: 1;
        }

        .flex {
            display: flex;
        }
    `]

})
export class RiskInvoiceManagementComponent implements OnInit {
    @Input() urlData: any;
    lists: InvoiceInfoModel[];
    total = 0;
    pageSize = 10;
    mainForm: FormGroup;
    contractAmountAll = '';
    invoiceAmountAll = '';
    arrObjs = {} as any;
    paging = 0;
    searches: any[] = [];
    shows: any[] = [];

    public constructor(private xn: XnService, private localStorageService: LocalStorageService) {
    }

    public ngOnInit() {
        this.pageChange(1);
    }

    // 点击跳转至发票详情页- 硬编码发票号码
    handleClick(val: InvoiceInfoModel) {
        this.xn.router.navigate([`/console/invoice-display/invoice-list`]);
        this.localStorageService.setCacheValue('invoices_mainFlowId', val.mainFlowId); // 暂存mainFlowId
    }

    viewFlow(item) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    // 切换页码
    pageChange(e) {
        this.xn.loading.open();
        this.paging = e || 1;
        this.onUrlData(); // 导航回退取值
        this.searches = [
            {
                title: '交易ID',
                checkerId: 'mainFlowId',
                type: 'text',
                required: false,
                number: 1
            },
            {
                title: '供应商',
                checkerId: 'supplierOrgName',
                type: 'text',
                required: false,
                number: 2
            },
            {
                title: '核心企业',
                checkerId: 'enterpriseOrgName',
                type: 'text',
                required: false,
                number: 3
            }, {
                title: '交易模式',
                checkerId: 'isProxy',
                type: 'select',
                options: {ref: 'proxyStatus'},
                base: 'number',
                required: false,
                number: 4
            },
        ]; // 搜索项
        this.buildShow(this.searches);
        const params = this.buildParams();
        this.xn.api.post('/llz/risk_warning/invoice_management/invoice_list', params).subscribe(x => {
            this.xn.loading.close();
            if (x.data && x.data.rows && x.data.rows.length) {
                this.lists = x.data.rows;
                this.contractAmountAll = this.calcAmount(this.lists, 'contractAmount');
                this.invoiceAmountAll = this.calcAmount(this.lists, 'invoiceAmount');
                this.total = x.data.recordsTotal;
            } else {
                this.lists = [];
                this.contractAmountAll = this.calcAmount(this.lists, 'contractAmount');
                this.invoiceAmountAll = this.calcAmount(this.lists, 'invoiceAmount');
                this.total = 0;
            }
        });
    }

    // 计算总额
    calcAmount(row, label) {
        if (row.length) {
            const filter = row.filter(x => !!x[label]).map(y => parseFloat(y[label]));
            return filter.reduce((total, val) => total + val);
        }
        return 0;
    }

    // 搜索
    searchMsg() {
        this.paging = 1; // 重置
        this.pageChange(this.paging);
    }

    // 重置
    reset() {
        this.mainForm.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    // 构建搜索项
    private buildShow(searches) {
        this.shows = [];
        // this.onUrlData();
        this.buildCondition(searches);
    }


    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 构建参数
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize,
        };
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        return params;
    }

    // 搜索项值格式化
    private buildCondition(searches) {
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            obj.value = this.arrObjs[searches[i].checkerId];
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe((v) => {
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number').map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });
    }


    // 回退操作
    private onUrlData(data?) {
        const urlData = this.urlData || this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                arrObjs: this.arrObjs,
                code: 1.3
            });
        }
        // 删除 this.urlData 数据
        Object.keys(this.urlData).map(key => delete this.urlData[key]);
    }
}
