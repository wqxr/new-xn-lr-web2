/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：多标签页列表项 根据TabConfig.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-05-13
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    templateUrl: `./customer-whiteStatus.modal.component.html`,
    selector: 'customer-whiteStatus-table',
    styles: [`
    .modal-title{
        height:50px;
    }
        .title {
            font-weight:bold;
        }
        ul>li{
            list-style:none;
            font-weight:bold;
        }
        .label {
            font-weight: normal;
            flex: 1;
            color: black;
        }

        .flex {
            display: flex;
        }

        .input-check {
            width: 100px;
        }

        .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            /*position: relative;*/
            cursor: pointer
        }

        .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            font-family: 'Glyphicons Halflings';
            opacity: 0.5;
        }

        .table-head .sorting:after {
            content: "\\e150";
            opacity: 0.2
        }

        .table-head .sorting_asc:after {
            content: "\\e155"
        }

        .table-head .sorting_desc:after {
            content: "\\e156"
        }
    `]
})
export class CustomerWhiteStatusModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    // 数据
    // tslint:disable-next-line: no-use-before-declare
    label: string;
    // 数组字段
    heads: any[] = [];
    private observer: any;
    datalist01: any[] = [];
    datalist02: any[] = [];
    orgName = '';
    appId = '';
    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, ) {
    }

    ngOnInit(): void {
    }

    /**
       * 打开查看窗口
       * @param params
       * @returns {any}
       */
    open(params: any): Observable<any> {
        this.orgName = params.orgName;
        this.appId = params.appId;
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
            // 白名单请求接口：
            this.xn.api.post('/custom/avenger/customer_manager/white_history', {
                appId: this.appId
            }).subscribe(data => {
                this.datalist01 = data.data.whiteInfo.map(temp => {
                    let objResult = {} as any;
                    switch (temp.status) {
                        case 2: objResult = { whiteStatus: '人工白名单', date: temp.createTime ,
                        person: temp.person, recordId: temp.recordId}; break;
                        case 1: objResult = { whiteStatus: '系统白名单', date: temp.createTime ,
                        person: temp.person, recordId: temp.recordId}; break;
                        case 0: objResult = { whiteStatus: '非白名单', date: temp.createTime,
                        person: temp.person, recordId: temp.recordId }; break;
                    }
                    return objResult;
                });
                this.datalist02 = data.data.fkWhiteInfo.map(temp => {
                    let objResult = {} as any;
                    switch (temp.whiteStatus) {
                        case 1: objResult = { whiteStatus: '系统白名单', date: temp.dt }; break;
                        case 0: objResult = { whiteStatus: '非白名单', date: temp.dt }; break;
                    }
                    return objResult;
                });

            });
        });
    }
    oncancel() {
        this.modal.close();
    }
    onOk() {
        this.modal.close();
        this.observer.next({ action: 'ok' });
        this.observer.complete();
    }

    // 查看流程详情
    openCompanyDetail(item: any) {
        // 模态框跳转路由之前，应该先将订阅的观察者结束，才能跳转路由；
        this.observer.complete();
        this.xn.router.navigate([`console/record/view/${item.recordId}`]);
    }
}
