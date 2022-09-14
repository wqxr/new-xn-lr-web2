import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Component, OnInit, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { SelectOptions, HeadquartersTypeEnum, applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ActivatedRoute } from '@angular/router';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DaterangepickerDirective } from 'libs/shared/src/lib/public/directive/date-range-picker/date-range-picker.directive';
import * as moment from 'moment';
import { ZsGemdaleSingleSearchListModalComponent, SingleListParamInputModel } from '../../share/modal/single-searchList-modal.component';
import { ProxyType } from 'libs/shared/src/lib/config/enum/common-enum';


@Component({
    templateUrl: './zs-gemdale-record.component.html',
    styleUrls: ['./zs-gemdale-record.component.css']
})
export class ZsGemdaleRecordComponent implements OnInit, AfterViewInit {

    flowId1 = 'jd_financing_pre';  // 新万科流程

    /** 列表数据 */
    data: any[] = [];

    /** 页码配置 */
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };

    /** 部分公司选项 */
    options = [];
    status = [];
    type = [];
    query = {
        recordId: '',
        headquarters: HeadquartersTypeEnum[2],
        status: '',
        type: '',
        startTime: moment().subtract(12, 'months').valueOf().toString(),
        endTime: moment().valueOf().toString(),
    };

    sort: {
        name: string,
        order: 'asc' | 'desc'
    } = {
            name: '',
            order: 'asc'
        };

    @ViewChild(DaterangepickerDirective)
    private picker: DaterangepickerDirective;

    private get enterpriseOptions() {
        return 'enterprise_dragon';
    }

    constructor(private xn: XnService, private vcr: ViewContainerRef, private router: ActivatedRoute,) {
        this.options = SelectOptions.get(this.enterpriseOptions);
        this.status = SelectOptions.get('createStatus');
        this.type = SelectOptions.get('productType_new_jd');
    }

    ngOnInit() {
        this.router.params.subscribe(x => {
        });
        this.onPage();
    }

    ngAfterViewInit(): void {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);

        this.picker.datePicker.setStartDate(date);
    }

    /**
     *  @param event
     *       event.page: 新页码
     *       event.pageSize: 页面显示行数
     *       event.first: 新页面之前的总行数,下一页开始下标
     *       event.pageCount : 页码总数
     */
    public onPage(e?) {
        // this.onUrlData(); // 导航回退取值
        this.pageConfig = Object.assign({}, this.pageConfig, e);

        this.xn.loading.open();
        const params = {
            pageNo: this.pageConfig.first,
            pageSize: this.pageConfig.pageSize,
        };
        // 处理搜索项
        for (const key in this.query) {
            if (!XnUtils.isEmpty(this.query[key])) {
                params[key] = this.query[key];
            }
        }
        params['factoringAppId'] = applyFactoringTtype['深圳市前海中晟商业保理有限公司'];
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
        this.query.recordId = '';
        this.query.status = '';
        this.query.type = '';
        this.pageConfig.first = 0;
        this.pageConfig.pageSize = 10;
        this.resetDateRange();
        this.search(); // 清空之后自动调一次search
    }

    /**
     * 排序
     * @param sort 排序列名
     */
    onSort(name: string): void {
        if (this.sort.name === name) {
            this.sort.order = this.sort.order === 'desc' ? 'asc' : 'desc';
        } else {
            this.sort = {
                name,
                order: 'asc'
            };
        }

        this.onPage();
    }

    onSortClass(name: string): string {
        return this.sort.name && name === this.sort.name ? `sorting_${this.sort.order}` : 'sorting';
    }

    getOrderInfo() {
        return this.sort.name ? [`${this.sort.name} ${this.sort.order}`] : null;
    }

    doProcess(record: any) {
        // 流程已完成 或者账号没有权限查看流程
        record.proxyType = record.proxyType === ProxyType.AVENGER ? ProxyType.AVENGER : ProxyType.ZS_GEMDALE;
        XnUtils.doProcess(record, this.xn);
    }

    // 发起提单
    newProcess() {
        this.xn.router.navigate([`/zs-gemdale/record/new/jd_financing_pre/${HeadquartersTypeEnum[2]}`]);
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
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ZsGemdaleSingleSearchListModalComponent, params).subscribe(() => {

        });
    }
    selectedDate(value: any) {
        // this is the date the iser selected
        this.query.startTime = value.start.format('x');
        this.query.endTime = value.end.format('x');
    }

    public resetDateRange() {
        // const m = moment();
        this.query.endTime = moment().valueOf().toString();
        this.query.startTime = moment().subtract(12, 'months').valueOf().toString();
        this.picker.datePicker.setStartDate(moment().subtract(12, 'months'));
        this.picker.datePicker.setEndDate(moment());

        // const defaultDate = m.format('YYYY-MM-DD');
        this.picker.input.nativeElement.value =
            `${moment().subtract(12, 'months').format('YYYY-MM-DD')} - ${moment().format('YYYY-MM-DD')}`;
    }
}
