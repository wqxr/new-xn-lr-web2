import {Component, OnInit, Input, ViewContainerRef} from '@angular/core';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {PdfSignModalComponent} from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {HwModeService} from 'libs/shared/src/lib/services/hw-mode.service';

@Component({
    selector: 'xn-contract',
    templateUrl: './contract.component.html',
    styles: [
            `.control-label {
            font-size: 12px;
            font-weight: bold
        }

        .control-desc {
            font-size: 12px;
            padding-top: 7px;
            margin-bottom: 0;
            color: #999
        }

        .row {
            margin-bottom: 15px;
        }

        .down-btn {
            margin-left: 20px;
        }
        `
    ]
})
export class ContractComponent implements OnInit {

    @Input() set contracts(value) {
        if (XnUtils.isEmpty(value)) {
            this.rows = [];
        } else {
            this.rows = typeof value === 'string' ? JSON.parse(value) : value;
        }
    }

    public rows: any[] = [];

    constructor(private xn: XnService, private vcr: ViewContainerRef, private hwModeService: HwModeService) {
    }

    ngOnInit() {
        // if (XnUtils.isEmpty(this.contracts)) {
        //     this.rows = [];
        // } else {
        //     this.rows = JSON.parse(this.contracts);
        // }
        // this.rows = this.contracts;
        // console.log('合同显示', this.rows);
    }

    // 显示合同
    showContract(id, secret, label) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id,
            secret,
            label,
            readonly: true
        }).subscribe(v2 => {
            // 啥也不做
        });
    }

    // 下载合同
    downContract(val: any) {
        this.hwModeService.downContract(val.id, val.secret, val.label);
    }
}
