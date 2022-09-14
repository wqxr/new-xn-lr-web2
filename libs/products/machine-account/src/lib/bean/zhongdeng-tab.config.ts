import { ListHeadsFieldOutputModel, TabConfigModel } from "libs/shared/src/lib/config/list-config-model";
import { CheckersOutputModel } from "libs/shared/src/lib/config/checkers";
import CommBase from "libs/shared/src/lib/public/component/comm-base";
import { XnService } from "libs/shared/src/lib/services/xn.service";
import { HwModeService } from "libs/shared/src/lib/services/hw-mode.service";

export default class ZhongdengTabConfig {
    // 中登列表
    static zhongdengList = {
        heads: <ListHeadsFieldOutputModel[]>[
            { label: '中登登记序号', value: 'registerId', type: 'registerId' },
            { label: '总部公司', value: 'headquarters' },
            { label: '渠道', value: 'productType', type: 'productType' },
            { label: '登记状态', value: 'status', type: 'status' },
            { label: '登记编码', value: 'registerNum' },
            { label: '修改码', value: 'modifiedCode' },
            { label: '中登附件', value: 'zhongdengAttachment', type: 'file' },
            { label: '查询证明文件', value: 'assetFileList', type: 'assetFile' },
            { label: '登记证明文件', value: 'registerFile', type: 'file' },
            { label: '操作人', value: 'operatorName' },
            { label: '最后更新时间', value: 'updateTime', type: 'date' }
        ],
        searches: <CheckersOutputModel[]>[
            { title: '中登登记编号', checkerId: 'registerNum', type: 'text', required: false, sortOrder: 1 },
            { title: '创建时间', checkerId: 'createTime', type: 'quantum1', required: false, sortOrder: 2 },
            { title: '总部公司', checkerId: 'headquarters', type: 'text', required: false, sortOrder: 3 },
            {
                title: '登记状态', checkerId: 'status', type: 'select',
                options: { ref: 'zhongdengSearchStatus' }, required: false, sortOrder: 4
            },
            { title: '供应商', checkerId: 'debtUnitName', type: 'text', required: false, sortOrder: 5 },
            { title: '操作人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 6 }

        ]
    };
    static readonly config = {
        zhongdeng: <TabConfigModel>{
            title: '中登登记列表',
            tabList: [
                {
                    value: 'A',
                    subTabList: [
                        {
                            value: "DOING",
                            canSearch: true,
                            canChecked: false,
                            edit: {
                                rowButtons: [
                                    {
                                        label: '查看处理', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            // xn.router.navigate([`/machine-account/zhongdeng/record/${params.registerId}/${params.status}`]);
                                        }
                                    },
                                    // {
                                    //     label: '修改中登文件', operate: 'changeFile', post_url: '',
                                    //     click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                    //         console.log('commbase=>', base, params);
                                    //         xn.router.navigate([`/machine-account/zhongdeng/record/${params.registerId}/${params.status}`]);
                                    //     }
                                    // },
                                    {
                                        label: '导出中登登记附件', operate: 'invoice_detail', post_url: '',
                                        click: (base: CommBase, record, xn, vcr) => {
                                            const time = new Date().getTime();
                                            xn.dragon.download('/zhongdeng/zd/downloadExcelZd',
                                                { registerId: record.registerId }).subscribe((v: any) => {
                                                    xn.dragon.save(v._body, `${record.registerId}-${time}.xlsx`);
                                                }, err => {
                                                }, () => {
                                                    xn.loading.close();
                                                });
                                        }
                                    }
                                ]
                            },
                            searches: ZhongdengTabConfig.zhongdengList.searches,
                            headText: ZhongdengTabConfig.zhongdengList.heads,
                        }
                    ]
                }
            ]
        },
    };

    static getConfig(name) {
        return this.config[name];
    }
}
