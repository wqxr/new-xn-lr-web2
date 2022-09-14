import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShangHaiMfilesViewModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/mfiles-view-modal.component';
import { ShangHaiPdfSignModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/pdf-sign-modal.component';
import { ShSingleListParamInputModel, ShSingleSearchListModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/single-searchList-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import VankebusinessdataTabConfig from '../bean/vanke-business-related';

@Component({
    selector: 'oct-sh-business-related',
    templateUrl: './shanghai-business-related.component.html',
    styles: [
        `
            .table {
                font-size: 13px;
            }

            .table-head .sorting,
            .table-head .sorting_asc,
            .table-head .sorting_desc {
                position: relative;
                cursor: pointer;
            }

            .table-head .sorting:after,
            .table-head .sorting_asc:after,
            .table-head .sorting_desc:after {
                position: absolute;
                bottom: 8px;
                right: 8px;
                display: block;
                font-family: 'Glyphicons Halflings';
                opacity: 0.5;
            }

            .table-head .sorting:after {
                content: '\\e150';
                opacity: 0.2;
            }

            .table-head .sorting_asc:after {
                content: '\\e155';
            }

            .table-head .sorting_desc:after {
                content: '\\e156';
            }

            .tab-heads {
                margin-bottom: 10px;
                display: flex;
            }
            tbody tr:hover {
                background-color: #e6f7ff;
                transition: all 0.1s linear;
            }
        `
    ]
})
export class OctShangHaibusinessComponent implements OnInit {
    /** 列表数据 */
    data: any[] = [];
    heads: any[];
    @Input() mainFlowId: string;

    /** 页码配置 */
    pageConfig = {
        pageSize: 10,
        first: 1,
        total: 0,
    };
    tabConfig: any;
    /** 部分公司选项 */
    options = [];
    paging = 0; // 共享该变量
    sorting = '';
    naming = '';
    constructor(private xn: XnService, private vcr: ViewContainerRef, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.tabConfig = VankebusinessdataTabConfig.vankebusinessRelated;
        this.onPage({ page: this.paging });
    }
    viewRecord(record: string, type?: string) {
        if (type && type === 'avenger') {
            this.xn.router.navigate([`/console/record/avenger/detail/view/${record}`]);
        } else if (type && type === 'dragon') {
            this.xn.router.navigate([`/oct-shanghai/record/todo/view/${record}`]);
        }
    }

    /**
     * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
     * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
     */
    public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
        this.paging = e.page || 0;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置

        this.heads = CommUtils.getListFields(this.tabConfig.heads);

        // 构建参数

        this.xn.loading.open();
        // 采购融资 ：avenger,  地产abs ：api
        this.xn.dragon.post('/list/main/flow_relate_info',
            { mainFlowId: this.mainFlowId, start: this.paging, length: this.pageConfig.pageSize }).subscribe(x => {
                if (x.data && x.data.data.length) {
                    this.data = x.data.data;
                    this.pageConfig.total = x.data.count;
                } else {
                    // 固定值
                    this.data = [];
                    this.pageConfig.total = 0;
                }
            }, () => {
                // 固定值
                this.data = [];
                this.pageConfig.total = 0;
            }, () => {
                this.xn.loading.close();
            });
    }

    /**
     * 判断数据是否长度大于显示最大值
     * @param paramFileInfos
     */
    public arrayLength(paramFileInfos: any) {
        if (!paramFileInfos) {
            return [];
        }
        let obj = [];
        if (JSON.stringify(paramFileInfos).includes('[')) {
            obj = typeof paramFileInfos === 'string'
                ? JSON.parse(paramFileInfos)
                : paramFileInfos;
        } else {
            obj = typeof paramFileInfos === 'string'
                ? paramFileInfos.split(',')
                : [paramFileInfos];
        }
        return obj;
    }

    /**
     * 查看更多发票
     */
    public viewMore(paramItem: any, uuid: string, isProxy: any) {
        // 打开弹框
        const params: ShSingleListParamInputModel = {
            title: '发票详情',
            get_url: '/sub_system/sh_vanke_system/vanke_invoice_list',
            get_type: 'dragon',
            multiple: null,
            heads: [
                { label: '发票代码', value: 'code', type: 'text' },
                { label: '发票号码', value: 'number', type: 'text' },
                { label: '发票含税金额', value: 'invoiceAmt', type: 'money' },
                { label: '发票转让金额', value: 'invTransAmt', type: 'money' },
                // { label: '发票文件', value: 'invoiceFile',type: 'file' },
            ],
            searches: [],
            key: 'invoiceCode',
            data: [],
            total: 0,
            inputParam: { uuid },
            rightButtons: [{ label: '确定', value: 'submit' }],
            options: {
                paramsType: 1   // 1 区分接口入参分页参数
            }
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShSingleSearchListModalComponent, params).subscribe(v => {
            if (v === null) {
                return;
            }
        });
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
     *  格式化数据
     * @param data
     */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }

    /**
     *  查看合同，只读
     * @param con
     */
    public showContract(con) {
        const params = Object.assign({}, con, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiPdfSignModalComponent, params).subscribe(() => {
        });
    }

    viewMFiles(paramFile) {
        const paramFiles = JSON.parse(paramFile);
        if (paramFiles.label !== undefined) {
            const params = Object.assign({}, paramFiles, { readonly: true });
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiPdfSignModalComponent, params).subscribe(() => {
            });
        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiMfilesViewModalComponent, [paramFiles]).subscribe(x => {
            });
        }
    }

    /**
     *  列表头样式
     * @param paramsKey
     */
    public onSortClass(paramsKey: string): string {
        if (paramsKey === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    /**
     *  按当前列排序
     * @param sort
     */
    public onSort(sort: string) {
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }
        this.onPage({ page: 1 });
    }

    /**
     *  返回
     */
    public onCancel(): void {
        this.xn.user.navigateBack();
    }

}
