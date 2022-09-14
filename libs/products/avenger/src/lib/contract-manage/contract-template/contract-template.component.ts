import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormGroup } from '@angular/forms';
import contractTemplateTab from './contract-template.tab';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { Isshow } from 'libs/shared/src/lib/config/hideOrshow';
@Component({
    selector: 'app-contract-template',
    templateUrl: './contract-template.component.html',
    styleUrls: ['./contract-template.component.css'],
    styles: [`
        .item-box {
            position: relative;
            display: flex;
            margin-bottom: 10px;
        }


        .item-label label {
            min-width: 150px;
            padding-right: 8px;
            font-weight: normal;
            line-height: 34px;
            text-align:right;

        }

        .item-control {
            flex: 1;
            margin-top:-5px;
        }

        .item-control select {
            width: 100%
        }

    `]
})
export class ContractManagerComponent implements OnInit {

    pageTitle = '合同模版管理';
    shows: any[] = [];
    searches: any[] = [];
    data: any[] = []; // 合同列表
    // 页码配置
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    label = 'do_not';
    tabConfig: any;
    currentTab: any; // 当前标签页
    form: FormGroup;
    beginTime: any;
    endTime: any;
    headBtnStatus: boolean;
    paging = 0; // 共享该变量
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    timeId = [];
    arrObjs = {} as any; // 缓存后退的变量
    preChangeTime: any[] = [];
    nowTimeCheckId = '';
    type: number;
    typeurl = {
        url: '',
        id: '',
    };
    public isShow: boolean;

    // 自定义配置
    config = {
        edit: true,
        select: true,
        rows: [{ label: '编辑', value: 'edit' }, { label: '删除', value: 'delete' }]
    };

    constructor(private xn: XnService) {
    }


    ngOnInit(): void {
        this.tabConfig = contractTemplateTab.contractManager;
        this.initData(this.label);
        this.isShow = Isshow.contract;


    }

    getData() {
        this.paging = 1;
        this.onPage({ page: this.paging });
    }
    /**
   *  加载信息
   * @param val
   */
    public initData(val: string) {
        if (this.label !== val) {
            this.naming = '';
            this.sorting = '';
        }
        this.label = val;
        this.onPage({ page: this.paging });
    }

    /**
     *  event.page: 新页码 event.pageSize: 页面显示行数 event.first: 新页面之前的总行数,下一页开始下标 event.pageCount : 页码总数
     *  param  {first:0  page :1 pageCount:3 pageSize:2}
     */
    public onPage(e?) {
        this.paging = e.page || 1;
        this.onUrlData(); // 导航回退取值
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        this.currentTab = this.tabConfig.tabList.find((x: any) => x.value === this.label); // 当前标签页

        this.searches = this.currentTab.searches; // 当前标签页的搜索项
        this.buildShow(this.searches);
        // 构建参数
        const params = this.buildParams();
        if (this.currentTab.get_url === '') {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        this.xn.api.post(this.currentTab.get_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.data = x.data.data;
                this.pageConfig.total = x.data.recordsTotal;
            } else {
                // 固定值
                this.data = [];
                this.pageConfig.total = 0;
            }
        }, () => {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });
    }

    // 新增合同模版-新流程
    handleAdd() {
        if (this.currentTab.label === '普惠通') {
            this.xn.router.navigate(['console/record/new/contract_avenger_add']);
        } else if (this.currentTab.label === '地产类业务') {
            this.xn.router.navigate(['console/record/new/contract_rule_add']);
        }
    }

    // 下载附件-合同模板
    download(): void {
        let paramsItem = [];
        const items = this.data.filter((x: any) => x.checked === true).map(y => y.applyTemplate);
        if (items.length) {
            items.map(item => {
                if (typeof item === 'string') {
                    paramsItem = [...paramsItem, ...JSON.parse(item)];
                }
            });
            this.xn.api.download('/file/down_file', {
                files: paramsItem
            }).subscribe((v: any) => {
                this.xn.api.save(v._body, '合同模版');
                this.data.forEach(data => data.checkerId === false);
            });
        } else {
            this.xn.msgBox.open(false, '无可下载项');
        }

    }

    /**
     * @param obj {label:'',item:{}}
     */
    handleRow(obj) {
        if (this.type === 1) {
            this.typeurl.url = 'console/record/new';
            this.typeurl.id = 'contract_avenger_edit';
        } else if (this.type === 0) {
            this.typeurl.url = 'console/record/new';
            this.typeurl.id = 'contract_rule_edit';
        }
        if (obj.label === 'delete') {
            this.xn.msgBox.open(true, '确认删除', () => {
                this.xn.api.post('/custom/contract_template/contract_template/delete_contract_template',
                    { contractTemplateId: obj.item.contractTemplateId })
                    .subscribe(() => {
                        this.onPage({ page: this.paging });
                    });
            });
        }
        if (obj.label === 'edit') {
            this.xn.router.navigate([this.typeurl.url], {
                queryParams: {
                    id: this.typeurl.id,
                    relate: 'contractTemplateId',
                    relateValue: obj.item.contractTemplateId
                }
            });
        }
    }

    deleteRow() {
        const items = this.data.filter((x: any) => x.checked === true);
        this.xn.msgBox.open(true, '确认删除', () => {
            items.forEach((item, index) => {
                this.xn.api.post('/custom/contract_template/contract_template/delete_contract_template',
                    { contractTemplateId: item.contractTemplateId })
                    .subscribe(() => {
                        if (index === items.length - 1) {
                            this.onPage({ page: this.paging });
                        }
                    });
            });
        });
    }

    // 重置
    reset(): void {
        this.form.setValue({ specialSupplier: '', applyTemplate: '', headquarters: '', templateType: '' });
    }

    headBtn(e) {
        this.headBtnStatus = e;
    }


    /**
      * 构建搜索项
      * @param searches
      */
    private buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
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
        this.timeId = $.extend(true, [], this.searches
            .filter(v => v.type === 'quantum')
            .map(v => v.checkerId));
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);

        this.form = XnFormUtils.buildFormGroup(this.shows);

        const time = this.searches.filter(v => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.form.valueChanges.subscribe((v) => {
            // 时间段
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime.beginTime;
                const endTime = paramsTime.endTime;
                // 保存每次的时间值。
                this.preChangeTime.unshift({ begin: beginTime, end: endTime });
                // 默认创建时间
                this.beginTime = beginTime;
                this.endTime = endTime;
                if (this.preChangeTime.length > 1) {
                    if (this.preChangeTime[1].begin === this.beginTime &&
                        this.preChangeTime[1].end === this.endTime) {
                        // return;
                    } else {
                        this.beginTime = beginTime;
                        this.endTime = endTime;
                        this.paging = 1;
                        this.onPage({ page: this.paging });
                    }
                }
            }
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches
                        .filter(v1 => v1 && v1.base === 'number')
                        .map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }


    /**
     * 构建参数
     */
    private buildParams() {
        if (this.currentTab.label === '普惠通') {
            this.type = 1;
        } else if (this.currentTab.label === '地产类业务') {
            this.type = 0;
        }
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime,
            type: this.type
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }

        return params;
    }
    /**
    * 回退操作
    * @param data
    */
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.type = urlData.data.type || this.type;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
            this.label = urlData.data.label || this.label;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                onepaging: this.paging,
                type: this.type,
                pageConfig: this.pageConfig,
                arrObjs: this.arrObjs,
                label: this.label
            });
        }
    }
}
