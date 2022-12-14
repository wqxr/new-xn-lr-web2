import {Component, OnInit, Input, ViewContainerRef, OnChanges} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ShowPhotoModalComponent} from 'libs/shared/src/lib/public/modal/show-photo-modal.component';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';

@Component({
    selector: 'xn-flow-detail-data-show',
    templateUrl: './flow-detail-data-show.component.html',
    styles: [
        `.no-top { border: 0; margin-bottom: 0}`,
        `.box-zichan { padding: 20px 20px 10px; }`,

        `.asset-wrap {cursor: pointer;padding-top: 3px;height: 261px;background: url(assets/lr/img/infoBg.png) repeat-x;}`,
        `.asset-wrap-gray {background: url(assets/lr/img/infoBg2.png) repeat-x;}`,
        `.asset-name {height: 42px; line-height: 42px; font-size: 18px; color: #fff; text-align: center; margin: 13px 20px 33px 20px; background: url(assets/lr/img/titBg.png) repeat-x; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}`,
        `.asset-wrap-gray .asset-name {background: url(assets/lr/img/titBg2.png) repeat-x;}`,
        `.asset-code-wrap { margin: 0 30px 0 30px;}`,
        `.asset-code {max-width: 320px;height: 30px;font-size: 12px;color: #595757;margin-top: 9px;margin-bottom: 25px;word-break:break-all;}`,
        `.asset-info-wrap {display: flex; justify-content: space-around;}`,
        `.asset-code-tit, .no-asset-content {font-size: 16px; color: #535353;font-weight: 400}`,
        `.asset-code-tit { margin: 0; display: inline-block; }`,
        `.asset-code-time {font-size: 14px;color: #00b9a3; float: right;}`,
        `.asset-box, .asset-info-group, .guid-icon {float: left;}`,
        `.asset-info-tit {width: 136px;line-height: 30px;font-size: 14px;color: #535353; text-align: center;}`,
        `.asset-info-group .asset-info-content, .asset-info-group .asset-info-tit {width: 160px; text-align: center; margin: 0;}`,
        `.record-ul { flex: auto; display: flex; flex-direction: row; justify-content: space-between;}`,
        `.record-li { flex: auto; padding: 0 10px; max-width: 400px; width: 100%}`,
        `.asset-info-group-trade .asset-info-content, .asset-info-group-trade .asset-info-tit { width: 120px;}`,
        `.asset-info-content, .asset-more {text-align: center; color: #00b9a3;}`,
        `.asset-info-content {width: 136px;height: 40px;line-height: 45px; font-size: 24px;font-family: helvetica-light;}`,

        `.record-line { margin-bottom: 20px; border: 1px solid #a5e0d9 }`,
        `.record-box { position: relative; margin-bottom: 20px; display: flex; flex-wrap: nowrap; }`,
        `.record-title {height: 40px;line-height: 40px;padding: 0px 15px; background-color: #e7faf8; border: none; border-bottom: 1px solid #a5e0d9;}`,
        `.record-title .text { float: right; color: #00b9a3; font-weight: bold }`,
        `.record-message { background-color: #ffffff; padding: 10px 15px}`,

        `.change-base { margin-bottom: 20px; }`,
        `.change-icon { cursor: pointer;display: inline-block;color: #fff;background: #00b9a3; border-radius: 5px; padding: 0 5px; }`,
        `.change-number, .change-last, .change-time { color: #666; font-size: 13px; }`,
        `.change-time { text-align: right }`,
        `.change-last { float: right }`,

        `.arrow { flex-basis: 50px; width: 50px; height: 261px; cursor: pointer; background: url(assets/lr/img/arrow.png) no-repeat no-repeat 0 0 / 100% 100%;}`,
        `.arrow-left {transform: rotate(180deg); margin-right: 10px;}`,
        `.arrow-right {margin-left: 10px;}`,
        `.arrow-gray {filter: grayscale(1)}`,

        `.base-title {height: 40px;line-height: 40px;padding: 0px 15px; background-color: #e7faf8; border: none; border-bottom: 1px solid #a5e0d9; margin-bottom: 10px;}`,
        `.base-line { margin-bottom: 10px; font-size: 13px; }`,
        `.base-describe, .base-message { display: inline-block; padding-left: 5px;}`,
        `.base-describe { width: 240px; vertical-align: top;}`,
        `.table tr th { width: 120px }`,
        `.btn-return { margin-top: 3px; }`,
        `.base-files { cursor: pointer }`,
        `.storage-box { height: 250px; overflow-y: scroll }`
    ]
})
export class FlowDetailDataShowComponent implements OnInit, OnChanges {

    @Input() assets: any[];
    pageAssets: any[] = [];  // ????????????assets

    // ????????????
    private pageCount = 0;
    private pageSize = 2;
    private pageIndex: number;

    // ?????????????????????
    assetIndex = 0;
    nowAsset: any;

    // ??????????????????
    showRecord = false;

    changeBase: any;
    transactionData: any;
    commodities: any;

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        // this.initPage(this.assets.length);
        // this.goPage(0);
    }

    ngOnChanges() {
        this.initPage(this.assets.length);
        this.goPage(0);
    }

    private initPage(recordCount: number) {
        this.pageCount = Math.ceil(recordCount / this.pageSize);
    }

    /**
     * ??????????????????
     * @param page
     */
    private goPage(page) {
        if (page < 0 || page >= this.pageCount || page === this.pageIndex) {
            return;
        }

        this.pageIndex = page;

        // ?????????????????????????????????
        const start = this.pageIndex * this.pageSize;
        this.goAsset(start);

        // ??????????????????????????????formattedAssets???
        this.pageAssets = this.assets.slice(start, start + this.pageSize);
    }

    /**
     * ???????????????index???????????????
     * @param index
     */
    private goAsset(index) {
        this.assetIndex = index;
        this.nowAsset = this.assets[index];

        // ?????????nowStorehouse, nextStorehouse
        // this.nowAsset = this.formatHouse(this.nowAsset);
    }

    // formatHouse(nowAsset) {
    //     console.log('stockObjs: ', nowAsset.stockObjs);
    //     for (let element of nowAsset.stockObjs) {
    //         if (element['nowStorehouse'] && element['nowStorehouse'] !== '') {
    //             const type = (typeof element['nowStorehouse']).toLowerCase();
    //             if (type !== 'object') {
    //                 element['nowStorehouse'] = JSON.parse(element['nowStorehouse']);
    //             }
    //         }
    //         if (element['nextStorehouse'] && element['nextStorehouse'] !== '') {
    //             const type = (typeof element['nextStorehouse']).toLowerCase();
    //             if (type !== 'object') {
    //                 element['nextStorehouse'] = JSON.parse(element['nextStorehouse']);
    //             }
    //         }
    //     }
    //     return nowAsset;
    // }

    prevPage() {
        if (this.pageIndex - 1 >= 0) {
            this.goPage(this.pageIndex - 1);
        }
    }

    nextPage() {
        if (this.pageIndex + 1 < this.pageCount) {
            this.goPage(this.pageIndex + 1);
        }
    }

    onCss(num) {
        const index = num + this.pageIndex * this.pageSize;
        return this.assetIndex === index ? 'active' : 'asset-wrap-gray';
    }

    onArrowCss(d) {
        if (d === 'left') {
            return this.pageIndex === 0 ? 'arrow-gray' : '';
        }
        else {
            return this.pageIndex === this.pageCount - 1 ? 'arrow-gray' : '';
        }
    }

    onClick(num) {
        const index = num + this.pageIndex * this.pageSize;
        this.goAsset(index);
    }

    // toDetail(id) {
    //     // console.log("id: ", id);
    //     this.showRecord = true;
    //     for (let log of this.nowAsset.logs) {
    //         if (log.assetLogId === id) {
    //             this.changeBase = log;
    //         }
    //     }
    //     console.log('changeBase: ', this.changeBase);
    //     // console.log("this.changeBase.transactionData:", this.changeBase.transactionData);

    //     if (this.changeBase.transactionData !== '') {
    //         this.transactionData = JSON.parse(this.changeBase.transactionData);
    //     }
    //     else {
    //         this.transactionData = '';
    //     }

    //     if(this.changeBase.changeBase && this.transactionData && this.transactionData.commodities !== ''){
    //         this.commodities = this.transactionData.commodities;
    //     }

    //     // if (this.transactionData && this.transactionData.commodities && this.transactionData.commodities !== '') {
    //     //     debugger;
    //     //     this.commodities = JSON.parse(this.transactionData.commodities);
    //     // }
    //     // else {
    //     //     this.commodities = '';
    //     // }

    //     // console.log("transactionData: ", this.transactionData)
    //     // console.log("commodities: ", this.commodities)
    // }

    getPhoto(id, ext) {
        if (!id) {
            return;
        }
        this.xn.api.post('/enclosure/enclosure', {
            id
        }).subscribe(json => {
            console.log('json: ', json);
            json.ext = ext;
            this.onView(json);
        });
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShowPhotoModalComponent, item).subscribe(() => {
        });
    }
}
