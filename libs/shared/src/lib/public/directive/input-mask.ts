import {Directive, ElementRef} from '@angular/core';
import * as inputmask from 'inputmask';

/**
 *  手机号输入指令
 */
@Directive({
    selector: '[appInputMask]'
})
export class InputMaskDirective {
    constructor(private el: ElementRef) {
        const mask = new inputmask({mask: '999[-9999][-9999]', greedy: false, showMaskOnFocus: false, showMaskOnHover: false});
        mask.mask(this.el.nativeElement);
    }
}
