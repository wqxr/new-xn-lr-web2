/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：InterestModalComponent
 * @summary：实收利息
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan             增加         2019-05-18
 * **********************************************************************
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {InsterestOutputModel} from './avenger-list-model';

@Component({
    selector: 'xn-interest-modal-component',
    template: `
        <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
            <modal-body>
                <div style="max-height: calc(100vh - 200px);overflow: auto;padding: 0 100px">
                    <h2 class="text-center">{{pageTitle}}</h2>
                    <div style="padding: 5px 50px">
                        <table class="table table-bordered text-center">
                            <tbody>
                                <tr>
                                    <td>实收保理使用费</td>
                                    <td>{{params.realFactoringFee}}</td>
                                </tr>
                                <tr>
                                    <td>实收保理服务费</td>
                                    <td>{{params.realFactoringServerFee}}</td>
                                </tr>
                                <tr>
                                    <td>实收平台使用费</td>
                                    <td>{{params.realPlatformFee}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </modal-body>
            <modal-footer>
                <div class="text-right">
                    <button type="button" class="btn btn-default" (click)="handleClick(null)">关闭</button>
                </div>
            </modal-footer>
        </modal>
    `
})

export class InterestModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    public observer: any;
    public params: InsterestOutputModel = new InsterestOutputModel();
    public pageTitle = '实收费用';

    constructor() {
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
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     * 关闭模态框，此弹窗内容保存在供应商首页消息列表。
     * @param operate null：关闭
     */
    public handleClick(operate: string | null) {
        if (operate === null) {
            this.close(null);
        }
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
