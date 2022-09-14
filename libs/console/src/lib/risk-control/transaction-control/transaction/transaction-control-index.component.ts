import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {SelectOptions} from 'libs/shared/src/lib/config/select-options';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

/**
 *  交易控制-交易控制
 */
@Component({
    selector: 'app-transaction-control-index-component',
    templateUrl: './transaction-control-index.component.html',
    styles: [`
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
    `]
})
export class TransactionControlIndexComponent implements OnInit {
    public data: Array<any> = [];
    public total = 0;
    public pageSize = 10;
    public shows = [];
    public mainForm: FormGroup;
    public searches = [];
    orgNameType = SelectOptions.get('orgNameType');
    paging = 0;
    arrObjs = {} as any;

    public constructor(
        private xn: XnService) {
    }

    public ngOnInit() {
        this.onPage(1);
    }


    public onPage(page: number) {
        this.paging = page || 1;
        this.onUrlData(); // 导航回退取值
        this.searches = [
            {
                title: '企业名称',
                checkerId: 'orgName',
                type: 'text',
                required: false
            },
            {
                title: '企业类型',
                checkerId: 'orgType',
                type: 'select',
                options: {ref: 'orgNameType'},
                required: false
            }
        ];
        this.buildShow(this.searches);
        const params = this.buildParams();
        this.xn.api.post(`/yb/risk1/deal/deal_list`, params).subscribe(v => {
            this.data = v.data.data;
            this.total = v.data.recordsTotal;
        });
    }

    // 搜索
    searchMsg() {
        this.paging = 1; // 重置
        this.onPage(this.paging);
    }

    // 重置
    reset() {
        this.mainForm.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    viewDetail(item, e: MouseEvent) {
        this.xn.router.navigate([`/console/transaction-control/transaction/enterprise`],
            {queryParams: {appId: item.appId, org: item.orgName}});
        // 禁止a标签的默认行为
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        else { window.event.returnValue = false; }
    }

    // 构建搜索项
    private buildShow(searches) {
        this.shows = [];
        // this.onUrlData();
        this.buildCondition(searches);
    }

    // 构建参数
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize,
        };
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        return params;
    }

    // 搜索项值格式化
    private buildCondition(searches) {
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            obj.value = this.arrObjs[searches[i].checkerId];
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe((v) => {
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number').map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 回退操作
    private onUrlData() {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;

        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                arrObjs: this.arrObjs,
            });
        }
    }
}
