import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CapitalPoolNameModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-name-modal.component';
import { CapitalPoolIntermediaryAgencyModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-intermediary-agency-modal.component';
import { CapitalPoolAlertRatioModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-alert-ratio-modal.component';
import { CapitalPoolBankCardAddModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-bank-card-add-modal.component';

@Component({
    selector: 'app-capital-pool',
    templateUrl: './capital-pool.component.html',
    styleUrls: ['./capital-pool.component.css']
})
export class CapitalPoolComponent implements OnInit {
    shows: any[] = [];
    mainForm: FormGroup;
    searches: any[] = [];
    /** 页码配置 */
    pageConfig = {
        page: 1,
        pageSize: 10,
        first: 1,
        total: 0,
    };
    // 资产池数据
    public capitalPoolLists: CapitalPoolModel[] = [];
    // 只有在保理商的时候显示增加，下载excel
    public showButtonBool: boolean = this.xn.user.orgType === 3;
    public showButtonBool2: boolean = this.xn.user.orgType === 77;

    // 总公司
    public headquartersOptions: any;
    // 交易模式类型
    public proxyTypeOptions = SelectOptions.get('proxyTypeDragon');
    enterpriserSelectItems = SelectOptions.get('enterprise_dragon'); // 总部企业对应
    storageRack = SelectOptions.get('storageRackDragon'); // 储
    public isAgencyUser = false;

    public lockStatus = LockStatus;

    refreshDataAfterAttachComponent = () => {
        this.onPage();
    }

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
                this.pageConfig.first = (page - 1) * this.pageConfig.total;
                this.onPage();
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
     *  添加新的资金项
     */
    public capitalItemForm(params?: { id: string; name: string }) {
        const capitalPoolId = params ? params.id : undefined;
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
                memo: ''
            };
            const isProxy = {
                checkerId: 'isProxy',
                name: 'isProxy',
                required: 1,
                type: 'select',
                options: { ref: 'dragonListType' },
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
                const action = params ? 'rename' : 'create';
                this.xn.api.dragon
                    .post(
                        `/pool/${action}`,
                        Object.assign({ capitalPoolId }, data)
                    )
                    .subscribe(() => {
                        this.onPage();
                    });
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
                this.xn.api.dragon
                    .post(
                        `/pool/update_alert_ratio`,
                        Object.assign({ capitalPoolId }, data)
                    )
                    .subscribe(() => {
                        this.onPage();
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
                type: 'agency-picker',
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
                this.xn.api.dragon
                    .post(
                        `/pool/add_agency`,
                        { capitalPoolId, agency: JSON.parse(data.agency) }
                    )
                    .subscribe(() => {
                        this.onPage();
                    });
            }
        });
    }

    /**
     *  查看 id,type
     */
    public handleView(val: any) {
        this.xn.router.navigate(['/logan/capital-pool/trading-list'], {
            queryParams: {
                capitalId: val.id,
                capitalPoolName: val.name,
                isProxy: val.isProxy,
                type: val.value,
                currentPage: this.pageConfig.page,
                isLocking: val.isLocking,
                storageRack: val.storageRack,
            }
        });
    }

    /**
     *  添加 id,type
     */
    public handleAdd(val: any) {
        this.xn.router.navigate(['/logan/capital-pool/unhandled-list'], {
            queryParams: {
                capitalId: val.id,
                capitalPoolName: val.capitalPoolName,
                currentPage: this.pageConfig.page
            }
        });
    }

    /**
     *  锁定该列，改变isLocking状态为1
     */
    public handleLock(val: CapitalPoolModel) {
        const lock = val.isLocking === this.lockStatus.Locked
            ? this.lockStatus.Unlock
            : this.lockStatus.Locked;

        this.xn.msgBox.open(true, `是否要${!!lock ? '锁定' : '解锁'}该项`, () => {
            const params = {
                capitalPoolId: val.capitalPoolId,
                lock,
            };
            this.xn.api.dragon
                .post('/pool/lock', params)
                .subscribe(() => {
                    // 完成后重新加载
                    this.onPage();
                });
        });
    }

    /**
     * 切换分页查看，搜索
     */
    public onPage(e?: { page: number, pageSize: number, first: number, pageCount: number }) {
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        const params: any = {
            pageNo: this.pageConfig.first,
            pageSize: this.pageConfig.pageSize,
            capitalPoolName: this.searches.length ? this.searches[0].value : undefined
        };
        this.xn.api.dragon.post('/pool/list', params).subscribe(x => {
            this.capitalPoolLists = x.data.data;
            this.pageConfig.total = x.data.count;
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
            CapitalPoolBankCardAddModalComponent,
            item
        ).subscribe(v => {
            //
            if (v === 'ok') {
                this.onPage();
            }
        });
    }

    /**
     * 获取数据,默认加载第一页
     */
    private init() {
        this.onPage();
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

/** 锁定状态 */
enum LockStatus {
    /** 未锁定 */
    Unlock = 0,
    /** 锁定 */
    Locked = 1,
}
