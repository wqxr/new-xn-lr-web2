/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：supplier-expiration-reminder-modal-component
 * @summary：供应商-保理业务到期提醒
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-18
 * **********************************************************************
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { FactoringBusinessExpirationRemindeModel } from './factoring-business.model';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

@Component({
    selector: 'xn-supplier-expiration-reminder-modal-component',
    template: `
        <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
            <modal-body>
                <div style="max-height: calc(100vh - 200px);overflow: auto;padding: 0 100px">
                    <h2 class="text-center">{{pageTitle}}</h2>
                    <p style="margin: 10px 0"><strong>尊敬的 {{params.supplierName}}：</strong></p>
                    <p class="xn-text-indent">
                        贵司有{{params.businessList.length}}笔保理业务即将到期，详情如下：
                    </p>
                    <div style="padding: 5px 0px">
                        <table class="table table-bordered text-center">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>涉及票据号码</th>
                            <th>金额</th>
                            <th>保理到期日</th>
                            <th>相关交易</th>
                        </tr>
                        </thead>
                            <tbody>
                            <ng-container *ngIf='params.businessList.length>0;'>
                            <tr *ngFor="let item of params.businessList;let i =index">
                            <td>{{i+1}}</td>
                                <td>
                                   {{item.honorNum}}
                                </td>

                             <td>
                                    {{item.receive | xnMoney}}
                                </td>

                                <td>{{item.receiveDate}}</td>

                                <td>
                                <ng-container *ngIf="item.mainFlowId.endsWith('cg')">
                                <a href="javaScript:void(0)"
                              (click)="hwModeService.viewProcess(item.mainFlowId,50)">{{item.mainFlowId}}</a>
                            </ng-container>
                            <ng-container *ngIf="!item.mainFlowId.endsWith('cg')">
                                <a href="javaScript:void(0)"
                              (click)="hwModeService.viewProcess(item.mainFlowId)">{{item.mainFlowId}}</a>
                            </ng-container>
                                </td>
                            </tr>
                            </ng-container>
                            </tbody>
                        </table>
                    </div>
                    <div class="text-right">
                        <p><strong>链融科技供应链服务平台</strong></p>
                        <p><strong>{{params.time | xnDate :'zh-cn'}}</strong></p>
                    </div>
                </div>
            </modal-body>
            <modal-footer>
                <div class="text-center">
                    <button type="button" class="btn btn-default" (click)="handleClick(null)">关闭</button>
                </div>
            </modal-footer>
        </modal>

    `
})
// 在商票到期前 T-7，T-2，T日 给【万科供应商保理业务】的【供应商】发送此弹窗，及短信，短信发送对象
export class SupplierExpirationReminderModalComponentComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    public observer: any;
    public params: FactoringBusinessExpirationRemindeModel = new FactoringBusinessExpirationRemindeModel();
    public pageTitle = '保理业务到期提醒';

    constructor(private xn: XnService, public hwModeService: HwModeService) {
    }

    ngOnInit() {

    }

    /**
     *  模态框打开
     * @param params 事件触发模态框传递参数
     */
    public open(params?: any): Observable<any> {
        // tslint:disable-next-line:no-unused-expression
        !XnUtils.isEmptyObject(params) ? this.params = params : '';
        this.params.businessList = params;
        this.params = Object.assign({}, this.params, { supplierName: this.xn.user.orgName, time: new Date().getTime() });
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     * 关闭模态框，此弹窗内容保存在供应商首页消息列表。
     * @param operate
     */
    public handleClick(operate: string | null) {
        // tslint:disable-next-line:no-unused-expression
        operate === null ? this.close(null) : '';
    }

    /**
     *  查看发票信息
     * @param paramInvoiceInfo
     */
    public viewInvoice(paramInvoiceInfo) {

    }

    /**
     *  查看流程信息
     * @param paramMainFlowInfo
     */
    public viewMainFlow(paramMainFlowInfo) {
        this.xn.router.navigate([`console/main-list/detail/${paramMainFlowInfo}`]);
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
