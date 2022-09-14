import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'xn-discount-manage',
    templateUrl: './discount-manage.component.html',
    styleUrls: ['./discount-manage.component.css']
})
export class DiscountManageComponent implements OnInit {
    data: any;

    private flowId = 'discount_management_service';
    constructor(private xn: XnService, private route: ActivatedRoute) {}

    ngOnInit() {
        //
    }

    downloadTemplate() {
        const filename = '银行保理保证管理模板.xlsx';
        this.xn.api
            .download('/llz/bank_discounting/download_excel', {})
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }

    importData() {
        //
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'discount_management_service',
                relate: 'discount_management_service',
                relateValue: this.flowId
            }
        });
    }

    downloadData() {
        const appId = this.xn.user.appId;
        const orgName = this.xn.user.orgName;
        const time = new Date().getTime();
        const filename = `${appId}-${orgName}-银行保理保证管理-${time}.xlsx`;

        this.xn.api
            .download('/llz/bank_discounting/download_list', {
                flowId: this.flowId
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }
}
