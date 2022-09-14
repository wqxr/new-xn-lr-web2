import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from '../../services/xn.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
    selector: 'app-public-invoice-display-detail',
    templateUrl: './invoice-display-detail.component.html',
})
export class InvoiceDisplayDetailComponent implements OnInit {

    public jindieDetail: any;
    public tableTitle = '发票详情';

    constructor(public xn: XnService, public route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        // 获取的id
        const val = this.route.snapshot.paramMap.get('invoiceNum');
        const valCode = this.route.snapshot.paramMap.get('invoiceCode');
        this.showJdDetail(val, valCode);
    }

    // 显示金蝶验证详情
    public showJdDetail(val: string, valCode: any) {
        if (!!val) {
            this.xn.api.post('/ljx/invoice/invoice_message', {invoiceNum: val, invoiceCode: valCode}).subscribe(x => {
                this.jindieDetail = x.data;
            });
        }
    }

    // goback
    public goback() {
        window.history.back();
    }
}
