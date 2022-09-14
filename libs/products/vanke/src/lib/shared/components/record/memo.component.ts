/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\vanke\src\lib\shared\components\record\memo.component.ts
* @summary：万科流程退回原因展示组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-08-24
***************************************************************************/

import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'xn-vanke-memo-component',
    templateUrl: './memo.component.html',
    styles: [
            `.xn-input-border-radius {
            border-style: dashed;
        }

        .xn-show-input-textarea {
            background-color: #ffffff;
            border-style: dashed;
            resize: none
        }`
    ]
})
export class VankeMemoComponent implements OnInit {

    @Input() memo: string;
    /**
     *  1=普通字符串 2=是下面的JSON字符串
     *  {
     *         operatorName: '',
     *         operatorTime: '',
     *         operatorMemo: '',
     *         reviewerName: '',
     *         reviewerTime: '',
     *         reviewerMemo: ''
     *     }
     */
    type: number;
    data: any; // 具体的数据

    constructor() {
    }

    ngOnInit() {
        const pos = this.memo.indexOf(';');
        if (pos > 0) {
            const s = this.memo.substring(0, pos).trim();
            const type = parseInt(s, 0);
            if (type >= 1 && type <= 2) {
                this.type = type;
                const data = this.memo.substring(pos + 1).trim();
                if (type === 1) {
                    this.data = data;
                } else if (type === 2) {
                    this.data = JSON.parse(data);
                }
            } else {
                this.type = 1;
                this.data = this.memo;
            }
        } else {
            this.type = 1;
            this.data = this.memo;
        }
    }
}
