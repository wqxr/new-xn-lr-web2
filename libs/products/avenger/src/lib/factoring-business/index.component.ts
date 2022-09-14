/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.p
 *
 * @file：index-component
 * @summary：首页业务信息
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-16
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { ButtonGroupEnum } from './factorying-business.enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PromotionInformationModalComponent } from './promotion-information.modal.component';
import { FactoringBusinessModel } from './factoring-business.model';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { enumTransformFn } from '../shared/components/pipes/enum-transform.pipe';

@Component({
    selector: 'xn-index-component',
    templateUrl: './index.component.html',
    styles: [`
        .info-title {
            width: 80%;
            background-color: #ffffff;
            border: 1px solid #DDDDDD;
            margin: 5px auto;
            padding: 30px;
        }

        .num-hlight {
            color: red;
        }

        .flex {
            display: flex;
        }

        .flex-1 {
            flex-grow: 1;
        }

        .title {
            width: 160px;
            text-align: right;
            padding: 0 10px;
        }

        .title-lh {
            line-height: 30px;
        }

        .main {
            height: 30px;
            width: 60%;
            background-color: #08BBA5;
            border-radius: 5px;
            padding: 2px;
            margin-right: 10px;
        }

        .sub-main {
            height: 100%;
            float: right;
            background-color: #FFFFFF;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }

        .main-base {
            width: 60%;
            justify-content: space-between;
        }
    `]
})

export class IndexComponent implements OnInit {
    @Input() fac: FactoringBusinessModel;
    /**
     *  按钮组
     */
    public buttonGroupList: Array<{ label: string, value: string }> = [];
    // 保理信息
    // 是否可以查看推介函
    isViewLetter: boolean;
    totalFlv: string;
    // 是否可以发起保理业务请求
    isApply: boolean;
    isClick = {
        isAllFileReview: false,
        isSign: false,
        isUpdateReport: false
    };

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.buttonGroupList = enumTransformFn(ButtonGroupEnum);
        // todo 按钮权限，根据企业性质，条件
        // do something
        this.xn.avenger.post('/sign_aggrement/bussiness_info/isSign', { appId: this.xn.user.appId }).subscribe(x => {
            if (x.data) {
                this.isApply = x.data.isSign;
            }


        });
        this.xn.avenger.post('/sign_aggrement/bussiness_info/apply', { appId: this.xn.user.appId }).subscribe(x => {
            if (x.data) {
                this.isClick = x.data;
            }
        });
        this.xn.avenger.post('/sign_aggrement/bussiness_info/info', { appId: this.xn.user.appId }).subscribe(x => {
            if (x.data) {
                this.fac.allAmount = x.data.allAmount;
                this.fac.allLeftAoumnt = x.data.allLeftAoumnt;
                this.fac.backAmount = x.data.backAmount;
                this.fac.factoringServiceFLV = x.data.factoringServiceFLV;
                this.fac.factoringUseFLV = x.data.factoringUseFLV;
                this.fac.leftAmount = x.data.leftAmount;
                this.fac.maxAmount = x.data.maxAmount;
                this.fac.nowlimit = x.data.nowlimit;
                this.fac.useAmount = x.data.useAmount;
                this.fac.platformServiceFLV = x.data.platformServiceFLV;
                this.fac.oldReceive = x.data.oldReceive;
                this.fac.totalFLV = x.data.totalFLV;
                // this.totalFlv = (this.fac.factoringServiceFLV + this.fac.factoringUseFLV + this.fac.platformServiceFLV).toFixed(2);
            }

        });
    }

    /**
     *  供应商操作
     *  @param paramButtonValue :string ： view :查看推介涵 、history：交易列表、business：发起供应商保理业务
     */
    public handleClick(paramButtonValue: string = 'View' || 'History' || 'Business'): void {
        this[`handleClick${paramButtonValue}`]();
    }

    /**
     * 计算比例
     * @param type = 1： 保理业务额度信息、2：保理业务统计 、 3：平台ABS业务统计
     */
    public sortStyle(type: number = 1 || 2 || 3): any {
        let widthValue = 0;
        switch (type) {
            case 1:
                widthValue = 1 - (this.fac.useAmount / this.fac.maxAmount);
                break;
            case 2:
                widthValue = 1 - this.fac.backAmount / this.fac.allAmount;
                break;
            case 3:
                widthValue = 0;
                break;
        }
        widthValue = isNaN(widthValue) ? 0 : widthValue;
        return { width: `${parseFloat(widthValue.toFixed(4)) * 100}%` };
    }

    /**
     *  查看推介涵
     *  仅在【客户管理】中，【白名单状态】为【系统白名单】或【人工白名单】，且【过会情况】为【准入】的企业，且未签署合作协议的企业可见此按钮。
     */
    private handleClickView(): void {
        const info = Object.assign({}, this.fac, { customerName: this.xn.user.orgName });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PromotionInformationModalComponent, info)
            .subscribe(param => {
                if (param === null) {
                    return;
                }
            });
    }

    /**
     * 历史记录,进入交易列表
     */
    private handleClickHistory(): void {
        this.xn.router.navigate(['/console/main-list/avenger-list']);

    }

    /**
     *  供应商发起保理申请业务  模版id supplier_sign_500
     */
    private handleClickBusiness(): void {
        if (this.isClick.isAllFileReview === false) {
            this.xn.msgBox.open(false, '文件上传失效，请到企业资料上传确认');
            return;
        }
        if (this.isClick.isUpdateReport === false) {
            this.xn.msgBox.open(false, '半年没有更新财报,请到财报资料上更新财报');
            return;
        }
        if (this.isClick.isSign === false) {
            this.xn.msgBox.open(false, '还没签署合作协议,不可申请');
            return;
        }
        this.xn.router.navigate(['/console/record/avenger/new/financing_500'],
        );
    }
}
