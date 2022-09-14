import {Component, OnInit, Input} from '@angular/core';
import {EenterpriseInfoModel, LevelModel} from './lv-wan-manage.component';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

/**
 * 万科利率公用组件
 */
@Component({
    selector: 'app-page-lv-vanke-public-component',
    template: `
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">{{tableTitle}}</h3>
                    <div [hidden]="hiddenBtn" style="float: right">
                        <a class="btn btn-success" *ngIf="showView" [routerLink]="addApi">新增</a>
                        <a class="btn btn-primary" *ngIf="showView" [routerLink]="editApi">编辑</a>
                    </div>
                </div>
                <div class="box-body">
                    <table class="table table-bordered table-striped table-hover text-center">
                        <thead>
                        <tr class="label-text">
                            <th>总部公司</th>
                            <ng-container *ngIf="type===levelModel.level1">
                                <th>城市公司</th>
                            </ng-container>
                            <ng-container *ngIf="type===levelModel.level2">
                                <th>城市公司</th>
                                <th>项目公司</th>
                            </ng-container>
                            <th>模式使用费率（%）</th>
                            <th>模式服务费率（%）</th>
                            <th>模式平台服务费</th>
                            <th>模式特殊利率</th>
                        </tr>
                        </thead>
                        <ng-container *ngIf="wkLvInfo && wkLvInfo?.length > 0 ;else block">
                            <tbody>
                            <tr *ngFor="let item of wkLvInfo">
                                <td>{{item.enterpriseName}}</td>
                                <ng-container *ngIf="type===levelModel.level1">
                                    <td>{{item.enterpriseName1}}</td>
                                </ng-container>
                                <ng-container *ngIf="type===levelModel.level2">
                                    <td>{{item.enterpriseName1}}</td>
                                    <td>{{item.enterpriseName2}}</td>
                                </ng-container>
                                <td>{{item.factoringSYF}}</td>
                                <td>{{item.factoringFWF}}</td>
                                <td>{{item.platformCost}}</td>
                                <td>{{item.factoringTS}}</td>
                            </tr>
                            </tbody>
                        </ng-container>
                        <ng-template #block>
                            <tr>
                                <td [attr.colspan]="colspanSzie">
                                    <div style="padding: 3rem;text-align: center;color: #c5c5c5;background-color: #fdfdfd">暂无数据！</div>
                                </td>
                            </tr>
                        </ng-template>
                    </table>
                    <xn-page [total]="total" [size]="size" (change)="onPage($event)"></xn-page>
                </div>
            </div>
        </section>`,
})
export class LvVankePublicComponent implements OnInit {
    @Input()
    public type: string;
    // table标签名
    @Input()
    public tableTitle: string;
    // 数据信息
    @Input()
    public wkLvInfo: EenterpriseInfoModel[];
    // 总数
    @Input()
    public total: number;
    // 是否显示
    @Input()
    public showView: boolean;
    // 分页
    @Input()
    public size: number;
    // 请求接口
    @Input()
    public api: string;
    // 新增id
    @Input()
    public add: string;
    // 编辑id
    @Input()
    public edit: string;
    @Input()
    public hiddenBtn: boolean;
    // 调用公用组件id
    public addApi: string;
    public editApi: string;
    // 公司级数
    public levelModel: LevelModel = new LevelModel();
    // td横向合并
    public colspanSzie: number;

    public constructor(private xn: XnService) {
    }

    public ngOnInit() {
        this.addApi = `/console/manage/lv-wan-manage/${this.add}`;
        this.editApi = `/console/manage/lv-wan-manage/${this.edit}`;
        this.switchCospan();
    }

    // 翻页
    public onPage(page: number) {
        page = page || 1;
        const params = {
            start: (page - 1) * this.size,
            length: this.size
        };
        this.xn.api.post(this.api, params)
            .subscribe(vanke => {
                this.wkLvInfo = vanke.data.data;
            });
    }

    // 横向合并列数
    private switchCospan() {
        switch (this.type) {
            case this.levelModel.level:
                this.colspanSzie = 5;
                break;
            case this.levelModel.level1:
                this.colspanSzie = 6;
                break;
            case this.levelModel.level2:
                this.colspanSzie = 7;
                break;
        }
    }
}
