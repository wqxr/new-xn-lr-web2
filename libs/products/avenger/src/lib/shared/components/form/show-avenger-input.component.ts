/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：show-avenger-input-component.ts
 * @summary：提交记录显示组件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-09
 * **********************************************************************
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';


@Component({
    selector: 'xn-show-avenger-input-component',
    templateUrl: './show-avenger-input.component.html',
    styleUrls: ['./show-avenger-input.component.css']
})

export class ShowAvengerInputComponent implements OnInit {

    // 当前行信息
    @Input() row: any;
    // 表单组
    @Input() form: FormGroup;
    @Input() memo: string;
    @Input() svrConfig: any;
    @Input() mainFlowId: string;

    constructor() {
    }

    ngOnInit(): void {
        if (!isNullOrUndefined(this.memo)) {
            this.row.type = 'textarea';
        } else if (isNullOrUndefined(this.row) || isNullOrUndefined(this.row.data)) {
            this.row.type = this.row && this.row.type || 'text';
            // this.label = '未填写';
        }
    }
}
