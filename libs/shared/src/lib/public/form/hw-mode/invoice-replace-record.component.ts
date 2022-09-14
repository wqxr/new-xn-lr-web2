import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import {ActivatedRoute} from '@angular/router';
import {InvoiceReplaceViewModalComponent} from './modal/invoice-replace-view-modal.component';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

@Component({
    selector: 'app-invoice-replace-record',
    templateUrl: './invoice-replace-record.component.html',
    styles: [
            `
            .xn-input-font {
                border: dashed #ccc 1px;
                background-color: #eee;
            }
            .table td ,  td span{
                word-break: break-all;
            }
        `
    ]
})
export class InvoiceReplaceRecordComponent implements OnInit {
    nowInvoiceListTheadText = [
        '序号',
        '发票回款日',
        '到期金额',
        '待替换发票金额',
        '替换发票金额',
        '操作'
    ];

    invoiceReplaceInfo = [
        '序号',
        '替换时间',
        '替换金额',
        '当前状态',
        '操作'
    ];

    data: any;
    orgType: number;
    mainFlowId: string;
    curInvoice: any;
    replaceInvoice: any;
    isShow: any;

    constructor(
        private xn: XnService,
        private loading: LoadingService,
        private vcr: ViewContainerRef,
        private activeRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.orgType = this.xn.user.orgType;
        this.activeRoute.params.subscribe(mainFlowId => {
            this.mainFlowId = mainFlowId.mainFlowId;
            this.xn.api
                .post(`/custom/direct_v3/project/replace_info`, mainFlowId)
                .subscribe(v => {
                    v.data.invoiceReplaceInfo = v.data.invoiceReplaceInfo.map(d => {
                        d.status === '0' ? d.statusTitle = '未通过' : d.statusTitle = '已通过';
                        return d;
                    });
                    v.data.receivableT = XnUtils.formatMoney(v.data.receivable);
                    v.data.nowReplaceMoneyT = XnUtils.formatMoney(v.data.nowReplaceMoney);
                    this.data = v.data;
                    this.isShow = v.data.isShow;
                    this.curInvoice = this.amountArr(v.data.nowInvoiceList, 'replaceMoney', 'dueMoney', 'deputeMoney');
                    this.replaceInvoice = this.amountArr(v.data.invoiceReplaceInfo, 'replaceMoney');
                });
        });
    }

    amountArr(...rect) {
        const len = rect.length;
        // 参数长度判断小于等于1，无效
        if (len <= 1) {
            return;
        }
        const result = {} as any;
        for (let i = 1; i < len; i++) {
            result[rect[i]] = 0;
        }
        rect[0].forEach(c => {
            for (let i = 1; i < len; i++) {
                result[rect[i]] += c[rect[i]];
            }
        });
        return result;
    }

    onCancel() {
        this.xn.user.navigateBack();
    }

    onReplace() {
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'financing_invoice_replace13',
                relate: 'mainFlowId',
                relateValue: this.mainFlowId,
                nextDate: this.data.nextDate,
                nowReplaceMoney: this.data.nowReplaceMoney
            }
        });
    }

    BalanceTransfer() {
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'factoring_left_change13',
                relate: 'mainFlowId',
                relateValue: this.mainFlowId,
                nextDate: this.data.nextDate,
                nowReplaceMoney: this.data.nowReplaceMoney
            }
        });
    }

    onViewInvoice(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceReplaceViewModalComponent, {
            mainFlowId: this.mainFlowId,
            backDate: item.backDate
        }).subscribe(() => {
        });
    }

    viewProcess(mainFlowId) {
        this.xn.router.navigate([
            `console/main-list/detail/${mainFlowId}`
        ]);
    }

    viewRecord(recordId) {
        this.xn.router.navigate(['console/record/view', recordId]
        );
    }

    entrustedPayment() {
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'factoring_depute_money13',
                relate: 'mainFlowId',
                relateValue: this.mainFlowId,
                nextDate: this.data.nextDate,
                nowReplaceMoney: this.data.nowReplaceMoney
            }
        });
    }
}
