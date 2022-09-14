import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewChild, AfterViewChecked } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from '../../dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';


@Component({
    template: `
    <div style='width:100%'>
        <div class="form-control xn-input-font xn-input-border-radius" style='display:inline-block;width:99%'>
            <div class="label-line">
                {{label}}
            </div>
        </div>
        <div style='display: inline-block;width: 1%;float: right;font-weight:200;padding-top:5px'>%</div>
    </div>
    `,

})
// 查看二维码checker项
@DynamicForm({ type: 'text-rate', formModule: 'default-show' })
export class VankeTextRateShowComponent implements  OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    label: any;

    constructor() {
    }

    ngOnInit() {
        this.label = this.row.data;
    }
}
