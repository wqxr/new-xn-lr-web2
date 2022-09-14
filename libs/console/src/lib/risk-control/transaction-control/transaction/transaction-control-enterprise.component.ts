import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute} from '@angular/router';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {EnterpriseTransactionControlModalComponent} from './enterprise-transaction-control-modal.component';
import {Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

/**
 *  交易控制-企业控制界面
 */
@Component({
    selector: 'app-transaction-control-enterprise-component',
    templateUrl: './transaction-control-enterprise.component.html'
})
export class TransactionControlEnterpriseComponent implements OnInit {
    data: Array<any> = [];
    total = 0;
    pageSize = 10;
    currentPage = 0;
    currentOrgName = '';
    appId = '';
    resCache = new Map<string, Array<any>>();

    constructor(
        public xn: XnService,
        private router: ActivatedRoute,
        private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.router.queryParams.subscribe(x => {
            this.currentOrgName = x.org;
            this.appId = x.appId;
            this.getData(1, this.appId);
        });
    }


    onPage(page: number) {
        page = page || 1;
        this.currentPage = page;

        this.getData(page, this.appId);
    }

    // 编辑
    edit(item) {
        const params = {
            pageTitle: '编辑交易控制信息',
            rows: [
                {
                    title: '交易类型',
                    checkerId: 'mType',
                    type: 'text',
                    options: {readonly: true},
                    required: 1,
                    value: item.mType
                }, {
                    title: '是否可用',
                    checkerId: 'used',
                    options: {ref: 'bussStatus'},
                    type: 'select',
                    required: 1,
                    value: item.used
                }, {
                    title: '是否可收取保证金',
                    checkerId: 'deposited',
                    options: {ref: 'bussStatus'},
                    type: 'select',
                    required: 1,
                    value: item.deposited
                }, {
                    title: '保证金比例',
                    checkerId: 'depositRate',
                    type: 'text',
                    required: 1,
                    memo: '%',
                    value: item.depositRate
                },
                {
                    title: '融资期限',
                    checkerId: 'finaningDay',
                    type: 'text',
                    required: 1,
                    memo: '天',
                    value: item.finaningDay
                },
                {
                    title: '区域',
                    checkerId: 'area',
                    options: {ref: 'controlArea'},
                    type: 'select',
                    required: 1,
                    value: item.area
                },
                {
                    title: '有效期',
                    checkerId: 'indate',
                    type: 'date',
                    required: 1,
                    value: item.indate
                }
            ]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EnterpriseTransactionControlModalComponent, params).subscribe(x => {
                if (x && x.action === 'ok') {
                    const obj = x.value;
                    const postParams =
                        Object.assign({}, {mType: item.mType, appId: this.appId}, obj);
                    this.xn.api.post('/yb/risk1/deal/control_edit', postParams).subscribe(() => {
                        this.resCache.delete('data'); // 如果都是修改过的先删除掉缓存值
                        this.getData(this.currentPage, this.appId);
                    });
                }
            }
        );
    }

    private getData(page?, appId?) {
        this.currentPage = page;
        page = page || 1;
        this.splitPage('/yb/risk1/deal/control_list', {appId}, page, this.pageSize).subscribe(v => {
            this.data = v.list;
            this.total = v.total;
        });
    }

    // 分页
    private splitPage(url, params, start, length): Observable<any> {
        if (this.resCache.has('data')) {
            const data = this.resCache.get('data');
            if (this.resCache.get('data').length) {
                return of({list: data.slice((start - 1) * length, start * length), total: data.length});
            }
            return of({list: [], total: 0});
        } else {
            return this.xn.api.post(url, params).pipe(map(x => {
                this.resCache.set('data', x.data);
                if (x.data.length) {
                    return {list: x.data.slice((start - 1) * length, start * length), total: x.data.length};
                }
                return {list: [], total: 0};
            }));
        }
    }
}
