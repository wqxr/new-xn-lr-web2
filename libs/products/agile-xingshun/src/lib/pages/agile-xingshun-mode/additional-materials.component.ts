import { Component, ElementRef, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { fromEvent } from 'rxjs';
import {
    AgileXingshunSingleSearchListModalComponent,
    SingleListParamInputModel
} from '../../share/modal/single-searchList-modal.component';
import { UploadLyFileModalComponent } from '../../share/modal/upload-lvyuefile-modal.component';
declare const $: any;

/**
 * 项目公司补充资料
 * 
 */
@Component({
    templateUrl: './additional-materials.component.html',
    styleUrls: ['./additional-materials.component.css']
})
export class AdditionalMaterialsComponent implements OnInit {
    public tabConfig: any;
    // 默认激活第一个标签页 {do_not,do_down}
    public label = 'do_not';
    // 数据
    public data: any[] = [];
    // 页码配置
    public pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    // 搜索项
    public shows: any[] = [];
    public form: FormGroup;
    public searches: any[] = []; // 面板搜索配置项项
    public selectedItems: any[] = []; // 选中的项
    public currentTab: any; // 当前标签页

    public arrObjs = {} as any; // 缓存后退的变量
    public paging = 1; // 共享该变量
    public beginTime: any;
    public endTime: any;
    public timeId = [];
    public nowTimeCheckId = '';
    // 上次搜索时间段
    public preChangeTime: any[] = [];

    public sorting = ''; // 共享该变量
    public naming = ''; // 共享该变量
    public displayShow = true;
    public headLeft: number;
    public subResize: any;
    public scroll_x = 0;   // 滚动条滚动距离

    constructor(private xn: XnService,
        private route: ActivatedRoute,
        private vcr: ViewContainerRef,
        public hwModeService: HwModeService,
        private router: ActivatedRoute,
        private er: ElementRef,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.initData(this.label, true);
        });
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });

    }

    ngAfterViewInit() {
        this.formResize();

    }
    ngOnDestroy() {
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize) {
            this.subResize.unsubscribe();
        }
    }
    formResize() {
        const scrollContainer = $(`<div class="custom-scrollbar" style="box-sizing: border-box;
            position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($('body'));
        const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
        // 滚动条的宽度
        const scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $('.head-height', this.er.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth1}px)`);
    }

    /**
     *  加载信息
     * @param val
     */
    public initData(val: string, init?: boolean) {
        if (this.label === val && !init) { return }
        this.label = val;
        this.selectedItems = []; // 切换标签页是清空选中的项
        this.naming = '';
        this.sorting = '';
        this.paging = 1;
        this.pageConfig = { pageSize: 10, first: 0, total: 0 };
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.onPage({ page: this.paging });
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    public onPage(e?) {
        this.selectedItems = [];
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
        this.xn.dragon.post(this.currentTab.get_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.data = x.data.data;
                x.data.data.forEach(obj => {
                    if (obj.isProxy !== 57) {
                        obj.color = '#D9D9D9';
                    }
                });
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
    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.selectedItems = [];
        this.paging = 1;
        this.onPage({ page: this.paging });
    }

    /**
     * 重置
     */
    public reset() {
        this.selectedItems = [];
        this.paging = 1;
        this.pageConfig = { pageSize: 10, first: 0, total: 0 };
        this.form.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    /**
     *  列表头样式
     * @param paramsKey
     */
    public onSortClass(paramsKey: string): string {
        if (paramsKey === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }
    show() {
        this.displayShow = !this.displayShow;
    }
    /**
     *  按当前列排序
     * @param sort
     */
    public onSort(sort: string) {
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }
        this.onPage({ page: 1 });
    }

    /**
    *  查看更多发票
    * @param paramItem 发票详情
    */
    public viewMore(paramItem: any[]) {
        // 打开弹框
        const params: SingleListParamInputModel = {
            title: '发票详情',
            get_url: '',
            get_type: '',
            multiple: null,
            heads: [
                { label: '发票号码', value: 'invoiceNum', type: 'text' },
                { label: '发票代码', value: 'invoiceCode', type: 'text' },
                { label: '发票含税金额', value: 'invoiceAmount', type: 'money' },
                { label: '发票不含税金额', value: 'amount', type: 'money' },
                { label: '发票开票日期', value: 'invoiceDate', type: 'text' },
            ],
            searches: [],
            key: 'invoiceCode',
            data: paramItem || [],
            total: paramItem.length || 0,
            inputParam: {},
            rightButtons: [{ label: '确定', value: 'submit' }]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AgileXingshunSingleSearchListModalComponent, params).subscribe();
    }

    /**
     *  表头按钮组
     * @param btn {label:string,operate:string,value:string,value2?:string,disabled:boolean}
     */
    public handleHeadClick(btn) { }

    /**
     * 行按钮组事件
     * @param item 当前行数据
     * @param btn {label:string,operate:string,value:string,value2?:string}
     * @param i 下标
     */
    public handleRowClick(item: any, btn: { label: string, operate: string, value: string, value2?: string }, i: number) {
        switch (btn.operate) {
            // 上传履约证明
            case 'update_file':
                this.updateFile(item);
                break;
            // 替换履约证明
            case 'replace_file':
                this.replaceFile(item);
                break;
        }
    }

    /**
     * 上传履约证明
     * @param paramInfo
     */
    private updateFile(paramInfo: any) {
        const params = {
            mainFlowId: paramInfo.mainFlowId,
            title: '上传履约证明文件',
            type: 'upload',
            tableInfo: [...paramInfo],
            buttons: ['取消', '提交'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, UploadLyFileModalComponent, params)
            .subscribe(v => {
                if (!v) { return }
                this.onPage({ page: this.paging });
            })
    }

    /**
     * 替换履约证明
     * @param paramInfo
     */
    private replaceFile(paramInfo: any) {
        const params = {
            mainFlowId: paramInfo.mainFlowId,
            title: '替换履约证明文件',
            type: 'edit',
            tableInfo: [...paramInfo],
            params: JSON.parse(paramInfo.performanceFile),
            buttons: ['取消', '提交'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, UploadLyFileModalComponent, params)
            .subscribe(v => {
                if (!v) { return }
                this.onPage({ page: this.paging });
            })
    }

    /**
    *  查看文件信息
    * @param paramInfo 履约证明文件
    */
    public viewFiles(paramInfo: any) {
        const params = {
            title: '查看履约证明文件',
            type: 'view',
            tableInfo: [...paramInfo],
            params: JSON.parse(paramInfo.performanceFile),
            buttons: ['关闭'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, UploadLyFileModalComponent, params)
            .subscribe()
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
        this.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
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
        this.shows = $.extend(true, [], objList.sort(function (a, b) {
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
                    const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number').map(c => c.checkerId);
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

    /**
     * 构建参数
     */
    private buildParams() {
        // 分页处理
        const params: any = {
            pageNo: this.paging,
            pageSize: this.pageConfig.pageSize,
            isPerformance: this.currentTab.isPerformance, // 是否补充履约证明 0=未补充 1=已补充
        };
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    if (search.checkerId === 'tradeStatus') {
                        params['flowId'] = this.arrObjs[search.checkerId];
                    } else if (search.checkerId === 'receive') {
                        let receive = '';
                        this.arrObjs[search.checkerId].split(',').forEach(v => { receive += v; });
                        params['receive'] = Number(receive);
                    } else if (search.checkerId === 'changePrice') {
                        let changePrice = '';
                        this.arrObjs[search.checkerId].split(',').forEach(v => { changePrice += v; });
                        params['changePrice'] = Number(changePrice);
                    } else {
                        params[search.checkerId] = this.arrObjs[search.checkerId];
                    }
                }
            }
        }
        params.factoringAppId = `${applyFactoringTtype['深圳市星顺商业保理有限公司']}`
        return params;
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
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
            this.beginTime = urlData.data.beginTime || this.beginTime;
            this.endTime = urlData.data.endTime || this.endTime;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
            this.label = urlData.data.label || this.label;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs,
                label: this.label
            });
        }
    }

}
