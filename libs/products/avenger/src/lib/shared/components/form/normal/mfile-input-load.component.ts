/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AvengerMFileInputComponent
 * @summary：文件上传，批量 type = 'mfile'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-04-22
 * **********************************************************************
 */

import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { FormGroup} from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

declare let $: any;

@Component({
    selector: 'xn-avenger-mfileload-input-component',
    styles: [`
     .editor_view {    width: 100px;
        position: absolute;
        top: 5px;
        left: 800px;}`
    ],
    template: `
        <app-xn-mfile-input [row]="row" [form]="form"></app-xn-mfile-input>
        <a href='javascript:void(0)'  (click)='loadtemplate()' class='editor_view' (click)='download()'>点击下载此模板</a>`,
})
@DynamicForm({ type: 'guaranteePhotocopy', formModule: 'avenger-input' })
export class AvengerMFileInputloadComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    ngOnInit() {
        this.row.isAvenger = true;
    }
    loadtemplate(){

    }
    download(){

    }
}
