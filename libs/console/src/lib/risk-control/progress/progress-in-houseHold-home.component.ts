import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {BigDataListModel} from '../risk-control.service';

import * as moment from 'moment';

/**
 *  客户访谈 主页
 */
@Component({
    selector: 'app-progress-in-house-hold-home',
    templateUrl: './progress-in-houseHold-home.component.html',
    styles: [
            `
            .title {
                font-size: 16px;
                padding: 10px 0;
                font-weight: bold
            }

            .deal {
                margin-bottom: 50px;
            }

            table th, table td {
                padding-bottom: 0;
                padding-top: 7px;
                line-height: 33px;
                text-align: center;
            }

            .flex {
                display: flex;
            }

            .fix-form-align {
                text-align: left;
                padding-bottom: 7px;
            }

            .flex-g {
                flex-grow: 1;
            }

            .search-title {
                min-width: 8rem;
            }
        `
    ]
})
export class ProgressInHouseHoldHomeComponent implements OnInit {

    @Output() chooseTurn: EventEmitter<any> = new EventEmitter(false);
    @Input() customerInfo: BigDataListModel; // 企业信息
    public canEditManage = false; // 编辑客户经理
    public canEditStaff = false; // 编辑访谈专员
    public editBtnTitle: string[] = ['保存', '编辑'];
    public manageValue: string; // 客户经理
    public staffValue: string; // 访谈专员

    public currentPage = 1; // 当前页
    public size = 10; // 每页多少条
    public totle: number; // 列表总数
    public list;

    public rows = [
        {
            checkerId: 'clientName',
            number: 1,
            options: {},
            placeholder: '',
            required: false,
            title: '客户名称',
            type: 'text',
            validators: {},
            value: ''
        },
        {
            checkerId: 'staffName',
            number: 2,
            options: {},
            placeholder: '',
            required: false,
            title: '记录人',
            type: 'text',
            validators: {},
            value: ''
        },
        {
            checkerId: 'clientType',
            number: 3,
            options: {
                ref: 'orgType'
            },
            placeholder: '',
            required: false,
            title: '客户类型',
            type: 'select',
            validators: {},
        },
        {
            checkerId: 'visitTime',
            name: 'visitTime',
            number: 4,
            options: {},
            placeholder: '请选择日期',
            required: false,
            title: '访谈日期',
            type: 'quantum',
            validators: {},
            value: JSON.stringify({beginTime: moment().subtract(90, 'days').format('x'), endTime: moment().format('x')})
        }
    ];
    public mainForm: FormGroup;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
        this.getManager();
        const params = {
            start: 0, // 查询开始位置
            length: this.size, // 查询记录长度
            beginTime: moment().subtract(90, 'days').format('x'), // 初始开始时间
            endTime: moment().format('x'), // 初始结束时间
            recorder: this.mainForm.value.staffName,
            appType: this.mainForm.value.clientType,
            appName: this.mainForm.value.clientName,
            appId: this.customerInfo.appId
        };
        const cleanParams = this.clearEmptyObjAttr(params);
        this.getList(cleanParams);
    }

    // 跳转页面
    choose(type, item?) {
        this.chooseTurn.emit({
            type,
            item
        });
    }

    // 获取manager
    getManager() {
        this.xn.api.post('/mdz/executive/query_manager', {appId: this.customerInfo.appId})
            .subscribe(json => {
                if (json && json.data) {
                    this.manageValue = json.data.manager;
                    this.staffValue = json.data.attache;
                }
            });
    }

    // 更新manager
    updateManager() {
        const value = {manager: this.manageValue, attache: this.staffValue, appId: this.customerInfo.appId};
        this.xn.api.post('/mdz/executive/update_manager', value)
            .subscribe(() => {
            });
    }

    // 获取列表
    getList(params) {
        this.xn.api.post('/mdz/executive/querylist', params).subscribe(x => {
            this.totle = x.data.count;
            this.list = x.data.rows;
        });
    }

    changeManageValue(e) {
        // 判断点击元素
        if (e.target.id === 'manage') {
            this.canEditManage = !this.canEditManage;
        } else {
            this.canEditStaff = !this.canEditStaff;
        }
        if (e.target.innerText === this.editBtnTitle[0]) {
            this.updateManager();
        }
    }

    // 列表翻页
    pageChange(num: number) {
        this.currentPage = num || 1;
        const params = {
            start: (this.currentPage - 1) * this.size,
            length: this.size,
            beginTime: this.getChangeData(this.mainForm.value.visitTime).beginTime,
            endTime: this.getChangeData(this.mainForm.value.visitTime).endTime,
            recorder: this.mainForm.value.staffName,
            appType: this.mainForm.value.clientType,
            appName: this.mainForm.value.clientName,
            appId: this.customerInfo.appId
        };
        const cleanParams = this.clearEmptyObjAttr(params);
        this.getList(cleanParams);
    }

    // 查询事件
    searchEvent() {
        const params = {
            start: 0, // 查询开始位置
            length: this.size, // 查询记录长度
            beginTime: this.getChangeData(this.mainForm.value.visitTime).beginTime,
            endTime: this.getChangeData(this.mainForm.value.visitTime).endTime,
            recorder: this.mainForm.value.staffName,
            appType: this.mainForm.value.clientType,
            appName: this.mainForm.value.clientName,
            appId: this.customerInfo.appId
        };
        const cleanParams = this.clearEmptyObjAttr(params);
        this.getList(cleanParams);
    }

    // 导出事件 // http://localhost:8362/api/mdz/executive/export_data
    exportEvent() {
        const fileName = '访谈记录.xlsx';
        this.xn.api.download('/mdz/executive/export_data', {appId: this.customerInfo.appId})
            .subscribe((v: any) => {
                this.xn.api.save(v._body, fileName);
            });
    }

    // 清除空字符串
    clearEmptyObjAttr(o: any) {
        const k = {} as any;
        for (const [key, value] of Object.entries(o)) {
            if (value === '' || value === null || value === undefined) {
                continue;
            } else {
                k[key] = value;
            }
        }
        return k;
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 获取选择的日期
    private getChangeData(v: any): any {
        return JSON.parse(v);
    }
}
