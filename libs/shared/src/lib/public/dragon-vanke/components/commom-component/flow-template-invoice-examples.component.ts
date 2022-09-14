/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：index.component.ts
 * @summary：供应商提交资料发票的查看示例
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          新增              2021-09-16
 * **********************************************************************
 */
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DragonPdfSignModalComponent } from '../../modal/pdf-sign-modal.component';
import { XnUtils } from '../../../../common/xn-utils';
import { XnService } from '../../../../services/xn.service';
import { XnModalUtils } from '../../../../common/xn-modal-utils';
import { HwModeService } from '../../../../services/hw-mode.service';
@Component({
    selector: 'flow-invoice-template',
    templateUrl: './flow-template-invoice-examples.component.html',
    styles: [
        `
        .helpUl {
            padding-left:20px;
        }
        .helpUl li{
            text-align:left;
          }
        `
    ]
})
export class FlowtemplateInvoiceExampleComponent implements OnInit {

    @Input() template: any;
    constructor(private xn: XnService, private vcr: ViewContainerRef, private hwModeService: HwModeService) {
    }
    ngOnInit() {
    }

}
