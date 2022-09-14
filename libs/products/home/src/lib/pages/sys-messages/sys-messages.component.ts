import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ApiService } from 'libs/shared/src/lib/services/api.service';

@Component({
    templateUrl: './sys-messages.component.html',
    styles: [
        `.table {
            font-size: 13px;
        }`,
    ]
})
export class SysMessagesComponent implements OnInit {
    public msgConfig: any; // 首页代办
    public countSysMsg: any;

    constructor(public xn: XnService, private api: ApiService,
        public localStorageService: LocalStorageService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe((config: any) => {
            this.msgConfig = config.sysMsg;
        });
    }

}
