
/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：资产池评级信息弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 congying            新增           2020-06-17
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { Observable, of, fromEvent } from 'rxjs';
import { EditModalComponent } from './edit-modal.component';
import CommUtils from '../../../public/component/comm-utils';
declare const moment: any;

@Component({
    templateUrl: `./capital-rate-grade-modal.component.html`,
    styles: [`
        .title {
            font-weight:bold;
        }
        ul>li{
            list-style:none;
            font-weight:bold;
        }
        .label {
            font-weight: normal;
            flex: 1;
            color: black;
        }

        .flex {
            display: flex;
        }

        .input-check {
            width: 100px;
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
        .head-height .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            /*position: relative;*/
            cursor: pointer
        }

        .head-height .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            font-family: 'Glyphicons Halflings';
            opacity: 0.5;
        }

        .head-height .sorting:after {
            content: "\\e150";
            opacity: 0.2
        }

        .head-height .sorting_asc:after {
            content: "\\e155"
        }

        .head-height .sorting_desc:after {
            content: "\\e156"
        }
        .table-display tr td {
            vertical-align: middle;
        }
        .relative {
            position: relative
        }
        .head-height {
            position: relative;
        }
        .table-height {
            max-height: 400px;
            overflow: scroll;
        }
        .table {
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 0;
        }
        .table-display {
            margin: 0;
        }
    `]
})
export class CapitalRateGradeComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    // 数据
    // tslint:disable-next-line: no-use-before-declare
    // 数组字段
    private observer: any;
    public datalist01: etexecutionInfoList[] = [];
    public params: any; // 参数
    public paging = 0; // 共享该变量
    public executeTime: ''; // 执行时间
    public executionText: ''; // 执行内容
    public project_manage_id: '';
    public list: any[] = [];
    // 页码配置
    public pageConfig = {
        pageSize: 5,
        first: 0,
        total: 0,
    };
    private sortObjs = []; // 缓存后退的排序项
    private sorting = ''; // 共享该变量 列排序
    private naming = ''; // 共享该变量 列css样式
    public headLeft: number;
    public subResize: any;
    public heads: any[]; // 表头

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, ) {
    }

    ngOnInit(): void {
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
        $('.head-height', this.er.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth1}px`);
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.param;
        this.project_manage_id = params.project_manage_id;
        this.heads = CommUtils.getListFields(params.heads);

        this.onPage({ page: this.paging });
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
      *  滚动表头
      *  scrollLeft 滚动条的水平位置
    */
    onScroll($event: any) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
        // this.headLeft = 2;
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
        this.onPage({ page: this.paging });
    }

    /**
      *  @param event
      *       event.page: 新页码
      *       event.pageSize: 页面显示行数
      *       event.first: 新页面之前的总行数,下一页开始下标
      *       event.pageCount : 页码总数
    */
    onPage(e?: any): void {

        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);

        const params = this.buildParams();
        this.xn.loading.open();
        this.xn.dragon.post('/project_manage/grade/list_grade', params).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
                this.datalist01 = x.data.data;
                this.pageConfig.total = x.data.count;
            }
        });
    }

    /**
      *  修改评级
      *  @param paramInfo 行信息
      *  @param i 下标
    */
    async changeGrade(paramInfo: any, i: number) {
        const selectOptions = await this.getGradeConfig().then() || [];  // 获取评级selectOptions
        const checkers = [
            {
                title: '评级',
                checkerId: 'rateGrade',
                type: 'linkage-select',
                selectOptions,
                value: { proxy: paramInfo.optionOne, status: paramInfo.gradeId },
                required: 1
            }
        ];
        const params = {
            checker: checkers,
            title: '修改评级',
            buttons: ['取消', '提交'],
        };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            EditModalComponent,
            params
        ).subscribe(data => {
            if (!data) {
                return;
            }
            let rateGrade: any;
            if (typeof (data.rateGrade) === 'string') {
                rateGrade = JSON.parse(data.rateGrade);
            } else { // 取消修改-返回对象格式数据
                rateGrade = data.rateGrade;
            }

            this.xn.dragon.post('/project_manage/grade/alter_grade',
                {
                    id: paramInfo.id,
                    gradeId: rateGrade.status
                }).subscribe(x => {
                    if (x.ret === 0) {
                        this.onPage({ page: this.paging });
                    }
                });
        });

    }

    /**
      *  添加跟踪评级
      *  @param
    */
    async addGrade() {
        const selectOptions = await this.getGradeConfig().then() || [];  // 获取评级selectOptions
        const checkers = [
            {
                title: '评级',
                checkerId: 'rateGrade',
                type: 'linkage-select',
                selectOptions,
                value: '',
                required: 1
            },
        ];
        const params = {
            checker: checkers,
            title: '增加评级',
            buttons: ['取消', '提交'],
        };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            EditModalComponent,
            params
        ).subscribe(data => {
            if (!data) {
                return;
            }
            const rateGrade: any = JSON.parse(data.rateGrade);
            // 新增评级
            this.xn.dragon.post('/project_manage/grade/add_grade',
                {
                    capitalPoolId: this.params,
                    gradeId: rateGrade.status
                }).subscribe(x => {
                    if (x.ret === 0) {
                        this.onPage({ page: this.paging });
                    }
                });
        });
    }

    /**
      *  删除评级
      *  @param paramInfo 行信息
    */
    deleteGrade(paramInfo: any) {
        this.xn.msgBox.open(true, '确定要删除此项评级?',
            () => { // yes-callback
                this.xn.dragon.post('/project_manage/grade/delete_grade', { id: paramInfo.id }).subscribe(x => {
                    if (x.ret === 0) {
                        this.onPage({ page: this.paging });
                    }
                });
            },
            () => { // cancel-callback

            });
    }

    /**
     * 获取评级selectOptions
     *  @param
    */
    getGradeConfig() {
        return new Promise((resolve, reject) => {
            // 获取评级selectOptions
            this.xn.dragon.post('/project_manage/grade/get_grade_config', {}).subscribe(x => {
                if (x.ret === 0) {
                    const selectOptions: any[] = [];
                    const gradeConfig = x.data.data;
                    const optionOne = new Set(gradeConfig.map(t => t.optionOne));
                    optionOne.forEach(v => {
                        const oneObj = { label: v, value: v, children: [] };
                        gradeConfig.forEach(t => {
                            if (t.optionOne === v) {
                                const twoObj = { label: t.optionTwo, value: t.id };
                                oneObj.children.push(twoObj);
                            }
                        });
                        selectOptions.push(oneObj);
                    });
                    resolve(selectOptions);
                }
            }, (err) => {
                reject(err);
            });
        });
    }

    /**
      *  构建参数
      *  @param
    */
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            capitalPoolId: this.params,
        };
        // 排序处理
        if (!!this.naming) {
            params.orderType = sortType[this.naming];
        }
        return params;
    }


    /**
      *  取消
      *  @param
    */
    oncancel() {
        this.modal.close();
    }

    /**
      *  确定
      *  @param
    */
    onOk() {
        this.modal.close();
    }

    calcAttrColspan() {
        return 5;
    }


}
class etexecutionInfoList {
    'orgName': string; 	 	  // 机构名字
    'executeTime': number;	  // 执行时间（时间戳）
    'executeDesc': string;	  // 执行内容
    'createTime': number;		  // 创建时间（时间戳）
}

enum sortType {
    asc = 0,
    desc = 1
}
