import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
// 中登查询表格配置
export default class ZdRejectData {
    static zdsearch = {  // 合同模板列表templateName
        heads: [
            { label: '登记证明编号', value: 'registerNo', type: 'text' },  // templateName
            {
                label: '登记时间', value: 'registerDate', type: 'longDateTime', _inList: {
                    sort: true,
                    search: true
                }
            },
            {
                label: '登记到期日', value: 'registerDueDate', type: 'longDateTime', _inList: {
                    sort: true,
                    search: true
                }
            },
            { label: '中登类别', value: 'classify', type: 'classType' },
            { label: '修改人', value: 'updateUserName', type: 'text' },
            { label: '复核人', value: 'reviewUserName', type: 'text' },
            {
                label: '最后更新时间', value: 'updateTime', type: 'longDateTime', _inList: {
                    sort: true,
                    search: true
                }
            },
        ],
        searches: [
            {
                title: '修改人',
                checkerId: 'updateUserName',
                type: 'text',
                required: false,
                placeholder: '请输入修改人',
            },
            {
                title: '登记证明编号',
                checkerId: 'registerNo',
                type: 'text',
                required: false,
                placeholder: '请输入登记证明编号',

            },
            {
                title: '复核人',
                checkerId: 'reviewUserName',
                type: 'text',
                required: false,
                placeholder: '请输入复核人',
            },
        ],
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        zhongdengsearch: {
            title: '复核退回列表',
            value: 'zd-search',
            tabList: [
                {
                    label: '',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                ],
                                rowButtons: [
                                    {
                                        label: '查看处理',
                                        operate: 'view',
                                        post_url: '',
                                        click: (xn: XnService, item: any) => {
                                            const flowId = 'zd_modify_category';
                                            xn.router.navigate([`/console/manage/invoice-search/record/${flowId}/edit/${item.recordId}`]);
                                        }
                                    },
                                ]
                            },
                            searches: ZdRejectData.zdsearch.searches,
                            headText: [...ZdRejectData.zdsearch.heads],
                        }
                    ],
                    post_url: '/custom/zhongdeng/zd/list',
                    params: 1
                },
            ]
        } as TabConfigModel
    };
    static getConfig(name) {
        return this.config[name];
    }
}
