/**
 * base: src\app\pages\console\gemdale-mode\tab-pane.ts
 */
export default class NewAgileSignContractConfig {
    // 批量签署合同(万科abs_雅居乐)
    static signContractConfig = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit' },
            // { label: '总部公司', value: 'headquarters' },
            { label: '合同编号', value: 'contractId' },
            { label: '发票号码', value: 'realInvoiceNum', type: 'invoiceNum' }, // 实际上传发票
            { label: '发票金额', value: 'realInvoiceAmount', type: 'money' },
            { label: '应收账款金额', value: 'receivable', type: 'money' },
            { label: '付款确认书编号', value: 'payConfirmId' },
            { label: '付款确认书', value: 'pdfProjectFiles', type: 'contract' },
        ],
        searches: [
            {
                title: '付款确认书编号',
                checkerId: 'payConfirmId',
                type: 'text',
                required: false,
                number: 2
            },
            {
                title: '申请付款单位',
                checkerId: 'projectCompany',
                type: 'text',
                required: false,
                number: 3
            },
            {
                title: '合同编号',
                checkerId: 'contractId',
                type: 'text',
                required: false,
                number: 4
            },
            {
                title: '收款单位',
                checkerId: 'debtUnit',
                type: 'text',
                required: false,
                number: 5
            },
            {
                title: '发票号',
                checkerId: 'realInvoiceNum',
                type: 'text',
                required: false,
                number: 6
            },
        ],
    };

    static readonly config = {
        title: '批量签署合同-星顺-雅居乐',
        tabList: [
                {
                    label: '未签署合同', value: 'do_not',
                    canChecked: true,
                    canSearch: true,
                    edit: {
                        headButtons: [
                            {
                                label: '批量签署',
                                value: '/custom/vanke_v5/contract/sign_contracts',
                                operate: 'yjl_sign_contracts',
                                disabled: true,
                                value2: '/custom/vanke_v5/contract/update_contracts' // 保存签署合同信息
                            }
                        ],
                        rowButtons: [
                            {
                                label: '签署',
                                value: '/custom/vanke_v5/contract/sign_contracts',
                                operate: 'yjl_sign_contract',
                                value2: '/custom/vanke_v5/contract/update_contracts' // 保存签署合同信息
                            },
                        ]
                    },
                    searches: NewAgileSignContractConfig.signContractConfig.searches,
                    headText: NewAgileSignContractConfig.signContractConfig.heads,
                    get_url: '/custom/vanke_v5/contract/get_contracts_not',
                },
                {
                    label: '已签署合同',
                    value: 'do_down',
                    canChecked: true,
                    canSearch: true,
                    searches: NewAgileSignContractConfig.signContractConfig.searches,
                    headText: NewAgileSignContractConfig.signContractConfig.heads,
                    get_url: '/custom/vanke_v5/contract/get_contracts_has',
                }
        ],
    };
}
