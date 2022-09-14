import {Component, OnInit, AfterViewInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {Params, ActivatedRoute} from '@angular/router';
import {ArticleEditModalComponent} from 'libs/shared/src/lib/public/modal/article-edit-modal.component';
import {ArticleAddModalComponent} from 'libs/shared/src/lib/public/modal/article-add-modal.component';
import {ArticleDeleteModalComponent} from 'libs/shared/src/lib/public/modal/article-delete-modal.component';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
@Component({
    templateUrl: './portal-list-manage.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`
    ]
})
export class PortalListManageComponent implements OnInit, AfterViewInit {

    pageTitle = '门户管理';
    pageDesc = '';
    tableTitle = '';
    kind = '';
    cardNo = '';
    columnId = 0;
    articleOneOrNot = false; // false不显示

    showEnterprise = true;

    total = 0;
    pageSize = 10;
    items: any[] = [];

    articleId: string;
    get isLog() {
      return this.articleId === '169';
    }
    constructor(private xn: XnService, private vcr: ViewContainerRef, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.articleOneOrNot = true;
            this.articleId = params.id;
            switch (parseInt(this.articleId, 0)) {
                case 111:
                    // this.kind = '平台新闻';
                    this.kind = '公司新闻';
                    break;
                case 112:
                    this.kind = '平台通知';
                    break;
                case 113:
                    this.kind = '行业动态';
                    break;
                case 114:
                    this.kind = '监控政策';
                    break;
                case 169:
                    this.kind = '企业大事记';
                    break;
                case 21:
                    this.kind = '平台守则';
                    break;
                case 221:
                    this.kind = '法律法规';
                    break;
                case 222:
                    this.kind = '深圳地方规定';
                    break;
                case 23:
                    this.kind = '帮助中心';
                    break;
                case 161:
                    this.kind = '平台介绍';
                    this.articleOneOrNot = false;
                    break;
                case 162:
                    this.kind = '内设机构';
                    this.articleOneOrNot = false;
                    break;
                case 163:
                    this.kind = '人才招聘';
                    break;
                case 164:
                    this.kind = '联系我们';
                    this.articleOneOrNot = false;
                    break;
                case 231:
                    this.kind = '开票登记';
                    break;
                case 232:
                    this.kind = '注册';
                    break;
            }
        });
        this.onPage(1);
    }

    ngAfterViewInit() {
        // 在ngAfterViewInit里打开模态框，实际体验效果会好些
        // this.route.params.subscribe((params: Params) => {
        //     this.articleId = params['id'];
        //     console.log("id : " + this.articleId);
        // });
    }

    onPage(page: number) {
        page = page || 1;
        // this.columnId = parseInt(this.articleId);
        this.xn.api.post('/portalsite/detail_list', {
            columnId: this.articleId,
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.items = json.data.data;
        });
    }

    onViewAdd() {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ArticleAddModalComponent, {
            columnId: this.articleId,
            items: this.items
        }).subscribe(v => {
            this.items.unshift(v);
            this.total ++;
        });
    }

    onViewEdit(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ArticleEditModalComponent, item).subscribe(v => {
          const index = this.items.findIndex(c => v.id === c.id)
          if (index > -1) {
            this.items[index] = v;
          }
        });
    }

    onViewDelete(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ArticleDeleteModalComponent, item).subscribe(v => {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id == v.id) {
                    this.items.splice(i, 1);
                    this.total --;
                }
            }
        });
    }
}
