import { ListHeadsFieldOutputModel } from "libs/shared/src/lib/config/list-config-model";
import { CheckersOutputModel } from "libs/shared/src/lib/config/checkers";

// 标准保理 - 交易列表
export default class DragonProjectTabConfig {
    // 地产类ABS
    static DragonProjectInfo = {
        heads: <ListHeadsFieldOutputModel[]>[
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '总部公司', value: 'headquarters', type: 'headquarters' },
            { label: '付款确认书编号', value: 'payConfirmId' },
            { label: '交易金额', value: 'receivable', type: 'money' },
            { label: '利率', value: 'assigneePrice' },
            { label: '交易状态', value: 'transactionStatus', type: 'xnMainFlowStatus' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
            { label: '合同类型', value: 'debtReceivableType', type: 'xnContractType' },
            { label: '资产池名称', value: 'capitalPoolName' },
            { label: '创建时间', value: 'createTime', type: 'date' }
        ],
        searches: <CheckersOutputModel[]>[
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '创建时间', checkerId: 'createTime', type: 'quantum', required: false, sortOrder: 2 },
            { title: '总部公司', checkerId: 'headquarters', type: 'text', required: false, sortOrder: 7 },
            { title: '资产池名称', checkerId: 'capitalPoolName', type: 'text', required: false, sortOrder: 4 },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 3 },
            {
                title: '交易模式及状态',
                checkerId: 'status',
                type: 'linkage-select',
                options: { ref: 'StandardFactoringMode' },
                required: false,
                sortOrder: 6
            }
        ]
    };
    static readonly config = {
        dragonProjectList: {
            title: '龙光交易列表',
            tabList: [
                {
                    label: '所有交易', value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    searches: DragonProjectTabConfig.DragonProjectInfo.searches,
                    headText: DragonProjectTabConfig.DragonProjectInfo.heads,
                    get_url: 'list/main/mainList',
                }
            ]
        }
    }
    static get(name) {
        return this.config[name];
    }
}
