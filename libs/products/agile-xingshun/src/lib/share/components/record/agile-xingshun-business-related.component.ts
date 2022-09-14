import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import VankebusinessdataTabConfig from 'libs/shared/src/lib/public/dragon-vanke/components/bean/vanke-business-related';

@Component({
    selector: 'agile-xingshun-business-related',
    templateUrl: './agile-xingshun-business-related.component.html',
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
export class AgileXingshunBusinessComponent implements OnInit {


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
    constructor(private xn: XnService, private vcr: ViewContainerRef, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.tabConfig = VankebusinessdataTabConfig.vankebusinessRelated;
        this.onPage({ page: this.paging });
    }
    viewRecord(record: string, type: string) {
        if (type && type === 'avenger') {
            this.xn.router.navigate([`/console/record/avenger/detail/view/${record}`]);
        } else if (type && type === 'dragon') {
            this.xn.router.navigate([`/agile-xingshun/record/todo/view/${record}`]);
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
   *  返回
   */
    public onCancel(): void {
        this.xn.user.navigateBack();
    }

}
