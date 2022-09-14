import { Component, OnInit, Input, ViewChild, ViewChildren, ElementRef, QueryList, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

import { ShowPhotoModalComponent } from 'libs/shared/src/lib/public/modal/show-photo-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnAsset } from 'libs/shared/src/lib/common/xn-asset';

@Component({
    selector: 'xn-flow-detail-chart',
    templateUrl: './flow-detail-chart.component.html',
    styles: [
        `.no-top { border: 0; margin-bottom: 0}`,
        `.maoyi { padding-bottom: 20px; }`,
        `.circles { height: 300px; padding: 20px 0px; overflow: hidden; position: relative; margin-left: 20px; margin-right: 20px }`,
        `.circles li { float: left; margin-right: 50px; width: 100px;height: 100px; cursor: pointer; list-style: none; background: rgba(22, 155, 213, 1);border-radius: 100%;text-align: center;vertical-align: middle;line-height: 100px; }`,
        `.circles-info { position: relative; border: 2px solid #00b9a3; box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1); border-radius: 5px; margin: 0px 20px; padding: 10px 13px 30px 13px; background-color: #fff;}`,
        `.circle-title {margin-bottom: 20px}`,
        `.circles-info p { margin: 0 }`,
        `.picture { height: 400px; position: relative; width: 900px;}`,
        `.clear:after{content:"";display:block;height:0;line-height:0;clear:both;visibility:hidden;}`,
        `.sm-circle { position: absolute; width: 300px }`,
        `.sm-circle1 { left: 0; top: 0px; } `,
        `.sm-circle2 { left: 50%; margin-left: -150px; } `,
        `.sm-circle3 { right: 0; top: 0px; } `,
        `.sm-circle4 { left: 50%; margin-left: -150px; bottom: 0; } `,
        `.text1 { position: absolute; left: 220px; top: 65px; height: 50px; display: flex; flex-direction: column-reverse; }`,
        `.text2 { position: absolute; left: 200px; top: 330px; }`,
        `.text3 { position: absolute; left: 520px; top: 65px; height: 50px; display: flex; flex-direction: column-reverse; }`,
        `.text3-top { position: absolute; left: 520px; top: 40px; height: 50px; display: flex; flex-direction: column-reverse;z-index:1000;}`,
        `.text4 { position: absolute; left: 560px; top: 330px; }`,
        `.text5 { position: absolute; left: 520px; top: 130px; }`,
        `.text6 { position: absolute; left: 220px; top: 130px; }`,
        `.picture p { text-align: center }`,
        `.bottom-btn { text-align: center}`,
        `.btn-store { bottom: 15px; background-color: #00b9a3; border-color: #00b9a3;}`,

        `.change-icon { cursor: pointer;display: inline-block;color: #fff;background: #00b9a3; border-radius: 5px; padding: 0 5px; }`,
        `.change-number, .change-last, .change-time { color: #666 }`,
        `.change-time { text-align: right }`,
        `.record-line { margin-bottom: 20px; border-radius: 5px; }`,
        `.record-box { position: relative; margin-bottom: 20px;}`,
        `.base-title {height: 40px;line-height: 40px;padding: 0px 15px; background: inherit;background-color: rgba(100, 100, 100, 0.7);color: #000; border: none; border-radius: 0px;margin-top: 20px; margin-bottom: 20px }`,
        `.detail-id { color: #1ba208 }`,
        `.base-line { margin-bottom: 10px }`,
        `.base-describe, .base-message { display: inline-block; }`,
        `.base-describe { width: 120px; vertical-align: top;}`,
        `.circles .row { margin: 0 }`,
        `.circles .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 { padding: 0} `,
        `.cursor { cursor: pointer }`,
        `.chart-inner { position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 9999999 }`,
        `.box-bing { background: url(assets/lr/img/infoBg2.png) repeat-x !important }`,
        `.box-bing.active { background: url(assets/lr/img/infoBg.png) repeat-x !important }`,

        `.arrow1 {position: absolute; top: 113px; left: 204px;}`,
        `.arrow2 {position: absolute; top: 113px; left: 505px;}`,
        `.arrow3 {position: absolute; top: 175px; left: 147px;}`,
        `.arrow4 {position: absolute; top: 177px; left: 505px;}`,
        `.xn-arrow-left, .xn-arrow-right {display: inline-block; height: 16px;}`,
        `.xn-arrow-left .arrow, .xn-arrow-right .arrow {width: 192px; height: 16px; display: inline-block;}`,
        `.xn-arrow-left .arrow:before,   .xn-arrow-left .arrow:after,   .xn-arrow-right .arrow:before,   .xn-arrow-right .arrow:after {content: ''; border-color: transparent; border-style: solid; position: absolute;}`,
        `.xn-arrow-right .arrow:after {width: 184px; height: 2px; border-width: 0px; background-color: #ccc; top: 7px; left: 0px;}`,
        `.xn-arrow-right .arrow:before {border-left-color: #ccc; border-width: 8px; left: 184px; top: 0px;}`,
        `.xn-arrow-left .arrow:after {width: 184px; height: 2px; border-width: 0px; background-color: #ccc; top: 7px; left: 8px;}`,
        `.xn-arrow-left .arrow:before {border-right-color: #ccc; border-width: 8px; left: -8px; top: 0px;}`,
        `.xn-arrow-down-right {display: inline-block;}`,
        `.xn-arrow-down-right .line {width: 2px; height: 149px; display: inline-block; border-width: 0px; background-color: #ccc; position: absolute;}`,
        `.xn-arrow-down-right .arrow {width: 248px; height: 16px; display: inline-block; position: absolute; top: 141px;}`,
        `.xn-arrow-down-right .arrow:before,   .xn-arrow-down-right .arrow:after {content: ''; border-color: transparent; border-style: solid; position: absolute;}`,
        `.xn-arrow-down-right .arrow:after {width: 240px; height: 2px; border-width: 0px; background-color: #ccc; top: 7px; left: 0px;}`,
        `.xn-arrow-down-right .arrow:before {border-left-color: #ccc; border-width: 8px; left: 240px; top: 0px;}`,
        `.xn-arrow-right-up {display: inline-block;}`,
        `.xn-arrow-right-up .line {width: 248px; height: 2px; display: inline-block; border-width: 0px; background-color: #ccc; position: absolute; top: 148px;}`,
        `.xn-arrow-right-up .arrow {width: 2px; height: 149px; display: inline-block; position: absolute; top: 0px; left: 248px;}`,
        `.xn-arrow-right-up .arrow:before,   .xn-arrow-right-up .arrow:after {content: ''; border-color: transparent; border-style: solid; position: absolute;}`,
        `.xn-arrow-right-up .arrow:after {width: 2px; height: 149px; border-width: 0px; background-color: #ccc; top: 1px; left: 0px;}`,
        `.xn-arrow-right-up .arrow:before {border-bottom-color: #ccc; border-width: 8px; left: -7px; top: -12px;}`,

        `img {width: 100px; height: 100px; border: 1px solid #eee}`,

        `.arrows { flex-basis: 50px; width: 50px; height: 261px; cursor: pointer; background: url(assets/lr/img/arrow.png) no-repeat no-repeat 0 0 / 100% 100%;}`,
        `.arrow-left {transform: rotate(180deg); margin-right: 10px;}`,
        `.arrow-right {margin-left: 10px;}`,
        `.arrow-gray {filter: grayscale(1)}`,

        `.chart-height-260 { height: 260px }`,
        `.chart-flex { position: relative; display: flex }`,
        `.chart-box { flex: auto; display: flex; flex-direction: row; justify-content: space-between;}`,
        `.chart { flex: auto; padding: 0 10px; max-width: 400px }`,
        `.record-text { font-size: 12px }`,
        `.store-title { text-align: center; position: absolute; z-index: 3; width: 100%; top: 39px; font-size: 16px; font-weight: bold }`,
        `.camera { width: 50px; height: 50px; position: absolute; z-index: 2; left: 50%; margin-left: -25px; top: 11px; cursor: pointer; background: url(assets/lr/img/camera.png) no-repeat no-repeat 0 0 / 100% auto; transition: all 0.1s ease } `,
        `.camera:hover { transform: scale(1.1); position: relative;}`,
        `.camera:hover:after {position: absolute;content: '查看仓库';width: 66px;left: 49px;top: -13px;border: 1px solid #00b9a3;border-radius: 5px;text-align: center;}`,
        `.chart-height-200 { z-index: 1 }`,
        `.picture-arrow { position: absolute; background: url(assets/lr/img/arrow.png) no-repeat no-repeat center center / 100% auto; border-radius: 100%}`,
        `.picture-left  { height: 50px; left: 0; top: 50%; transform: translateY(-50%) rotate(180deg); z-index: 2;  } `,
        `.picture-right { height: 50px; right: 0; top: 50%; transform: translateY(-50%); z-index: 2;  } `,
    ]
})
export class FlowDetailChartComponent implements OnInit {

    @Input() assets: any[];

    pageAssets: any[] = [];  // 当前页的assets
    url: any;

    @ViewChildren('chart') pageCharts: QueryList<ElementRef>;
    @ViewChild('chartLeft') chartLeft: ElementRef;
    @ViewChild('chartUp') chartUp: ElementRef;
    @ViewChild('chartRight') chartRight: ElementRef;
    @ViewChild('chartDown') chartDown: ElementRef;
    @ViewChild('imgView') imgView: ElementRef;

    private chartInstances: any = {} as any;

    // 分页相关
    private pageCount = 0;
    private pageSize = 2;
    private pageIndex: number;

    // 当前选中的资产
    assetIndex = 0;
    nowAsset: any;
    nowAssetOriginal: any = {} as any;
    // 委托下单需要的对象
    public entrustmentList: any[] = [];

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.initPage(this.assets.length);
        this.goPage(0);
    }

    private initPage(recordCount: number) {
        this.pageCount = Math.ceil(recordCount / this.pageSize);
    }

    /**
     * 跳转到第几页
     * @param page
     */
    private goPage(page) {
        if (page < 0 || page >= this.pageCount) {
            return;
        }
        this.pageIndex = page;

        // 翻页后当前资产也会变化
        let start = this.pageIndex * this.pageSize;

        // 把当前页的资产保存在formattedAssets里
        this.pageAssets = this.assets.slice(start, start + this.pageSize);

        this.showPageAssets();
        this.goAsset(start);
    }

    /**
     * 跳到下标为index的数字资产
     * @param index
     */
    private goAsset(index) {

        this.assetIndex = index;
        // 对应数组数据
        this.nowAssetOriginal = this.assets[index];
        this.nowAsset = $.extend(true, {}, this.nowAssetOriginal); // 深拷贝
        if (this.nowAsset && this.nowAsset.logs && this.nowAsset.logs.length) {
            this.entrustmentList = this.nowAsset.logs.filter(item => item.transactionType === 'entrustment');
            if (this.entrustmentList && this.entrustmentList.length) {
                this.entrustmentList.forEach(v => {
                    v.transactionData = JSON.parse(v.transactionData);
                    v.transactionData.commodities = JSON.parse(v.transactionData.commodities);
                });
            }

        }

        // 涉及渲染，放到下一个循环处理
        setTimeout(() => {
            this.showDown();
        }, 0);
    }

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

    // prevLog() {
    //     if (this.nowAsset.logs.length <= 1) {
    //         return;
    //     }
    //
    //     this.sliceShow(0, this.nowAsset.logs.length - 1);
    // }

    nextLog() {
        if (this.nowAsset.logs.length >= this.nowAssetOriginal.logs.length) {
            this.sliceShow(0, 1);
            return;
        }

        this.sliceShow(0, this.nowAsset.logs.length + 1);
    }

    private sliceShow(start, end) {
        let obj = $.extend(true, {}, this.nowAssetOriginal);
        obj.logs = obj.logs.slice(start, end);
        this.nowAsset = XnAsset.convertAsset(obj);
        setTimeout(() => {
            // 调整页面下半部分
            this.showDown();

            // 调整当前资产饼图
            let asset = this.convertPageAsset(this.nowAsset);
            let option = this.optionTerm(asset.data, asset.title, asset.subTitle);
            let num = this.assetIndex - this.pageIndex * this.pageSize;  // 当前是这页的第几个？
            const elements = this.pageCharts.toArray();
            let element: any = elements[num];
            element.chart.setOption(option);  // 这里认为chart一定存在
        }, 0);
    }

    private showPageAssets() {
        let assets = this.pageAssets.map(asset => this.convertPageAsset(asset));

        // 涉及渲染，放到下一个循环处理
        setTimeout(() => {
            this.chart(assets);
        }, 0);
    }

    private convertPageAsset(asset) {
        return {
            data: [
                { value: asset.dai_ding, name: '待订', color: '#d46e6f' },
                { value: asset.ding_dan, name: '订单', color: '#e0a493' },
                { value: asset.ku_cun, name: '库存', color: '#cd8632' }, // #697984
                { value: asset.chu_ku, name: '出库', color: '#8dc7af' },
                { value: asset.ji_ku, name: '寄库', color: '#89b9b3' }
            ].filter(v => v.value > 0),
            title: asset.assetName,
            subTitle: asset.assetUnit
        };
    }

    private chart(assets) {
        const elements = this.pageCharts.toArray();
        for (let i = 0; i < assets.length; ++i) {
            let asset = assets[i];
            let option = this.optionTerm(asset.data, asset.title, asset.subTitle);
            let element: any = elements[i];
            if (!element.chart) {
                element.chart = echarts.init(element.nativeElement);
            }
            element.chart.setOption(option);
        }
    }

    private optionTerm(data, title, subTitle) {
        let names = data.map(v => {
            return v.name;
        });

        let datas = data.map(v => {
            return {
                value: v.value,
                name: v.name
            };
        });

        let colors = data.map(v => {
            return v.color;
        });

        return {
            // backgroundColor: '#169BD5',
            title: {
                text: title,
                subtext: '单位（' + subTitle + '）',
                x: 'center',
                y: '15px'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            // animation: false, // 关闭动画
            legend: {
                orient: 'vertical',
                x: '10px',
                y: '120px',
                data: names
            },
            calculable: true,
            series: [
                {
                    name: '占比',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: datas,
                    // roseType: 'radius',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{c}',
                                textStyle: {
                                    color: '#555'
                                },
                                normal: {
                                    position: 'inner'
                                },
                                position: 'inner'
                            },
                            labelLine: { show: true },
                            position: 'inner'
                        }
                    },
                    color: colors
                }
            ]
        };
    }

    private optionTerm2(data, title) {
        let datas = data.map(v => {
            return {
                value: v.value,
                name: v.name
            };
        });

        let colors = data.map(v => {
            return v.color;
        });

        return {
            title: {
                text: title === '仓库' ? '' : title,
                x: 'center',
                y: title === '仓库' ? '10px' : '25px',
                textStyle: {
                    fontStyle: 'normal',
                    // 字体大小
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            // animation: false, // 关闭动画
            calculable: true,
            series: [
                {
                    name: '占比',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: datas,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{c}',
                                textStyle: {
                                    color: '#555'
                                },
                                position: 'inner'
                            },
                            labelLine: { show: true },
                        }
                    },
                    color: colors
                }
            ]
        };
    }

    private showDown() {
        const asset = this.nowAsset;

        let arrLeft = [
            { name: '未发货', value: asset.supply_order - asset.stock_in, color: '#dfdfdf' },
            { name: '发货', value: asset.stock_in, color: '#8dc7af' }
        ].filter(v => v.value > 0);

        if (arrLeft.length === 0) {
            arrLeft.push({ name: '未发货', value: 0, color: '#dfdfdf' });
        }

        let arrUp = [
            { name: '待订', value: asset.dai_ding, color: '#dfdfdf' },
            { name: '订单数', value: asset.supply_order, color: '#8dc7af' },
        ].filter(v => v.value > 0);

        if (arrUp.length === 0) {
            arrUp.push({ name: '待订', value: 0, color: '#dfdfdf' });
        }

        let arrRight = [
            { name: '未销', value: asset.assetCount - asset.chu_ku, color: '#dfdfdf' },
            { name: '已销', value: asset.chu_ku, color: '#8dc7af' },
        ].filter(v => v.value > 0);

        if (arrRight.length === 0) {
            arrRight.push({ name: '未销', value: 0, color: '#dfdfdf' });
        }

        let arrDown = [
            { name: '库存', value: asset.ku_cun, color: '#dfdfdf' },
            { name: '出库', value: asset.stock_in - asset.ku_cun, color: '#8dc7af' },
        ].filter(v => v.value > 0);

        if (arrDown.length === 0) {
            arrDown.push({ name: '库存', value: 0, color: '#dfdfdf' });
        }

        let charts: any = [
            { data: arrLeft, title: '上游', value: 'chartLeft' },
            { data: arrUp, title: '核心企业', value: 'chartUp' },
            { data: arrRight, title: '下游', value: 'chartRight' },
            { data: arrDown, title: '仓库', value: 'chartDown' },
        ];

        for (let i = 0; i < charts.length; ++i) {
            this.writeDown(charts[i]);
        }
    }

    onCss(num) {
        const index = num + this.pageIndex * this.pageSize;
        return this.assetIndex === index ? 'active' : '';
    }

    onArrowCss(d) {
        if (d === 'left') {
            return this.pageIndex === 0 ? 'arrow-gray' : '';
        } else {
            return this.pageIndex === this.pageCount - 1 ? 'arrow-gray' : '';
        }
    }

    onClick(num) {
        const index = num + this.pageIndex * this.pageSize;
        if (index === this.assetIndex) {
            return;
        }
        this.goAsset(index);
    }

    writeDown(chart) {
        // 避免反复init echarts
        let initChart = this.chartInstances[chart.value];
        if (!initChart) {
            initChart = echarts.init(this[chart.value].nativeElement);
            this.chartInstances[chart.value] = initChart;
        }

        let option = this.optionTerm2(chart.data, chart.title);
        initChart.setOption(option);
    }

    view(relationPlatformSeq: string) {
        if (!relationPlatformSeq) {
            return;
        }
        this.xn.api.post('/visualization/show', {
            platformSeq: relationPlatformSeq
        }).subscribe(json => {
            if (json.data && json.data.data && json.data.data.id) {
                this.getPhoto(json.data.data.id, json.data.data.ext);
            }
        });
    }

    getPhoto(id, ext) {
        if (!id) {
            return;
        }
        this.xn.api.post('/enclosure/enclosure', {
            id: id
        }).subscribe(json => {
            json['ext'] = ext;
            this.onView(json);
        });
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShowPhotoModalComponent, item).subscribe(() => {
        });
    }
}
