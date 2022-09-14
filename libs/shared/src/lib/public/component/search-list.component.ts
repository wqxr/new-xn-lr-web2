import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { BigDataListModel } from 'libs/console/src/lib/risk-control/risk-control.service';
import {XnService} from '../../services/xn.service';

/**
 *  企业列表-搜索组建
 */
@Component({
    selector: 'app-search-list-component',
    template: `
        <section class="content">
            <div class="row">
                <div class="item-control flex col-sm-8 col-sm-offset-2">
                    <input type="text" class="form-control input-text" [(ngModel)]="inputValue">
                    <button type="button" class="btn btn-success search-btn" (click)="searchBtn(inputValue)">查询</button>
                </div>
            </div>
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">{{tableTitle}}</h3>
                </div>
                <div class="box-body">
                    <table class="table table-bordered table-striped text-center">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>企业名称</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr *ngFor="let item of list;let i=index">
                            <td>{{size * (currentPage - 1) + i + 1}}</td>
                            <td><a href="javaScript:void(0)" (click)="jump(item,i)">{{item.orgName}}</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </section>
    `,
    styles: [
            `.flex {
            display: flex
        }

        .input-text {
            flex: 1;
            height: auto
        }

        .search-btn {
            width: 120px;
            height: 50px;
        }

        .box {
            border-top: 0;
            margin-top: 25px;
        }
        `
    ]
})
export class SearchListComponent implements OnInit {

    @Input() searchName: string;
    @Input() type: string;
    @Input() list: BigDataListModel[];
    @Output() change: EventEmitter<any> = new EventEmitter(false);
    @Input() currentPage: number;
    @Input() size: number;
    inputValue = '';
    tableTitle = '企业列表';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        this.inputValue = this.searchName;
    }

    jump(item: BigDataListModel, index: number) {
        this.xn.router.navigate([`/console/${this.type}/${this.type}/${this.type}`], {queryParams: item});
    }

    searchBtn(val) {
        this.change.emit(val);
    }
}
