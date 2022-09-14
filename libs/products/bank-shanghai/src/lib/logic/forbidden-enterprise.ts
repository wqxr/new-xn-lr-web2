import { ListHeadsFieldOutputModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

// 上海银行直保 -禁入规则列表配置
export default class ForbiddenEnterpriseConfig {
    // 列表表头,搜索项配置
    static forbiddenEnterpriselist = {
        heads: [
            { label: '企业名称', value: 'companyName', type: 'text', width: '40%' },
            { label: '来源', value: 'originType', type: 'source', width: '10%' },
            { label: '添加人', value: 'createUserName', type: 'text', width: '10%' },
            { label: '添加时间', value: 'createTime', type: 'longdatetime', width: '20%' },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '企业名称', checkerId: 'companyName', type: 'text', required: false, sortOrder: 1 },
        ] as CheckersOutputModel[]
    };
    static readonly config = {
        forbiddenEnterpriseList: {
            title: '禁入企业列表',
            value: 'dataDockingList',
            tabList: [
                {
                    label: '禁入企业列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: false,
                            edit: {
                                headButtons: [
                                    { label: '新增', operate: 'add_enterprise', post_url: '', disabled: false, showButton: true, },
                                    { label: '批量上传', operate: 'batch_upload_enterprise', post_url: '', disabled: false, showButton: true, },
                                    { label: '下载模板', operate: 'download_template', post_url: '', disabled: false, showButton: true, },
                                    { label: '导出清单', operate: 'export_manifest', post_url: '/', disabled: false, showButton: true },
                                ],
                                rowButtons: [
                                    {   label: '删除', operate: 'delete_enterprise', post_url: '',
                                        click: (xn: XnService, params: any) => {
                                        }
                                    },
                                ]
                            },
                            searches: [...ForbiddenEnterpriseConfig.forbiddenEnterpriselist.searches],
                            params: 1,
                            searchNumber: 8,
                            headNumber: 7,
                            headText: [...ForbiddenEnterpriseConfig.forbiddenEnterpriselist.heads],
                        },
                    ] as SubTabListOutputModel[],
                    post_url: '/shanghai_bank/sh_company_limit/querySupplierByName'
                },
            ] as TabListOutputModel[]
        }
    };
    static getConfig(name) {
        return this.config[name];
    }
}
