import { Component, OnInit, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    template: `
    <div>
        <textarea readonly class="form-control xn-input-textarea xn-input-font xn-input-border-radius" rows="6">{{showValue}}</textarea>
        <span class="textarea-tip">{{inputLength}}/{{inputMaxLength}}</span>
    </div>
    <span class="xn-input-alert">{{alert}}</span>
    `,
    styles: [
        `.xn-input-textarea {
            resize: none
        }
        .textarea-tip {
            font-size: 14px;
            color: #ccc;
        }
        `
    ]
})
@DynamicForm({ type: 'text-area', formModule: 'default-show' })
export class TextareaLimitInputShowComponent implements OnInit, AfterViewInit {
    inputMaxLength = 255;
    inputLength = 0;
    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    showValue = '';
    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.showValue = this.row.data;
        this.inputLength = !!this.row.data ? String(this.row.data).length : 0;
        this.inputMaxLength = this.row.options && this.row.options?.inputMaxLength ?
        this.row.options.inputMaxLength : 255;
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngAfterViewInit(): void {
        /**
         * Internet Explorer 10、Firefox、Chrome 以及 Safari 支持 maxlength 属性。
         * Internet Explorer 9 以及更早的版本或 Opera 不支持 maxlength 属性。
         * 侦听input事件(firefox, safari...)和propertychange事件(IE)，限制textarea输入框的长度[maxlength]
         */
        // $("textarea").on('input propertychange', (e)=> {
        //     let maxLength = this.inputMaxLength;  //$(e.target).attr('maxlength');
        //     if ($(e.target).val().length > maxLength) {
        //         $(e.target).val($(e.target).val().substring(0, maxLength));
        //     }
        // });
    }

    // onBlur() {
    //     this.calcAlertClass();
    // }

    // calcAlertClass() {
    //     this.myClass = XnFormUtils.getClass(this.ctrl);
    //     this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    // }
}
