import { ListHeadsFieldOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

// 标准保理 - 交易列表
export default class DragonTransactionTabConfig {
    // 地产类ABS
    static DragonProjectInfo = {
        heads: [
            {
                label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                }
            },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '总部公司', value: 'headquarters' },
            { label: '付款确认书编号', value: 'payConfirmId' },
            {
                label: '交易金额', value: 'receive', type: 'money', _inList: {
                    sort: true,
                    search: true
                },
            },
            { label: '利率', value: 'discountRate' },
            // { label: '交易状态', value: 'status', type: 'tradeStatus' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
            { label: '合同类型', value: 'contractType', type: 'dragonContracttype' },
            { label: '资产池名称', value: 'capitalPoolName' },
            { label: '当前步骤', value: 'flowId', type: 'currentStep' },
            {
                label: '创建时间', value: 'createTime', type: 'date', _inList: {
                    sort: true,
                    search: true
                }
            }
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '交易金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 2 },
            { title: '创建时间', checkerId: 'createTime', type: 'quantum1', required: false, sortOrder: 3 },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
            { title: '企业Id', checkerId: 'debtUnitId', type: 'text', required: false, sortOrder: 6 },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 7 },
            {
                title: '交易模式及状态', checkerId: 'status', type: 'select', options: { ref: 'standardFactoring' },
                required: false,
                sortOrder: 8
            },
            { title: '资产池名称', checkerId: 'capitalPoolName', type: 'text', required: false, sortOrder: 9 },
        ] as CheckersOutputModel[]
    };
    static readonly config = {
        dragonProjectList: {
            title: '台账-金地',
            tabList: [
                {
                    label: '所有交易',
                    value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        rowButtons: [
                            {
                                label: '查看', operate: 'view', post_url: '',
                                click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                    hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                    // hwModeService.DragonviewProcess(params.mainFlowId);
                                }
                            },
                            { label: '发票详情', operate: 'invoice_detail', post_url: '/trade/get_invoice_list' },
                            {
                                label: '中止', operate: 'stop', post_url: '/customer/changecompany', disabled: false,
                                click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                    xn.router.navigate([`/machine-account/record/new/`],
                                        {
                                            queryParams: {
                                                id: 'sub_dragon_book_stop',
                                                relate: 'mainFlowId',
                                                relateValue: params.mainFlowId,
                                            }
                                        });
                                }
                            },
                        ]
                    },
                    searches: DragonTransactionTabConfig.DragonProjectInfo.searches,
                    headText: DragonTransactionTabConfig.DragonProjectInfo.heads,
                    get_url: '/list/main/mainList'
                }
            ],
        }
    };
    static get(name) {
        return this.config[name];
    }
}
