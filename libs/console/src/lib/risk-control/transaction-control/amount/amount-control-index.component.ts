import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {AmountControlOutputModel, EnterpriseTransferInput} from '../../model/amount-control';
import { BankManagementService } from 'libs/products/new-agile/src/lib/pages/vnake-mode/bank-mangement.service';

/**
 *  交易控制-额度控制
 */
@Component({
    selector: 'app-amount-control-index-component',
    templateUrl: './amount-control-index-component.html'
})
export class AmountControlIndexComponent implements OnInit {
    info: AmountControlOutputModel = new AmountControlOutputModel();
    enterprise = {
        core: {total: 0, pageSize: 10, pageTitle: 'core'} as EnterpriseTransferInput,
        supplier: {total: 0, pageSize: 10, pageTitle: 'supplier'} as EnterpriseTransferInput
    };
    postUrl = {
        core: '/yb/risk1/quota/quota_list',
        supplier: '/yb/risk1/quota/quota_list1'
    };
    searches = [];

    constructor(private xn: XnService, private bankManagementService: BankManagementService) {
    }

    ngOnInit() {
        this.init(1, 'core', this.searches); // 默认加载第一页
        this.init(1, 'supplier', this.searches); // 默认加载第一页
    }

    // 切换页码
    pageChange(page, label) {
        const currentPage = page || 1;
        this.init(currentPage, label, this.searches);
    }

    // 搜索
    searchValue(search, label) {
        console.log('搜索的值：', search);
        this.searches = search || [];
        this.init(1, label, this.searches);
    }

    /**
     *  加载数据
     * @param page 页码
     * @param label 表明
     * @param searches 搜索项
     */
    init(page, label, searches) {
        const currentPage = page || 1;
        const param = this.bankManagementService.searchFormat(currentPage, this.enterprise[label].pageSize, searches);
        this.xn.api.post(this.postUrl[label], param).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.info[label] = x.data.data;
                this.enterprise[label].total = x.data.recordsTotal;
            } else {
                this.info[label] = [];
                this.enterprise[label].total = 0;
            }
        });
    }
}
