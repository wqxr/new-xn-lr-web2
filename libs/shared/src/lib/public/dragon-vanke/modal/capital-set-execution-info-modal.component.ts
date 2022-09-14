
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：资产池执行信息查看
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-08-28
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { Observable, of } from 'rxjs';
import { EditModalComponent } from './edit-modal.component';
import { ListHeadsFieldOutputModel } from '../../../config/list-config-model';
import { SingleListParamInputModel, SingleSearchListModalComponent } from './single-searchList-modal.component';

declare const moment: any;

@Component({
    templateUrl: `./capital-set-execution-info-modal.component.html`,
    selector: 'chose-capitalPool-modal',
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
        .disabled {
            pointer-events: none;
            filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
            -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
            opacity: 0.5; /*其他，透明度50%*/
        }
    `]
})
export class CapitalSetexecutionInfoComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    // 数据
    // tslint:disable-next-line: no-use-before-declare
    // 数组字段
    private observer: any;
    datalist01: etexecutionInfoList[] = [];
    public params: any;
    paging = 0; // 共享该变量
    // 页码配置
    public pageConfig = {
        pageSize: 5,
        first: 0,
        total: 0,
    };
    totalReceive = 0;
    paramType: number;
    executeTime: ''; // 执行时间
    executionText: ''; // 执行内容
    project_manage_id: '';
    list: any[] = [];
    public readOnly: boolean; // 只读
    public dateExecuteList: any[] = []; // 执行日程表
    public dateExecuteHeads: ListHeadsFieldOutputModel[] = VankeSetExecuteList.dateExecuteList.heads;

    constructor(private xn: XnService,
        private vcr: ViewContainerRef, private er: ElementRef,) {
    }

    ngOnInit(): void {

    }





    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.param;
        this.readOnly = params.readOnly;
        this.project_manage_id = params.project_manage_id;
        if (!this.readOnly) { // 只读属性不需要调这个接口
            this.xn.dragon.post('/project_manage/agency/project_agency_list',
                { project_manage_id: this.project_manage_id }).subscribe(x => {
                    if (x.ret === 0) {
                        this.list = x.data.rows;
                    }
                });
        }
        this.onPage({ page: this.paging });
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    public selectedDate(value: any, key: string) {
        this.executeTime = value.format();
    }

    /** 获取数据
      *  @param event page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
      *
      */
    onPage(event: { page: number, first?: number, pageSize?: number, pageCount?: number }): void {
        this.paging = event.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, event);
        const params = this.buildParams();
        this.xn.loading.open();
        // 获取执行信息表
        this.xn.dragon.post('/project_manage/agency/list_execute_agency', params).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
                this.datalist01 = x.data.rows;
                this.pageConfig.total = x.data.count;
            } else {
                this.datalist01 = [];
                this.pageConfig.total = 0;
            }
        });
        // 获取执行日程表
        this.xn.dragon.post('/project_manage/agency/date_execute_agency', { capitalPoolId: this.params }).subscribe(x => {
            if (x.ret === 0 && x.data && x.data.data.length > 0) {
                this.dateExecuteHeads = this.rganizeHead(x.data.data, VankeSetExecuteList.dateExecuteList.heads);
                this.dateExecuteList = this.rganizeResData(x.data.data);
            } else {
                this.dateExecuteList = [];
            };
        });
    }

    oncancel() {
        this.modal.close();
    }
    onOk() {
        this.modal.close();
    }

    // 修改层级
    changeExecution(paramInfo) {
        const checkers = [
            {
                checkerId: 'executeTime',
                name: 'executeTime',
                required: 0,
                type: 'date',
                title: '执行时间 ',
                memo: '',
                value: paramInfo.executeTime ? moment(paramInfo.executeTime).format('YYYY-MM-DD') : ''
            },
            {
                checkerId: 'executeDesc',
                name: 'executeDesc',
                required: 0,
                type: 'text',
                title: '执行内容 ',
                memo: '',
                value: paramInfo.executeDesc
            }
        ];
        const params = {
            checker: checkers,
            title: '修改执行信息',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
            .subscribe((v) => {
                if (v === null) {
                    return;
                } else {
                    this.xn.dragon.post('/project_manage/agency/alter_execute_agency',
                        {
                            execute_id: paramInfo.execute_id,
                            executeTime: moment(v.executeTime).valueOf(), executeDesc: v.executeDesc
                        })
                        .subscribe(x => {
                            if (x.ret === 0) {
                                this.onPage({ page: this.paging });
                            }
                        });
                }

            });

    }
    // 添加执行信息
    addCeil() {
        const checkers = [
            {
                checkerId: 'vankeAgency',
                name: 'vankeAgency',
                required: 1,
                type: 'vankeAgency-select',
                title: '中介机构 ',
                options: { ref: 'contractRules' },
                value1: this.list,
            },
            {
                checkerId: 'executeTime',
                name: 'executeTime',
                required: 0,
                type: 'date',
                title: '执行时间 ',
                memo: '',
                value: ''
            },
            {
                checkerId: 'executeDesc',
                name: 'executeDesc',
                required: 0,
                type: 'text',
                title: '执行内容 ',
                memo: '',
                value: ''
            }
        ];
        const params = {
            checker: checkers,
            title: '添加执行信息',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            EditModalComponent,
            params
        ).subscribe(data => {
            if (!data) {
                return
            }
            let vankeAgency = [data.vankeAgency];
            this.xn.dragon.post('/project_manage/agency/add_execute_agency',
                {
                    capitalPoolId: this.params,
                    appIds: vankeAgency, executeTime: moment(data.executeTime).valueOf(), executeDesc: data.executeDesc
                }).subscribe(x => {
                    if (x.ret === 0) {
                        this.onPage({ page: this.paging });
                    }
                });

        });
    }

    /** 下载执行信息
     *  @param
    */
    downloadExecuteInfo() {
        this.xn.dragon.download('/project_manage/agency/download_execute',
            { capitalPoolId: this.params }
        ).subscribe((v: any) => {
            this.xn.dragon.save(v._body, `执行信息.xlsx`);
        });
    }

    /** 下载执行日程表
     *  @param
     *
    */
    downloadExecuteTime() {
        this.xn.dragon.download('/project_manage/agency/download_date_execute',
            { capitalPoolId: this.params }
        ).subscribe((v: any) => {
            this.xn.dragon.save(v._body, `执行日程表.xlsx`);
        });
    }

    /** 引用执行信息
      *  @param
      *
    */
    useExecutionInfo() {
        // 打开弹框
        const params: SingleListParamInputModel = {
            title: '引用执行信息',
            get_url: '/project_manage/pool/pool_list',
            get_type: 'dragon',
            multiple: 'single',
            heads: [
                { label: '专项计划名称', value: 'projectName', type: 'text' },
                { label: '资产池名称', value: 'capitalPoolName', type: 'text' },
            ],
            searches: [
                { title: '资产池名称', checkerId: 'capitalPoolName', type: 'text', required: false, sortOrder: 2 },
            ],
            key: 'capitalPoolId',
            data: [],
            total: 0,
            inputParam: { project_manage_id: this.project_manage_id },
            rightButtons: [{ label: '取消', value: 'cancel' }, { label: '确定', value: 'submit' }],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe((x) => {
            if (x.action === 'ok') {

                // 引用执行信息
                this.xn.dragon.post('/project_manage/agency/cite_execute',
                    { capitalPoolId: this.params, citeCapitalPoolId: x.value[0].capitalPoolId }
                ).subscribe(v => {
                    if (v.ret === 0) {
                        this.onPage({ page: this.paging });
                    }
                });
            }
        });
    }

    delete(paramInfo) {
        this.xn.dragon.post('/project_manage/agency/del_execute_agency', { execute_id: paramInfo }).subscribe(x => {
            if (x.ret === 0) {
                this.onPage({ page: this.paging });
            }
        });

    }
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            capitalPoolId: this.params,
        };
        return params;
    }

    /**
     * 组装表头
     * @param resData 接口返回数据
     * @param heads 表头
     */
    private rganizeHead(resData: [{ orgName: string, executeList: any[] }], heads: any) {
        let newHead = [];
        newHead = $.extend(true, [], heads); // 深拷贝;
        resData[0]['executeList'].forEach((x: any, i: number) => {
            newHead.push({ label: x.executeTime ? moment(x.executeTime).format('YYYY-MM-DD') : '', value: `time${i}`, type: 'executeDesc' });
        });
        return newHead || [];
    }

    /**
     * 组装数据
     * @param resData 接口返回数据
     * @param
     */
    private rganizeResData(resData: [{ orgName: string, executeList: any[] }]) {
        let newResData = [];
        resData.forEach((x: any, i: number) => {
            let dataItem = { orgName: '' };
            dataItem.orgName = x.orgName;
            x['executeList'].forEach((t: any, d: number) => {
                dataItem[`time${d}`] = t['executeDescList'];
            });
            newResData.push(dataItem);
        });
        return newResData || [];
    }


}
class etexecutionInfoList {
    "orgName": string; 	 	  // 机构名字
    "executeTime": number;	  // 执行时间（时间戳）
    "executeDesc": string;	  // 执行内容
    "createTime": number;	  // 创建时间（时间戳）
}

export default class VankeSetExecuteList {

    // 执行日程表
    static dateExecuteList = {
        heads: <ListHeadsFieldOutputModel[]>[
            { label: '机构/日期', value: 'orgName', type: 'text' },
        ],
    };

}