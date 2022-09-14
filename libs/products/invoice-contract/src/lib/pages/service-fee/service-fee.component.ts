import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'xn-service-fee',
    templateUrl: './service-fee.component.html',
    styleUrls: ['./service-fee.component.css']
})
export class ServiceFeeComponent implements OnInit {
    data: any;

    private flowId = 'platform_payment_service';
    constructor(private xn: XnService, private route: ActivatedRoute) {}

    ngOnInit() {
        //
    }

    downloadTemplate() {
        const filename = '平台服务费管理模板.xlsx';
        this.xn.api
            .download('/llz/platformpay/download_excel', {})
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }

    importData() {
        //
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'platform_payment_service',
                relate: 'platform_payment_service',
                relateValue: this.flowId
            }
        });
    }

    downloadData() {
        const appId = this.xn.user.appId;
        const orgName = this.xn.user.orgName;
        const time = new Date().getTime();
        const filename = appId + '-' + orgName + '-' + time + '.xlsx';

        this.xn.api
            .download('/llz/platformpay/download_list', {
                flowId: this.flowId
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }
}
