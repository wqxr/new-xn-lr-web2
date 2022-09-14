/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：invoice-search.component.ts
 * @summary：发票查询(中登)
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  wq              发票查询         2019-05-11
 * **********************************************************************
 */

import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DateInputDayComponent } from 'libs/shared/src/lib/public/component/date-input.component';
import { InvoiceSearchCompanyModalComponent } from 'libs/shared/src/lib/public/form/hw-mode/modal/invoice-search-company-modal.component';
import { DescEditModalComponent } from 'libs/shared/src/lib/public/modal/desc-edit-modal.component';
import * as moment from 'moment';

@Component({
    selector: 'app-invoice-search',
    templateUrl: './invoice-search.component.html',
    styles: [`
        .required-star::after {
            content: '*';
            color: #ff5500;
        }

        .table {
            font-size: 13px;
        }

        th, td {
            word-break: break-all;
            word-wrap: break-word;
        }

        table tbody {
            display: block;
            max-height: 500px;
            overflow-y: auto;
        }

        .xn-click-a {
            display: inline-block;
            padding-left: 5px;
            padding-right: 5px;
        }

        .btn-more {
            margin-top: 10px;
        }

        .btn-more-a {
            position: relative;
            left: 50%;
            transform: translateX(-50%)
        }

        .btn.disabled.btn-primary {
            background: #666
        }

        .red {
            color: #f20000
        }

        .form-date {
            padding: 0;
            border: 0
        }

        .search-zd {
            border-bottom: 2px dashed #f5f5f5;
            padding: 15px 10px;
            margin-bottom: 15px;
        }

        .search-input {
            width: 72%;
        }
    `
    ]
})
export class InvoiceSearchComponent implements OnInit, AfterViewInit {
    // 页面标题
    public pageTitle = '发票查询';
    showBtn = false;
    public showbtn: boolean;
    public recordList: any[] = [];
    items = [];
    invoiceValue = '';
    invoiceValueTemp = '';
    invoiceArr = [];
    manValue = '';
    manArr = [];
    allArr = [];
    contractId = '';
    name = '';
    page = 8;
    date = '';
    public downHref = '';
    public dateValue: any;
    private elementRef: ElementRef;
    @ViewChild(DateInputDayComponent)
    private dateInputDayComponent: DateInputDayComponent;
    defaultData = {
        value: '',
        index: undefined
    };
    lastSearchDate = ' ';
    @ViewChild('name') names: ElementRef;
    @ViewChild('contractId') contractIds: ElementRef;
    @ViewChild('man') man: ElementRef;
    @ViewChild('invoice') invoice: ElementRef;
    public zhongDengAddress = '';

    public constructor(private xn: XnService, elementRef: ElementRef, private vcr: ViewContainerRef,) {
        this.elementRef = elementRef;
        this.showbtn = false;

    }

    public ngOnInit() {
        this.getLastSearchDate();
        this.zhongDengAddress = this.xn.user.env === 'production' ? 'https://gateway.lrscft.com/api/zd/download/query/subject/template?xwappid=eb2812c67d0740c292f9f9f70c31b542' : 'https://gateway.test.lrscft.com/api/zd/download/query/subject/template?xwappid=eb2812c67d0740c292f9f9f70c31b542';
    }

    public ngAfterViewInit() {
        const tbody = document.getElementsByTagName('tbody')[0];
        if (tbody.clientHeight < tbody.scrollHeight) {
            this.hasScrollbar();
        }
    }

    /**
     * 判断表格是否出现滚动条以此改变thead的宽度
     */
    public hasScrollbar() {
        document.getElementsByTagName('thead')[0].style.width = 'calc(100% - 17px)';
    }

    /**
     *  获取最后一次请求时间
     */
    public getLastSearchDate() {
        return this.lastSearchDate;
    }




    // 下载附件
    downloadTp(paramUrl) {
        const a = document.createElement('a');
        a.href = this.xn.user.env === 'production' ? `https://gateway.lrscft.com/api/zd/query/subject/download/annex?xwappid=eb2812c67d0740c292f9f9f70c31b542&subject_id=${paramUrl}` : `https://gateway.test.lrscft.com/api/zd/query/subject/download/annex?xwappid=eb2812c67d0740c292f9f9f70c31b542&subject_id=${paramUrl}`;
        a.click();
    }
    /**
     *  日期输入
     * @param obj
     */
    public dateInput(obj: any) {
        this.dateValue = obj.value;
    }

    /**
     *  搜索发票信息
     * @param contractId  合同编号
     * @param invoice 发票号码
     * @param man 出让人
     * @param name 合同名称
     * @param date  日期
     */
    public searchResult(contractId, invoice, man, name, date, type) {
        this.contractId = contractId.trim();
        this.invoiceValue = invoice.trim();
        this.invoiceValueTemp = this.invoiceValue;
        this.invoiceArr = [invoice];
        this.manValue = man.trim();
        this.name = name.trim();
        this.date = date;
        if (!!this.invoiceValue && this.invoiceValue.length !== 8) {
            this.xn.msgBox.open(false, '输入的发票号码必须等于8位');
            return;
        }


        if (this.manValue.length <= 0) {
            this.xn.msgBox.open(false, '出让人不能为空');
            return;
        }

        this.items = [];
        this.showBtn = true;
        if (type === 1) {
            this.invoiceArr = [invoice];
            this.manArr = [man, contractId];
            this.allArr = this.invoiceArr.concat(this.manArr);
            this.xn.api.post('/custom/zhongdeng/invoice/query_invoice4', {
                invoiceNumLength: 8,
                invoiceNum: this.invoiceValue, // 发票号码
                crrName: this.manValue, // 出让人
                name: this.name, // 合同名称
                date, // 日期
                contractId: this.contractId, // 合同编号
            }).subscribe(json => {
                if (json.data === null) {
                    this.recordList = [];
                } else {
                    this.recordList = json.data.invoice_list;
                    this.showbtn = json.data.display_load;
                    this.page = json.data.invoice_num_length_next;
                }

            });
        } else if (type === 2) {
            this.invoiceArr.push(invoice.substring(0, this.page));
            this.manArr = [man, contractId];
            this.allArr = this.invoiceArr.concat(this.manArr);
            this.xn.api.post('/custom/zhongdeng/invoice/query_invoice4', {
                invoiceNumLength: this.page,
                invoiceNum: invoice, // 发票号码
                crrName: man, // 出让人
                name, // 合同名称
                date, // 日期
                contractId, // 合同编号
            }).subscribe(json => {
                if (json.data === null) {
                    this.recordList = [];
                } else {
                    this.recordList = json.data.invoice_list;
                    this.showbtn = json.data.display_load;
                    this.page = json.data.invoice_num_length_next;
                }

            });

        }


    }

    /**
     *  加载信息
     * @param invoiceNumLength
     * @param contractId 合同id
     * @param invoiceNum 发票号码
     * @param crrName 出让人信息
     * @param name 合同名称
     * @param date 日期
     */
    public onload(invoiceNumLength, contractId, invoiceNum, crrName, name, date) {
        const obj = {} as any;

        !!(invoiceNumLength) ? obj.invoiceNumLength = invoiceNumLength : obj.toString();
        !!(invoiceNum) ? obj.invoiceNum = invoiceNum : obj.toString();
        !!(crrName) ? obj.crrName = crrName : obj.toString();
        !!(name) ? obj.name = crrName : obj.toString();
        !!(date) ? obj.date = date : obj.toString();
        !!contractId ? obj.contractId = contractId : obj.toString();
        if (this.page < 4) {
            return;
        }

        this.searchResult(contractId, invoiceNum, crrName, name, date, 2);

    }

    public onMore() {
        this.showBtn = true;
        this.onload(this.page, this.contractId, this.invoiceValue, this.manValue, this.name, this.date);
    }

    public updateInvoice(company) {
        if (!company) {
            this.xn.msgBox.open(false, '请输入公司名称');
            return;
        }
        this.xn.api.post('/custom/zhongdeng/invoice/get_invoicemain', {
            company: company.trim()
        }).subscribe(json => {
            if (json.data.errcode !== 0) {
                this.xn.msgBox.open(true, json.data.errmsg);
                return;
            } else {
                this.xn.msgBox.open(true,'查询中，请等待');
                const record_id = json.data.record_id;
                const timed = window.setInterval(() => {
                    this.xn.api.post('/custom/zhongdeng/invoice/get_invoicestatus', {
                        record_id
                    }).subscribe(data => {
                        if (data.data.status === 2 || data.data.status === 3) {
                            if ($(document).find('.modal-body span').length === 0) {
                                this.xn.msgBox.open(true, data.data.status_info);
                            } else {
                                $(document).find('.modal-body span').text(data.data.status_info);
                            }
                            clearInterval(timed);
                        } else {
                        }
                    });
                }, 5000);
            }
        });
    }

    /**
     * 重置
     */
    public resetdata() {
        this.names.nativeElement.value = '';
        this.man.nativeElement.value = '';
        this.invoice.nativeElement.value = '';
        this.contractIds.nativeElement.value = '';
        this.dateInputDayComponent.clearDate();
        this.items = [];
    }

    // 下载模板
    downTemplate() {
        this.xn.api.download('/custom/zhongdeng/zd/download_subject_template',
            {})
            .subscribe((con: any) => {
                this.xn.api.save(con._body, '企业批量查询模板.xlsx');
                this.xn.loading.close();
            });
    }
    /**
     *  批量查询
     * @param paramCompanyName
     */
    public batchsearch(paramCompanyName: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceSearchCompanyModalComponent, {
            companyvalue: paramCompanyName,
        }).subscribe(() => {
        });
    }

    /**
     *
     * @param value 公司名称 批量查询记录
     */
    public downList(value: string) {
        this.xn.router.navigate([`console/manage/invoice-search/record`]);
    }

    /**
     * 打开修改备注弹窗
     */
    public editDesc(paramsItem) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DescEditModalComponent, { desc: paramsItem.remark }).subscribe((v) => {
            if (v === '') {
                return;
            } else {
                this.xn.api.post('/custom/zhongdeng/invoice/invoice_remark',
                    {
                        subject_id: paramsItem.subject_id, remark: `${this.xn.user.userName}
                    \n ${moment(new Date().getTime()).format('YYYY-MM-DD HH-mm-ss')}\n${v}`
                    }).subscribe(x => {
                        if (x.data.errcode === 0) {
                            paramsItem.remark = `${this.xn.user.userName}
                            \n ${moment(new Date().getTime()).format('YYYY-MM-DD HH-mm-ss')}\n${v}`;

                            this.xn.msgBox.open(false, '修改备注成功');
                        }
                    });
            }
        });
    }

}
