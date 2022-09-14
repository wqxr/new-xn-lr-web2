import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
    selector: 'xn-file-logical',
    template: `
            <div class="col-sm-4 info">
                <span class="col-sm-12">合同签订日: </span><span class="col-sm-12 text-info">{{ contract.date }}&nbsp;</span>
                <span class="col-sm-12">发票日期: </span><span class="col-sm-12 text-info">{{ invoice.date }}&nbsp;</span>
                <span class="col-sm-12">商票出票日：</span><span class="col-sm-12 text-info">{{ honour.date }}&nbsp;</span>
            </div>

            <div class="col-sm-4 info">
                <span class="col-sm-12">合同买方: </span><span class="col-sm-12 text-info">{{ contract.contractBuyer }}&nbsp;</span>
                <span class="col-sm-12">发票购方: </span><span class="col-sm-12 text-info">{{ invoice.buyer }}&nbsp;</span>
                <span class="col-sm-12">背书人： </span><span class="col-sm-12 text-info">{{ honour.owner }}&nbsp;</span>
            </div>

            <div class="col-sm-4 info">
                <span class="col-sm-12">合同卖方: </span><span class="col-sm-12 text-info">{{ contract.supplier }}&nbsp;</span>
                <span class="col-sm-12">发票销方: </span><span class="col-sm-12 text-info">{{ invoice.supplier }}&nbsp;</span>
                <span class="col-sm-12">持票人： </span><span class="col-sm-12 text-info">{{ honour.acceptorName }}&nbsp;</span>
            </div>

            <div class="col-sm-4">
                <select name="honour" class="form-control" [disabled]="viewModel" [(ngModel)]="honourConsistent" (change)="onChange($event)">
                    <option value="-1">请选择</option>
                    <option value="1">通过</option>
                    <option value="0">不通过</option>
                </select>
            </div>

            <div class="col-sm-4">
                <select name="contract" class="form-control" [disabled]="viewModel" [(ngModel)]="contractConsistent" (change)="onChange($event)">
                    <option value="-1">请选择</option>
                    <option value="1">通过</option>
                    <option value="0">不通过</option>
                </select>
            </div>

            <div class="col-sm-4">
                <select id="invoice" class="form-control" [disabled]="viewModel"  [(ngModel)]="invoiceConsistent" (change)="onChange($event)">
                    <option value="-1">请选择</option>
                    <option value="1">通过</option>
                    <option value="0">不通过</option>
                </select>
            </div>
    `,
    styles: [
        `
            span.col-sm-12 {
                padding: 0;
                font-size: 13px;
            }
            .info {
                height: 112px;
            }
            .text-info {
                text-indent: 1em;
            }
        `
    ]
})
export class FileLogicalComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    ctl: any;

    viewModel = false;

    contractConsistent = -1; // -1：未审核； 0： 不一致； 1 一致
    invoiceConsistent = -1; // -1：未审核； 0： 不一致； 1 一致
    honourConsistent = -1; // -1：未审核； 0： 不一致； 1 一致

    honour = {
        date: '',
        acceptorName: '',
        owner: ''
    };
    invoice = {
        date: '',
        buyer: '',
        supplier: ''
    };
    contract = {
        date: '',
        contractBuyer: '',
        supplier: ''
    };

    logicalInfo = {
        contract: {
            contractDate: '',
            contractBuyer: '',
            supplier: ''
        },
        invoice: {
            invoiceDate: '',
            invoiceBuyer: '',
            supplier: ''
        },
        honour: {
            honourDate: '',
            honourBuyer: '',
            supplier: ''
        }
    };

    constructor(
        private xn: XnService,
        private route: ActivatedRoute,
        private publicCommunicateService: PublicCommunicateService
    ) {
        //
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            const recordId = params.id;
            this.xn.api
                .post('/record/record?method=show_submit', {
                    recordId
                })
                .subscribe(json => {
                    if (json && json.data && json.data.actions) {
                        const checkers = [...json.data.actions[0].checkers];
                        const contractObj = checkers.find(
                            (x: any) => x.checkerId === 'contractFile'
                        );
                        const invoiceObj = checkers.find(
                            (x: any) => x.checkerId === 'invoiceFile'
                        );
                        const honourObj = checkers.find(
                            (x: any) => x.checkerId === 'honourFile'
                        );

                        if (contractObj) {
                            const data = JSON.parse(contractObj.data);
                            this.contract.date = this.getRangeDateString(
                                data,
                                'contractDate'
                            );
                            this.contract.contractBuyer =
                                data[0].contractBuyer;
                            this.contract.supplier = data[0].supplier;
                        }

                        if (invoiceObj) {
                            const data = JSON.parse(invoiceObj.data);
                            this.invoice.date = this.getRangeDateString(
                                data,
                                'invoiceDate'
                            );
                            this.invoice.buyer = data[0].buyer;
                            this.invoice.supplier = data[0].supplier;
                        }

                        if (honourObj) {
                            const data = JSON.parse(honourObj.data);
                            this.honour.date = this.getRangeDateString(
                                data,
                                'honourDate'
                            );
                            // 业务数据来源不清，暂为空
                            this.honour.acceptorName = ''; // data[0]['acceptorName'];
                            this.honour.owner = ''; // data[0]['owner'];
                        }
                    }
                });
        });

        if (!this.form) {
            this.viewModel = true;
            this.initViewModel();
        } else {
            this.ctl = this.form.get('checkTrade');
            this.ctl.reset();
        }
    }

    initViewModel() {
        const data = JSON.parse(this.row.data);
        this.honourConsistent = data.honour;
        this.contractConsistent = data.contract;
        this.invoiceConsistent = data.invoice;
    }

    onChange(e) {
        const value = +e.target.value;
        if (value < 0) {
            this.ctl.setErrors({ invalid: true });
        } else {
            this.setValue();
        }
    }

    setValue() {
        const data = {
            honour: this.honourConsistent,
            invoice: this.invoiceConsistent,
            contract: this.contractConsistent
        };
        this.ctl.setValue(data);

        if (
            this.honourConsistent > 0 &&
            this.invoiceConsistent > 0 &&
            this.contractConsistent > 0
        ) {
            this.ctl.setErrors(null);
        } else {
            this.ctl.setErrors({ invalid: true });
        }
    }

    private getRangeDateString(data, dateKey) {
        const date = [...data].map((x: any) => x[dateKey]).sort((d1, d2) => {
            return d1 - d2;
        });

        return `${date[0]} - ${date[date.length - 1]}`;
    }
}
