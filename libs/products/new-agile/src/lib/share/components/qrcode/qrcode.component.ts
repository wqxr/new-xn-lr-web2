import {Component, OnInit, Input, ViewContainerRef, Output, EventEmitter} from '@angular/core';

import * as cookie from 'cookie_js';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { QrcodeViewModalComponent } from 'libs/shared/src/lib/public/modal/qrcode-view-modal.component';

@Component({
    selector: 'app-new-agile-qrcode',
    templateUrl: './qrcode.component.html',
    styles: [
            `
            .qr {
                position: relative;
            }

            .qrbtn {
                position: absolute;
                right: 10px;
                top: 10px;
                width: 200px;
            }
        `
    ]
})
export class QrcodeComponent implements OnInit {
    @Input() recordId: string;
    @Input() checkers: any;
    @Input() procedure: any;
    isOperate = false;
    @Output() onChange: EventEmitter<any> = new EventEmitter(false);

    public constructor(private xn: XnService, private vcr: ViewContainerRef) {
        //
    }

    public ngOnInit() {
        this.isOperate = this.procedure.procedureId === 'operate';
    }

    uploadQr() {
        const factoryObj = this.checkers.find(v => v.checkerId === 'factoringApp');
        const factory = factoryObj.value && factoryObj.value.label || '';

        const payablesObj = this.checkers.find(v => v.checkerId === 'payables');
        const payables = payablesObj.value;

        const projectCompanyObj = this.checkers.find(v => v.checkerId === 'projectCompany');
        const projectCompany = projectCompanyObj.value;

        const contractNumObj = this.checkers.find(v => v.checkerId === 'contractFile');
        const contractNum = contractNumObj.value !== '' && JSON.parse(contractNumObj.value)[0].files.contractNum;

        const invoiceNumInfoObj = this.checkers.find(v => v.checkerId === 'invoiceNumInfo');
        const invoiceNumInfo = invoiceNumInfoObj.value !== '' && JSON.parse(invoiceNumInfoObj.value).list.map(v => v.invoiceNum);

        const obj = {
            recordId: this.recordId,
            supplier: this.xn.user.orgName,
            factoring: factory,
            payables,
            projectCompany,
            appId: this.xn.user.appId,
            contractNum,
            invoiceNumInfo
            // skey: cookie.get('skey') || ''
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, QrcodeViewModalComponent, obj).subscribe(v => {

        });
    }

    fresh() {
        this.onChange.emit();
    }
}
