import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import CapitalcapitalDataAnalyseConfig from 'libs/shared/src/lib/public/dragon-vanke/components/bean/capital-data-analyse';
import { XnSortTypeEnum } from 'libs/shared/src/lib/config/enum/common-enum';
declare var $: any;

@Component({
    selector: 'capital-data-analyse',
    templateUrl: './capital-data-analyse.component.html',
    styleUrls: ['./capital-data-analyse.component.css']
})
export class CapitalDataAnalyseComponent implements OnInit, AfterViewInit, OnDestroy {
    public mainForm: FormGroup;  //表单类
    public rows: any[] = [];  //表单数据
    public formModule: string = 'dragon-input';

    public tableListData: any = {};//表格数据
    public rowsData: any = {};//资产池概况数据

    public tableConfigAll?: any[];  //表格配置项
    public svrConfig?: any;  //控件配置项
    public queryParams: any; // 路由数据
    public subscribeScoll: any;  //scroll事件
    public processBarConfig: any;  //右侧导航配置
    //分页配置
    public pageConfig = {
        contractTypeList: {
            total: 0,  //总数据量
            size: 5,  //每页显示数量
            pageArr: [], //总页数数组
            currentPage: 1  //当前页码
        },
        receiveList: {
            total: 0,
            size: 5,
            pageArr: [],
            currentPage: 1
        },
        projectAreaList: {
            total: 0,
            size: 5,
            pageArr: [],
            currentPage: 1
        },
        debtUnitAreaList: {
            total: 0,
            size: 5,
            pageArr: [],
            currentPage: 1
        },
        projectBusinessList: {
            total: 0,
            size: 5,
            pageArr: [],
            currentPage: 1
        },
        paymentDaysList: {
            total: 0,
            size: 5,
            pageArr: [],
            currentPage: 1
        },
        debtUnitList: {
            total: 0,
            size: 5,
            pageArr: [],
            currentPage: 1
        },
        projectList: {
            total: 0,
            size: 5,
            pageArr: [],
            currentPage: 1
        },
    }
    private naming = '';  // 共享该变量 列css样式
    private sorting = '';  // 共享该变量 列排序
    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,
        private er: ElementRef,
        public hwModeService: HwModeService,) {
    }

    ngOnInit() {
        this.router.params.subscribe((params: Params) => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }
            this.doShow();
        });

        this.router.queryParams.subscribe(params => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }
            this.queryParams = { ...params };
        });
        this.doShow();
        //监听页面滚动条事件
        this.subscribeScoll = fromEvent(window, 'scroll')
            .pipe(debounceTime(200)).subscribe((event) => {
                this.WindowScroll(event);
            });
    }

    ngAfterViewInit() {
    }

    // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
    ngOnDestroy() {
        if (this.subscribeScoll) {
            this.subscribeScoll.unsubscribe();
        }
    }

    /**
     * 处理数据
     */
    private doShow() {
        // console.log("queryParams", this.queryParams);
        let params = {
            capitalPoolId: this.queryParams.capitalPoolId,
        };
        this.xn.loading.open();
        this.xn.dragon.post('/sample/pool_report', params).subscribe(json => {
            this.xn.loading.close();
            if (json && json.ret === 0 && json.data) {
                //基础资产池概况
                let {
                    capitalPoolName,
                    receiveSum,
                    count,
                    projectCount,
                    debtUnitCount,
                    receiveMin,
                    receiveMax,
                    paymentDaysAverage,
                    ...tableList
                } = json.data;
                this.rowsData = { capitalPoolName, receiveSum, count, projectCount, debtUnitCount, receiveMin, receiveMax, paymentDaysAverage };
                this.tableListData = tableList;
                this.buildRows();
                //表格信息
                this.buildTable();
            }
        });

        //右侧导航栏配置
        this.processBarConfig = CapitalcapitalDataAnalyseConfig.barConfig;
    }

    /**
     *  根据配置渲染form
     */
    private buildRows(): void {
        let config = CapitalcapitalDataAnalyseConfig.setRowsValue(this.rowsData);
        config['params'] = this.queryParams;
        this.svrConfig = XnFlowUtils.handleSvrConfig(config);
        this.rows = this.svrConfig.checkers;
        this.rows.forEach(x => {
            if (['receiveSum', 'receiveMin', 'receiveMax'].includes(x.checkerId)) { x.value = XnUtils.formatMoney(x.value) }
        })
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
    }

    /**
     *  根据配置渲染table
     */
    private buildTable(): void {
        this.tableConfigAll = CapitalcapitalDataAnalyseConfig.tableListAll;
        this.onPage('contractTypeList');
        this.onPage('receiveList');
        this.onPage('projectAreaList');
        this.onPage('debtUnitAreaList');
        this.onPage('projectBusinessList');
        this.onPage('paymentDaysList');
        this.onPage('debtUnitList');
        this.onPage('projectList');
    }

    onSortClass(paramsId) {
        if (paramsId === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    /**
   *  按当前列排序
   * @param sort
   */
    public onSort(paramId, paramData) {
        this.sorting = paramId;
        this.naming = this.naming === XnSortTypeEnum.DESC ? XnSortTypeEnum.ASC : XnSortTypeEnum.DESC;
        if (this.naming === XnSortTypeEnum.ASC) {
            paramData = paramData.sort((a, b) => {
                if (a.surplusRate) {
                    return a.surplusRate - b.surplusRate;
                } else {
                    return a.countRate - b.countRate;
                }
            });
        } else {
            paramData = paramData.sort((a, b) => {
                if (a.surplusRate) {
                    return b.surplusRate - a.surplusRate;
                } else {
                    return b.countRate - a.countRate;
                }
            });
        }
        this.cdr.markForCheck();
    }

    /**
   * 描点点击事件
   * @param nav
   * @param e
   * @param index
   */
    public onNavClick(nav: { id: string, value: string, divCss: string, aCss: string }, event: any, index: number) {
        event.preventDefault();
        event.stopPropagation();
        this.setCss(nav.id);
        document.getElementById(nav.id).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }

    /**
     * 监测页面滚动监听事件
     * $(...).offset().top 获取要定位元素距离浏览器顶部的距离
     * @param event
     */
    public WindowScroll(event: any) {
        let allScrollTop = [];
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        this.processBarConfig.forEach((item) => {
            allScrollTop.push({
                top: $(`#${item.id}`).offset().top,
                id: item.id
            });
        });
        //升序排序
        allScrollTop.sort((a, b) => a.top - b.top);
        //过滤出top为正的数据
        let positiveScrollTop = allScrollTop.filter((x) => x.top - scrollTop > -20 && x.top - scrollTop <= 120);
        let id = positiveScrollTop[0] ? positiveScrollTop[0].id : '';
        this.setCss(id);
    }

    /**
     * 设置导航样式
     * @param targetId
     */
    public setCss(targetId: string) {
        this.processBarConfig.forEach((obj) => {
            if (obj.id === targetId) {
                obj['divCss'] = true;
                obj['aCss'] = true;
            } else {
                obj['divCss'] = false;
                obj['aCss'] = false;
            }
        });
    }

    /**
     * 下载分析结果-可将本页数据以 excel形式下载到本地，每个列表一个sheet
     * @param event
     */
    public onDownload(event: any) {
        this.xn.loading.open();
        this.xn.dragon.download('/sample/download_pool_report', { capitalPoolId: this.queryParams.capitalPoolId }).subscribe((v: any) => {
            this.xn.loading.close();
            this.xn.dragon.save(v._body, '分析结果.xlsx');
        }, () => {
            this.xn.loading.close();
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     * 返回到基础资产列表
     * @param event
     */
    public onGoBack(event: any) {
        this.onCancel();
    }

    /**
     *  取消并返回
     */
    public onCancel() {
        this.xn.router.navigate(['/agile-hz/assets-management/capital-pool'], {
            queryParams: {
                ...this.queryParams
            }
        });
    }

    /**
     * 首页
     * @param checkerId 表格标识
     */
    public firstPage(checkerId: string) {
        this.pageConfig[checkerId].currentPage = 1;
        this.onPage(checkerId);
    }

    /**
     * 上一页
     * @param checkerId 表格标识
     */
    public previousPage(checkerId: string) {
        if (this.pageConfig[checkerId]['pageArr'].length < 2 ||
            this.pageConfig[checkerId].currentPage === this.pageConfig[checkerId]['pageArr'][0]) { return }
        this.pageConfig[checkerId].currentPage = this.pageConfig[checkerId].currentPage - 1;
        this.onPage(checkerId);
    }

    /**
     * 选择页码
     * @param checkerId
     * @param pages 传入的页码
     */
    public selectPage(checkerId: string, pages: number) {
        this.pageConfig[checkerId].currentPage = pages;
        this.onPage(checkerId);
    }

    /**
     * 判断页码是否已选中
     * @param checkerId
     * @param pages 传入的页码
     */
    public isPageActive(checkerId: string, pages: number) {
        return this.pageConfig[checkerId].currentPage === pages;
    }

    /**
     * 判断页码是否已选中
     * @param checkerId
     * @param label 区分分页按钮
     */
    public isPageDisabled(checkerId: string, label: string) {
        if (label === 'first' || label === 'prev') {
            return this.pageConfig[checkerId].currentPage <= 1;
        } else if (label === 'next' || label === 'last') {
            return this.pageConfig[checkerId].currentPage >= this.pageConfig[checkerId].pageArr.length;
        }
    }

    /**
     * 下一页
     * @param checkerId 表格标识
     */
    public nextPage(checkerId: string) {
        if (this.pageConfig[checkerId]['pageArr'].length < 2 ||
            this.pageConfig[checkerId].currentPage === this.pageConfig[checkerId]['pageArr'].slice(-1)[0]) { return }
        this.pageConfig[checkerId].currentPage = this.pageConfig[checkerId].currentPage + 1;
        this.onPage(checkerId);
    }

    /**
     * 末页
     * @param checkerId 表格标识
     */
    public lastPage(checkerId: string) {
        this.pageConfig[checkerId].currentPage = this.pageConfig[checkerId].pageArr.length;
        this.onPage(checkerId);
    }

    /**
     * 页码改变触发
     * @param checkerId
     */
    onPage(checkerId: string) {
        let param = {
            start: (this.pageConfig[checkerId].currentPage - 1) * this.pageConfig[checkerId].size,
            length: this.pageConfig[checkerId].size,
        };
        let tableList = this.deepCopy(this.tableListData[checkerId], []);
        this.pageConfig[checkerId].total = this.tableListData[checkerId].length || 0;
        let pageLimit = Math.ceil(this.tableListData[checkerId].length / this.pageConfig[checkerId].size);
        this.pageConfig[checkerId].pageArr = Array.from({ length: pageLimit }, (item, index) => index + 1);

        let listObj = {};
        let rateCount = { receiveSum: this.rowsData.receiveSum, count: this.rowsData.count };
        listObj[checkerId] = tableList.slice(param.start, param.start + param.length);
        this.tableConfigAll = CapitalcapitalDataAnalyseConfig.setTableValue(listObj, rateCount);
    }

    deepCopy(obj, c?: any) {
        c = c || {};
        for (let i in obj) {
            if (!!obj[i] && typeof obj[i] === 'object') {
                c[i] = obj[i].constructor === Array ? [] : {};
                this.deepCopy(obj[i], c[i]);
            } else {
                c[i] = obj[i];
            }
        }
        return c;
    }

}
