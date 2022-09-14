import {
    Component,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {BankManagementService} from '../bank-mangement.service';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';

/**
 *  协议管理
 */
@Component({
    templateUrl: './protocol-management-index.component.html',
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
export class ProtocolManagementIndexComponent implements OnInit {
    public data: Array<any> = [];
    public total = 0;
    public pageSize = 10;
    public status = 0;
    public shows = [];
    public mainForm: FormGroup;
    public searchs = [];
    // 显示已签署
    public showSigned: boolean;
    // 显示变更
    public showChange: boolean;
    // 合并的列
    public colNumber: number;

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

        this.getInfo(this.status, page);
    }

    // 查询
    public searchMsg(page?) {
        this.getInfo(this.status, page);
    }

    // 重置
    public reset() {
        this.mainForm.setValue({createTime: '', orgName: ''});
        this.getInfo(this.status);
    }


    public getInfo(status, page?) {
        this.status = status; // 保存状态变量
        this.getData(status, page);
        // 根据不同标签，合并不同的单元格，显示不同的表格内容
        switch (status) {
            case 1:
                this.colNumber = 7;
                break;
            case 2:
                this.colNumber = 8;
                break;
            default:
                this.colNumber = 5;
        }
        this.showSigned = status === 1;
        this.showChange = status === 2;
    }

    // 查看交易流程
    public viewProcess(item: any) {
        this.bankManagementService.viewProcess(item.mainFlowId);
    }

    private getData(status, page?) {
        this.loadingService.open();
        page = page || 1;
        const post = this.bankManagementService.searchFormat(page, this.pageSize, this.searchs);
        post.status = status;
        this.xn.api.post(`/llz/direct_payment/agreement_list`, post).subscribe(v => {
            this.data = v.data.list;
            this.total = v.data.recordsTotal;
            this.loadingService.close();
        });
    }

    private buildForm() {
        this.shows = [
            {
                title: '客户名称',
                checkerId: 'orgName',
                type: 'text',
                required: false
            },
            {
                title: '流程创建时间',
                checkerId: 'createTime',
                type: 'quantum',
                required: false
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
