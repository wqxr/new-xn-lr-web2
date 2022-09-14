import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Component, OnInit, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { SelectOptions, HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ActivatedRoute } from '@angular/router';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { EditNewVankeModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-new-vanke-modal.component';
import { SingleListParamInputModel, SingleSearchListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

declare const moment: any;
declare const $: any;
const searchs = [
    { title: '流程记录ID', checkerId: 'recordId', type: 'text', required: false, sortOrder: 1 },
    {
        title: '状态', checkerId: 'status', type: 'select',
        options: { ref: 'createStatus' }, required: false, sortOrder: 2
    },
    {
        title: '创建时间', checkerId: 'valueDate', type: 'quantum1',
        required: false, sortOrder: 3
    },
    {
        title: '渠道', checkerId: 'productType', type: 'linkage-select',
        options: { ref: 'productType_pslogan' }, required: false, sortOrder: 4
    },
]

@Component({
    templateUrl: './record-dragon.component.html',
    styleUrls: ['./record-dragon.component.css']
})
export class RecordDragonComponent implements OnInit, AfterViewInit {

    flowId = 'dragon_financing_pre';

    /** 列表数据 */
    data: any[] = [];

    /** 页码配置 */
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };

    public shows: CheckersOutputModel[] = [];  // 搜索项
    public searchForm: FormGroup;              // 搜索表单组
    public formModule = 'dragon-input';
    private searches = searchs; // 面板搜索配置项暂存
    private beginTime: any;
    private endTime: any;
    private timeId = [];
    private arrObjs = {} as any;  // 缓存后退的变量


    constructor(private xn: XnService, private vcr: ViewContainerRef, private router: ActivatedRoute,) {}

    ngOnInit(): void {
        this.onPage();
    }

    ngAfterViewInit(): void {
    }

    /**
     *  @param event
     *       event.page: 新页码
     *       event.pageSize: 页面显示行数
     *       event.first: 新页面之前的总行数,下一页开始下标
     *       event.pageCount : 页码总数
     */
    public onPage(e?) {
        this.pageConfig = Object.assign({}, this.pageConfig, e);

        this.xn.loading.open();
        this.buildShow(this.searches);
        // 构建参数
        const params = this.buildParams();
        this.xn.api.dragon.post('/pay_plan/list', params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.data = x.data.data;
                this.pageConfig.total = x.data.count;
            } else {
                this.noData();
            }
        }, () => {
            this.noData();
        }, () => {
            this.xn.loading.close();
        });
    }

    private noData() {
        this.data = [];
        this.pageConfig.total = 0;
    }

    /**
     *  搜索,默认加载第一页
     */
    public search() {
        this.onPage();
    }

    /**
     * 重置
     */
    public reset() {
        this.pageConfig.first = 0;
        this.pageConfig.pageSize = 10
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.onPage();
    }

    doProcess(record: any) {
        // 流程已完成 或者账号没有权限查看流程
        if ((record.status !== 1 && record.status !== 0)
            || !XnUtils.getRoleExist(record.nowRoleId, this.xn.user.roles, record.proxyType)) {
            this.xn.router.navigate([`/pslogan/record/${this.flowId}/view/${record.recordId}`]);
        } else {
            this.xn.router.navigate([`/pslogan/record/${this.flowId}/edit/${record.recordId}`]);
        }
    }

    viewProcess(record: any) {
        if ((record.status !== 1 && record.status !== 0) || this.xn.user.roles.indexOf(record.nowRoleId) < 0) {
            this.xn.router.navigate([`/pslogan/record/${this.flowId}/view/${record.recordId}`]);
        } else {
            this.xn.router.navigate([`/pslogan/record/${this.flowId}/edit/${record.recordId}`]);
        }
    }

    newProcess() {
        // 地产业务 -新万科 适用项目 根据所选“总部公司”，出现【一次转让合同管理】功能列表中该总部公司对应的“适用项目”

        const params = {
            title: '发起交易申请',
            checker: [
                {
                    title: '总部公司', checkerId: 'headquarters', type: 'select', required: 1,
                    options: { ref: 'newenterprise_dragon2' }
                },
                {
                    title: '渠道', checkerId: 'productType', type: 'linkage-select', required: 1,
                    options: { ref: 'productType_pslogan' }
                },
                {
                    title: '合同组', checkerId: 'fitProject', type: 'search-select', required: 1,
                },
            ],
            info: { flowId: 'vanke_financing_pre', headquarters: HeadquartersTypeEnum[5] }
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditNewVankeModalComponent, params).subscribe(x => {
            if (!!x) {
                const channel = JSON.parse(x.productType);
                if (x) {
                    this.xn.router.navigate([`/pslogan/record/new/${this.flowId}/${HeadquartersTypeEnum[5]}`],
                        {
                            queryParams: {
                                productType: channel.proxy,
                                selectBank: channel.status ? channel.status : '0',
                                fitProject: x.fitProject,
                                headquarters: x.headquarters,
                            }
                        });
                }
            }
        });
    }

    viewZdList(item) {
        const params: SingleListParamInputModel = {
            title: '查看登记编码/修改码',
            get_url: '/pay_plan/zd_code_list',
            get_type: 'dragon',
            multiple: null,
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
                { label: '收款单位', value: 'debtUnit', type: 'text' },
                { label: '申请付款单位', value: 'projectCompany', type: 'text' },
                { label: '应收账款金额', value: 'receive', type: 'text' },
                { label: '登记编码', value: 'registerNum', type: 'text' },
                { label: '修改码', value: 'modifiedCode', type: 'text' },
            ],
            searches: [],
            key: 'mainFlowId',
            data: [],
            total: 0,
            inputParam: { recordId: item.recordId },
            options: { paramsType: 1 },
            rightButtons: [{ label: '确定', value: 'submit' }]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe(() => {

        });
    }

    private buildShow(searches) {
        this.shows = [];
        this.buildCondition(searches);
    }

    /**
    * 构建列表请求参数
    */
    private buildParams() {

        let params = null;
        params = {
            pageNo: this.pageConfig.first,
            pageSize: this.pageConfig.pageSize,
        };
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {

                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    if (search.checkerId === 'productType') {
                        const val = JSON.parse(this.arrObjs[search.checkerId]);
                        params.type = Number(val.proxy);
                        if (!!val.status) {
                            params.selectBank = Number(val.status);
                        }
                    } else if (search.checkerId === 'valueDate') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        params.startTime = date.beginTime;
                        params.endTime = date.endTime;
                    } else {
                        params[search.checkerId] = this.arrObjs[search.checkerId];
                    }
                    if (search.type === 'text') {
                        params[search.checkerId] = this.arrObjs[search.checkerId].trim();
                    }
                }
            }
        }
        params.headquarters = HeadquartersTypeEnum[8]
        params.isLgBoShi = 1; // 0=非龙光博时资本 1=龙光博时资本
        return params;
    }

    /**
    * 搜索项值格式化
    * @param searches
    */
    private buildCondition(searches) {
        const tmpTime = {
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        const objList = [];
        this.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.sortOrder = searches[i].sortOrder;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function (a, b) {
            return a.sortOrder - b.sortOrder;
        })); // 深拷贝，并排序;

        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.searchForm = XnFormUtils.buildFormGroup(this.shows);
        this.searchForm.valueChanges.subscribe((v) => {

            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches.filter((v1: any) => v1 && v1.base === 'number')
                        .map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
