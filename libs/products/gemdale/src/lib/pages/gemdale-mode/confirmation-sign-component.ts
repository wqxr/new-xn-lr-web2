/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：confirmation-sign-component.ts
 * @summary：金地模式 金地集团公司签署付款清单，并签署付款确认书
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          重新生成付款确认书         2019-04-24
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { ActivatedRoute } from '@angular/router';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';

@Component({
    templateUrl: `./confirmation-sign-component.html`
})
export class ComfirmationSignComponent implements OnInit {
    // 默认激活第一个标签页 {do_not,do_down}
    public label = 'do_not';
    // 数据
    public data: any[] = [];
    public currentTab: any; // 当前标签页
    public tabConfig: any;
    public get_contract_url = this.localStorageService.caCheMap.get('get_contract_url');
    public get_contract2_url = this.localStorageService.caCheMap.get('get_contract2_url');


    constructor(public xn: XnService,
                private vcr: ViewContainerRef,
                public bankManagementService: BankManagementService,
                private router: ActivatedRoute,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.currentTab = this.tabConfig.tabList.find(item => item.value === this.label); // 当前标签页
            this.data = this.localStorageService.caCheMap.get('selected');
        });
    }

    /**
     * 查看合同
     * @param paramContract
     */
    public showContract(paramContract: any): void {
        const params = Object.assign({}, paramContract, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, params).subscribe();
    }

    /**
     * 查看更多发票
     * @param paramItem
     */
    public viewMore(paramItem): void {
        if (typeof paramItem === 'string') {
            paramItem = JSON.parse(paramItem);
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            paramItem
        ).subscribe();
    }

    /**
     * 生成确认书并批量签署
     */
    public signContract(): void {
        this.xn.loading.open();
        this.xn.api.post(this.get_contract_url, { mainFlowIds: this.data.map((x: any) => x.mainFlowId) })
            .subscribe(x => {
                this.xn.loading.close();
                const contracts = x.data.contractList;
                contracts.isProxy = 14;

                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: '（盖章）'
                        };
                    }
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, contracts)
                    .subscribe(v => {
                        if (v === 'ok') {
                            // 保存合同信息
                            this.xn.api.post(this.get_contract2_url, {
                                mainFlowIds: this.data.map(main => main.mainFlowId),
                                contractList: contracts
                            }).subscribe(() => {
                                this.xn.user.navigateBack();
                            });
                        }
                    });
            });
    }

    /**
     * 判断数组
     * @param paramObj
     */
    public arrayLength(paramObj: any): boolean {
        if (!paramObj) {
            return false;
        }
        const obj =
            typeof paramObj === 'string'
                ? JSON.parse(paramObj)
                : JSON.parse(JSON.stringify(paramObj));
        return !!obj && obj.length > 2;
    }
}
