import { Component, ViewChild, ChangeDetectorRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable ,  Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { MfilesViewModalComponent } from './mfiles-view-modal.component';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

/**
 *  picker 选项模态框
 */
@Component({
    templateUrl: './single-searchList-modal.component.html',
    styles: [`
        table {
            table-layout: fixed;
            margin: 0;
        }

        table tr td:first-child, table tr th:first-child {
            width: 300px;
        }

        table tr td:nth-child(2), table tr th:nth-child(2) {
            width: 350px;
        }

        .scroll-height {
            max-height: calc(100vh - 450px);
            overflow-y: auto
        }

        .scroll-height > table {
            border-top: none;
            word-wrap: break-word;
            word-break: break-all;
        }

        .scroll-height > table tr:first-child td {
            border-top: 0;
        }
    `]
})
export class SingleSearchListModalComponent implements OnInit, OnDestroy {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    private lists: any[] = [];  // 所有数据
    selectItems: any[] = [];
    other: any;  // 其他参数
    // 分页
    // 页码配置
    pageConfig = {
        pageSize: 5,
        first: 0,
        total: 0,
    };
    paging = 0; // 共享该变量
    arrObjs = {} as any; // 缓存后退的变量

    // 搜索项
    shows: any[] = [];
    searches: any[] = []; // 面板搜索配置项项

    heads: any[] = [];
    data: any[] = []; // 当前页数据

    params: any;
    form: FormGroup;
    // 声明订阅对象
    rooterChange: Subscription;
    constructor(private xn: XnService, private cdr: ChangeDetectorRef, private router: Router,
                public hwModeService: HwModeService, private vcr: ViewContainerRef, ) {
    }

    ngOnInit(): void {
        // 监听路由变化
        this.rooterChange = this.router.events.subscribe((data) => {
            // 路由导航结束之后处理
            if (data instanceof NavigationEnd) {
                this.onCancel();
            }
        });
    }
    open(params: any): Observable<string> {
        // console.log(params);
        this.params = params;
        this.lists = params.data;
        this.heads = params.heads;
        this.other = params.other;
        this.initData(); // 初始化数据
        // 初始化时有选中项，则打开添加按钮
        this.selectItems = [...this.selectItems, ...this.lists.filter((x: any) => x.checked === true)];
        this.isAllChecked();
        this.cdr.markForCheck();
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public initData() {
        this.onPage({ page: this.paging });
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     */
    onPage(e?) {
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        this.searches = this.params.searches; // 当前标签页的搜索项
        this.buildShow(this.searches);
        // 构建参数
        const params = this.buildParams();
        if (this.params.get_url !== '') {
            this.xn.loading.open();
            this.xn[this.params.get_type].post(this.params.get_url, params).subscribe(x => {
                if (x.data && x.data.data && x.data.data.length) {
                    this.data = x.data.data;
                    this.pageConfig.total = x.data.count;
                } else if (x.data && x.data.rows && x.data.rows.length) {
                    this.data = x.data.rows;
                    this.pageConfig.total = x.data.count;
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
        } else if (this.params.data.length > 0) {
            this.data = this.filterBySearch(params);
        }

    }

    ngOnDestroy(): void {
        if (this.rooterChange) {
            this.rooterChange.unsubscribe();
        }
    }

    /**
     *
     * @param searches 搜索项
     * @param params 搜索条件
     */
    public filterBySearch(params: any) {
        let result = [];
        let searchFlag: any;
        const searchList = [];
        this.pageConfig.total = this.params.total;
        Object.keys(params).filter((key) => !(['start', 'length'].includes(key))).forEach((key) => {
            const searchObj = {
                [key]: params[key]
            };
            searchList.push(searchObj);
        });
        if (searchList.length > 0) {
            result = this.lists.slice(params.start, params.start + params.length).filter((list) => {
                searchList.forEach((search, index) => {
                    if (index === 0) {
                        searchFlag = list[Object.keys(search)[0]] === params[Object.keys(search)[0]];
                    } else {
                        searchFlag = searchFlag && list[Object.keys(search)[0]] === params[Object.keys(search)[0]];
                    }
                });
                return searchFlag;
            });
        } else {
            result = this.lists.slice(params.start, params.start + params.length);
        }
        return result;
    }

    /**
     * 构建搜索项
     * @param searches
     */
    private buildShow(searches) {
        this.shows = [];
        this.buildCondition(searches);
    }

    /**
     * 搜索项值格式化
     * @param searches
     */
    private buildCondition(searches) {
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            obj.value = this.arrObjs[searches[i].checkerId];
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        this.form.valueChanges.subscribe((v) => {
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
        });
    }

    /**
     * 构建参数
     */
    private buildParams() {
        // 分页处理
        const params: any = {
            ...this.params.inputParam,
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize
        };
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
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.selectItems = [];
        this.paging = 1;
        this.onPage({ page: this.paging, first: 0 });
    }

    /**
     * 重置
     */
    public reset() {
        this.selectItems = [];
        // this.form.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    /**
     *  判读列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.data.some(x => !x.checked || x.checked && x.checked === false) || this.data.length === 0);
    }

    /**
     *  全选
     * @param e
     */
    public checkAll(e) {
        if (!this.isAllChecked()) {
            this.data.forEach(item => item.checked = true);
            this.selectItems = XnUtils.distinctArray2([...this.selectItems, ...this.data], this.params.key);
        } else {
            this.data.forEach(item => item.checked = false);
            this.selectItems = [];
        }
    }

    /**
     * 单选
     * @param e
     * @param item
     * @param index
     */
    public singelChecked(e, item, index) {
        if (item.checked && item.checked === true) {
            item.checked = false;
            this.selectItems = this.selectItems.filter((x: any) => x[this.params.key] !== item[this.params.key]);
        } else {
            item.checked = true;
            this.selectItems.push(item);
            this.selectItems = XnUtils.distinctArray2(this.selectItems, this.params.key); // 去除相同的项
        }
        this.isAllChecked();
    }

    /**
     *  查看文件信息
     * @param paramFile
     */
    public viewFiles(paramFile) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, [paramFile]).subscribe();
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 取消操作
    public onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    handleAdd() {
        // selectItems 先去重在提交
        const items = XnUtils.distinctArray2(this.selectItems, this.params.key);
        this.close({ action: 'ok', value: items });
    }

}
