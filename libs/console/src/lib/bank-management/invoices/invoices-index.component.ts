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
 *  发票管理
 */
@Component({
    templateUrl: './invoices-index.component.html',
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
export class InvoicesIndexComponent implements OnInit {
    public data: Array<any> = [];
    public total = 0;
    public pageSize = 10;
    public shows = [];
    public mainForm: FormGroup;
    public searchs = [];

    public constructor(
        private xn: XnService, private bankManagementService: BankManagementService, private loadingService: LoadingService) {
    }

    public ngOnInit() {
        setTimeout(() => {
            this.buildForm();
            this.getData(1);
        });
    }


    public onPage(page: number) {
        page = page || 1;

        this.getData(page);
    }

    // 查询
    public searchMsg(page?) {
        this.getData(page);
    }

    // 导出清单
    public loadList() {
        this.loadingService.open();
        // 搜索处理
        const params = {} as any;
        for (const search of this.searchs) {
            if (search.key === 'createTime' && search.value !== '') {
                params.startTime = JSON.parse(search.value).beginTime;
                params.endTime = JSON.parse(search.value).endTime;
            } else {
                params[search.key] = search.value;
            }
        }
        this.xn.api.download(`/custom/direct_v3/down_file/download_excel_list`, params).subscribe((v: any) => {
            this.xn.api.save(v._body, '发票清单.xlsx');
            this.loadingService.close();
        });
    }

    // 重置
    public reset() {
        this.mainForm.setValue({mainFlowId: '', orgName: '', invoiceNum: '', receiveId: '', status: ''});
        this.getData();
    }

    // 查看流程
    public viewProcess(item: any) {
        this.bankManagementService.viewProcess(item.mainFlowId);
    }

    private getData(page?) {
        this.loadingService.open();
        page = page || 1;
        const post = this.bankManagementService.searchFormat(page, this.pageSize, this.searchs);
        this.xn.api.post(`/llz/direct_payment/invoice_list`, post).subscribe(v => {
            this.data = v.data.list;
            this.total = v.data.recordsTotal;
            this.loadingService.close();
        });
    }

    private buildForm() {
        this.shows = [
            {
                title: '交易ID',
                checkerId: 'mainFlowId',
                type: 'text',
                required: false
            }, {
                title: '出票人',
                checkerId: 'orgName',
                type: 'text',
                required: false
            },
            {
                title: '发票号码',
                checkerId: 'invoiceNum',
                type: 'text',
                required: false
            }, {
                title: '《应收账款转让协议书》编号',
                checkerId: 'receiveId',
                type: 'text',
                required: false
            }, {
                title: '发票状态',
                checkerId: 'status',
                type: 'select',
                required: false,
                options: {ref: 'invoiceStatus'}
            }
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
