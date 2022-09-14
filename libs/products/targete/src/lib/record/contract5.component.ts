/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract5.component.ts
 * @summary：查看合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          代码格式化         2019-04-08
 * **********************************************************************
 */

import {Component, Input, ViewContainerRef} from '@angular/core';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {PdfSignModalComponent} from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'xn-contract5',
    templateUrl: './contract5.component.html',
    styles: [
            `.control-label {
            font-size: 12px;
            font-weight: bold
        }

        .control-desc {
            font-size: 12px;
            padding-top: 7px;
            margin-bottom: 0;
            color: #999
        }

        .row {
            margin-bottom: 15px;
        }

        .down-btn {
            margin-left: 20px;
        }
        `
    ]
})
export class Contract5Component {

    @Input() set contracts(value) {
        if (XnUtils.isEmpty(value)) {
            this.rows = [];
        } else {
            this.rows = JSON.parse(value);
        }
    }

    public rows: any[] = [];

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    /**
     *  查看
     * @param id
     * @param secret
     * @param label
     */
    public showContract(id, secret, label) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id: id,
            secret: secret,
            label: label,
            readonly: true
        }).subscribe(() => {
        });
    }
}
