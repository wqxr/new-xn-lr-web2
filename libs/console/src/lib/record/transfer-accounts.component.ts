import {Component} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

/**
 *  应收账款转让
 */
@Component({
    selector: 'app-record-transfer-accounts',
    template: `
        <section class="content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <span class="panel-title">{{pageTitle}}</span>
                </div>
                <div class="panel-body">
                    <div class="text-right">
                        <button type="button" class="btn btn-primary" (click)="downloadExcel()">下载Excel</button>
                    </div>
                    <div>
                        <!--content-->
                        <div class="text-box" *ngFor="let info of baseInfo">
                            <div class="col-sm-3 xn-control-label">
                                {{info.title}}
                            </div>
                            <div class="col-sm-6">
                                <xn-show-input [row]="info"></xn-show-input>
                            </div>
                            <div class="col-sm-3 xn-control-desc"></div>
                        </div>
                        <div class="text-box">
                            <label class="col-sm-3 xn-control-label">登记证明：</label>
                            <div class="btn btn-primary btn-group-sm btn-file xn-table-upload">
                                <span style="color: #ffffff">点击上传</span>
                                <input type="file" (change)="upload($event)">
                            </div>
                        </div>
                        <div class="text-box">
                            <div *ngFor="let file of files" class="col-sm-6 col-sm-offset-3">
                                <!--<a class="text-bg" href="javaScript:void(0)" (click)="view(file)">{{file.name}}</a>-->
                                <!--<a class="text-bg" href="javaScript:void(0)" (click)="remove(file)">x</a>-->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel-footer text-right">
                    <button type="button" class="btn btn-default pull-left" (click)="goBack()">返回</button>
                    <button type="submit" class="btn btn-primary">提交</button>
                </div>
            </div>
        </section>
    `,
    styles: [`
        .text-box {
            padding-bottom: 5px;
        }

        .title {
            width: 200px;
            text-align: right;
            margin-right: 10px;
        }

        .position-display {
            margin-left: 210px;
            background-color: #efefef;
        }

        .text-bg {
            display: inline-block;
            margin: 0 10px 5px 0;
            line-height: 20px;
        }
    `]
})
export class TransferAccountsComponent {
    public pageTitle = '应收账款转让信息';
    public baseInfo: any;
    public fileName = '';
    public files: any[] = [
        {name: '123.jpg', id: '1234'},
        {name: 'adqwe.jpg', id: '1234'},
        {name: '123qwe.jpg', id: '1234'},
    ];

    public constructor(private xn: XnService) {

    }

    public goBack() {
        this.xn.user.navigateBack();
    }

    public downloadExcel() {
        //
    }
    // 保存上传的pdf
    public upload(event) {
    }

    // 查看上传的文件
    public view() {
    }

    // 删除
    public remove() {
    }
}
