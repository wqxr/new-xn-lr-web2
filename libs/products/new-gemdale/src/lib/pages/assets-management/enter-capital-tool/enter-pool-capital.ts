import { ListHeadsFieldOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

// 标准保理 - 交易列表
export default class NewGemdaleEnterPoolConfig {
    // 地产类ABS
    static enterPoolList = {
        heads: [
            {
                label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                }
            },
            { label: '资产池名称', value: 'capitalPoolName' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '申请付款单位', value: 'projectCompany', },
            { label: '总部公司', value: 'headquarters' },
            { label: '渠道', value: 'productType', type: 'productType' },
            {
                label: '应收账款金额', value: 'receive', type: 'money', _inList: {
                    sort: true,
                    search: true
                },
            },
            { label: '上传发票与预录入是否一致', value: 'isInvoiceFlag', type: 'text1' },
            { label: '创建时间', value: 'createTime', type: 'date' },
            { label: '总部提单日期', value: 'headPreDate', type: 'date' },
            { label: '付款确认书编号', value: 'payConfirmId', type: '' },
            { label: '合同签署时间', value: 'signContractDate', type: 'date' },
            { label: '预计放款日', value: 'priorityLoanDate', type: 'date' },
            { label: '当前步骤', value: 'flowId', type: 'currentStep' },
            { label: '实际放款日', value: 'realLoanDate', type: 'date' },
            { label: '收款单位是否注册', value: 'isRegisterSupplier', type: 'text1' },
            {
                label: '资金渠道', value: 'channelType', type: 'text1', _inList: {
                    sort: false,
                    search: false
                },
            },
            {
                label: '付款银行', value: 'bankName', type: 'fundingInfo', _inList: {
                    sort: false,
                    search: false
                }
            },
            {
                label: '付款银行账号', value: 'cardCode', type: 'fundingInfo', _inList: {
                    sort: false,
                    search: false
                }
            },
            { label: '台账备注', value: 'memo', type: 'memo' },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 1 },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 2 },
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 3 },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 4 },
            { title: '交易状态', checkerId: 'tradeStatus', type: 'select', required: false, sortOrder: 5, options: { ref: 'newGemdaleTradeStatus' }, },
            { title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text', required: false, sortOrder: 6, options: { ref: 'accountReceipts' } },
            { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 7 },
            { title: '渠道', checkerId: 'productType', type: 'linkage-select', required: false, sortOrder: 8, options: { ref: 'productType_new_jd' } },
            { title: '总部提单日期', checkerId: 'isHeadPreDate', type: 'dragon-loandate', required: false, sortOrder: 9, },
            { title: '实际上传发票与预录入是否一致', checkerId: 'isInvoiceFlag', type: 'select', required: false, sortOrder: 13, options: { ref: 'defaultRadio' }, },
        ] as CheckersOutputModel[]
    };
    static readonly config = {
        enterPoolList: {
            title: '拟入池交易列表-金地',
            tabList: [
                {
                    label: '所有交易', value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        leftheadButtons: [
                            {
                                label: '移入资产池',
                                operate: 'enter-capitalpool',
                                post_url: '/customer/changecompany',
                                disabled: false,
                                click: (xn: XnService, params) => { },
                            },
                            {
                                label: '批量补充信息',
                                operate: 'batch-information',
                                post_url: '/customer/changecompany',
                                disabled: false,
                                click: (xn: XnService, params) => { },

                            },
                        ],
                        rightheadButtons: [
                            {
                                label: '下载附件',
                                operate: 'download-file',
                                post_url: '/customer/changecompany',
                                disabled: false,
                                click: (xn: XnService, params) => { },

                            },
                            {
                                label: '导出清单',
                                operate: 'export-file',
                                post_url: '/customer/changecompany',
                                disabled: false,
                                click: (xn: XnService, params) => { },

                            },
                        ],
                        rowButtons: [
                        ]
                    },
                    searches: NewGemdaleEnterPoolConfig.enterPoolList.searches,
                    headText: NewGemdaleEnterPoolConfig.enterPoolList.heads,
                    get_url: '/project_manage/pool/pool_plan_list',
                }
            ]
        }
    };
    static get(name) {
        return this.config[name];
    }
}
