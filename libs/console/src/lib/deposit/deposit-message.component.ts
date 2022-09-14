import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {FormGroup} from '@angular/forms';
import {Component, OnInit, Output, EventEmitter, Input, AfterViewInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute, Params} from '@angular/router';
import {apiRoot} from 'libs/shared/src/lib/config/config';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';

/**
 *  保证金支付记录表
 */
@Component({
    selector: 'app-deposit-message',
    templateUrl: './deposit-message.component.html',
    styles: [
            `.flex {
            display: flex
        }

        .input-text {
            flex: 1;
            height: auto
        }

        .search-btn {
            width: 120px;
            height: 50px;
        }

        .title {
            font-size: 16px;
        }

        .box {
            border-top: 0;
            margin-top: 0px;
        }
        `
    ]
})
export class DepositMessageComponent implements OnInit, AfterViewInit {

    @Input() item: any;
    @Output() onChange: EventEmitter<any> = new EventEmitter(false);
    inputValue = '';
    tableTitle = '';
    baseInfo = [];
    rows = [];
    mainForm: FormGroup;
    // 合同
    public contracts: any;

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.init(params);

        });
    }

    ngAfterViewInit() {
        //
    }

    init(params) {
        this.xn.api.post('/yb/deposit/index/detail', {
            mainFlowId: params.mainFlowId
        }).subscribe(v => {
            this.buildForm(v.data.data);
            this.contracts = v.data.data.depositContracts;
        });
    }

    buildForm(info) {
        const extendInfo = info.extendInfo !== '' && JSON.parse(info.extendInfo);
        let honourInfo = extendInfo.honourInfo;
        honourInfo = honourInfo.map(v => {
            return {
                url: `${apiRoot}/attachment/view?key=${v.fileId}`,
                label: v.fileName,
                honourNum: v.honourNum,
                honourAmount: v.honourAmount,
                deposit: (Number(v.honourAmount) * Number(info.depositRate) / 100).toFixed(2)
            };
        });
        honourInfo = JSON.stringify(honourInfo);
        const status = XnFlowUtils.formatDepositMainFlowStatus(info.depositStatus);
        this.rows = [
            {
                title: '交易ID', checkerId: 'mainFlowId', type: 'text',
                data: info.mainFlowId
            },
            {
                title: '核心企业', checkerId: 'supplierOrgName', type: 'text',
                data: info.supplierOrgName
            },
            {
                title: '融资金额', checkerId: 'contractAmount', type: 'text',
                data: info.contractAmount,
                memo: '单元：元'
            },
            {
                title: '保证金比例', checkerId: 'depositRate', type: 'text',
                data: info.depositRate,
                memo: '%'
            },
            {
                title: '保证金', checkerId: 'deposit', type: 'text',
                data: info.deposit,
                memo: '单元：元'
            },
            {
                title: '交易状态', checkerId: 'depositStatus', type: 'xnDepositMainFlowStatus',
                data: status
            },
            {
                title: '交易创建时间', checkerId: 'createTime', type: 'date',
                data: info.createTime
            },
            {
                title: '交易完成时间', checkerId: 'depositFinishTime', type: 'date',
                data: info.depositFinishTime
            },
            {
                title: '电票详情', checkerId: 'depositHonour', type: 'depositHonour',
                data: honourInfo
            }
        ];
        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    goBack() {
        this.xn.user.navigateBack();
    }

}
