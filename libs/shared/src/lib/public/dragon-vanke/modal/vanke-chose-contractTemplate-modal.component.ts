import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, of } from 'rxjs';
import VankebusinessdataTabConfig from '../../dragon-vanke/components/bean/vanke-business-related';
import { XnService } from '../../../services/xn.service';
import { ModalSize, ModalComponent } from '../../../common/modal/components/modal';
import { JsonTransForm } from '../../../public/pipe/xn-json.pipe';
import { XnUtils } from '../../../common/xn-utils';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { SelectOptions } from '../../../config/select-options';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { ContractManagerEnum } from '../../../config/enum/common-enum';
import { DragonPdfSignModalComponent } from './pdf-sign-modal.component';

@Component({
    selector: 'selector-name',
    templateUrl: './vanke-chose-contractTemplate-modal.component.html'
})

export class VankechoseTemplateModalComponent implements OnInit {
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
    shows: any[] = [];
    form: FormGroup;
    public numberok = 1;
    searches: any[] = []; // 面板搜索配置项项
    selectedItems: any[] = []; // 选中的项

    arrObjs = {} as any; // 缓存后退的变量
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
    url = '';
    params: any;
    signTypeList: any[] = [];
    styleList: any[] = [];
    signType: number;
    style: number;
    createType:number;
    templateName: string;
    generateList:any[]=[]; // 合同生成方式


    constructor(private xn: XnService, private cdr: ChangeDetectorRef,private vcr: ViewContainerRef,) {
    }

    ngOnInit(): void {
        this.tabConfig = VankebusinessdataTabConfig.choseContractTemplate;
        this.initData(this.label);
        this.signTypeList = SelectOptions.get('signType');
        this.styleList = SelectOptions.get('generateLogicNumber');
        this.generateList=SelectOptions.get('concreateType');
    }


    /**
     * 打开查看窗口
     * @param params
     * @returns {Observable}
     */
    open(params: any): Observable<any> {
        this.params = params;
        // 传递过来已经选中的项
        if (params.secondTemplateList && this.judgeDataType(JSON.parse(params.secondTemplateList))) {
            this.selectedItems = $.extend(true, [], JSON.parse(params.secondTemplateList));
        }
        this.cdr.markForCheck();
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
     *  查看合同，只读
     * @param con
     */
    public showContract(paramId) {
       this.xn.loading.open();
       this.xn.dragon.post('/contract/first_contract_info/get_first_temlate_file',{id:paramId,type:ContractManagerEnum.SECOND_CONTRACT_MANAGE}).subscribe(x=>{
           if(x.ret===0){
               this.xn.loading.close();
               const data=JSON.parse(x.data)[0];
               const params = Object.assign({}, data, { readonly: true });
               XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
               });
           }
       })
   }
    changeSignType(e) {
        if (e.target.value === '') {
            this.signType = undefined;

        } else {
            this.signType = Number(e.target.value);

        }
        this.onPage({ page: this.paging });
    }

    changeStyle(e) {
        if (e.target.value === '') {
            this.style = undefined;
        } else {
            this.style = Number(e.target.value);

        }
        this.onPage({ page: this.paging });

    }
    generateStyle(e){
        if (e.target.value === '') {
            this.createType = undefined;
        } else {
            this.createType = Number(e.target.value);

        }
        this.onPage({ page: this.paging });

    }
    onInput() {
        this.onPage({ page: this.paging });

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
        const params = this.buildParams();
        if (this.tabConfig.url === '') {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        // 龙光-博时资本 需要isLgBoShi字段区分龙光的业务 0=非龙光博时资本 1=龙光博时资本
        if (this.xn.router.url.startsWith('/pslogan')) {
            params.isLgBoShi = 1;
        }
        this.xn.dragon.post('/contract/second_contract_info/get_template_list', params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.data = x.data.data;
                this.pageConfig.total = x.data.count;
                this.checkByPrevItems(this.selectedItems);
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
        return !(this.data.some(x => !x.checked || x.checked && x.checked === false) || this.data.length === 0);
    }

    /**
     *  全选
     * @param e
     */
    public checkAll(e) {
        if (!this.isAllChecked()) {
            this.data.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], 'id');
        } else {
            this.data.forEach(item => item.checked = false);
            const prevArr = this.data.map((prev) => { return prev.id; });
            this.selectedItems = this.selectedItems.filter(item => { return !prevArr.includes(item.id) });
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
            this.selectedItems = this.selectedItems.filter((x: any) => x.id !== item.id);
        } else {
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'id'); // 去除相同的项

        }
    }


    /**
     * 构建参数
     */
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime,
            headquarters: this.params.headquarters,
            signType: this.signType,
            style: this.style,
            createType:this.createType,

            templateName: this.templateName

            // templateName: this.params.headquarters,
        };
        // 排序处理

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
        this.modal.close({ action: 'cancel' });
    }
    /**
     *
     * @param head 所选单个公司的详情，删除单个已添加的公司
     */
    clearData(head: any) {
        const clearindex = this.selectedItems.findIndex((item) => item.id === head.id);
        head.checked = false;
        this.data.map(item => {
            if (item.id === head.id) {
                item.checked = false;
            }
        });
        this.selectedItems.splice(clearindex, 1);
    }
    /**
     * 确定添加公司企业
     */
    SureAddComp() {
        const secondTemplateId = this.selectedItems.map((x: any) => x.id);
        this.xn.dragon.post('/contract/second_contract_info/add_second_template',
            { project_manage_id: this.params.project_manage_id, secondTemplateId }).subscribe(x => {
                if (x.ret === 0) {
                    this.close({ action: 'ok' });
                }
            });
        // this.close(this.selectedItems);

    }
    /**
     *  清空所有已选企业
     */
    clearcompany() {
        this.data.forEach(item => item.checked = false);
        this.selectedItems = [];
    }

    /**
     * 根据带过来的已选项勾选表格对应记录
     * @param prevItem  带过来的已选项
     */
    public checkByPrevItems(prevItem: any[]) {
        const prevArr = prevItem.map((prev) => {
            return prev.id;
        });
        this.data.filter(item => {
            return prevArr.includes(item.id);
        }).forEach((da) => { da.checked = true; });
    }
}
