import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-invoice-replace',
    templateUrl: './invoice-replace.component.html',
    styles: [
            `
            .flex {
                display: flex;
            }

            .title {
                width: 100px;
            }

            .label {
                font-weight: normal;
                flex: 1;
            }

            .hightLine {
                color: red;
            }

            .print {
                margin-bottom: 10px;
                overflow: hidden;
            }

            .half-width {
                width: 48%;
                display: inline;
            }
        `
    ]
})
export class InvoiceReplaceComponent implements OnInit {
    data: Array<any> = [];
    total = 0;
    pageSize = 10;
    pageIndex = 1;
    first = 0;

    form = {
        waitMoneyFirst: '',
        waitMoneySecond: '',
        mainFlowId: '',
        supplierOrgName: '',
        receivableFirst: '',
        receivableSecond: ''
    };

    constructor(
        private xn: XnService,
        private loading: LoadingService,
        private vcr: ViewContainerRef,
        private activeRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(() => {
            this.initData();
        });
    }

    onPage(event: { page: number; pageSize: number }) {
        this.pageIndex = event.page;
        this.pageSize = event.pageSize;
        this.getData(this.pageIndex);
    }

    searchMsg() {
        const waitMoneyFirst = Number(this.form.waitMoneyFirst);
        const waitMoneySecond = Number(this.form.waitMoneySecond);
        const receivableFirst = Number(this.form.receivableFirst);
        const receivableSecond = Number(this.form.receivableSecond);
        if (isNaN(waitMoneyFirst) || isNaN(waitMoneySecond) || isNaN(receivableFirst) || isNaN(receivableSecond)) {
            this.xn.msgBox.open(false, '输入有误');
            return;
        }
        if ((waitMoneyFirst > waitMoneySecond) || (receivableFirst > receivableSecond)) {
            this.xn.msgBox.open(false, '输入的金额范围有误');
        } else {
            this.getData(1);
        }
    }

    // 重置查询表单
    reset() {
        const keys = Object.keys(this.form);
        keys.forEach(k => {
            this.form[k] = null;
        });
        this.getData(1);
    }

    searchFormat(page) {
        return {
            start: (page - 1) * this.pageSize,
            length: this.pageSize,
            ...this.form
        };
    }

    initData(page?) {
        this.getData(page);
    }

    getData(page?) {
        page = page || 1;
        const post = this.searchFormat(page);
        this.xn.api
            .post(`/custom/direct_v3/project/replace_list`, post)
            .subscribe(v => {
                this.data = v.data.data;
                this.total = v.data.count;
                this.first = (this.pageIndex - 1) * this.pageSize;
            });
    }

    totalAmount() {
        return this.data
            .filter(item => item.checked)
            .reduce((prev, curr) => {
                return prev + curr.receivable;
            }, 0);
    }

    public viewProcess(item: any) {
        this.xn.router.navigate([
            `console/record/invoice-change/${item.mainFlowId}`
        ]);
    }
}
