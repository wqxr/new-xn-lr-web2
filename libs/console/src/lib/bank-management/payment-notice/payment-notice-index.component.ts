import {
    Component,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {BankManagementService} from '../bank-mangement.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';

/**
 *  通知书管理
 */
@Component({
    templateUrl: './payment-notice-index.component.html',
    styles: [
            `
            .content-p {
                padding: 10px;
            }

            .flex {
                display: flex;
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
export class PaymentNoticeIndexComponent implements OnInit {
    public data: Array<any> = [];
    public total = 0;
    public pageSize = 10;
    public status = 0;
    public shows = [];
    public mainForm: FormGroup;
    public searchs = [];
    // 显示待处理
    public showStay: boolean;
    // 显示已处理
    public showDown: boolean;
    public loadBtnBool = false;
    public allChecked = false;
    public selects: any;
    // 当前页吗保存
    private currentPage: number;

    public constructor(
        private xn: XnService, private bankManagementService: BankManagementService, private loadingService: LoadingService) {
    }

    public ngOnInit() {
        setTimeout(v => {
            this.getInfo(0, 1);
            this.buildForm();
        }, 100);
    }


    public onPage(page: number) {
        page = page || 1;
        // 保存当前页吗
        this.currentPage = page;

        this.getInfo(this.status, page);
    }

    // 查询
    public searchMsg(page?) {
        this.getInfo(this.status, page);
    }

    // 重置
    public reset() {
        this.mainForm.setValue({createTime: '', status: '', receiveId: ''});
        this.getInfo(this.status);
    }

    public getInfo(status, page?) {
        this.status = status;
        this.getData(status, page);
        this.showStay = status === 0;
        this.showDown = status === 1;
    }

    // 查看交易流程
    public viewProcess(item: any) {
        this.bankManagementService.viewProcess(item.mainFlowId);
    }

    // 查看发票替换记录
    public viewReplace(item: any) {
        this.xn.router.navigate([
            `console/record/invoice-change/${item.mainFlowId}`
        ]);
    }

    // 下载委托付款确认书
    public downloadNotices() {
        const data = [];
        const mapNotice = this.selects.map((x: any) => x.noticeContracts);
        if (mapNotice && mapNotice.length) {
            mapNotice.map(y => {
                if (y !== '') {
                    if (JSON.parse(y) && (JSON.parse(y) instanceof Array) && JSON.parse(y).length) {
                        JSON.parse(y).map(z => {
                            data.push(z);
                        });
                    }
                }
            });
        }
        const params = {
            contract: data
        };
        this.xn.api.download('/contract/pdf_list', params).subscribe((v: any) => {
            this.xn.api.save(v._body, '付款通知书');
            setTimeout(() => {
                // 下载完成后，返回通知后台已下载，并改变状态，取消选中
                this.xn.api.post('/llz/direct_payment/notice_status', params).subscribe(() => {
                    this.selects.forEach(item => {
                        item.checked = false;
                    });
                    // this.calcStatus();
                    // 重新拉取状态
                    this.onPage(this.currentPage);
                });
            }, 1000);
        });
    }

    // 全选，取消全选
    public handleAllSelect() {
        this.allChecked = !this.allChecked;
        if (this.allChecked) {
            this.data.forEach(item => item.checked = true);
        } else {
            this.data.forEach(item => item.checked = false);
        }
        this.calcStatus();
    }

    public inputChange(val: any, index: number) {
        if (val.checked && val.checked === true) {
            val.checked = false;
        } else {
            val.checked = true;
        }
        this.calcStatus();
    }

    public calcTd(): boolean {
        return this.data.find((x: any) => x.noticeStatus === '待下载');

    }


    // 计算全选、下载按钮状态
    private calcStatus() {
        this.selects = this.data.filter(item => item.checked && item.checked === true);
        this.loadBtnBool = this.selects && this.selects.length > 0;
        // 当数组中不具有clicked 且为false。没有找到则表示全选中。
        const find = this.data.find((x: any) => x.checked === undefined || x.checked === false);
        if (!find) {
            this.allChecked = true;
        } else {
            this.allChecked = false;
        }
    }

    private getData(status, page?) {
        this.loadingService.open();
        page = page || 1;
        const post = this.bankManagementService.searchFormat(page, this.pageSize, this.searchs);
        post.handleStatus = status;
        this.xn.api.post(`/llz/direct_payment/notice_list`, post).subscribe(v => {
            this.data = v.data.list;
            this.total = v.data.recordsTotal;
            // 切换标签之后重置全选状态
            this.calcStatus();
            this.loadingService.close();
        });
    }

    private buildForm() {
        this.shows = [
            {
                title: '通知状态',
                checkerId: 'status',
                type: 'select',
                required: false,
                options: {ref: 'noticeStatus'}
            },
            {
                title: '委托付款日期',
                checkerId: 'createTime',
                type: 'quantum',
                required: false
            }, {
                title: '《应收账款转让协议书》编号',
                checkerId: 'receiveId',
                type: 'text',
                required: false
            },
        ];
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe(v => {
            const search = [];
            for (const key in this.mainForm.value) {
                if (this.mainForm.value.hasOwnProperty(key)) {
                    if (this.mainForm.value[key] !== '') {
                        const obj = {} as any;
                        obj.key = key;
                        obj.value = this.mainForm.value[key];
                        search.push(obj);
                    }
                }
            }
            this.searchs = search;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
