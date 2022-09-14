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
 * 1.0                 hucongying     重新生成付款确认书   2020-12-11
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { ActivatedRoute } from '@angular/router';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';

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
    public headquarters_sign = this.localStorageService.caCheMap.get('headquarters_sign'); // 获取签署付款确认书
    public update_qrs_contract = this.localStorageService.caCheMap.get('update_qrs_contract'); // 回传付款确认书


    constructor(public xn: XnService,
        private vcr: ViewContainerRef,
        public hwModeService: HwModeService,
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
     * 生成确认书并批量签署
     */
    public signContract(): void {
        this.xn.loading.open();
        this.xn.dragon.post(this.headquarters_sign, { mainFlowIdList: this.data.map((x: any) => x.mainFlowId) })
            .subscribe(x => {
                this.xn.loading.close();
                const contracts = x.data.contractList;
                contracts.isProxy = 56;

                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: '（盖章）'
                        };
                    }
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonFinancingContractModalComponent, contracts)
                    .subscribe(v => {
                        if (v === 'ok') {
                            // 回传付款确认书
                            this.xn.dragon.post(this.update_qrs_contract, {
                                contractList: contracts
                            }).subscribe(() => {
                                this.xn.user.navigateBack();
                            });
                        }
                    });
            });
    }

    /**
     *  判断数据是否长度大于显示最大值
     * @param value
     */
    public arrayLength(value: any) {
        let obj = [];
        if (JSON.stringify(value).includes('[')) {
            obj = typeof value === 'string'
                ? JSON.parse(value)
                : value;
        } else {
            obj = typeof value === 'string'
                ? value.split(',')
                : [value];
        }
        return obj;
    }

    /**
     *  查看更多发票
     * @param item
     */
    public viewMore(item) {
        if (typeof item === 'string') {
            item = JSON.parse(item);
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }
}
