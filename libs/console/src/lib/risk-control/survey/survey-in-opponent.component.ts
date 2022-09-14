import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {LinkOutputModel, OpponentOutputModel, StreamOutputModel} from '../model/opponent';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {OpponentModalComponent} from './opponent-modal.component';
import {OpponentEnum} from '../enum/risk-control-enum';
import {BigDataListModel} from '../risk-control.service';

/**
 *  交易对手
 */
@Component({
    selector: 'app-survey-in-opponent',
    templateUrl: './survey-in-opponent.component.html',
    styles: [
            `.title {
            font-size: 16px;
            padding: 10px 0;
            font-weight: bold
        }

        .label-text {
            background-color: #F2F9FC
        }

        .table th, .table td {
            vertical-align: middle;
        }

        .table tbody tr.selected {
            background-color: #9cccee;
        }

        .table tbody tr:hover {
            cursor: pointer;
        }
        `
    ],
})
export class SurveyInOpponentComponent implements OnInit {
    @Input() customerInfo: BigDataListModel;
    info: OpponentOutputModel = new OpponentOutputModel();
    // 请求url
    postUrl = {
        upStream: {
            get: '/yb/risk1/big_customer/get_data_top',
            add: '/yb/risk1/big_customer/add_data_top',
            edit: '/yb/risk1/big_customer/update_data_top',
            delete: '/yb/risk1/big_customer/delete_data_top'
        },
        downStream: {
            get: '/yb/risk1/big_customer/get_data_bottom',
            add: '/yb/risk1/big_customer/add_data_bottom',
            edit: '/yb/risk1/big_customer/update_data_bottom',
            delete: '/yb/risk1/big_customer/delete_data_bottom'
        },
        link: {
            get: '/yb/risk1/related_transaction/get_data',
            add: '/yb/risk1/related_transaction/add_data',
            edit: '/yb/risk1/related_transaction/update_data',
            delete: '/yb/risk1/related_transaction/delete_data'
        },
    };
    checkers = {
        upStream: [
            {checkerId: 'companyName', title: '企业名称', type: 'text'},
            {checkerId: 'registerMoney', title: '注册资本', type: 'money'},
            {checkerId: 'managementForms', title: '经营状态', type: 'text'},
            {checkerId: 'tradeProportion', title: '交易比重', type: 'text'},
            {checkerId: 'establishmentDate', title: '成立日期', type: 'date'},
            {checkerId: 'compayType', title: '公司类型', type: 'text'},
            {checkerId: 'industryInvolved', title: '所属行业', type: 'dselect', options: {ref: 'orgIndustry'}},
            {checkerId: 'areaInvolved', title: '所属地区', type: 'dselect', options: {ref: 'chinaCity'}},
            {checkerId: 'mainProduct', title: '主要产品', type: 'text'},
        ],
        downStream: [
            {checkerId: 'companyName', title: '企业名称', type: 'text'},
            {checkerId: 'registerMoney', title: '注册资本', type: 'money'},
            {checkerId: 'managementForms', title: '经营状态', type: 'text'},
            {checkerId: 'tradeProportion', title: '交易比重', type: 'text'},
            {checkerId: 'establishmentDate', title: '成立日期', type: 'date'},
            {checkerId: 'compayType', title: '公司类型', type: 'text'},
            {checkerId: 'industryInvolved', title: '所属行业', type: 'dselect', options: {ref: 'orgIndustry'}},
            {checkerId: 'areaInvolved', title: '所属地区', type: 'dselect', options: {ref: 'chinaCity'}},
            {checkerId: 'mainProduct', title: '主要产品', type: 'text'},
        ],
        link: [
            {checkerId: 'companyName', title: '企业名称', type: 'text'},
            {checkerId: 'dealCounts', title: '交易笔数', type: 'text'},
            {checkerId: 'dealMoney', title: '交易金额', type: 'money'},
            {checkerId: 'tradeProportion', title: '一年内交易比重', type: 'text'},
        ]
    };
    inputValue: any; // 导入数据

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        // 获取数据
        this.init('upStream');
        this.init('downStream');
        this.init('link');
    }

    /**
     *  上游五大企业
     * @param type 操作类型 ['add','edit','delete']
     * @param table 显示表单 ['upStream','downStream','link']
     */
    streamClick(type: any, table: string) {
        const find = this.info[table].find((x: any) => x.selected === true);
        // 新增、修改
        const value = {
            upStream: {
                add: new StreamOutputModel(),
                edit: find
            }, downStream: {
                add: new StreamOutputModel(),
                edit: find
            }, link: {
                add: new LinkOutputModel(),
                edit: find
            },

        };
        // 更新，删除 id
        const paramsDel = {
            upStream: {bigCustomerId: find ? find.bigCustomerId : ''},
            downStream: {bigCustomerId: find ? find.bigCustomerId : ''},
            link: {
                relatedTransactionId: find ? find.relatedTransactionId : ''
            }
        };
        const params = {type, table, value: value[table][type], checkers: this.checkers[table]};
        if (type === 'delete') {
            this.xn.api.post(this.postUrl[table][type], paramsDel[table]).subscribe(() => {
                this.init(table);
            });
        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, OpponentModalComponent, params).subscribe(x => {
                if (x && x.action && x.action === 'ok') {
                    const params1 = Object.assign({}, x.value, paramsDel[table], {orgName: this.customerInfo.orgName});
                    this.xn.api.post(this.postUrl[table][type], params1).subscribe(() => {
                        this.init(table);
                    });
                }
            });
        }
    }

    // 选择行
    handleSelect(index: number, label) {
        // 如果存在其他元素存在，则取消其他元素的selected=false;
        const findIndex = this.info[label].findIndex((x: any) => x.selected === true);
        if (findIndex > -1 && findIndex !== index) {
            this.info[label][findIndex].selected = false;
        }
        if (!this.info[label][index].selected) {
            this.info[label][index].selected = true;
        } else {
            this.info[label][index].selected = false;
        }
    }

    init(label: any) {
        const params = {
            orgName: this.customerInfo.orgName,
            start: 0,
            length: 10
        };
        this.xn.api.post(this.postUrl[label].get, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.info[label] = x.data.data;
            } else {
                this.info[label] = [];
            }
        });
    }
}
