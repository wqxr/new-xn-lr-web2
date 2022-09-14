/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：VankeYjlSupplierSignComponent
 * @summary：雅居乐，供应商补充协议【暂时存在】
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-03-22
 * **********************************************************************
 */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute, Params } from '@angular/router';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { FormGroup } from '@angular/forms';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';

@Component({
    templateUrl: `./vanke-yjl-supplier-sign.component.html`
})

export class VankeYjlSupplierSignComponent implements AfterViewInit, AfterViewChecked {
    constructor(private xn: XnService,
        private route: ActivatedRoute,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef) {
    }

    private mainFlowId = '';
    public shows: any[] = [];
    public mainForm: FormGroup;
    public contracts: any[] = [];


    ngAfterViewInit() {
        this.route.params.subscribe((params: Params) => {
            this.mainFlowId = params.id;
            this.showLists(this.mainFlowId);
            this.buildForm();
        });
    }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    /**
     *  提交并签署合同
     */
    public handleSubmit() {
        const cons = this.contracts;
        cons.forEach(element => {
            if (!element.config) {
                element.config = {
                    text: ''
                };
            }
        });
        cons.forEach(x => {
            x.config.text = '转让方（全称）';
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, cons)
            .subscribe(x => {
                if (x === 'ok') {
                    this.xn.api.post('/custom/vanke_v5/yjl_add/supplier_sign', { mainFlowId: this.mainFlowId })
                        .subscribe(() => {
                            this.xn.user.navigateBack();
                        });
                }
            });
    }

    /**
     *  返回
     */
    handleCancel() {
        this.xn.user.navigateBack();
    }

    /**
     *  显示checkers,构建formGroup,获取合同
     */
    private showLists(id: string): void {
        this.xn.loading.open();
        this.shows = [
            {
                checkerId: 'mainFlowId',
                required: false,
                type: 'text',
                options: { readonly: true },
                title: '交易ID',
            },
            {
                checkerId: 'debtUnit',
                required: false,
                type: 'text',
                title: '供应商',
                options: { readonly: true },
            },
            {
                checkerId: 'factoringAppName',
                required: false,
                type: 'text',
                title: '保理商',
                options: { readonly: true },
            }, {
                checkerId: 'assigneePrice',
                required: false,
                type: 'text',
                title: '利率',
                options: { readonly: true },
            }, {
                checkerId: 'receivable',
                required: false,
                type: 'money',
                title: '应收账款金额',
                options: { readonly: true },
            },
        ];
        this.xn.api.post('/custom/vanke_v5/yjl_add/supplier_list', { mainFlowId: id })
            .subscribe(res => {
                if (res.data && res.data.data) {
                    const obj = res.data.data;
                    this.contracts = res.data.contracts || [];
                    this.shows.forEach(sw => {
                        sw.value = obj[sw.checkerId];
                    });
                    this.buildForm();
                }
            }, (err) => {
            }, () => {
                this.xn.loading.close();
            });
    }

    private buildForm() {
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
