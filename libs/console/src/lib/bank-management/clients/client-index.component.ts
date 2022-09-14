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
 *  客户业务统计
 */
@Component({
    templateUrl: './client-index.component.html',
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
export class ClientIndexComponent implements OnInit {
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

    // 重置
    public reset() {
        this.mainForm.setValue({orgName: '', createTime: ''});
        this.getData();
    }

    private getData(page?) {
        this.loadingService.open();
        page = page || 1;
        const post = this.bankManagementService.searchFormat(page, this.pageSize, this.searchs);
        this.xn.api.post(`/llz/direct_payment/customer_list`, post).subscribe(v => {
            this.data = v.data.list;
            this.total = v.data.recordsTotal;
            this.loadingService.close();
        });
    }

    private buildForm() {
        this.shows = [
            {
                title: '出票人',
                checkerId: 'orgName',
                type: 'text',
                required: false
            },
            {
                title: '申请日期',
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
