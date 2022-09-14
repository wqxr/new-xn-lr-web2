/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：/promotion-information.modal.component.ts
 * @summary：万科供应商业务产品推介涵
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-16
 * **********************************************************************
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FactoringBusinessModel } from './factoring-business.model';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
// import { CNYCurrency, utils } from 'xmcommon';
@Component({
    selector: 'promotion-information-component',
    templateUrl: './promotion-information.modal.component.html',
    styles: [`
        .th-title {
            width: 20%;
        }
    `]
})

export class PromotionInformationModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public date = new Date().getTime();
    public params: FactoringBusinessModel = new FactoringBusinessModel();
    public pageTitle = '产品推介函';
    userName: string;
    mobile: string;
    /** 是否显示马上申请按钮 */
    isShowApplyButtom = false;
    /** 是否存在客户经理 */
    hasManager = false;
    /** 系统客户经理名称 */
    systemMgrName  = '';
    /** 系统客户经理电话 */
    systemMgrMobile  = '';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        this.xn.avenger.post('/sign_aggrement/bussiness_info/customerInfoEx', { appId: this.xn.user.appId }).subscribe(x => {
            if (x.data) {
                this.userName        = x.data.userName;
                this.mobile          = x.data.mobile;
                this.hasManager      = x.data.hasManager;
                this.systemMgrName   = x.data.systemMgrName;
                this.systemMgrMobile = x.data.systemMgrMobile;
                const data = {
                    customerName: this.xn.user.orgName,
                    userName    : this.userName,
                    mobile      : this.mobile,
                    time        : Date.now()
                };
                // 如果客户经理不存在，则使用系统经理
                if (!this.hasManager) {
                    data.userName = this.systemMgrName;
                    data.mobile   = this.systemMgrMobile;
                }
                this.params   = Object.assign({}, this.params, data);
            }
        });
    }

    /**
     *  模态框打开
     * @param params 事件触发模态框传递参数
     */
    public open(params?: any): Observable<any> {
        // tslint:disable-next-line:no-unused-expression
        !XnUtils.isEmptyObject(params) ? this.params = params : '';
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  发起申请 ，进入【万科供应商保理业务  签署合作协议流程】-【签署合同 - 供应商页面】
     * @param operate null | string    apply:发起申请，null:关闭
     */
    public handleClick(operate: null | string): void {
        if (operate === 'apply') {
            // todo 使用采购融资新的流程发起模板 AvengerNewComponent
            this.xn.router.navigate(['/console/record/avenger/new/supplier_sign_510'],
                { queryParams: { modelId: 'vanke_ht', version: 1 } });
            this.close(null);
        }
        this.close(null);
    }

    /**
     *  关闭弹框
     * @param paramValue
     */
    private close(paramValue) {
        this.modal.close();
        this.observer.next(paramValue);
        this.observer.complete();
    }
}
