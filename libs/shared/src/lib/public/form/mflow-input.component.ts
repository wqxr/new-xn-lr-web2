/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mflow-input.component.ts
 * @summary：项目公司确认应收账款 <xn-input>  type:mFlows
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-04-09
 * **********************************************************************
 */

import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';
import {ActivatedRoute} from '@angular/router';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {PdfSignModalComponent} from '../modal/pdf-sign-modal.component';
import {InvoiceDataViewModalComponent} from '../modal/invoice-data-view-modal.component';
import {XnUtils} from '../../common/xn-utils';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import TabConfig from '../../../../../products/gemdale/src/lib/pages/gemdale-mode/tab-pane';

@Component({
    selector: 'app-xn-mflow-input',
    templateUrl: './mflow-input.component.html',
    styles: [`

        .table-display tr td {
            width: 250px;
            vertical-align: middle;
        }

        .height {
            overflow-x: hidden;
        }

        .table {
            table-layout: fixed;
            width: 3000px;
        }

        .table-height {
            max-height: 600px;
            overflow: auto;
        }

        .head-height {
            position: relative;
            overflow: hidden;
        }

        .table-display {
            margin: 0;
        }

        .relative {
            position: relative
        }

        .red {
            color: #f20000
        }
    `]
})
export class MflowInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    heads = TabConfig.receivable.heads;
    // 应收账款保理计划表数据
    public items: any[] = [];
    public alert = '';
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    public headLeft = 0;

    public constructor(private xn: XnService,
                       private er: ElementRef,
                       public bankManagementService: BankManagementService,
                       private router: ActivatedRoute,
                       private vcr: ViewContainerRef) {
    }

    public ngOnInit() {
        if (!this.form) {
            if (this.row.data) {
                this.items = JSON.parse(this.row.data);
            }

            return;
        }
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }

    /**
     * 判断数组
     * @param value
     */
    public arrayLength(value: any) {
        if (!value) {
            return false;
        }
        const obj =
            typeof value === 'string'
                ? JSON.parse(value)
                : JSON.parse(JSON.stringify(value));
        return !!obj && obj.length > 2;
    }

    /**
     * 查看合同
     * @param con
     */
    public showContract(con) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id: con.id,
            secret: con.secret,
            label: con.label,
            readonly: true
        }).subscribe(() => {
        });
    }

    /**
     * 查看更多发票
     * @param item
     */
    public viewMore(item) {
        item = JSON.parse(item);
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }

    /**
     *  获取值，金地模式确认应收账款
     */
    private fromValue() {
        const data = XnUtils.parseObject(this.ctrl.value, []);
        if (!!data && data.length) {
            this.items = data;
        } else {
            this.items = this.xn.localStorageService.caCheMap.get('selected'); // 本地缓存
        }
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        this.toValue();
    }

    /**
     * 上传完后取回值
     */
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.items));
        }

        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
