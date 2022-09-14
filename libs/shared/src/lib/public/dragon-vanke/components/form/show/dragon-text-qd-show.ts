/*
 * @Description: 
 * @Version: 1.0
 * @Author: yutianbao
 * @Date: 2020-09-21 19:37:47
 * @LastEditors: yutianbao
 * @LastEditTime: 2020-11-27 17:28:49
 * @FilePath: \xn-lr-web2\libs\shared\src\lib\public\dragon-vanke\components\form\show\dragon-text-qd-show.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */
import { Component, OnInit, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';

@Component({
    selector: 'dragon-text-qd-show',
    template: `
    <div style='width:100%'>
        <div class="form-control xn-input-font xn-input-border-radius">
            <div class="label-line">
                {{label | xnSelectDeepTransform:selectOption}}
            </div>
        </div>
    </div>
    `,
})
// 查看二维码checker项
@DynamicForm({ type: 'text-qd', formModule: 'dragon-show' })
export class VanketextQdShowComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    label: any;
    selectOption: string = 'productType_sh'

    constructor() {
    }

    ngOnInit() {
        if (!!this.row.data) {
            this.label = JSON.parse(this.row.data);
        }
        this.selectOption = this.row.options['ref'] ? this.row.options['ref'] : 'productType_sh';
    }
}
