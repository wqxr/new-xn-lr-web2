import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { JsonTransForm } from '../../../public/pipe/xn-json.pipe';
import { XnUtils } from '../../../common/xn-utils';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { SelectOptions } from '../../../config/select-options';

@Component({
    selector: 'selector-name',
    templateUrl: './vanke-addAgency.modal.component.html'
})

export class VankeAddAgencyModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;

    tabConfig: any;
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'do_not';
    // 数据
    data: any[] = [];
    // 页码配置
    pageConfig = {
        pageSize: 5,
        first: 0,
        total: 0,
    };
    // 搜索项
    form: FormGroup;
    public numberok: number = 1;
    searches: any[] = []; // 面板搜索配置项项
    selectedItems: any[] = []; // 选中的项


    arrObjs = {}; // 缓存后退的变量
    paging = 0; // 共享该变量
    beginTime: any;
    endTime: any;
    timeId = [];
    nowTimeCheckId = '';
    // 上次搜索时间段
    preChangeTime: any[] = [];

    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    private observer: any;
    url: string = '';
    choseList: any[];
    vankeAddIntermediary: any[];
    appName: string = '';
    orgName: string = '';
    agencyType: number = 0;
    project_manage_id: string = '';
    public delIds: string[] = [];
    public addIds: string[] = [];
    public params: any; // 参数
    constructor(private xn: XnService) {
    }

    ngOnInit(): void {
        this.vankeAddIntermediary = SelectOptions.get('vankeAddIntermediary');

        this.initData(this.label);
    }


    /**
     * 打开查看窗口
     * @param params
     * @returns {Observable}
     */
    open(params: any): Observable<any> {

        this.params = params;
        this.project_manage_id = params.project_manage_id;
        this.agencyType = params.agencyType || 0;
        this.selectedItems = params.value === '' ? [] : JSON.parse(params.value);
        if (this.selectedItems.length !== 0) {
            this.selectedItems.forEach(x => {
                x.checked = true;
            });
        }
        this.choseList = this.selectedItems.map(x => x.appId);
        this.modal.open(ModalSize.XLarge);
        this.onPage({ page: this.paging });
        return Observable.create(observer => {
            this.observer = observer;
        });

    }


    /**
  *  提交
  */
    public handleSubmit() {
        this.SureAddComp();
    }

    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }

    /**
     *  格式化数据
     * @param data
     */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }

    /**
     *  加载信息
     * @param val
     */
    public initData(val: string) {
        if (this.label !== val) {
            this.selectedItems = []; // 切换标签页是清空选中的项
            this.naming = '';
            this.sorting = '';
        }
        this.label = val;
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    public onPage(e?) {
        this.paging = e.page || 1;
        this.onUrlData(); // 导航回退取值
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        // this.buildShow(this.searches);
        // 构建参数
        const params = this.buildParams();
        this.xn.loading.open();
        if (this.params.rowName === 'userList' && this.project_manage_id) {
            this.xn.dragon.post('/project_manage/agency/project_agency_user_list', params).subscribe(x => {
                if (x.data && x.data.rows && x.data.rows.length) {
                    this.data = x.data.rows;
                    this.data.forEach(v => {
                        this.selectedItems.forEach(x => {
                            if (v.userId === x.userId) {
                                v.checked = true;
                            }
                        });
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
        } else {
            this.xn.dragon.post('/project_manage/agency/agency_list', params).subscribe(x => {
                if (x.data && x.data.rows && x.data.rows.length) {
                    this.data = x.data.rows;
                    this.data.forEach(v => {
                        this.selectedItems.forEach(x => {
                            if (v.userId === x.userId) {
                                v.checked = true;
                            }
                        });
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

    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.paging = 1;
        this.onPage({ page: this.paging });
    }

    /**
     * 重置
     */
    public reset() {
        this.selectedItems = [];
        this.appName = '';
        this.orgName = '';
        this.agencyType = this.params.agencyType || 0;
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
     *  判读列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.data.some(x => !x['checked'] || x['checked'] && x['checked'] === false) || this.data.length === 0);
    }

    /**
     *  全选
     * @param e
     */
    public checkAll(e) {
        if (!this.isAllChecked()) {
            this.data.forEach(item => item['checked'] = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], 'userId');
        } else {
            this.data.forEach(item => item['checked'] = false);
            this.selectedItems = [];
        }
    }

    /**
     * 单选
     * @param e
     * @param item
     * @param index
     */
    public singelChecked(e, item, index) {

        if (item['checked'] && item['checked'] === true) {
            item['checked'] = false;
            this.selectedItems = this.selectedItems.filter(x => x.userId !== item.userId);
        } else {
            item['checked'] = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'userId'); // 去除相同的项
            this.addIds.push(item.appIds);

        }
    }
    /**
     * 构建参数
     */
    private buildParams() {
        // 分页处理
        let params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
        };
        if (this.params.rowName === 'userList' && this.project_manage_id) {
            params['project_manage_id'] = Number(this.project_manage_id)
        } else {
            params['agencyType'] = this.agencyType
        }
        if (this.appName !== '') {
            params = { ...params, appName: this.appName };
        }
        if (this.orgName !== '') {
            params = { ...params, orgName: this.orgName };
        }
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
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
    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
    // 取消操作
    public oncancel() {
        this.modal.close();
    }
    /**
     *
     * @param head 所选单个公司的详情，删除单个已添加的公司
     */
    clearData(head: any) {
        this.delIds.push(head.appId);
        let clearindex = this.selectedItems.findIndex((item) => { return item.userId === head.userId });
        head.checked = false;
        this.selectedItems.splice(clearindex, 1);
    }
    /**
     * 确定添加公司企业
     */
    SureAddComp() {
        this.selectedItems.forEach(x => x['agencyType'] = this.params.agencyType);
        let currentItems = this.selectedItems.map(x => x.appId);
        this.addIds = currentItems.filter((val) => { return this.choseList.indexOf(val) === -1 });
        this.close({ action: 'ok', value: this.selectedItems });
        // if (this.addIds.length === 0 && this.delIds.length === 0) {
        //     this.modal.close();

        // } else {
        //     this.xn.dragon.post('/project_manage/agency/add_agency',
        //         { project_manage_id: this.project_manage_id, addIds: this.addIds, delIds: this.delIds }).subscribe(x => {
        //             if (x.ret === 0) {
        //                 this.close({ action: 'ok', value: this.selectedItems });

        //             }
        //         });
        // }

    }
    /**
     *  清空所有已选企业
     */
    clearcompany() {
        this.data.forEach(item => item['checked'] = false);
        this.selectedItems = [];
        this.delIds = this.choseList;
    }


}
