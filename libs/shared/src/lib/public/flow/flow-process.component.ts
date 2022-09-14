/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：flow-process.component.ts
 * @summary：业务流程进度提示
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-04-08
 * **********************************************************************
 */

import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-flow-process',
    templateUrl: './flow-process.component.html',
    styles: [
            `.tc-15-step {
            margin: 0 0;
            border: none;
            color: #00b9a3;
            padding: 5px 0 10px;
        }`,
    ]
})
export class FlowProcessComponent {
    // 交易进度
    @Input() steped: number;
    // 交易模式
    @Input() proxy: number;
}
