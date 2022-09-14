import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BankCardAddModalComponent } from 'libs/shared/src/lib/public/modal/bank-card-add-modal.component';
import { ActivatedRoute } from '@angular/router';
import { CapitalPoolNameModalComponent } from 'libs/shared/src/lib/public/modal/capital-pool-name-modal.component';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CapitalPoolAlertRatioModalComponent } from 'libs/shared/src/lib/public/modal/capital-pool-alert-ratio-modal.component';
import { CapitalPoolIntermediaryAgencyModalComponent } from 'libs/shared/src/lib/public/modal/capital-pool-intermediary-agency-modal.component';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';

/**
 *  资产池组件
 */
@Component({
    selector: 'gemdale-capital-pool-index',
    templateUrl: './capital-pool-index.component.html',
    styles: [
        `
            .box {
                border: none;
            }
            .btn {
                margin-right: 2px;
            }

            .operating {
                min-width: 100px;
            }

            .table-herder-bg {
                background-color: #f6f6f6;
            }

            .button-group-position {
                padding: 0 0 1rem 0;
            }

            .button-group-position button {
                min-width: 8rem;
            }

            .font-weight-bold {
                font-weight: 700;
            }

            .disabled-bg {
                background-color: #999999;
            }
        `
    ]
})
export class GemdaleCapitalPoolIndexComponent implements OnInit {
    shows: any[] = [];
    mainForm: FormGroup;
    searches: any[] = [];
    public pageTitle = '资产池';
    public pageSize = 10;
    public total = 0;
    public pageNumber: number;
    // 资产池数据
    public capitalPoolLists: CapitalPoolModel[] = [];
    // 只有在保理商的时候显示增加，下载excel
    public showButtonBool: boolean = this.xn.user.orgType === 3;
    public showButtonBool2: boolean = this.xn.user.orgType === 77;
    // 页面导航显示页数
    public currentPage: number;

    // 总公司
    public headquartersOptions: any;
    // 交易模式类型
    public proxyTypeOptions = SelectOptions.get('proxyType');
    // 是否为金地模式下的中介角色用户
    public isAgencyUser = false;
    enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // 总部企业对应
    storageRack = SelectOptions.get('storageRack'); // 储
    public constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        public route: ActivatedRoute
    ) {
        this.isAgencyUser = this.xn.user.orgType === 102;
    }

    public ngOnInit() {
        this.buildForm();
        this.route.queryParams.subscribe(x => {
            if (!!x.currentPage) {
                const page = parseInt(x.currentPage, 0);
                this.currentPage = page;
                this.onPage(page);
            } else {
                this.init();
            }
        });
    }

    /**
     * 重置列表
     */
    public reset(): void {
        this.mainForm.setValue({ capitalPoolName: '' });
        this.init();
    }

    /**
     *  下载表格-万科没有入资产池交易
     */
    public downloadExcel() {
        // 拼接文件名
        const time = new Date().getTime();
        const filename = `${time}_万科没有入资产池交易.xlsx`;
        // appId + '-' + orgName + '-' + time + '.zip';
        this.xn.api
            .download('/attachment/download/index', {
                key: '万科没有入资产池交易.xlsx'
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }

    /**
     *  添加新的资金项
     */
    public capitalItemForm(params?: { id: string; name: string }) {
        const capitalPoolId = params ? params.id : null;
        const checkers = () => {
            const capitalPoolName = {
                checkerId: 'capitalPoolName',
                name: 'capitalPoolName',
                required: 1,
                type: 'text',
                title: '资产池名称 ',
                memo: '',
                value: params ? params.name : null
            };
            const headquarters = {
                checkerId: 'headquarters',
                name: 'headquarters',
                required: 1,
                type: 'headquarters-select',
                // selectOptions: [...this.headquartersOptions],
                title: '总部公司',
                memo: ''
            };
            const storageRack = {
                checkerId: 'storageRack',
                name: 'storageRack',
                required: 1,
                type: 'storage-rack-select',
                title: '储架',
                show: true,
                memo: ''
            };
            const isProxy = {
                checkerId: 'isProxy',
                name: 'isProxy',
                required: 1,
                type: 'select',
                options: { ref: 'newproxyType' },
                title: '交易模式',
                memo: ''
            };

            return params
                ? [capitalPoolName]
                : [capitalPoolName, isProxy, headquarters, storageRack];
        };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            CapitalPoolNameModalComponent,
            { id: capitalPoolId, checkers: checkers() }
        ).subscribe(data => {
            if (data && data.capitalPoolName) {
                const action = params ? 'rename' : 'add';
                if (action === 'rename') {
                    this.xn.api
                        .post(
                            `/ljx/capital_pool/${action}`,
                            Object.assign({ capitalPoolId }, data)
                        )
                        .subscribe(() => {
                            this.onPage(action === 'rename' ? this.pageNumber : 1);
                        });
                } else {
                    this.xn.api
                        .post(
                            `/ljx/capital_pool/${action}`,
                            Object.assign(
                                {
                                    capitalPoolId, project_manage_id: data.storageRack[0].project_manage_id,
                                    storageRack: data.storageRack[0].value
                                },
                                { headquarters: data.headquarters, isProxy: data.isProxy, capitalPoolName: data.capitalPoolName })
                        )
                        .subscribe(() => {
                            this.onPage(1);
                        });
                }

            }
        });
    }

    /**
     * 设置警戒比例
     */
    public alertRatioForm(params?: { id: string; value: any }) {
        const capitalPoolId = params ? params.id : null;
        const checkers = [
            {
                checkerId: 'supplierRatio',
                name: 'supplierRatio',
                required: 1,
                type: 'text',
                title: '供应商警戒比例 ',
                memo: '',
                value: params ? params.value.supplierRatio : null
            },
            {
                checkerId: 'enterpriseRatio',
                name: 'enterpriseRatio',
                required: 1,
                type: 'text',
                title: '项目公司警戒比例 ',
                memo: '',
                value: params ? params.value.enterpriseRatio : null
            }
        ];

        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            CapitalPoolAlertRatioModalComponent,
            { id: capitalPoolId, checkers }
        ).subscribe(data => {
            if (data && data.enterpriseRatio && data.supplierRatio) {
                this.xn.api
                    .post(
                        `/ljx/capital_pool/update_alert_ratio`,
                        Object.assign({ capitalPoolId }, data)
                    )
                    .subscribe(() => {
                        this.onPage(this.pageNumber);
                    });
            }
        });
    }

    /**
     * 设置中介机构
     */
    public intermediaryAgencyForm(params?: { id: string; value: number }) {
        const capitalPoolId = params ? params.id : null;
        const checkers = [
            {
                checkerId: 'agency',
                name: 'agency',
                required: 1,
                type: 'multiple-picker',
                title: '中介机构 ',
                memo: '',
                value: params ? params.value : null
            }
        ];

        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            CapitalPoolIntermediaryAgencyModalComponent,
            { id: capitalPoolId, checkers }
        ).subscribe(data => {
            if (data && data.agency) {
                this.xn.api
                    .post(
                        `/llz/capital_list/add_agency`,
                        Object.assign({ capitalPoolId }, data)
                    )
                    .subscribe(() => {
                        this.onPage(this.pageNumber);
                    });
            }
        });
    }

    /**
     *  查看 id,type
     */
    public handleView(val: any) {
        const module = val.isProxy === 18 // 星顺-雅居乐
            ? 'new-agile'
            : 'gemdale';
        this.xn.router.navigate([`/gemdale/asset-pool/trading-list`], {
            queryParams: {
                capitalId: val.id,
                capitalPoolName: val.name || '',
                headquarters: val.headquarters,
                isProxy: val.isProxy,
                type: val.value,
                currentPage: this.pageNumber,
                isLocking: val.isLocking,
                isProjectentter: this.isAgencyUser,
            }
        });
    }

    /**
     *  添加 id,type
     */
    public handleAdd(val: any) {
        this.xn.router.navigate(['/console/capital-pool/main-list'], {
            queryParams: {
                capitalId: val.id,
                capitalPoolName: val.name || '',
                headquarters: val.headquarters,
                isProxy: val.isProxy,
                type: val.value,
                currentPage: this.pageNumber
            }
        });
    }

    /**
     *  锁定该列，改变isLocking状态为1
     */
    public handleLock(val: CapitalPoolModel) {
        this.xn.msgBox.open(true, '是否要锁定该项', () => {
            const params = {
                capitalPoolId: val.capitalPoolId
            };
            this.xn.api
                .post('/ljx/capital_pool/locking', params)
                .subscribe(() => {
                    // 完成后重新加载
                    this.onPage(this.pageNumber);
                });
        });
    }

    /**
     *  切换分页查看，搜索
     * @param page
     */
    public onPage(page: number) {
        this.pageNumber = page || 1;
        const params: any = {
            start: (this.pageNumber - 1) * this.pageSize,
            length: this.pageSize,
            where: {}
        };
        // 如果金地中介角色则添加默认条件
        if (this.isAgencyUser) {
            params.where = {
                _complex: {
                    _logic: 'AND',
                    isProxy: ['IN', [6, 14, 18]], // 交易模式（万科模式: 6 , 金地模式: 14, 星顺雅居乐：18 ）
                    agencyInfo: ['like', `%${this.xn.user.appId}%`]
                }
            };
        }
        params.where.capitalPoolName = this.searches.length
            ? ['like', '%' + this.searches[0].value + '%']
            : undefined;
        params.where.isProxy = 14;
        this.xn.api.post('/ljx/capital_pool/get', params).subscribe(x => {
            this.capitalPoolLists = x.data.data;
            this.total = x.data.recordsTotal;
        });
    }

    /**
     * 绑定银行卡和管理员信息
     * @param item
     */
    public bankCardAdd(item: any) {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            BankCardAddModalComponent,
            item
        ).subscribe(v => {
            //
            console.log(v);
            if (v === 'ok') {
                this.onPage(this.pageNumber);
            }
        });
    }

    /**
     * 是否为万科模式的资产池
     */
    public isHwBusiness(headquarters): boolean {
        return headquarters === '万科';
    }

    /**
     * 获取数据,默认加载第一页
     */
    private init() {
        this.onPage(1);
    }

    /**
     * 构建表头搜索项
     */
    private buildForm(): void {
        this.shows = [
            {
                title: '资产池名称',
                checkerId: 'capitalPoolName',
                type: 'text',
                required: false
            }
        ];

        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe(v => {
            const search = [];
            for (const key in this.mainForm.value) {
                if (this.mainForm.value.hasOwnProperty(key)) {
                    if (this.mainForm.value[key] !== '') {
                        const obj = {} as any;
                        obj.key = key;
                        obj.value = this.mainForm.value[key];
                        search.push(obj);
                    }
                }
            }
            this.searches = search;
        });
    }

    private buildChecker(stepRows): void {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}

// 资产池字段对应
export class CapitalPoolModel {
    public capitalPoolId?: string; // 资产池编号
    public capitalPoolName?: string; // 资产池名称
    public headquarters?: string; // 总部公司
    public storageRack?: string; // 储架
    public isProxy?: string; // 交易模式
    public financiersNumber?: number; // 供应商融资人数量
    public enterprisersNumber?: number; // 项目公司融资人数量
    public maxFinancingRatio?: number; // 最大供应商融资比例
    public maxEnterpriseRatio?: number; // 最大项目公司融资比例
    public supplierRatio?: number; // 供应商警戒比例
    public enterpriseRatio?: number; // 项目公司警戒比例
    public maxFinancingName?: string; // 最大供应商融资人名称
    public maxEnterpriseName?: string; // 最大项目公司融资人名称
    public agencyInfo?: string; // 中介机构
    public commodityTradNumber?: number; // 商品交易个数
    public serviceTradNumber?: number; // 服务交易个数
    public tradNumber?: number; // 交易个数
    public isLocking?: number; // 是否锁定 1: 锁定 0：未锁定
}

// 按钮对应枚举
export enum EnumOperating {
    '查看' = 1,
    '添加' = 2,
    '移除' = 3
}
