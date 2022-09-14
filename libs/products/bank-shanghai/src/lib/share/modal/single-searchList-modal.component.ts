import { Component, ViewChild, ChangeDetectorRef, ViewContainerRef, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable ,  Subscription, fromEvent } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ShangHaiMfilesViewModalComponent } from './mfiles-view-modal.component';
import { transFormatJson } from 'libs/shared/src/lib/public/pipe/xn-json-pre.pipe';

/**
 *  参数默认
 */
export class ShSingleListParamInputModel {
    /** 标题 */
    public title: string;
    /** 接口url */
    public get_url: string;
    /** 接口类型 dragon avenger api */
    public get_type: string;
    /** 行选择配置 single 单选  check 复选  null 无选框*/
    public multiple: string | null;
    /** 表头配置 */
    public heads: any[];
    /** 搜索项配置 */
    public searches: any[];
    /** 主键，用于数据过滤 */
    public key: string;
    /** 表格数据，数据无需调用接口获取时使用 */
    public data: any[];
    /** 数据长度 */
    public total: number;
    /** 调用接口需传入的参数 */
    public inputParam?: {
        [key: string]: any
    };
    /** 按钮配置 [{label: '', value: ''}]*/
    public leftButtons?: any[];
    public rightButtons: any[];
    /** modal大小配置 */
    public size?: string;
    /** 其他配置 */
    public options?: {
        [key: string]: any
    };
    constructor() {
        this.multiple = null;
        this.data = [];
        this.total = 0;
        this.options = { tips: '' };
        this.rightButtons = [{ label: '取消', value: 'cancel' }, { label: '确定', value: 'submit' }];
        this.size = ModalSize.XLarge;
    }
}

/**
 *  picker 选项模态框
 */
@Component({
    templateUrl: './single-searchList-modal.component.html',
    styles: [`
    .table-head table,.table-body table{
        margin-bottom: 0px;
        word-break: break-all;
    }
    .table-body{
        width:100%;
        max-height:270px;
        overflow-y: scroll;
        min-height:50px;
    }
    .table-body table tr:nth-child(2n+1){
        background-color:#f9f9f9;
    }
    table thead,tbody tr {
        display:table;
        width:100%;
        table-layout:fixed;
    }
    .table-head table tr th {
        border:1px solid #cccccc30;
        text-align: center;
    }
    .table-body table tr td{
        border:1px solid #cccccc30;
        text-align: center;
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
export class ShSingleSearchListModalComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('listHead') listHead: ElementRef;
    @ViewChild('listBody') listBody: ElementRef;
    @ViewChild('listTbody') listTbody: ElementRef;
    observer: any;
    lists: any[] = [];  // 所有数据
    // 搜索项
    shows: any[] = [];
    searches: any[] = []; // 面板搜索配置项项

    heads: any[] = [];
    data: any[] = []; // 当前页数据
    selectItems: any[] = [];

    options: any;  // 其他参数
    // 分页页码配置
    pageConfig = {
        pageSize: 5,
        first: 0,
        total: 0,
    };
    paging = 0; // 共享该变量
    arrObjs = {} as any; // 缓存后退的变量

    leftButtons: any[];
    rightButtons: any[];
    params: ShSingleListParamInputModel = new ShSingleListParamInputModel();
    form: FormGroup;
    // 声明订阅对象
    rooterChange: Subscription;
    subResize: any;
    constructor(private xn: XnService, private cdr: ChangeDetectorRef, private router: Router, private er: ElementRef,
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
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }

    open(params: ShSingleListParamInputModel): Observable<string> {
        this.params = Object.assign({}, this.params, params);
        this.lists = params.data;
        this.heads = params.heads;
        this.options = params.options || {};
        this.leftButtons = params.leftButtons || [];
        this.rightButtons = params.rightButtons || [];

        this.initData(); // 初始化数据
        // 初始化时有选中项，则打开添加按钮
        this.selectItems = [...this.selectItems, ...this.lists.filter((x: any) => x.checked === true)];
        this.isAllChecked();
        this.cdr.markForCheck();
        const size = params.size || ModalSize.XLarge;
        this.modal.open(size);
        this.formResize();
        return new Observable(observer => {
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
                }  else if (x.data  && x.data.length) {
                    this.data = x.data;
                    this.pageConfig.total = x.data.length;
                } else {
                    // 固定值
                    this.data = this.params.get_url.includes('shanghai_bank/sh_bank_gateway/getFailData') ? [{
                        extStatus: 0,
                        response: '',
                        status: null,
                        taskType: '',
                        updateTime: 0
                    }] : [];
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
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize) {
            this.subResize.unsubscribe();
        }
    }

    ngAfterViewInit() {
        this.formResize();
    }

    formResize() {
        const scrollContainer = $(`<div class="custom-scrollbar" style="box-sizing: border-box;
            position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($('body'));
        const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
        // 滚动条的宽度
        const scrollBarWidth = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $(this.listHead.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth}px)`);
    }

    /**
     * 左侧按钮点击事件
     * @param btn
     */
    onBtnClick(btn: { laebl: string, value: string }) {
        if (btn.value === 'sample-model') {
            this.xn.router.navigate(['/console/manage/sampling/management-list']);
        } else if (btn.value === 'cancel') {
            this.onCancel();
        } else if (['submit', 'repeatRequst', 'addInfo', 'execute_next_process'].includes(btn.value)) {
            this.onSubmit(btn);
        } else {
            this.onCancel();
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
            const resultTmplate = this.lists.filter((list) => {
                searchList.forEach((search, index) => {
                    if (index === 0) {
                        searchFlag = list[Object.keys(search)[0]] === params[Object.keys(search)[0]];
                    } else {
                        searchFlag = searchFlag && list[Object.keys(search)[0]] === params[Object.keys(search)[0]];
                    }
                });
                return searchFlag;
            });
            this.pageConfig.total = resultTmplate.length;
            result = resultTmplate.slice(params.start, params.start + params.length);
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
        let params: any = {} as any;
        if (this.options.paramsType && this.options.paramsType === 1) {
            // 分页处理
            params = {
                ...this.params.inputParam,
                pageNo: this.paging,
                pageSize: this.pageConfig.pageSize
            };

        } else if (this.options.paramsType && this.options.paramsType === 2) {
            params = {} as any;
        } else if (this.options.paramsType && this.options.paramsType === 3) {
            params = {
                ...this.params.inputParam,
            } as any;
        } else {
            // 分页处理
            params = {
                ...this.params.inputParam,
                start: (this.paging - 1) * this.pageConfig.pageSize,
                length: this.pageConfig.pageSize
            };
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
     * 单选框选择
     * @param e
     * @param item
     * @param index
     */
    public radioChecked(e, item, index) {
        this.data.forEach((item, _index) => {
            if (_index === index) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        });
        this.selectItems = [item];
    }

    /**
     *  查看文件信息
     * @param paramFile
     */
    public viewFiles(paramFile) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiMfilesViewModalComponent, [paramFile]).subscribe();
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

    /**
     *  按鈕样式
     * @param btn
     */
    public getBtnClass(btn: string): string {
        return ['submit', 'repeatRequst', 'addInfo'].includes(btn) ? 'btn btn-success' :
        ['execute_next_process'].includes(btn) ? 'btn btn-info' : 'btn btn-default';
    }

    // 取消操作
    public onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    /**
     * 提交操作
     */
    onSubmit(btn) {
        // selectItems 先去重在提交
        const items = XnUtils.distinctArray2(this.selectItems, this.params.key);
        if (btn && btn.url && btn.id === 'systemSample') {
            // 入参-规则编号集合
            const params = {
                id: items[0].id,
                type: items[0].type,
                capitalPoolId: this.params.options.capitalPoolId,
            };
            // 获取系统抽样匹配的结果
            this.xn.loading.open();
            this.xn[btn.urlType].post(btn.url, params).subscribe(x => {
                if (x.data && x.data.data && x.data.data.length) {
                    this.close({ action: 'ok', value: x.data.data });
                } else {
                    this.xn.msgBox.open(false, `未抽样到具体交易,请选择其他模型或规则进行抽样`);
                }
            }, () => {
            }, () => {
                this.xn.loading.close();
            });
        } else if (btn && btn.value === 'addInfo') {
            this.close({ action: 'addInfo', value: this.data[0]?.status });
        } else if (btn && btn.value === 'execute_next_process') {
            this.close({ action: 'execute_next_process', value: this.data[0]?.status });
        } else {
            this.close({ action: 'ok', value: items });
        }
    }

}
