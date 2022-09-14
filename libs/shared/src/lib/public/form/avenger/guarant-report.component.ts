/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：多标签页列表项 根据TabConfig.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-05-13
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef, } from '@angular/core';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { AbstractControl } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnInputOptions } from '../xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { EditInfoModalComponent } from '../../component/edit-info-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

@Component({
    templateUrl: `./guarant-report.component.html`,
    selector: 'xn-guarantReport-table',
    styles: [`
        .title {
            width: 100px;
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
    `]
})
export class GuarantReportComponent implements OnInit {
    ctrl: AbstractControl;
    selectedItems: any[] = []; // 选中的项
    // 数组字段
    heads: any[] = [];
    @Input() row: any;
    @Input() form: any;

    datalist: any[] = [];
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    alert = '';
    xnOptions: XnInputOptions;
    allCheckedStatus: boolean;
    procedureId: boolean;
    datatype = {
        nameofCounterparty: '',
        flag: '',
        balance: '',
        analysis: '',
    };

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, ) {
    }

    ngOnInit(): void {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);


    }
    /**
     * 新增交易对手
     */
    addCounterparties() {
        const params = {
            title: '新增交易对手',
            checker: [
                {
                    title: '交易对手名称',
                    checkerId: 'nameofCounterparty',
                    type: 'text',
                    required: 1,

                },
                {
                    title: '业务模式',
                    checkerId: 'flag',
                    type: 'text',
                    required: 1,

                },
                {
                    title: '业务余额',
                    checkerId: 'balance',
                    type: 'text',
                    required: 1,

                },
                {
                    title: '交易场景分析',
                    checkerId: 'analysis',
                    type: 'textarea',
                    required: 1,

                },
            ] as CheckersOutputModel[],
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditInfoModalComponent, params)
            .subscribe(v => {
                if (v === null) {
                    return;
                } else {
                    this.datalist.push(v);
                    this.toValue();
                }
            });

    }
    cleardata(item: number) {
        this.datalist.splice(item, 1);
    }

    // 上传完后取回值
    private toValue() {
        if (this.datalist.length === 0) {
            this.ctrl.setValue('');
        } else {
            // 复核流程情况下，如果没有补充，不能提交
            this.ctrl.setValue(JSON.stringify(this.datalist));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private fromValue() {
        this.datalist = XnUtils.parseObject(this.ctrl.value, []);
        // 复核流程情况下 ,且 不是会计下载流程
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        this.toValue();
    }
}
