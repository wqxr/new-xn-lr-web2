
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：资产池层级信息
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-08-28
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { BankCardAddComponent } from './bank-card-add.component';
import { Observable, of } from 'rxjs';
import { DeletematerialEditModalComponent } from './delete-material-modal.component';
import { EditModalComponent } from './edit-modal.component';
declare const moment: any;

@Component({
    templateUrl: `./capital-add-info.modal.component.html`,
    selector: 'chose-capitalPool-modal',
    styles: [`
        .title {
            font-weight:bold;
        }
        ul>li{
            list-style:none;
            font-weight:bold;
        }
        .label {
            font-weight: normal;
            flex: 1;
            color: black;
        }

        .flex {
            display: flex;
        }

        .input-check {
            width: 100px;
        }

        .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            /*position: relative;*/
            cursor: pointer
        }

        .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            font-family: 'Glyphicons Halflings';
            opacity: 0.5;
        }

        .table-head .sorting:after {
            content: "\\e150";
            opacity: 0.2
        }

        .table-head .sorting_asc:after {
            content: "\\e155"
        }

        .table-head .sorting_desc:after {
            content: "\\e156"
        }
    `]
})
export class CapitalAddInfoComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    // 数据
    // tslint:disable-next-line: no-use-before-declare
    // 数组字段
    private observer: any;
    datalist01: any[] = []; // 层级列表
    dataAgency: any[] = []; // 投资机构列表
    list: any[] = []; // 中介机构列表
    public params: any;
    first = 0;
    paging = 0; // 共享该变量
    pagingnext = 0;
    pageSize = 10;
    beginTime: any;
    endTime: any;
    total = 0;
    totalReceive = 0;
    paramType: number;
    ceilList: any[] = [];
    project_manage_id: string = '';
    purchaseRatioTotal: any;
    constructor(private xn: XnService,
        private vcr: ViewContainerRef, private er: ElementRef, private cdr: ChangeDetectorRef,) {
    }

    ngOnInit(): void {

    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.project_manage_id = this.params.project_manage_id;
        // 获取中介机构
        this.xn.dragon.post('/project_manage/agency/project_agency_list',
            { project_manage_id: this.project_manage_id }).subscribe(x => {
                if (x.ret === 0) {
                    this.list = x.data.rows;
                }
            });
        this.onPage();
        this.onPageNext();
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }


    /**
      *  @param event
      *       event.page: 新页码
      *       event.pageSize: 页面显示行数
      *       event.first: 新页面之前的总行数,下一页开始下标
      *       event.pageCount : 页码总数
     */
    onPage(): void {
        // 获取层级列表
        this.xn.loading.open();
        this.xn.dragon.post('/project_manage/pool/pool_invest_tier_list', { capitalPoolId: this.params.params, }).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
                this.datalist01 = x.data.rows;
                this.total = x.data.sumReceive;
                this.total = x.data.count;
                this.totalReceive = x.data.sumReceive;
            }
        });
    }

    /**
     * 取消
     *  @param
    */
    oncancel() {
        this.close({ action: 'cancel' });
    }

    /**
      * 提交补充信息
      *  @param
    */
    onOk() {
        // 新增投资机构
        this.xn.loading.open();
        this.xn.dragon.post('/project_manage/agency/add_invest_agency',
            { capitalPoolId: this.params.params, investTierList: this.datalist01, investAgencyList: this.dataAgency })
            .subscribe(x => {
                this.xn.loading.close();
                if (x.ret === 0) {
                    this.close({ action: 'ok' });
                    this.xn.msgBox.open(false, '补充信息成功');
                }
            });
    }

    /**
     * 增加投资机构
     *  @param
     */
    choseAgency() {
        this.ceilList = []; // 所属层级select
        this.datalist01.forEach((x) => {
            this.ceilList.push({ appId: x.investTierName, orgName: x.investTierName });
        });
        const checkers = [
            {
                checkerId: 'vankeAgency',
                name: 'vankeAgency',
                required: 1,
                type: 'vankeAgency-select',
                title: '中介机构 ',
                options: { ref: 'contractRules' },
                value1: this.list,
            },
            {
                checkerId: 'purchaseMoney',
                name: 'purchaseMoney',
                required: 0,
                type: 'money',
                title: '认购金额 ',
                memo: '',
                value: ''
            },
            {
                checkerId: 'investTierName',
                name: 'investTierName',
                required: 1,
                type: 'vankeAgency-select',
                title: '所属层级 ',
                memo: '',
                value1: this.ceilList,
            }
        ];
        const params = {
            checker: checkers,
            title: '添加投资机构信息',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            EditModalComponent,
            params
        ).subscribe(data => {
            if (data) {
                // isSame 是否已经存在 投资机构+层级 重复的投资机构
                let isSame = this.dataAgency.filter(x => data.investTierName === x.investTierName && data.vankeAgency === x.appId);
                // 选择的层级id invest_tier_id
                let invest_tier_id = this.datalist01.filter(x => x.investTierName === data.investTierName)[0].invest_tier_id;
                // 层级金额 purchaseMoney
                let tierReceive = this.datalist01.filter(x => x.investTierName === data.investTierName)[0].tierReceive;
                if (isSame.length === 0) {
                    this.dataAgency.push({
                        purchaseMoney: data.purchaseMoney === '' ? 0 : this.ReceiveData(data.purchaseMoney),
                        invest_tier_id: invest_tier_id,
                        investTierName: data.investTierName,
                        appId: data.vankeAgency,
                        appName: this.list.filter(x => x.appId === data.vankeAgency)[0].appName,
                        orgName: this.list.filter(x => x.appId === data.vankeAgency)[0].orgName,
                    });

                    // 计算 投资机构列表信息中相同层级的“认购金额”总和 purchaseMoneyTotal
                    let purchaseMoneyTotal = this.dataAgency.filter(v => v.invest_tier_id === invest_tier_id)
                        .map(t => t.purchaseMoney).reduce((accumulator, currentValue) => accumulator + currentValue);

                    // 统计“投资机构信息”中相同层级的“认购金额”总和，系统硬控其不可超过该层级的“层级金额”。
                    if (purchaseMoneyTotal > tierReceive) {
                        this.xn.msgBox.open(false, `相同所属层级的认购金额总和: ${purchaseMoneyTotal} 不能超过该投资层级金额: ${tierReceive}`);
                        // 删除此条投资机构信息
                        this.dataAgency = this.dataAgency.slice(0, this.dataAgency.length - 1);
                    }
                    this.cdr.markForCheck();
                } else {
                    let orgName = this.list.filter(x => x.appId === data.vankeAgency)[0].orgName;
                    return this.xn.msgBox.open(false, `投资机构: ${orgName} + 层级: ${data.investTierName} 不能重复`);
                }
            }
        });

    }

    /**
     * 修改投资机构
     *  @param paramInfo 行信息
     *  @param paramIndex 下标
     */
    changeAgency(paramInfo: any, paramIndex: number) {
        this.ceilList = [];
        this.datalist01.forEach((x) => {
            this.ceilList.push({ appId: x.investTierName, orgName: x.investTierName });
        });
        const checkers = [
            {
                checkerId: 'vankeAgency',
                name: 'vankeAgency',
                required: 1,
                type: 'vankeAgency-select',
                title: '中介机构 ',
                options: { ref: 'contractRules' },
                value: paramInfo.appId,
                value1: this.list,
            },
            {
                checkerId: 'purchaseMoney',
                name: 'purchaseMoney',
                required: 0,
                type: 'money',
                title: '认购金额 ',
                memo: '',
                value: paramInfo.purchaseMoney
            },
            {
                checkerId: 'investTierName',
                name: 'investTierName',
                required: 0,
                type: 'vankeAgency-select',
                title: '所属层级',
                memo: '',
                value1: this.ceilList,
                value: paramInfo.investTierName,
            }
        ];
        const params = {
            checker: checkers,
            title: '修改投资机构信息',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            EditModalComponent,
            params
        ).subscribe(data => {
            if (!data) {
                return;
            }
            // isSame 是否已经存在 投资机构+层级 重复的投资机构
            let isSame = this.dataAgency.filter(x => data.investTierName === x.investTierName && data.vankeAgency === x.appId);
            // 重复的投资机构 不是当前修改
            if (isSame.length > 0 && (paramInfo.investTierName !== data.investTierName || paramInfo.appId !== data.vankeAgency)) {
                let orgName = this.list.filter(x => x.appId === data.vankeAgency)[0].orgName;
                return this.xn.msgBox.open(false, `投资机构: ${orgName} + 层级: ${data.investTierName} 不能重复`);
            }
            // 层级id
            let invest_tier_id = this.datalist01.filter(x => x.investTierName === data.investTierName)[0].invest_tier_id;
            // 层级金额 purchaseMoney
            let tierReceive = this.datalist01.filter(x => x.investTierName === data.investTierName)[0].tierReceive;

            // 投资机构列表信息中相同层级的数组 purchaseTotal
            let purchaseTotal = this.dataAgency.filter(v => v.invest_tier_id === invest_tier_id);
            let purchaseMoneyTotal = 0; // “认购金额”总和
            // 计算 投资机构列表信息中相同层级的“认购金额”总和 purchaseMoneyTotal
            if (purchaseTotal.length > 0) {
                purchaseMoneyTotal = purchaseTotal.map(t => t.purchaseMoney).reduce((totalV, curV) => totalV + curV) + this.ReceiveData(data.purchaseMoney);
            } else {
                purchaseMoneyTotal = this.ReceiveData(data.purchaseMoney);
            }

            // 统计“投资机构信息”中相同层级的“认购金额”总和，系统硬控其不可超过该层级的“层级金额”。
            if (purchaseMoneyTotal > tierReceive) {
                this.xn.msgBox.open(false, `相同所属层级的认购金额总和: ${purchaseMoneyTotal} 不能超过该投资层级金额: ${tierReceive}`);
            } else {
                this.dataAgency[paramIndex].investTierName = data.investTierName;
                this.dataAgency[paramIndex].purchaseMoney = this.ReceiveData(data.purchaseMoney);
                this.dataAgency[paramIndex].vankeAgency = data.vankeAgency;
                this.dataAgency[paramIndex].invest_tier_id = invest_tier_id;
                this.cdr.markForCheck();
            }
            this.cdr.markForCheck();
        });
    }

    /**
     *  删除中介机构
     *  @param
     */
    deleteAgency(paramIndex) {
        this.dataAgency.splice(paramIndex, 1);
        this.cdr.markForCheck();
    }

    /**
     * 获取投资机构列表
     *  @param
     */
    onPageNext(): void {
        this.xn.dragon.post('/project_manage/agency/list_invest_agency', { capitalPoolId: this.params.params, }).subscribe(x => {
            if (x.ret === 0) {
                this.dataAgency = x.data.rows;
                this.total = x.data.count;
            }
        });
    }

    /**
     * 修改层级
     *  @param paramInfo 行信息
     *  @param paramIndex 下标
     */
    changeRece(paramInfo: any, paramIndex: number) {
        const checkers = [
            {
                title: '认购价格',
                checkerId: 'purchaseRatio',
                type: 'text',
                required: 0,
                value: paramInfo.purchaseRatio,
            }

        ];

        const params = {
            checker: checkers,
            title: '修改投资层级',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
            .subscribe((v) => {
                if (v === null) {
                    return;
                } else {
                    this.datalist01[paramIndex].purchaseRatio = this.ReceiveData(v.purchaseRatio);
                    this.purchaseRatioTotal = this.computeSum(this.datalist01.filter(v =>
                        v && v.purchaseRatio).map(v => v.purchaseRatio));
                    this.cdr.markForCheck();
                }
            });

    }

    /**
     * 关闭弹窗
     *  @param value
     */
    private close(value: any) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    /**
     * 具体到单个数组的求和
     *  @param
     */
    private computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }

    delete(paramIndex) {
        this.datalist01.splice(paramIndex, 1);
        this.cdr.markForCheck();

    }

    // 计算应收账款转让金额
    public ReceiveData(item: any) {
        let tempValue = item.includes(',') ? item.replace(/,/g, '') : item;
        tempValue = parseFloat(tempValue).toFixed(2);
        return Number(tempValue);
    }
}
