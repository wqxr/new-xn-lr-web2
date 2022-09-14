import {Component, OnInit} from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

/**
 *  保全机制
 */
@Component({
    selector: 'app-ensure',
    templateUrl: './ensure.component.html',
    styles: [
            `
            .ensure {
                background-color: #fff;
                padding: 20px;
            }

            .title {
                padding: 0;
                margin: 0;
                font-size: 16px;
                padding-bottom: 10px;
                border-bottom: 1px solid #aaa;
                margin-bottom: 10px;
            }

            .detail {
                margin-bottom: 20px;
            }
        `
    ]
})
export class EnsureComponent implements OnInit {
    entry: OutputModel = new OutputModel();
    mainFlowId = '';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        const url = this.xn.router.url;
        this.mainFlowId = url.substr(url.lastIndexOf('/') + 1);
        this.xn.api.post('/llz/risk_warning/security/security', {mainFlowId: this.mainFlowId}).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.entry = x.data.data[0];
            }
        });
    }

    reset() {
        this.entry.controlGoods = '';
        this.entry.throwGoods = '';
    }

    save() {
        const params = {
            mainFlowId: this.mainFlowId,
            controlGoods: this.entry.controlGoods,
            throwGoods: this.entry.throwGoods
        };
        this.xn.api.post('/llz/risk_warning/security/upload_security', params).subscribe(() => {
        });
    }

    validBtn(): boolean {
        return !!this.entry.controlGoods && this.entry.controlGoods !== ''
            && !!this.entry.throwGoods && this.entry.throwGoods !== '';
    }
}

class OutputModel {
    controlGoods?: any; // 控制
    throwGoods?: any; // 甩货
    depositRate?: any; // 保证金比例
    contractAmount?: any; // 资产金额
    depositAmount?: any; // 保证金金额
    depositAccountName?: any; // 账户名
    depositAccountNumber?: any; // 账户
    depositAccountBank?: any; // 开户行
}
