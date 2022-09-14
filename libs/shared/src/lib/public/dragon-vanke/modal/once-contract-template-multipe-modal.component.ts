import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonTransForm } from '../../../public/pipe/xn-json.pipe';
import { XnUtils } from '../../../common/xn-utils';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { XnService } from '../../../services/xn.service';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { DragonPdfSignModalComponent } from './pdf-sign-modal.component';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import onceContractTemplateTab from '../components/bean/once-contract-template.tab';
import { applyFactoringTtype } from '../../../config/select-options';
import { ContractManagerEnum } from '../../../config/enum/common-enum';

@Component({
    selector: 'dragon-once-contract-multipe-modal',
    templateUrl: './once-contract-template-multipe-modal.component.html',
    styles: [`
    .font-bold{
        font-size: 15px;
        font-weight: bolder;
        margin-bottom: 16px;
    }
    .item-box {
        position: relative;
        display: flex;
        margin-bottom: 10px;
    }
    .item-label label {
        width: fit-content;
        padding-right: 8px;
        font-weight: normal;
        line-height: 34px;
        text-align:left;
    }
    .item-control {
        flex: 1;
    }
    .select-items p{
        width: fit-content;padding: 0px 5px;
        margin: 5px 5px 0px 5px;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 10px;
    }
    .select-items p:hover{
        border-color:#3c8dbc;
    }
    .select-items{
        width:calc(100% - 30px);
        height: 250px;
        border: 1px solid #ccc;
        margin: 20px 0px 0px 10px;
        overflow:auto;
    }

    `]
})

export class OnceContractMultipeSelectModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;

    tabConfig: any;
    key: any;  // 传递的标识
    // 默认激活第一个标签页 {do_not,do_down}
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

    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    private observer: any;
    params: any;
    public alert = ''; // 错误提示
    type = { excelext: 'xlsx,xls' };
    constructor(private xn: XnService, private cdr: ChangeDetectorRef, private vcr: ViewContainerRef,) {
    }

    ngOnInit(): void {
    }

    /**
     * 打开查看窗口
     * @param params
     * @returns {Observable}
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.key = params.key;
        // 传递过来已经选中的项
        if (params.originalItems && params.originalItems.length > 0) {
            this.selectedItems = $.extend(true, [], params.originalItems);
        }
        this.tabConfig = onceContractTemplateTab[params.checkerId];
        // 一转让合同组新增 根据总部公司查询合同模板
        if (params.checkerId === 'contractTemplate') {
            this.tabConfig.searches[0].value = params.headquarters;
        }
        this.initData();
        this.cdr.markForCheck();
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
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
    beforeUpload(event) {

    }
    /**
     *  格式化数据
     * @param data
     */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }
    private validateExcelExt(s: string): string {
        if ('excelext' in this.type) {
            const exts = this.type.excelext.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `只支持以下文件格式: ${this.type.excelext}`;
            }
        } else {
            return '';
        }
    }
    // 上传excel
    uploadExcel(e) {
        if (e.target.files.length === 0) {
            return;
        }
        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;
            $(e.target).val('');
            return;
        }
        const fd = new FormData();
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        if (!!this.params.formValue && this.params.formValue.get('id') !== null) {
            fd.append('contractId', this.params.formValue.get('id').value);
        }
        /**
         *  应收款保理计划表上传
         */
        this.xn.api.dragon.upload('/contract/first_contract_info/upload_excel', fd).subscribe(json => {
            if (json.type === 'complete') {
                if (json.data.ret === 0) {
                    this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...json.data.data.success], 'appId');
                    this.selectedItems.forEach(x => {
                        x.checked = true;
                    });
                    this.checkByPrevItems(this.selectedItems);
                    this.cdr.markForCheck();
                }
            }
            $(e.target).val('');
        });

    }
    public downloadTp02() {
        const a = document.createElement('a');
        a.href = '/assets/lr/doc/公司.xlsx';
        a.click();
    }
    /**
     *  查看合同，只读
     * @param con
     */
    public showContract(con,paramId) {
        const newId=con.contractId?con.contractId:paramId; // 获取合同编号
        this.xn.loading.open();
        this.xn.dragon.post('/contract/first_contract_info/get_first_temlate_file',{id:newId,type:ContractManagerEnum.ONCE_CONTRACT_MANAGE}).subscribe(x=>{
            if(x.ret===0){
                this.xn.loading.close();
                const data=JSON.parse(x.data)[0];
                const params = Object.assign({}, data, { readonly: true });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
                });
            }
        })
    }
    /**
     *  加载信息
     * @param val
     */
    public initData() {
        this.onPage({ page: this.paging });
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    public onPage(e?) {
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        this.onUrlData(); // 导航回退取值
        this.searches = this.tabConfig.searches; // 当前标签页的搜索项
        this.buildShow(this.searches);
        // 构建参数
        const params = this.buildParams();
        if (this.tabConfig.get_url === '') {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        this.xn[this.tabConfig.get_type].post(this.tabConfig.get_url, params).subscribe(x => {
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
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        // this.selectedItems = [];
        this.paging = 1;
        this.onPage({ page: this.paging, first: 0 });
    }

    /**
     *  判读列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.data.some(x => !x.checked || x.checked && x.checked === false) || this.data.length === 0);
    }

    /**
     * 根据带过来的已选项勾选表格对应记录
     * @param prevItem  带过来的已选项
     */
    public checkByPrevItems(prevItem: any[]) {
        const prevArr = prevItem.map((prev) => {
            return prev[this.key];
        });
        this.data.filter(item => {
            return prevArr.includes(item[this.key]);
        }).forEach((da) => { da.checked = true; });
    }


    /**
     *  全选
     * @param e
     */
    public checkAll(e) {
        if (!this.isAllChecked()) {
            this.data.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], this.key);
        } else {
            const dataArr = [];
            this.data.forEach(item => { item.checked = false; dataArr.push(item[this.key]); });
            // this.selectedItems = [];
            this.selectedItems = this.selectedItems.filter(x => !(dataArr.includes(x[this.key])));
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
            this.selectedItems = this.selectedItems.filter((x: any) => x[this.key] !== item[this.key]);
        } else {
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, this.key); // 去除相同的项
        }
    }
    /**
     * 构建搜索项
     * @param searches
     */
    private buildShow(searches) {
        this.shows = [];
        this.onUrlData(); // 导航回退取值
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
            obj.value = this.arrObjs[searches[i].checkerId] ? this.arrObjs[searches[i].checkerId] : searches[i].value;
            // obj.value = searches[i].value;
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function (a, b) {
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
            this.onUrlData();
        });
    }

    /**
     * 构建参数
     */
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // 一转让合同组新增 根据总部公司查询合同模板
        if (this.params.checkerId === 'contractTemplate') {
            params.headquarters = this.params.headquarters;
        }
        if (this.xn.router.url.indexOf('xnlogan') > 0) {
            params.factoringAppId = applyFactoringTtype['深圳市香纳商业保理有限公司'];
        } else if (this.xn.router.url.indexOf('country-graden') > 0) {
            params.factoringAppId = applyFactoringTtype.深圳市星顺商业保理有限公司;
        } else if (this.xn.router.url.indexOf('agile-xingshun') > 0) {
            params.factoringAppId = applyFactoringTtype['深圳市星顺商业保理有限公司'];
        } else if (this.xn.router.url.indexOf('agile-hz') > 0) {
            params.factoringAppId = applyFactoringTtype['广州恒泽商业保理有限公司'];
        } else if (this.xn.router.url.indexOf('xn-gemdale') > 0) {
            params.factoringAppId = applyFactoringTtype['深圳市香纳商业保理有限公司'];
        } else if (this.xn.router.url.indexOf('zs-gemdale') > 0) {
            params.factoringAppId = applyFactoringTtype['深圳市前海中晟商业保理有限公司'];
        } else if (this.xn.router.url.indexOf('xnvanke') > 0) {
            params.factoringAppId = applyFactoringTtype['深圳市香纳商业保理有限公司'];
        } else if (this.xn.router.url.startsWith('/pslogan')) {
            params.isLgBoShi = 1; // 0=非龙光博时资本 1=龙光博时资本
            params.factoringAppId = applyFactoringTtype['深圳市柏霖汇商业保理有限公司'];
        } else {
            params.factoringAppId = applyFactoringTtype.深圳市柏霖汇商业保理有限公司;

        }
        params.headquarters = this.params.headquarters;

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

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
    // 取消操作
    public onCancel() {
        this.close({
            action: 'cancel'
        });
    }
    private onUrlData() {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                arrObjs: this.arrObjs,
            });
        }
    }
    /**
     *
     * @param head 删除单个已添加的选项
     */
    clearOne(head: any) {
        const clearindex = this.selectedItems.findIndex((item) => item[this.key] === head[this.key]);
        // head.checked = false;
        this.data.map(item => {
            if (item[this.key] === head[this.key]) {
                item.checked = false;
            }
        });
        this.selectedItems.splice(clearindex, 1);
    }

    /**
    *  提交
    */
    public handleSubmit() {
        if (this.params.checkerId === 'contractTemplate') {
            const mainContractList = this.selectedItems.filter((sel) => {
                return sel.templateType === 0;
            });
            if (mainContractList && mainContractList.length > 1) {
                this.xn.msgBox.open(false, '最多只能选择一份类型为“主合同”的合同模板');
                return;
            }
        }
        this.close({
            action: 'ok',
            value: this.selectedItems,
            key: this.key
        });
    }

    /**
     *  清空所有已选项
     */
    clearAll() {
        this.data.forEach(item => item.checked = false);
        this.selectedItems = [];
    }
}
