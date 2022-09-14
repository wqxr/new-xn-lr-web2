import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

declare let $: any;

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(private xn: XnService) {
        const version = this.detectIE();

        if (version && version < 10) {
            this.xn.router.navigate([`/unsupported_browser`]);
        } else {
            // this.xn.router.navigate([`/`]);
        }
    }

    ngOnInit() {
        // 在启动时初始化日期组件的默认配置
        const defaults = $.fn.datepicker.defaults;
        defaults.autoclose = true;
        defaults.todayBtn = 'linked';
        defaults.todayHighlight = true;
        defaults.language = 'zh-CN';
    }

    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
     */
    private detectIE() {
        const ua = window.navigator.userAgent;

        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

        // Edge 12 (Spartan)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

        // Edge 13
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        const msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        const trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            const rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        const edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }
}
