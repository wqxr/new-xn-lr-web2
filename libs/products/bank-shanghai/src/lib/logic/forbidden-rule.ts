import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

// 上海银行直保 -禁入规则列表配置
export default class ForbiddenRuleConfig {
    // 列表表头,搜索项配置
    static forbiddenRulelist = {
        heads: [
            { label: '规则名称', value: 'ruleName', type: 'text', width: '10%' },
            { label: '简介', value: 'description', type: 'long-text', width: '34%' },
            { label: '适用渠道', value: 'channel', type: 'channel', width: '8%'  },
            { label: '创建人', value: 'createUserName', type: 'text', width: '10%'  },
            { label: '创建时间', value: 'createTime', type: 'longdatetime', width: '12%'  },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '企业名称', checkerId: 'companyName', type: 'text', required: false, sortOrder: 1 },
        ] as CheckersOutputModel[]
    };
    static readonly config = {
        forbiddenRuleList: {
            title: '提单禁入规则',
            value: 'dataDockingList',
            tabList: [
                {
                    label: '提单禁入规则列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: false,
                            edit: {
                                headButtons: [
                                    { label: '新建规则', operate: 'add_rule', post_url: '/', disabled: false, showButton: true, }
                                ],
                                rowButtons: [
                                    {   label: '查看', operate: 'view_fobidden_enterprise', post_url: '',
                                        click: (xn: XnService, params: any) => {}
                                    },
                                    {   label: '编辑', operate: 'edit_fobidden_enterprise', post_url: '',
                                        click: (xn: XnService, params: any) => {}
                                    },
                                    {   label: '启用/禁用', operate: 'isEnable_rule', post_url: '',
                                        click: (xn: XnService, params: any) => {}
                                    },
                                    {   label: '删除', operate: 'delete_rule', post_url: '',
                                        click: (xn: XnService, params: any) => {}
                                    },
                                ]
                            },
                            searches: [...ForbiddenRuleConfig.forbiddenRulelist.searches],
                            params: 1,
                            searchNumber: 8,
                            headNumber: 7,
                            headText: [...ForbiddenRuleConfig.forbiddenRulelist.heads],
                        },
                    ] as SubTabListOutputModel[],
                    post_url: '/shanghai_bank/sh_company_limit/selectRules'
                },
            ] as TabListOutputModel[]
        }
    };
    static getConfig(name) {
        return this.config[name];
    }
}
