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

                this.addRow(this.info, '区块链账本ID', data.ledgerId);
                this.addRow(this.info, '区块链订单ID', data.orderId);
                this.addRow(this.info, '订单状态', XnLogicUtils.formatBcOrderStatus(data.status));
                this.addRow(this.info, '合同金额', orderData.contractAmount);
                this.addRow(this.info, '当前步骤ID', step.stepId);
                this.addRow(this.info, '当前步骤名称', step.stepaNme);
                this.addRow(this.info, '记录ID', orderData.recordId);
                this.addRow(this.info, '折现率', orderData.price);

                // 时间信息
                this.addRowTime(this.times, '订单创建时间', orderData.orderCreateTime);
                this.addRowTime(this.times, '合同签署时间', orderData.signContractTime);
                this.addRowTime(this.times, '放款时间', orderData.payTime);
                this.addRowTime(this.times, '收款时间', orderData.lastPayBackTime);
                this.addRowTime(this.times, '订单结束时间', orderData.orderEndTime);

                // 机构信息
                this.addRow(this.factoring, '保理商名称', factoring.orgName);
                this.addRow(this.factoring, '保理商机构ID', factoring.orgId);

                this.addRow(this.supplier, '供应商名称', supplier.orgName);
                this.addRow(this.supplier, '供应商机构ID', supplier.orgId);


                // 历史步骤信息
                this.operators = privateData.operateInfos;

                // 文件信息
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
