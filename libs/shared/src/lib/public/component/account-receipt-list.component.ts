import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from '../../services/xn.service';
import {ActivatedRoute} from '@angular/router';
import CommUtils from './comm-utils';
import CommBase from './comm-base';
import {XnFormUtils} from '../../common/xn-form-utils';
import {FormGroup} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';
import {CommonPage, PageTypes} from './comm-page';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {PdfSignModalComponent} from '../modal/pdf-sign-modal.component';
import {LoadingService} from '../../services/loading.service';

/**
 *  应收账款回执生成
 */
@Component({
    templateUrl: './account-receipt-list.component.html',
    styles: [
            `.table {
            font-size: 13px;
        }

        .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            position: relative;
            cursor: pointer
        }

        .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            position: absolute;
            bottom: 8px;
            right: 8px;
            display: block;
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

        .tab-heads {
            margin-bottom: 10px;
            display: flex
        }

        .tab-buttons {
            flex: 1;
        }

        .tab-search {
            text-align: right;
        }

        .form-control {
            display: inline-block;
            border-radius: 4px;
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
            width: 200px
        }

        .btn {
            vertical-align: top
        }

        .small-font {
            font-size: 12px
        }

        .item-box {
            position: relative;
            display: flex;
            margin-bottom: 10px;
        }

        .item-box i {
            position: absolute;
            top: 11px;
            right: 23px;
            opacity: 0.5;
            cursor: pointer;
        }

        .plege {
            color: #3c8dbc
        }

        .plege.active {
            color: #ff3000;
        }

        tbody tr:hover {
            background-color: #e6f7ff;
            transition: all 0.1s linear
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
        }

        .item-control select {
            width: 100%
        }

        .fr {
            float: right
        }

        .money-control {
            display: flex;
            line-height: 35px;
        }

        .text-right {
            text-align: right
        }

        ul li {
            list-style-type: none;
        }

        .item-list {
            position: absolute;
            max-height: 200px;
            width: 375px;
            padding: 0px;
            z-index: 1;
            background: #fff;
            overflow-y: auto;
            border: 1px solid #DDD;
        }

        .item-list li {
            padding: 2px 12px;
        }

        .item-list li:hover {
            background-color: #ccc;
        }

        .btn-label {
            margin-bottom: 10px;
        }

        .btn-more {
            margin-top: 10px;
        }

        .btn-more-a {
            position: relative;
            left: 50%;
            transform: translateX(-50%)
        }

        .btn-cus {
            border: 0;
            margin: 0;
            padding: 0
        }

        .capital-pool-check {
            position: relative;
            top: 2px;
            left: 20px;
        }

        .a-block {
            display: block;
        }
        `
    ]
})
export class AccountReceiptListComponent extends CommonPage implements OnInit {

    total = 0;
    pageSize = 10;
    rows: any[] = [];
    words = '';

    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    paging = 0; // 共享该变量
    beginTime: any;
    endTime: any;
    arrObjs = {} as any; // 缓存后退的变量

    heads: any[];
    searches: any[];
    shows: any[];
    base: CommBase;
    mainForm: FormGroup;
    timeId = [];
    tolerance = [];
    nowTimeCheckId = '';
    searchArr = [];
    start: 0;
    showBtn: false;
    public businessSelected: any[];
    // 按钮状态
    public btnStatusBool = false;
    // 全选，取消全选
    public allChecked = false;

    preChangeTime: any[] = [];

    constructor(public xn: XnService, public vcr: ViewContainerRef, public route: ActivatedRoute, private loadingService: LoadingService) {
        super(PageTypes.List);
    }

    ngOnInit() {
        this.route.data.subscribe((superConfig: any) => {
            this.base = new CommBase(this, superConfig);
            // 过滤多余字段
            this.heads = CommUtils.getListFields(superConfig.fields).filter(item => item.checkerId !== 'isReceivable');
            this.searches = CommUtils.getSearchFields(superConfig.fields);
            this.buildShow(this.searches);
            this.pageSize = superConfig.list && superConfig.list.pageSize || this.pageSize;
            setTimeout(() => {
                this.onPage(this.paging);
            });
        });
    }

    public onPage(page: number): void {
        this.paging = page || 1;

        // 后退按钮的处理
        this.onUrlData();

        const params = this.buildParams();
        this.base.onList(params);

    }

    public onSort(sort: string): void {
        // 如果已经点击过了，就切换asc 和 desc
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }

        this.onPage(this.paging);
    }

    public onSortClass(checkerId: string): string {
        if (checkerId === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    public onTextClass(type) {
        return type === 'money' ? 'text-right' : '';
    }

    public onSearch(): void {
        this.onPage(1);
    }

    public onCssClass(status) {
        return status === 1 ? 'active' : '';
    }

    public clearSearch() {
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }

        this.buildCondition(this.searches);
        this.onSearch(); // 清空之后自动调一次search
        this.paging = 1; // 回到第一页
    }

    // 资产池选择框改变
    public inputChange(val: any, index: number) {
        if (val.checked && val.checked === true) {
            val.checked = false;
        } else {
            val.checked = true;
        }
        this.toCalc();
    }


    // 生成回执
    public handleReceipt() {
        if (this.businessSelected && this.businessSelected.length) {
            const data = [];
            this.businessSelected.forEach(x => {
                data.push({mainFlowId: x});
            });

            const params = {
                mainFlowIds: data,
            };
            this.xn.api.post('/ljx/receivable/generate_receipt', params).subscribe(() => {
                this.rows.filter(item => item.checked && item.checked === true).forEach(val => {
                    val.checked = false;
                });
                this.toCalc();
                this.onPage(this.paging);
            });
        }
    }

    // 全选，取消全选
    public handleAllSelect() {
        this.allChecked = !this.allChecked;
        if (this.allChecked) {
            this.rows.map(item => item.checked = true);
        } else {
            this.rows.map(item => item.checked = false);
        }
        this.businessSelected = this.rows.filter(item => item.checked && item.checked === true && item.receivableFile === '')
            .map((x: any) => x.mainFlowId);
        this.btnStatusBool = this.businessSelected && this.businessSelected.length > 0;

    }

    // 查看交易流程
    public viewProcess(item: any) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    // 下载文件
    public downLoadFiles(item: any) {
        if (!!item) {
            const str = JSON.parse(item).fileId;
            this.xn.api.download('/attachment/download/index', {
                key: str
            }).subscribe((v: any) => {
                this.xn.api.save(v._body, str);
            });
        }
    }

    // 当数组中不具有clicked 且为false。没有找到则表示全选中。
    private toCalc() {
        this.businessSelected = this.rows.filter(item => item.checked && item.checked === true && item.receivableFile === '')
            .map((x: any) => x.mainFlowId);
        this.btnStatusBool = this.businessSelected && this.businessSelected.length > 0;
        const find = this.rows.find((x: any) => x.checked === undefined || x.checked === false);
        if (!find) {
            this.allChecked = true;
        } else {
            this.allChecked = false;

        }
    }

    private buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }

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
            obj.number = searches[i].number;
            obj.options = {ref: searches[i].selectOptions};
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
        })); // 深拷贝;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        const time = this.searches.filter(v => v.type === 'quantum');
        this.tolerance = $.extend(true, [], this.searches.filter(v => v.type === 'tolerance').map(v => v.checkerId));

        const forSearch = this.searches.filter(v => v.type !== 'quantum').map(v => v && v.checkerId);
        this.searchArr = $.extend(true, [], forSearch); // 深拷贝;
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;

        this.mainForm.valueChanges.subscribe((v) => {
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime.beginTime;
                const endTime = paramsTime.endTime;

                // 保存每次的时间值。
                this.preChangeTime.unshift({begin: beginTime, end: endTime});
                // 默认创建时间
                this.beginTime = beginTime;
                this.endTime = endTime;
                if (this.preChangeTime.length > 1) {
                    if (this.preChangeTime[1].begin === this.beginTime &&
                        this.preChangeTime[1].end === this.endTime) {
                        // nothing
                    } else {
                        this.paging = 1;
                        this.rows.splice(0, this.rows.length);
                        const params = this.buildParams();
                        this.base.onList(params);
                    }
                }
            }
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches.filter(vv => vv && vv.base === 'number')
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

    // 回退操作
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.sorting = urlData.data.sorting || this.sorting;
            this.naming = urlData.data.naming || this.naming;
            this.words = urlData.data.words || this.words;
            this.beginTime = urlData.data.beginTime || this.beginTime;
            this.endTime = urlData.data.endTime || this.endTime;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                sorting: this.sorting,
                naming: this.naming,
                words: this.words,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs
            });
        }
    }

    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime,
            where: {
                _complex: {
                    _logic: 'AND',
                    isProxy: ['in', [3, 6]],
                    dcType: 4,
                    status: 3,
                    capitalPoolContract: ['!=', ''],
                }
            }
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            if (!$.isEmptyObject(this.arrObjs)) {
                // 如果参数已存在where属性，不重新添加新属性
                if (!params.where) {
                    params.where = {
                        _complex: {
                            _logic: 'AND'  // 搜索时是AND查询
                        }
                    };
                }
            }

            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    if (search.type && search.type === 'select') {
                        params.where._complex[search.checkerId] = this.arrObjs[search.checkerId];
                    } else {
                        params.where._complex[search.checkerId] = ['like', `%${this.arrObjs[search.checkerId]}%`];
                    }
                }
            }
        }
        return params;
    }

}
