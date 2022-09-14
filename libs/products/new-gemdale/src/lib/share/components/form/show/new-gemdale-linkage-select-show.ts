import { Component, OnInit, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
declare const $: any;


@Component({
    template: `
    <div class="row">
        <div class="col-md-6 xn-dselect-first">
            <div class="form-control xn-input-font xn-input-border-radius">
                <div class="label-line">
                    {{firstSelectValue | xnSelectTransform: row.options.ref }}
                </div>
            </div>
        </div>
        <div class="col-md-6 xn-dselect-second">
            <div class="form-control xn-input-font xn-input-border-radius">
                <div class="label-line">
                    {{secondSelectValue}}
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
    .xn-dselect-first {
        padding-right: 2px;
    }
    .xn-dselect-second {
        padding-left: 2px;
    }
    `]
})
// 查看二维码checker项
@DynamicForm({ type: 'linkage-select-jd', formModule: 'dragon-show' })
export class NewGemdalelinkageSelectShowComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    firstSelectValue: number;
    secondSelectValue = '';

    constructor() {
    }

    ngOnInit() {
        // 设置初始值
        if (!!this.row.data) {
            const reason = JSON.parse(this.row.data);
            // 金地-渠道展示处理
            this.firstSelectValue = Number(reason.type);
            this.secondSelectValue =
                this.fnTransform({ proxy: this.firstSelectValue, status: Number(reason.selectBank) }, this.row.options.ref);
        }
    }

    /**
     * 将 [{label:'是',value:'1',children:[{...}]}]枚举转换根据value 值显示label 标签
     * 或者 string : ref 键值对在select-options 中的配置属性名
     * @param value
     * @param param
     */
    public fnTransform(value: { proxy: any, status: any }, param: string): string {
        if (!param || !value || value && !value.status) {
            return '';
        }
        const obj = $.extend(true, {}, value);
        const hasChildren = SelectOptions.get(param).filter((pro) => pro.children && pro.children.length > 0).map((y) => Number(y.value));
        const noChildren = SelectOptions.get(param).filter((pro) => !pro.children || pro.children && !pro.children.length).map((y) => Number(y.value));
        if (noChildren.includes(Number(obj.proxy))) {
            return '';
        } else if (hasChildren.includes(Number(obj.proxy))) {
            const children = SelectOptions.get(param).find((pro) => Number(pro.value) === Number(obj.proxy)).children;
            const chidLabel = children.find((child) => Number(child.value) === Number(obj.status)).label;
            return chidLabel;
        } else {
            return '';
        }
    }
}
