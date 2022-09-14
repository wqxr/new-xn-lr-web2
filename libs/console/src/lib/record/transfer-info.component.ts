import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

/**
 *  出让信息组件
 */
@Component({
    selector: 'app-record-transfer-info',
    template: `
        <section class="content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <span class="panel-title">{{pageTitle}}</span>
                </div>
                <div class="panel-body">
                    <div class="text-right" style="padding-bottom: 5px">
                        <button type="button" class="btn btn-primary" (click)="downloadExcel()">下载Excel</button>
                    </div>
                    <table class="table table-bordered table-hover text-center">
                        <thead>
                        <tr>
                            <ng-container *ngFor="let item of headerText">
                                <th>{{item}}</th>
                            </ng-container>
                        </tr>
                        </thead>
                        <tbody>
                        <ng-container *ngFor="let item of dataLists">
                            <tr>
                                <td>{{item}}</td>
                            </tr>
                        </ng-container>
                        </tbody>
                    </table>
                </div>
                <div class="panel-footer text-right">
                    <button type="button" class="btn btn-default pull-left" (click)="goBack()">返回</button>
                    <button type="submit" class="btn btn-primary">提交</button>
                </div>
            </div>
        </section>
    `,
    styles: [``]
})
export class TransferInfoComponent implements OnInit {
    public pageTitle = '出让人信息表';
    public pageDesc = '';
    public dataLists: any[] = [];
    public headerText = [
        '收款单位', '组织机构代码/统一社会信用代码', '工商注册号/统一社会信用代码',
        '法定代表人/负责人', '所属行业', '注册地址', '操作'
    ];

    public constructor(private xn: XnService) {
        //
    }

    public ngOnInit() {
        //
    }

    // 返回上一导航
    public goBack() {
        this.xn.user.navigateBack();
    }

    public downloadExcel() {
        //
    }
}
