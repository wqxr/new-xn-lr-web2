import {Directive, ElementRef, HostListener} from '@angular/core';

// 金额正则
const regex = new RegExp(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/);

/**
 *  金额输入指令
 */
@Directive({
    selector: '[appMoneyInputMask]'
})
export class MoneyMaskDirective {
    @HostListener('input', ['$event'])
    onInput(event) {
        const value = event.target.value;
        if (!regex.test(value)) {
            $(this.el.nativeElement).addClass('not-invalid');
            $(this.el.nativeElement).next().html('请输入正确金额');
        } else {
            $(this.el.nativeElement).removeClass('not-invalid');
            $(this.el.nativeElement).next().html('');
        }
    }

    constructor(private el: ElementRef) {
    }
}
