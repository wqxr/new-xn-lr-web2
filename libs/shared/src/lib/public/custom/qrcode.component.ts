import {Component, OnInit, Input, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import {XnService} from '../../services/xn.service';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {QrcodeViewModalComponent} from '../modal/qrcode-view-modal.component';

declare const cookie: any;

@Component({
    selector: 'app-qrcode',
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
    isfinancing6 = false;
    @Output() onChange: EventEmitter<any> = new EventEmitter(false);

    public constructor(private xn: XnService, private vcr: ViewContainerRef) {
        //
    }

    public ngOnInit() {
        this.isOperate = this.procedure.procedureId === 'operate';
        this.isfinancing6 = this.procedure.flowId === 'financing6';
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
