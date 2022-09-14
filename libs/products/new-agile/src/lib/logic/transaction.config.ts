import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ListHeadsFieldOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';


/**
 * 标准保理 - 交易列表
 * base: src\app\modules\dragon\common\transaction.config.ts
 */
export default class TransactionTabConfig {
    // 地产类ABS
    static NewAgileProjectInfo = {
        heads: [
            {
                label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                }
            },
            { label: '申请付款单位', value: 'enterpriseOrgName' },
            { label: '收款单位', value: 'supplierOrgName' },
            { label: '付款确认书编号', value: 'payConfirmId' },
            {
                label: '交易金额', value: 'contractAmount', type: 'money', _inList: {
                    sort: true,
                    search: true
                },
            },
            { label: '利率', value: 'discountRate' },
            { label: '交易状态', value: 'status', type: 'tradeStatus' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
            { label: '合同类型', value: 'contractType' },
            { label: '资产池名称', value: 'capitalPoolName' },
            {
                label: '创建时间', value: 'createTime', type: 'date', _inList: {
                    sort: true,
                    search: true
                }
            }
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 2 },
            {
                title: '交易状态', checkerId: 'status', type: 'select', options: { ref: 'newAgileListType' },
                required: false,
                sortOrder: 3
            },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 4 },
            { title: '资产池名称', checkerId: 'capitalPoolName', type: 'text', required: false, sortOrder: 5 },
            { title: '交易金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 6 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
        ] as CheckersOutputModel[]
    };
    static readonly config = {
        newAgileProjectList: {
            title: '交易列表-星顺-雅居乐',
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
                                    // hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                    xn.router.navigate([
                                        `/new-agile/main-list/detail/${params.mainFlowId}`
                                    ]);
                                }
                            },
                            { label: '发票详情', operate: 'invoice_detail', post_url: '/trade/get_invoice_list' },
                            {
                                label: '中止', operate: 'stop', post_url: '', disabled: false,
                                click: (base: CommBase, params, xn: XnService) => {
                                    xn.router.navigate([`/new-agile/record/new/`],
                                        {
                                            queryParams: {
                                                id: 'pay_over18',
                                                relate: 'mainFlowId',
                                                relateValue: params.mainFlowId,
                                            }
                                        });
                                }
                            },
                        ]
                    },
                    searches: TransactionTabConfig.NewAgileProjectInfo.searches,
                    headText: TransactionTabConfig.NewAgileProjectInfo.heads,
                    get_url: '/flow/main/all?method=get'
                }
            ],
        }
    };
    static get(name) {
        return this.config[name];
    }
}
