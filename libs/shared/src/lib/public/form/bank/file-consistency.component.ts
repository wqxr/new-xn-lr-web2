import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
    selector: 'xn-file-consistency',
    template: `
        <span class="col-sm-4">商票数据信息检查：<i class="fa fa-2x" [ngClass]="{'text-success fa-check-circle-o': honourConsistent === 1, 'text-danger fa-times-circle-o': honourConsistent === 0, 'text-muted fa-circle-o': honourConsistent === -1}"></i></span>
        <span class="col-sm-4">合同数据信息检查：<i class="fa fa-2x" [ngClass]="{'text-success fa-check-circle-o': contractConsistent === 1, 'text-danger fa-times-circle-o': contractConsistent === 0, 'text-muted fa-circle-o': contractConsistent === -1}"></i></span>
        <span class="col-sm-4">发票数据信息检查：<i class="fa fa-2x" [ngClass]="{'text-success fa-check-circle-o': invoiceConsistent === 1, 'text-danger fa-times-circle-o': invoiceConsistent === 0, 'text-muted fa-circle-o': invoiceConsistent === -1}"></i></span>
    `,
    styles: [`
        span {
            font-size: 13px;
        }
    `]
})
export class FileConsistencyComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    ctl: any;

    contractConsistent = -1; // -1：未审核； 0： 不一致； 1 一致
    invoiceConsistent = -1; // -1：未审核； 0： 不一致； 1 一致
    honourConsistent = -1; // -1：未审核； 0： 不一致； 1 一致

    constructor(private publicCommunicateService: PublicCommunicateService) {
        //
    }

    ngOnInit() {
        if (!this.form) {
            this.initViewModel();
        } else {
            this.initFormModel();
        }
    }

    initFormModel() {
        this.ctl = this.form.get('checkPicTxt');

        this.publicCommunicateService.change.subscribe(v => {
            switch (v.type) {
                case 'contract':
                    this.contractConsistent = +v.consistent;
                    break;
                case 'invoice':
                    this.invoiceConsistent = +v.consistent;
                    break;
                case 'honour':
                    this.honourConsistent = +v.consistent;
                    break;
                default:
                    break;
            }

            this.setValue();
        });
    }

    initViewModel() {
        const data = JSON.parse(this.row.data);
        this.honourConsistent = data.honour;
        this.contractConsistent = data.contract;
        this.invoiceConsistent = data.invoice;
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
}
