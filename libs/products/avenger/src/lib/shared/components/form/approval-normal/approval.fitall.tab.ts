import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class AvengerapprovalTable { // 回款管理table配置
    static honorFit = { // 回款管理发起回款匹配
        heads: [
            { label: '商票号码', value: 'honorNum' },
            { label: '商票金额', value: 'receivable' },
            { label: '出票日期', value: 'factoringStartDate', type: 'text' },
            { label: '到期日期', value: 'factoringEndDate', type: 'text' },
            { label: '商票承兑人', value: 'projectCompany' },
            { label: '收款人', value: 'factoringName' },
            { label: '对应交易ID', value: 'mainFlowId' },
            { label: '匹配结果', value: 'result', type: 'fitResult' },

        ],
    };
    static uploadhonorFit = { // 平台资料初审-经办页面发票
        heads: [
            { label: '文件名', value: 'invoiceNum' },
            { label: '付款确认书编号', value: 'upstreamInvoice' },
            { label: '供应商名称', value: 'invoiceCode' },
            { label: '供应商银行账号', value: 'invoiceDate', type: 'date' },
            { label: '开户行', value: 'invoiceAmount', type: 'money' },
            { label: '应收账款金额', value: 'upstreamInvoice' },
            { label: '账款到期日', value: 'invoiceCode' },
            { label: '对应交易ID', value: 'invoiceDate', type: 'date' },
            { label: '匹配结果', value: 'invoiceAmount', type: 'money' },
            { label: '操作', value: 'realInvoiceAmount' },

        ],

    };
    static BusinessticketFit = {
        heads: [
            { label: '付款人名称', value: 'projectCompany' },
            { label: '收款人名称', value: 'debtUnit' },
            { label: '付款金额', value: 'receivable' },
            { label: '付款日期', value: 'paybackDate' },
            { label: '对应交易Id', value: 'mainFlowId' },
            { label: '匹配结果', value: 'result', type: 'fitResult' },
        ],

    };
    static freedetail = {
        heads: [
            { label: '项目', value: 'type' },
            { label: '应收', value: 'cost' },
            { label: '实收', value: 'invoiceCode' },
            { label: '差额', value: 'invoiceDate' },
            { label: '实收时间', value: 'invoiceAmount', type: 'date' },
        ],

    };
    static TransactionList = {
        heads: [
            { label: '交易id', value: 'mainFlowId' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit', },
            { label: '应收账款金额', value: 'receivable', type: 'money' },
        ],

    };
    static tableFormlist = {
        title: 'table',
        tabList: [
            {
                label: 'honor-fit', value: 'honor-fit',
                headText: AvengerapprovalTable.honorFit.heads,
                data: [],
                headButtons: [
                    {
                        label: '上传excel',
                        operate: 'confirm_receivable',
                        post_url: '/customer/changecompany',
                        disabled: false,
                    },

                ],

                Other: [{ label: '匹配成功数量', value: '' }, { label: '匹配失败数量', value: '' }]


            },
            {
                label: 'uploadhonor-fit', value: 'uploadhonor-fit',
                headText: AvengerapprovalTable.uploadhonorFit.heads,
                headButtons: [
                    {
                        label: '批量上传《付款确认书》',
                        operate: 'confirm_receivable',
                        post_url: '/customer/changecompany',
                        disabled: false,
                    },
                ],
                Other: [{ label: '上传文件数量', value: '' }, { label: '匹配成功数量', value: '' }, { label: '匹配失败数量', value: '' }]
            },
            {
                label: 'ticket-fit', value: 'ticket-fit',
                headText: AvengerapprovalTable.BusinessticketFit.heads,
                headButtons: [
                    {
                        label: '上传excel',
                        operate: 'confirm_receivable',
                        post_url: '/customer/changecompany',
                        disabled: false,
                    },
                    {
                        label: '下载模板',
                        operate: 'confirm_receivable',
                        post_url: '/customer/changecompany',
                        disabled: false,
                    },
                ],
                Other: [{ label: '匹配成功数量', value: '' }, { label: '匹配失败数量', value: '' }]
            },
            {
                label: 'fee-info', value: 'fee-info',
                headText: AvengerapprovalTable.freedetail.heads,
            },
            {
                label: 'deal-list', value: 'deal-list',
                headText: AvengerapprovalTable.TransactionList.heads,
            }
        ]
    };
    static readonly add = {
        can: (xn: XnService) => {
            return false;
        },
    };
}
