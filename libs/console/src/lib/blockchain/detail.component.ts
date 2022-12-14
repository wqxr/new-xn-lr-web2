import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute, Params} from '@angular/router';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import XnLogicUtils from 'libs/shared/src/lib/common/xn-logic-utils';

@Component({
    templateUrl: './detail.component.html',
    styles: [
        `.table-max {width: 100%; font-size: 12px;}`,
        `.table-max td { text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}`,
        `.xn-input-border-radius {border-style: dashed;}`,
        `.control-label { font-size: 13px; padding-top: 7px;}`,
        `.xn-panel-sm { margin-bottom: 10px;}`,
        `.xn-panel-sm .panel-heading { padding: 5px 15px;}`,
        `.xn-panel-sm .panel-heading .panel-title { font-size: 14px }`,
    ]
})
export class DetailComponent implements OnInit {

    ledgerId: string;
    id: string;

    info: any[] = [];
    times: any[] = [];
    factoring: any[] = [];
    supplier: any[] = [];

    operators: any[];
    files: any[];
    data: any;

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.ledgerId = params.ledger;
            this.id = params.id;

            let url, param;
            if (params.type === 'tid') {
                url = '/explorer/detail';
                param = {
                    ledgerId: this.ledgerId,
                    transactionDataId: this.id
                };
            } else {
                url = '/explorer/get_order';
                param = {
                    ledgerId: this.ledgerId,
                    orderId: this.id
                };
            }

            this.xn.api.post(url, param).subscribe(json => {
                // console.log(json.data);

                this.data = json.data;
                const data = json.data;
                const step = data.processNode;
                const factoring = data.factoring;
                const supplier = data.supplier;
                const privateData = data.orderPrivateData;
                const orderData = JSON.parse(privateData.orderData);

                this.addRow(this.info, '???????????????ID', data.ledgerId);
                this.addRow(this.info, '???????????????ID', data.orderId);
                this.addRow(this.info, '????????????', XnLogicUtils.formatBcOrderStatus(data.status));
                this.addRow(this.info, '????????????', orderData.contractAmount);
                this.addRow(this.info, '????????????ID', step.stepId);
                this.addRow(this.info, '??????????????????', step.stepaNme);
                this.addRow(this.info, '??????ID', orderData.recordId);
                this.addRow(this.info, '?????????', orderData.price);

                // ????????????
                this.addRowTime(this.times, '??????????????????', orderData.orderCreateTime);
                this.addRowTime(this.times, '??????????????????', orderData.signContractTime);
                this.addRowTime(this.times, '????????????', orderData.payTime);
                this.addRowTime(this.times, '????????????', orderData.lastPayBackTime);
                this.addRowTime(this.times, '??????????????????', orderData.orderEndTime);

                // ????????????
                this.addRow(this.factoring, '???????????????', factoring.orgName);
                this.addRow(this.factoring, '???????????????ID', factoring.orgId);

                this.addRow(this.supplier, '???????????????', supplier.orgName);
                this.addRow(this.supplier, '???????????????ID', supplier.orgId);


                // ??????????????????
                this.operators = privateData.operateInfos;

                // ????????????
                this.files = privateData.files;
            });
        });
    }

    private addRow(group, label, value) {
        group.push({
            label,
            data: value
        });
    }

    private addRowTime(group, label, value) {
        if (value === 0) {
            group.push({
                label,
                data: ''
            });
        }
        else {
            group.push({
                label,
                data: XnUtils.formatDatetime(value)
            });
        }
    }

    onBack() {
        this.xn.user.navigateBack();
    }

    onBlocks() {
        this.xn.router.navigate([`/console/blockchain/blocks/${this.data.ledgerId}/${this.data.orderId}`]);
    }
}
