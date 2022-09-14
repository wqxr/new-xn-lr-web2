import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'xn-service-fee-promise-pay',
    templateUrl: './service-fee-promise-pay.component.html',
    styleUrls: ['./service-fee-promise-pay.component.css']
})
export class ServiceFeePromisePayComponent implements OnInit {
    data: any;

    private flowId = 'service-fee-promise-pay';
    constructor(private xn: XnService, private route: ActivatedRoute) {}

    ngOnInit() {
        //
    }

    downloadTemplate() {
        const filename = '保证付款服务管理模板.xlsx';
        this.xn.api
            .download('/llz/promisepay/download_excel', {})
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }

    importData() {
        //
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'financing_payment_service',
                relate: 'financing_payment_service',
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
            .download('/llz/promisepay/download_list', {
                flowId: this.flowId
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }
}
