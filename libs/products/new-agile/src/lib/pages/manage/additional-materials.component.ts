import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { CommonPage, PageTypes } from 'libs/shared/src/lib/public/component/comm-page';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { NewFileModalComponent } from 'libs/shared/src/lib/public/form/hw-mode/modal/new-file-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

/**
 * 项目公司补充资料
 * base: src\app\pages\console\manage\additional-materials.component.ts
 */
@Component({
    selector: 'app-additional-materials',
    templateUrl: './additional-materials.component.html',
    styleUrls: ['./additional-materials.component.css']
})
export class AdditionalMaterialsComponent extends CommonPage implements OnInit {
    total = 0;
    pageSize = 10;
    first = 0;
    rows: any[] = [];
    words = '';

    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    paging = 1; // 共享该变量
    heads: any[];
    searches: any[];
    shows: any[];
    base: CommBase;
    mainForm: FormGroup;
    arrObjs = {} as any; // 缓存后退的变量
    searchArr = [];
    listType: 0 | 1 = 0; // 0: 待补充信息，1：已补充信息
    titleArr = ['上传', '替换'];

    refreshDataAfterAttachComponent = () => {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    constructor(
        public xn: XnService,
        public vcr: ViewContainerRef,
        public route: ActivatedRoute,
    ) {
        super(PageTypes.List);
    }

    ngOnInit() {
        this.route.data.subscribe(superConfig => {
            this.base = new CommBase(this, superConfig);
            this.heads = CommUtils.getListFields(superConfig.fields);
            this.searches = CommUtils.getSearchFields(superConfig.fields);
            this.buildShow(this.searches);
            this.pageSize =
                (superConfig.list && superConfig.list.pageSize) ||
                this.pageSize;
            this.onPage({ page: this.paging, pageSize: this.pageSize });
        });
    }

    getList(type: 0 | 1) {
        this.xn.loading.open();
        this.listType = type;
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    // 查看交易流程
    public viewProcess(item: any) {
        this.xn.router.navigate([`new-agile/main-list/detail/${item}`]);
    }

    buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }

    buildCondition(searches) {
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = { ref: searches[i].selectOptions };

            obj.value = this.arrObjs[searches[i].checkerId];

            objList.push(obj);
        }
        this.shows = $.extend(
            true,
            [],
            objList.sort(function (a, b) {
                return a.number - b.number;
            })
        ); // 深拷贝;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        const forSearch = this.searches.map(v => v && v.checkerId);
        this.searchArr = $.extend(true, [], forSearch); // 深拷贝;

        this.mainForm.valueChanges.subscribe(v => {
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches
                        .filter(vv => vv && vv.base === 'number')
                        .map(c => c.checkerId);
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

    viewFiles(item) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, item).subscribe(() => {
        });
    }

    // 判断数组
    arrayLength(value: any) {
        if (!value) {
            return false;
        }
        const obj =
            typeof value === 'string'
                ? JSON.parse(value)
                : JSON.parse(JSON.stringify(value));
        return !!obj && obj.length > 2;
    }

    // 查看更多发票
    viewMore(item) {
        if (typeof item === 'string') {
            item = JSON.parse(item);
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }


    onPage(event: { page: number; pageSize: number }): void {
        this.paging = event.page;
        this.pageSize = event.pageSize;

        // 后退按钮的处理
        this.onUrlData();

        const params = this.buildParams();
        let url = '';
        // console.log('请求参数值：', params);
        if (!this.listType) {
            url = '/custom/vanke_v5/project/project_not_add';
        } else {
            url = '/custom/vanke_v5/project/project_has_add';
        }
        this.xn.api.post(url, params)
            .subscribe(json => {
                this.total = json.data.count;
                this.rows = json.data.data.map(c => {
                    (c.addFile && c.addFile !== '') ? c.addFile = JSON.parse(c.addFile) : c.addFile = '';
                    return c;
                });
                this.xn.loading.close();
            });
    }


    onSort(sort: string): void {
        // 如果已经点击过了，就切换asc 和 desc
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }

        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    onSortClass(checkerId: string): string {
        if (checkerId === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    onTextClass(type) {
        // return type === 'money' ? 'text-right' : '';
    }

    onSearch(): void {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    onCssClass(status) {
        return status === 1 ? 'active' : '';
    }

    clearSearch() {
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }

        this.buildCondition(this.searches);
        this.onSearch(); // 清空之后自动调一次search
        this.paging = 1; // 回到第一页
    }

    /**
     *  上传/替换履约证明
     * @param row
     */
    replaceFile(row) {
        if (row.status === 3) {
            this.xn.msgBox.open(false, '保理商已审核，无法再替换履约证明文件');
            return;
        }
        const tit = this.titleArr[this.listType];
        const urls = ['/custom/vanke_v5/project/add_agree_file', '/custom/vanke_v5/project/replace_agree_file'];
        const addFiles = row.addFile && this.judgeDataType(row.addFile) ? row.addFile : [];
        const params = {
            title: `${tit}履约证明`,
            checker: [
                {
                    title: `${tit}履约证明`, checkerId: 'proveImg', type: 'mfile',
                    options: {
                        filename: `${tit}履约证明`,
                        fileext: 'jpg, jpeg, png, pdf',
                        picSize: '500'
                    }, memo: '请上传图片、PDF',
                    value: $.extend(true, [], addFiles)
                },
            ]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, NewFileModalComponent, params).subscribe(v => {
            this.xn.loading.open();
            if (v === null) {
                this.xn.loading.close();
                return;
            }
            console.log(v);
            this.xn.api.post(urls[this.listType], { mainFlowId: row.mainFlowId, files: v.files })
                .subscribe(() => {
                    this.getList(this.listType);
                    this.xn.loading.close();
                });
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }

    /**
     *  构建参数
     */
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize
        };

        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }

        // 搜索处理
        if (this.searches.length > 0) {
            if (!$.isEmptyObject(this.arrObjs)) {
                // 判断是否有缓存变量
            }

            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        params.modelId = 7;
        params['headquarters'] = HeadquartersTypeEnum[4]
        return params;
    }

    // 回退操作
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.sorting = urlData.data.sorting || this.sorting;
            this.naming = urlData.data.naming || this.naming;
            this.words = urlData.data.words || this.words;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                sorting: this.sorting,
                naming: this.naming,
                words: this.words,
                arrObjs: this.arrObjs
            });
        }
    }
}
