import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import SeasonDate, {SelectItem} from '../model/config-date';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {BankCreditModalComponent} from './bank-credit-modal.component';
import {BankCreditOutputModel, InfoDetailOutputModel, InfoOutputModel} from '../model/bank-credit';
import {BigDataListModel} from '../risk-control.service';
import {InfoDetailModalComponent} from './info-detail-modal.component';

/**
 *  征信调查
 */

@Component({
    selector: 'app-progress-in-credit',
    templateUrl: './progress-in-credit.component.html',
    styles: [
            `
            .title {
                font-size: 16px;
                padding: 10px 0;
                font-weight: bold
            }

            .red {
                color: red
            }

            .year {
                display: block;
                padding-right: 10px;
            }

            .flex {
                display: flex;
            }

            .line {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .line-split {
                overflow: hidden;
                border-bottom: 1px solid #434848;
                margin-top: 10px;
            }

            .line-text {
                float: left;
                width: 80px
            }

            .label-text {
                background-color: #F2F9FC;
            }

            .table-select tbody tr.selected {
                background-color: #9cccee;
            }

            .table-select tbody tr:hover {
                cursor: pointer;
            }

            .table-referee tr td:nth-child(5), .table-referee tr td:nth-child(2) {
                text-align: left;
            }

            .table td, .table th {
                vertical-align: middle;
            }

            .text-credit-color {
                color: #d95748;
            }
        `
    ]
})
export class ProgressInCreditComponent implements OnInit {
    @Input() customerInfo: BigDataListModel;
    bankCreditList: BankCreditOutputModel[] = []; // 银行授信
    bankCurrentPage = 0; // 银行授信当前页
    bankCreditTotal = 0;
    year = ''; // 银行授信年份选择
    yearItems: SelectItem [];
    size = 10; // 每页显示数据
    bankLimitAmount = 0; // 授信总额
    bankUsedAmount = 0; // 使用额度
    // 法人机构
    info: InfoOutputModel = new InfoOutputModel();
    // 法人机构详情
    infoDetail: InfoDetailOutputModel = new InfoDetailOutputModel();

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.xn.api.post('/yb/risk1/reference/get_year', {orgName: this.customerInfo.orgName})
            .subscribe(years => {
                this.yearItems = SeasonDate.getInfo(null, null, years.data); // 获取年份列表
                this.year = this.yearItems[0].value; // 默认第一个加载第一项的数据
                this.bankCreditPage(1, this.year);
                this.infoPage(1, 'referee');
                this.infoPage(1, 'courtNotice');
                this.infoPage(1, 'opening');
            });
    }

    // 增加，删除，编辑银行授信
    handleBankCredit(type?: string) {
        const params = {} as any;
        const find = this.bankCreditList.find((x: BankCreditOutputModel) => x.selected === true);
        if (type === 'delete') {
            this.xn.api.post('/yb/risk1/reference/delete_data', {referenceId: find.referenceId}).subscribe(() => {
                this.xn.api.post('/yb/risk1/reference/get_year', {orgName: this.customerInfo.orgName})
                    .subscribe(years => {
                        this.yearItems = SeasonDate.getInfo(null, null, years.data); // 获取年份列表
                        this.bankCreditPage(1, this.year);
                    });
            });
        }
        if (type === 'add') {
            params.title = '新增银行授信';
            params.value = new BankCreditOutputModel();
            // 默认年份
            params.value.inYear = this.year;
            XnModalUtils.openInViewContainer(this.xn, this.vcr, BankCreditModalComponent, params).subscribe(x => {
                if (!!x && x.action && x.action === 'ok') {
                    const addParams = x.value;
                    addParams.orgName = this.customerInfo.orgName;
                    this.xn.api.post('/yb/risk1/reference/add_data', addParams).subscribe(() => {
                        this.xn.api.post('/yb/risk1/reference/get_year', {orgName: this.customerInfo.orgName})
                            .subscribe(years => {
                                this.yearItems = SeasonDate.getInfo(null, null, years.data); // 获取年份列表
                                this.bankCreditPage(1, addParams.inYear);
                                this.year = addParams.inYear;
                            });
                    });
                }
            });
        }
        if (type === 'edit') {
            params.title = '修改银行授信';
            params.value = find;
            XnModalUtils.openInViewContainer(this.xn, this.vcr, BankCreditModalComponent, params).subscribe(x => {
                if (!!x && x.action && x.action === 'ok') {
                    const updateParams1 = x.value;
                    this.xn.api.post('/yb/risk1/reference/update_data', updateParams1).subscribe(() => {
                        this.xn.api.post('/yb/risk1/reference/get_year', {orgName: this.customerInfo.orgName})
                            .subscribe(years => {
                                this.yearItems = SeasonDate.getInfo(null, null, years.data); // 获取年份列表
                                this.bankCreditPage(1, updateParams1.inYear);
                                this.year = updateParams1.inYear;
                            });
                    });
                }
            });
        }
    }

    // 选择年份
    handleYearChange(year: any) {
        this.bankCreditPage(1, year);
    }

    /**
     *  选择
     * @param index
     */
    handleSelect(index: number) {
        // 如果存在其他元素存在，则取消其他元素的selected=false;
        const findIndex = this.bankCreditList.findIndex((x: any) => x.selected === true);
        if (findIndex > -1 && findIndex !== index) {
            this.bankCreditList[findIndex].selected = false;
        }
        if (!this.bankCreditList[index].selected) {
            this.bankCreditList[index].selected = true;
        } else {
            this.bankCreditList[index].selected = false;
        }
    }

    // 查看详情
    viewDetail(obj, label) {
        const url = {
            referee: '/yb/risk1/customer/data11',
            courtNotice: '/yb/risk1/customer/data9',
            opening: '/yb/risk1/customer/data7',
        };
        const params = {
            dataId: obj.Id
        };
        this.xn.api.post(url[label], params).subscribe(x => {
            this.infoDetail[label] = x.data;
            const params1 = {
                label,
                value: this.infoDetail[label]
            };
            // 法院公告 - 刊登版面添加
            if (label === 'courtNotice') {
                params1.value.PublishBroad = obj.PublishedPage;
            }
            XnModalUtils.openInViewContainer(this.xn, this.vcr, InfoDetailModalComponent, params1).subscribe();
        });
    }

    // 授信列表翻页
    bankCreditPage(num: number, year) {
        this.bankCurrentPage = num || 1;
        const params = {
            orgName: this.customerInfo.orgName,
            inYear: year,
            start: (this.bankCurrentPage - 1) * this.size,
            length: this.size
        };
        if (params.inYear !== '') { // 有年份再请求数据
            this.xn.api.post('/yb/risk1/reference/get_data', params).subscribe(x => {
                this.bankCreditTotal = x.data.recordsTotal;
                this.bankCreditList = x.data.data;
                // 计算总额
                if (this.bankCreditList.length) {
                    this.bankUsedAmount = this.bankCreditList.map(y => y.creditUsed).reduce((total, item) => total + item);
                    this.bankLimitAmount = this.bankCreditList.map(y => y.creditLimit).reduce((total, item) => total + item);
                }
            });
        }
    }

    // 法人机构
    // 裁判文书、法院公告、开庭公告
    infoPage(num: number, label) {
        const page = num || 1;
        this.info[`${label}CurrentPage`] = page;
        const params = {
            orgName: this.customerInfo.orgName,
            start: page,
            length: this.size
        };
        const url = {
            referee: '/yb/risk1/customer/data10',
            courtNotice: '/yb/risk1/customer/data8',
            opening: '/yb/risk1/customer/data6',
        };
        this.xn.api.post(url[label], params).subscribe(x => {
            this.info[label] = x.data.Result;
            this.info[`${label}Total`] = x.data.Paging.TotalRecords;
        });
    }
}
