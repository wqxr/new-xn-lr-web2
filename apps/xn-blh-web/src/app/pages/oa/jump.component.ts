import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    template: '{{msg}}',
    styles: []
})
export class JumpComponent implements OnInit {

    msg = '';

    constructor(private xn: XnService, private activatedRoute: ActivatedRoute) {
        this.msg = '';
    }

    ngOnInit() {
        // 检查url参数，获取票据和要跳转的url
        this.activatedRoute.queryParams.subscribe(params => {
            if (!params.url) {
                this.msg = '缺少参数url';
                return;
            } else if (!params.ltpa) {
                this.msg = '缺少参数ltpa';
                return;
            }

            // 登录
            this.msg = '登录中...';
            this.xn.user.oaLogin(params.ltpa).subscribe(json => {
                // 登录成功
                this.xn.router.navigate([params.url]);
            });
        });
    }
}
