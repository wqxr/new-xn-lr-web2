import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PointService } from 'libs/shared/src/lib/services/point.service';
@Component({
    selector: 'statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit {
    @ViewChild('chart') chart: ElementRef;
    pageTitle = '埋点数据分析';
    // 产品类型选项
    appOptions = [
        { label: '证券通', value: 1, checked: false },
        { label: '保理通', value: 2, checked: true },
        { label: '普惠通', value: 3, checked: false },
        { label: '票据通', value: 4, checked: false },
        { label: '保函通', value: 5, checked: false },
        { label: '信用通', value: 6, checked: false },
        { label: '项目通', value: 7, checked: false },
        { label: '抵质押通', value: 8, checked: false },
    ];
    // 客户端类型选项
    portOptions = [
        { label: 'PC端', value: 1, checked: false },
        { label: '小程序', value: 2, checked: true },
    ];
    // 分析类型选项
    typeOptions = [
        { label: '行为分析', value: 'action' },
        { label: '页面分析', value: 'page' },
    ];
    // 时间范围类型选项
    rangeOptions = [
        { label: '日粒度', value: 'date' },
        { label: '周粒度', value: 'week' },
        { label: '月粒度', value: 'month' },
    ];
    // 时间展示单位
     timeOptions = [
        { label: '秒', value: 'second' },
        { label: '分钟', value: 'minute' },
        { label: '小时', value: 'hour' },
    ];
    paramsOptions = [
        {
            appName: '保理通',
            portName: '小程序',
            // 行为分析选项
            actionOptions: [
                {
                    label: '使用量',
                    value: '使用量',
                    showTimeOptions: false,
                    children: [
                        {
                            label: '注册次数',
                            value: 'BL-WX-registry',
                            checked: false,
                        },
                        {
                            label: '登录成功次数',
                            value: 'BL-WX-login',
                            checked: false,
                        },
                        {
                            label: '业务查询功能使用次数',
                            value: 'BL-WX-query-business',
                            checked: false,
                        },
                        {
                            label: '业务资料上传使用次数',
                            value: 'BL-WX-upload-data-operate',
                            checked: false,
                        },
                        {
                            label: '业务资料上传成功次数',
                            value: 'BL-WX-upload-data-review',
                            checked: false,
                        },
                        {
                            label: '合同签署使用次数',
                            value: 'BL-WX-sign-contract-operate',
                            checked: false,
                        },
                        {
                            label: '合同签署成功次数',
                            value: 'BL-WX-sign-contract-review',
                            checked: false,
                        },
                        {
                            label: '在线客服使用次数',
                            value: 'BL-WX-online-service',
                            checked: false,
                        },
                        {
                            label: '客服电话使用次数',
                            value: 'BL-WX-service-telephone',
                            checked: false,
                        },
                    ]
                },
            ],
            // 页面分析选项
            pageOptions: [
                // {
                //     label: '浏览时长',
                //     value: '浏览时长',
                //     showTimeOptions: true,
                //     children: [
                //         {
                //             label: '业务待办页面',
                //             value: 'business_agent_views_time',
                //             checked: false,
                //         },
                //         {
                //             label: '业务查询页面',
                //             value: 'business_query_views_time',
                //             checked: false,
                //         },
                //         {
                //             label: '用户中心页面',
                //             value: 'business_user_center_views_time',
                //             checked: false,
                //         }
                //     ]
                // },
                // {
                //     label: '浏览量',
                //     value: '浏览量',
                //     showTimeOptions: false,
                //     children: [
                //         {
                //             label: '业务待办页面',
                //             value: 'business_agent_views',
                //             checked: false,
                //         },
                //         {
                //             label: '业务查询页面',
                //             value: 'business_query_views',
                //             checked: false,
                //         },
                //         {
                //             label: '用户中心页面',
                //             value: 'user_center_views',
                //             checked: false,
                //         }
                //     ]
                // }
            ] 
        },
        {
            appName: '保理通',
            portName: 'PC端',
            // 行为分析选项
            actionOptions: [
                {
                    label: '使用量',
                    value: '使用量',
                    showTimeOptions: false,
                    children: [
                        {
                            label: '注册次数',
                            value: 'BL-PC-registry',
                            checked: false,
                        },
                        {
                            label: '登录成功次数',
                            value: 'BL-PC-login',
                            checked: false,
                        },
                        {
                            label: '业务资料上传使用次数',
                            value: 'BL-PC-upload-data-operate',
                            checked: false,
                        },
                        {
                            label: '业务资料上传成功次数',
                            value: 'BL-PC-upload-data-review',
                            checked: false,
                        },
                        {
                            label: '合同签署使用次数',
                            value: 'BL-PC-sign-contract-operate',
                            checked: false,
                        },
                        {
                            label: '合同签署成功次数',
                            value: 'BL-PC-sign-contract-review',
                            checked: false,
                        }
                    ]
                },
            ],
            // 页面分析选项
            pageOptions: [] 
        }
    ];
    currentItemOptions = [];
    selectedList = [];
    rangeType = 'date';
    timeType = 'second';
    normalization = false;
    radioValue = 'action';
    rangeDate = [new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), new Date()];
    currentSelectParams = null;
    items = [];
    datas = [];
    // 是否是“行为分析”
    get isAction() {
        return this.radioValue === 'action';
    }
    // 当前选中的产品
    get currentApp() {
        return this.appOptions.find(c => c.checked);
    }
    // 当前选中的客户端类型
    get currentPort() {
        return this.portOptions.find(c => c.checked);
    }
    // 当前选中的分析类型
    get currentType() {
        return this.typeOptions.find(c => c.value === this.radioValue);
    }

    // 当前参数选项
    get currentParams() {
        return this.paramsOptions.find(c => this.currentApp.label === c.appName && this.currentPort.label === c.portName);
    }

    // 当前“行为分析”或“页面分析”匹配的选项
    get currentOptions() {
        return this.currentParams ? (this.isAction ? this.currentParams.actionOptions : this.currentParams.pageOptions) : [];
    }

    // 显示的标题-"保理通-小程序-行为分析"
    get title() {
        return `${this.currentApp.label}-${this.currentPort.label}-${this.currentType.label}`;
    }

    get hasSelected() {
        return this.selectedList.some(c => c.hasSelected);
    }

    get timeLabel() {
        return this.currentSelectParams?.showTimeOptions ? this.timeOptions.find(c => c.value === this.timeType).label : '次';
    }

    constructor(private xn: XnService, private ps: PointService) {}

    // 选中项目类型、客户端类型、分析类型时触发
    handleSelect(option, options) {
        console.log('option', option)
        console.log('options', options)
        // 项目类型、客户端类型多选框 单选操作
        this[options] = this[options].map(c => {
            if (c.value === option.value) {
                c.checked = true;
            } else {
                c.checked = false;
            }
            return c;
        })
        // 初始化数据
        this.setCurrentOptions();
        this.resetData();
    }
    handleSelectType() {
         // 初始化数据
         this.setCurrentOptions();
         this.resetData();
    };
    setCurrentOptions() {
        // 创建参数选项副本
        this.selectedList = this.currentOptions.length ? JSON.parse(JSON.stringify(this.currentOptions)) : [];
        // 默认选中当前第一项
        this.currentSelectParams = this.selectedList.length ? this.selectedList[0] : null;
        this.currentItemOptions = this.currentSelectParams ? this.currentSelectParams.children : [];
    }
    resetData() {
        this.rangeDate = [new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), new Date()];
        this.rangeType = 'date';
    }
    // 选择参数选项
    handleSelectParams(e) {
        console.log('e', e)
        this.selectedList = this.selectedList.map(c => {
            if (c.value === this.currentSelectParams.label) {
                c.children = c.children.map(d => {
                    if (e.includes(d.value)) {
                        d.checked = true;
                    } else {
                        d.checked = false;
                    }
                    return d;
                })
                c.hasSelected = c.children.some(d => d.checked);
            }
            return c;
        })
        if (this.hasSelected) {
            this.getData();
        }
    }
    handleSelectCurrentParams(item) {
        this.currentItemOptions = item.children; 
        this.currentSelectParams = item;
        if (this.currentType.label === '页面分析') {
            this.selectedList = this.selectedList.map(c => {
                c.children = c.children.map(d => {
                    d.checked = false;
                    return d;
                })
                c.hasSelected = c.children.some(d => d.checked);
                return c;
            })
        }
    }
    // 删除选项选项
    handleDelete(item) {
        this.selectedList = this.selectedList.map(c => {
            c.children = c.children.map(d => {
                if (d.value === item.value) {
                    d.checked = false;
                }
                return d;
            })
            c.hasSelected = c.children.some(d => d.checked)
            return c;
        })
        if (this.hasSelected) {
            this.getData();
        }
    }
    // 画图
    buildChart(xAxisData = [], series = []) {
        const options = {
            title: {
                text: '',
                subtext: `单位（${this.timeLabel}）`,
                left: '80px',
                top: '10px',
              },
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '10%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisData
              },
              yAxis: {
                type: 'value',
                min: 0,
                minInterval: this.normalization ? 0 : 1
              },
              series: series
        };
        const chart = echarts.init(this.chart.nativeElement);
        chart.clear();
        chart.setOption(options);
    }

    onDownload() {
        const params = {
            itemName: this.items,
            dataArr: this.datas
        }
        this.ps.downloadFile(params, this.title)
    }

    // 获取埋点数据
    getData() {
        if (this.hasSelected) {
            // 起始时间戳
            const beginTime = XnUtils.formatDate(this.rangeDate[0]) + ' 00:00:00';
            // 截止时间戳
            const endTime = XnUtils.formatDate(this.rangeDate[1]) + ' 23:59:59';
            // 时间粒度
            const grainSize = this.rangeType === 'date' ? 'day' : this.rangeType;
            // 产品ID
            const productId = this.currentApp.value;
            // 客户端类型
            const type = this.currentPort.value;
            // 埋点名称数组
            const itemName = this.selectedList.reduce((pre, cur) => {
                return pre.concat(cur.children.filter(c => c.checked));
            }, []).map(d => d.value);
            const params: any = {itemName, productId, type, beginTime, endTime, normalization: this.normalization, grainSize}
            // 时间粒度
            if (this.currentSelectParams?.showTimeOptions) {
                params.timeNormalization = this.timeType
            }
            this.ps.getPointData(params).subscribe((res: any) => {
                const resData = res.data[0]
                this.items = resData[0];
                this.datas = resData[1];
                const x = this.datas[0][0];
                const itemsList = this.selectedList.reduce((pre, cur) => {
                    return pre.concat(cur.children);
                }, []).filter(c => c.checked);
                const list = this.items.map((c, i) => {
                    const target = itemsList.find(d => d.value === c);
                    return {
                        name:  target ? target.label : c.value,
                        type: 'line',
                        data: this.datas[i][1]
                    }
                })
                // 画图
                this.buildChart(x, list);
            })
        }
    }

    ngOnInit(): void {
        this.setCurrentOptions();
    }
}