import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'xn-financing.manage',
    templateUrl: './financing-manage.component.html',
    styleUrls: ['./financing-manage.component.css']
})
export class FinancingManageComponent implements OnInit {
    data: any;

    private flowId = 'financing_management_service';
    constructor(private xn: XnService, private route: ActivatedRoute) {}

    ngOnInit() {
        //
    }

    downloadTemplate() {
        const filename = '银行融资管理模板.xlsx';
        this.xn.api
            .download('/llz/bank_financing/download_excel', {})
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }

    importData() {
        //
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'financing_management_service',
                relate: 'financing_management_service',
                relateValue: this.flowId
            }
        });
    }

    downloadData() {
        const appId = this.xn.user.appId;
        const orgName = this.xn.user.orgName;
        const time = new Date().getTime();
        const filename = `${appId}-${orgName}-银行融资管理-${time}.xlsx`;

        this.xn.api
            .download('/llz/bank_financing/download_list', {
                flowId: this.flowId
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }
}
