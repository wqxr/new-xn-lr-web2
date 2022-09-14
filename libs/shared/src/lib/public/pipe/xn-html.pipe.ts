import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({name: 'xnHtml'})
export class XnHtmlPipe implements PipeTransform {
    constructor(protected dom: DomSanitizer) {
    }

    transform(html: string): SafeHtml {
        return this.dom.bypassSecurityTrustHtml(html);
    }
}
