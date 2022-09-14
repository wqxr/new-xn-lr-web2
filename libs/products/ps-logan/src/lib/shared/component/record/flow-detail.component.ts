import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnAsset } from 'libs/shared/src/lib/common/xn-asset';


@Component({
    templateUrl: './flow-detail.component.html',
    styles: [
        `.flex-row {
            display: flex;
            margin-bottom: 15px;
        }

        .flex-row:last-child {
            margin-bottom: 0;
        }

        .this-flex-1 {
            flex: 1;
        }

        .this-flex-2 {
            flex: 2;
        }

        .this-flex-3 {
            flex: 3;
        }

        .box-body {
            font-size: 12px;
            padding-bottom: 20px;
        }

        .this-title-color {
            color: #9a9a9a;
        }

        .this-flex-status {
            width: 200px;
            padding-top: 7px;
        }

        .detail-status {
            font-size: 18px;
            color: #00b9a3;
        }

        .nav li {
            float: left;
            width: 140px;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            text-align: center;
            background: inherit;
            background-color: #f6f6f6;
            box-sizing: border-box;
            border-radius: 5px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: none;
            border: 1px solid #ddd;
        }

        .nav li.active {
            background-color: #fff;
            border-bottom: 0;
        }

        .con {
            padding: 0;
            border: 1px solid #ddd;
            margin-top: -1px;
        }

        .content {
            max-width: 1000px;
        }`
    ]
})
export class PsLoganFlowDetailComponent implements OnInit {

    mainFlowId: string;
    params: any;
    formattedAssets: any[];   // 转换后的assets
    numData: any[];   // 数据仓
    setItem = 0;
    showTab = false;
    showData = false;
    isProxy: number;
    currentStatus = '';
    // proxy: number;

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.mainFlowId = params.id;
            this.xn.dragon.post('/list/main/detail', {
                mainFlowId: this.mainFlowId
            }).subscribe(json => {
                this.params = json.data;
                this.params.debtUnit = this.params.debtUnit;
                this.params.factoringOrgName = this.params.factoringOrgName;
                this.params.projectCompany = this.params.projectCompany;
                // 先转换对象
                this.showTab = this.params.assets && this.params.assets.length > 0; // 显示数字资产
                this.formattedAssets = this.showTab && this.params.assets.map(v => XnAsset.convertAsset(v));
                this.showData = this.params.numData && this.params.numData.length > 0;
                // 显示数据仓
                this.numData = this.params.numData;
                // 显示当前步骤
                this.currentStatus = this.params.currentStatus;
            });
            // if (params['proxy'] === undefined) {
            //     this.xn.dragon.post('/trade/detail', {
            //         mainFlowId: this.mainFlowId
            //     }).subscribe(json => {
            //         this.params = json.data;
            //         console.info('this.params', this.params);
            //         this.params.supplierOrgName = this.params.debtUnit;
            //         this.params.factoringOrgName = this.params.factoringOrgName;
            //         this.params.upstreamName = this.params.projectCompany;
            //         // 先转换对象
            //         this.showTab = this.params.assets && this.params.assets.length > 0; // 显示数字资产
            //         this.formattedAssets = this.showTab && this.params.assets.map(v => XnAsset.convertAsset(v));
            //         this.showData = this.params.numData && this.params.numData.length > 0;
            //         // 显示数据仓
            //         this.numData = this.params.numData;
            //         // 显示当前步骤
            //         this.currentStatus = this.params['currentStatus'];
            //     });
            // // }
        });
    }

    /**
     * 样式变化
     * @param paramsType
     */
    public onCssClass(paramsType): string {
        return this.setItem === paramsType ? 'active' : '';
    }

    /**
     *  面版切换
     * @param paramsType
     */
    public onItemClick(paramsType): void {
        this.setItem = paramsType;
    }

    /**
     *  计算状态码下一位是否为 终止代码8
     * @param paramsStatus
     */
    public calcStatus(paramsStatus: number): number {
        return paramsStatus + 1 === 8 ? paramsStatus : paramsStatus + 1;
    }
}
