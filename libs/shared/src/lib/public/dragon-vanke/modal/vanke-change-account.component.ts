
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：银行账号选择
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-08-28
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { BankCardAddComponent } from './bank-card-add.component';
import { Observable, of } from 'rxjs';
import { DeletematerialEditModalComponent } from './delete-material-modal.component';
import { HwModeService } from '../../../services/hw-mode.service';

@Component({
    templateUrl: `./vanke-change-account.component.html`,
    selector: 'vanke-change-account',
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
export class VankeViewChangeAccountComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    // 数据
    // tslint:disable-next-line: no-use-before-declare
    label: string;
    // 数组字段
    heads: any[] = [];
    private observer: any;
    datalist01: any[] = [];
    orgName = '';
    appId = '';
    selectedItems: any[] = [];
    public params: any;
    first = 0;
    paging = 0; // 共享该变量
    pageSize = 10;
    beginTime: any;
    endTime: any;
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    total = 0;
    paramType: number;
    title = '';
    constructor(private xn: XnService,
                public hwModeService: HwModeService, private er: ElementRef, ) {
    }

    ngOnInit(): void {

    }






    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {

        this.params = params.params;
        if (this.params === '查看账号变更记录') {
            this.viewChangerecord(params.orgName);
        } else if (this.params === '查看账号使用记录') {
            this.viewUserecord(params.cardCode);
        }
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    viewChangerecord(paramValue) {
        this.xn.dragon.post('/pay_plan/account_change_record', { orgName: paramValue }).subscribe(x => {
            this.datalist01 = x.data;

        });
    }

    viewUserecord(paramValue) {
        this.xn.dragon.post('/pay_plan/account_history_record', { cardCode: paramValue }).subscribe(x => {
            this.datalist01 = x.data;
        });

    }

    oncancel() {
        this.modal.close();
    }
}
