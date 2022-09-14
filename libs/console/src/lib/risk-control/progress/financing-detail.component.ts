import {Component, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnAsset} from 'libs/shared/src/lib/common/xn-asset';
import {ActivatedRoute} from '@angular/router';
import {FinancingDetailEnum} from '../enum/risk-control-enum';

/**
 *  融资详情
 */
@Component({
    templateUrl: './financing-detail.component.html',
    styles: [
            `
            .box {
                border-top: 0;
                margin-top: 25px;
            }

            .navs {
                display: flex;
                width: 900px;
                height: 50px;
                line-height: 50px;
                text-align: center;
            }

            .item {
                flex: 1
            }

            .item:hover {
                background: #fff
            }

            .box-header {
                padding-bottom: 0
            }

            .box {
                margin: 0 10px;
                padding: 0
            }

            .nav li {
                cursor: pointer;
                text-align: center;
                background: inherit;
                background-color: #f6f6f6;
                box-sizing: border-box;
                border-radius: 5px;
                border-bottom-right-radius: 0px;
                border-bottom-left-radius: 0px;
                border: 1px solid #ddd;
            }

            .nav li.active {
                background-color: #fff;
                border-bottom: 0;
            }
        `
    ]
})
export class FinancingDetailComponent implements OnInit {
    pageTitle = '融资详情';
    params: any;
    formattedAssets: any[];   // 转换后的assets
    financingDetailEnum = FinancingDetailEnum;
    setItem = 'flow';
    showTab = false;
    mainFlowId: any;

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.mainFlowId = this.route.snapshot.paramMap.get('id');
        this.xn.api.post('/flow/main/detail', {
            mainFlowId: this.mainFlowId
        }).subscribe(json => {
            this.params = json.data;

            // 先转换对象
            this.formattedAssets = this.params.assets.map(v => XnAsset.convertAsset(v));
            this.showTab = this.params.assets.length > 0;
        });
    }

    onItemClick(item) {
        this.setItem = item;
    }

    calcBool(value): boolean {
        if (value === 'tradeMap' || value === 'digitalAssets') {
            return this.showTab;
        }
        return true;
    }
}
