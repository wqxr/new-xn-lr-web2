import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewContainerRef, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { DragonPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import  DragonCustomListConfig from '../../bean/custom-list';

import { Observable, fromEvent } from 'rxjs';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { XnUtils } from '../../../../../common/xn-utils';

@Component({
    templateUrl: './dragon-custom-list.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'dragon-custom-list',
    styles: [`
    .custom-table:before {
        content: "";
        clear: left;
        display: block;
    }
    .span-left {
        margin-bottom: 5px;
        float: left;
    }
    .span-right {
        margin-bottom: 5px;
        float: right;
    }
    .table-head table,.table-body table{
        margin-bottom: 0px
    }
    .table-body{
        width:100%;
        max-height:250px;
        overflow-y:scroll;
        min-height:50px;
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
    `]
})
// 多选列表组件
@DynamicForm({ type: 'custom-list', formModule: 'dragon-input' })
export class DragonCustomListInputComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    tableListConfig: any;  // 列表配置
    lists: any[] = [];  // 当前页列表数据
    totalLists: any[] = [];  // 所有列表数据
    selectedItems: any[] = []; // 选中的项
    subResize: any;  // 滚动条监听

    // 页码配置
    pageConfig = {
        pageSize: 5,
        first: 0,
        total: 0,
        page: 1, // 当前页码
    };

    constructor(private xn: XnService, private cdr: ChangeDetectorRef,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.tableListConfig = DragonCustomListConfig.exportList;
        this.totalLists = XnUtils.deepCopy(DragonCustomListConfig.exportList.data, []);
        if (!!this.row.value) {
            this.initSelectItem(JSON.parse(this.row.value));
        }
        this.initData();
        this.toValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }

    /**
     *  加载列表信息
     */
     public initData() {
        // 重置全局变量
        this.pageConfig = { pageSize: 5, first: 0, total: 0, page: 1 };
        this.onPage({ page: 1 });
    }

    ngAfterViewInit(){
        this.formResize();
    }

    ngOnDestroy() {
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize){
            this.subResize.unsubscribe();
        }
    }

    formResize(){
        const scrollContainer = $(`<div class="custom-scrollbar" style="box-sizing: border-box;
            position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($('body'));
        const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
        // 滚动条的宽度
        const scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $('.table-head', this.er.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth1}px`);
    }

    /**
     * 分页处理
     * @param e
     */
    onPage(e?: { page: number, first?: number, pageSize?: number, total?: number }){
        this.pageConfig = Object.assign({}, this.pageConfig, e);

        const start = (this.pageConfig.page - 1) * this.pageConfig.pageSize;
        const end = start + this.pageConfig.pageSize;
        const allListArr = XnUtils.deepCopy(this.totalLists, []);
        this.lists = allListArr.slice(start, end);
        this.pageConfig.total = this.totalLists.length;

        // 选中已勾选的项
        this.selectItemCheck();
    }

    /**
     * 根据row.value设置勾选项和动态配置合同编号字段
     * @param rowVal
     */
    initSelectItem(rowVal: any[]){
        const fixFieldArr = this.totalLists.map((x) => x.value);
        const hasFiled = rowVal.filter((x) => fixFieldArr.includes(x.value));
        const contractFiled = rowVal.filter((x) => !fixFieldArr.includes(x.value));
        if (hasFiled && hasFiled.length){
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...hasFiled], 'value');
        }
        if (contractFiled && contractFiled.length){
            this.totalLists = XnUtils.distinctArray2([...this.totalLists, ...contractFiled], 'value');
        }
    }

    /**
     * 勾选已选中的项
     */
    selectItemCheck(){
        const slectItem = this.selectedItems.map((x) => x.value);
        // 当前页列表勾选已选项
        this.lists.filter((list) => slectItem.includes(list.value)).forEach((obj) => obj.checked = true);
    }

    /**
    *  判读列表项是否全部选中
    */
    public isAllChecked(): boolean {
        return !(this.lists.some(x => !x.checked || x.checked && x.checked === false) || this.lists.length === 0);
    }

    /**
    *  全选
    */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.lists.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.lists], 'value');
        } else {
            this.lists.forEach(item => item.checked = false);
            const delItem = this.lists.map((x) => x.value);
            this.selectedItems = this.selectedItems.filter((x) => !delItem.includes(x.value));
        }
        this.toValue();
    }

    /**
     * 单选
     * @param e
     * @param item
     * @param index
     */
    public singleChecked(e, item, index) {
        if (item.checked && item.checked === true) {
            item.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.value !== item.value);
        } else {
            item.checked = true;
            this.selectedItems.push(item);
        }
        this.isAllChecked();
        this.toValue();
    }

    /**
     *  清空所有已选项
     */
    clearAll() {
        this.lists.forEach(item => item.checked = false);
        this.selectedItems = [];
        this.toValue();
    }

    /**
     * 组件设值
     */
    private toValue() {
        if (!!this.selectedItems.length) {
            const slectItem = this.selectedItems.map((x) => x.value);
            this.ctrl.setValue(JSON.stringify(slectItem));
        } else {
            this.ctrl.setValue('');
        }
    }
}
