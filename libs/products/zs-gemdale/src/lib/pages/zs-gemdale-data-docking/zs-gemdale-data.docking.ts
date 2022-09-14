import { ListHeadsFieldOutputModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';


// 标准保理 -金地接口数据列表
export default class ZsGemdaleDataDockingConfig {
    // 地产类ABS
    static dataLockinglist = {
        heads: [
            { label: '审核记录', value: 'approveList', type: 'approveList' },
            { label: '附件', value: 'exitList', type: 'exitList' },
            { label: '融资单号', value: 'billNumber', type: 'text' },
            {
                label: '融资金额', value: 'financingAmount', type: 'money', _inList: {
                    sort: true,
                    search: true
                }
            },
            { label: '同步原因', value: 'syncReason', type: 'syncReason' },
            // 1=融资单由金地分配完渠道 2=审批完成 3=融资单修改信息（如修改金额）
            { label: '金地数据对接情况', value: 'jdCallState', type: 'jdCallState' },
            { label: 'EAS付款单号', value: 'paymentApplyNumber', },
            { label: '付款申请单金额', value: 'paymentApplyAmount', type: 'money' },
            { label: '申请单审批状态', value: 'approveStatus', type: 'approveStatus' }, // 0=审批中 1=审批完成
            { label: '款项名称', value: 'paymentName' },
            { label: '付款类型', value: 'paymentType' },
            { label: '付款审批完成日期', value: 'bgyContractName', type: 'datetime' },
            { label: '项目公司名称', value: 'projectCompanyName' },
            { label: '项目所属区域的地区代码', value: 'areaCode' },
            { label: '区域名称', value: 'areaName' },
            { label: '城市', value: 'city' },
            { label: '项目名称', value: 'projectName' },
            { label: '预录入发票金额', value: 'sumInvoiceAmount', type: 'money', },
            { label: '预录入发票号', value: 'numberList', type: 'invoiceNum' },
            { label: '发起融资申请日期', value: 'financeApplyDate', type: 'datetime' },
            { label: '付款单位名称', value: 'payCompanyName' },
            { label: '付款单位编码', value: 'payCompanyCode' },
            { label: '付款单位统一信用代码', value: 'pcSocialCreditCode' },
            { label: '付款单位税务登记证号', value: 'pcTaxNumber' },
            { label: '付款单位营业执照号码', value: 'pcBusinessLicese' },
            { label: '付款单位组织机构代码', value: 'pcOrganizationCode' },
            { label: '收款单位名称', value: 'receiptCompanyName' },
            { label: '收款单位编码', value: 'receiptCompanyCode' },
            { label: '收款单位统一信用代码', value: 'rcSocialCreditCode' },
            { label: '收款单位税务登记证号', value: 'rcTaxNumber' },
            { label: '收款单位营业执照号码', value: 'rcBusinessLicese' },
            { label: '收款单位组织机构代码', value: 'rcOrganizationCode' },
            { label: '收款人名称', value: 'bankAccountName' },
            { label: '收款人开户银行', value: 'bankName' },
            { label: '收款人银行账号', value: 'bankAccountNumber' },
            { label: '供应商联系人名称', value: 'supplierContact' },
            { label: '供应商联系电话', value: 'supplierContactNumber' },
            { label: '区域公司联系人名称', value: 'areaContact' },
            { label: '区域公司联系电话', value: 'areaContactNumber' },
            { label: '项目公司联系人名称', value: 'projectContact' },
            { label: '项目公司联系电话', value: 'projectContactNumber' },
            { label: '工程项目', value: 'constructionProject' },
            { label: '基础合同编号', value: 'contractCode' },
            { label: '基础合同名称', value: 'contractName' },
            { label: '基础合同类别', value: 'contractType' }, // 1=工程类 2=贸易类
            { label: '合同金额', value: 'latestCost', type: 'money', },
            { label: '补充协议调整金额', value: 'adjustmentAmount', type: 'money', },
            { label: '签订基础合同的供应商名称', value: 'contractSigner' },
            { label: '预付款支付比例（%）', value: 'advanceChargePercent' },
            { label: '进度款支付比例（%）', value: 'progressPaymentPercent' },
            { label: '结算款支付比例（%）', value: 'settlementPercent' },
            { label: '发票类型', value: 'invoicedType' },
            { label: '纳税人身份', value: 'taxpayerType' },
            { label: '结算金额', value: 'settlementMoney', type: 'money', },
            { label: '合同归档编号', value: 'contractActualcode' },
            { label: '合同状态', value: 'contractStatus' },
            { label: '合同签署时间', value: 'signtime', type: 'datetime' },
            { label: '合同已确认的产值金额', value: 'settlementMoney', type: 'money', },
            { label: '合同已开票金额', value: 'invoicedAmount', type: 'money', },
            { label: '合同已付款金额', value: 'paidAmount', type: 'money', },
            { label: '是否已结算', value: 'settmentStatus', type: 'isInit' }, // 0=未结算 1=已结算
            { label: '结算时间', value: 'settmentTime', type: 'datetime' },
            { label: '合同所属的项目的编号', value: 'projectCode' },
            { label: '合同所属的项目分期名称', value: 'projectStage' },
            { label: '合同是否使用电子签章', value: 'useEsFlag' },
            { label: '运营部对接人', value: 'operatorName', type: 'text' },
            { label: '供应商是否注册', value: 'isRegisterSupplier', type: 'isInit' }, // 0=未注册 1=已注册
            { label: '校验状态', value: 'verifyStatus', type: 'verifyStatus' }, // 1=校验成功 2=校验失败
            { label: '校验失败类型', value: 'verifyArr', type: 'verifyArr' },
            {
                label: '获取数据时间', value: 'versionsTime', type: 'datetime', _inList: {
                    sort: true,
                    search: true
                }
            },
            { label: '资产转让折扣率（%）', value: 'discountRate' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
            { label: '保理商名称', value: 'factoringOrgName', },
            { label: '收款单位省份', value: 'platformProvince', },
            { label: '收款单位市', value: 'platformCity', },
            { label: '是否中止', value: 'isStop', type: 'isInit' },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '融资单号', checkerId: 'billNumber', type: 'text' },
            { title: '融资金额', checkerId: 'financingAmount', type: 'text' },
            { title: '项目公司名称', checkerId: 'projectCompanyName', type: 'text', },
            { title: '项目名称', checkerId: 'projectName', type: 'text' },
            { title: '收款单位名称', checkerId: 'receiptCompanyName', type: 'text' },
            { title: '获取数据时间', checkerId: 'versionsTime', type: 'quantum2' },
            { title: '校验状态', checkerId: 'verifyStatus', type: 'select', options: { ref: 'BgyVerifyStatus' }, }, // 1=校验成功 2=校验失败
            { title: '保理商名称', checkerId: 'factoringOrgName', type: 'text' },
            { title: '保理融资到期日时间', checkerId: 'expiredDateTime', type: 'quantum2' },
            { title: '运营部对接人', checkerId: 'operatorName', type: 'text' },
            { title: '市场部对接人', checkerId: 'marketName', type: 'text' },
            { title: '收款单位省份', checkerId: 'platformProvince', type: 'text', },
            { title: '收款单位市', checkerId: 'platformCity', type: 'text' },
            { title: '是否中止', checkerId: 'isStop', type: 'select', options: { ref: 'defaultRadio' } },
        ] as CheckersOutputModel[]
    };
    static readonly config = {
        dataDockingList: {
            title: '接口数据列表-金地-前海中晟',
            value: 'dataDockingList',
            tabList: [
                {
                    label: '当前数据列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    {
                                        label: '自定义筛选条件',
                                        operate: 'custom_search',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '自定义页面字段',
                                        operate: 'custom_field',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                ],
                                rightheadButtons: [
                                    {
                                        label: '发起提单',
                                        operate: 'jd_financing_pre',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '补充信息',
                                        operate: 'further_information',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '发起预审失败',
                                        operate: 'reject_deal',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '数据导出',
                                        operate: 'export_data',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                ],
                            },
                            searches: [...ZsGemdaleDataDockingConfig.dataLockinglist.searches],
                            params: 0,
                            searchNumber: 14,
                            headNumber: 13,
                            headText: [...ZsGemdaleDataDockingConfig.dataLockinglist.heads],
                        },
                    ],
                    post_url: '/sub_system/jd_system/jd_financing_list'
                },
                {
                    label: '所有数据列表',
                    value: 'C',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    {
                                        label: '自定义筛选条件',
                                        operate: 'custom_search',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '自定义页面字段',
                                        operate: 'custom_field',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                ],
                                rightheadButtons: [
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '数据导出',
                                        operate: 'export_data',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                ],
                            },
                            searches: [
                                ...ZsGemdaleDataDockingConfig.dataLockinglist.searches,
                                { title: '是否发起提单', checkerId: 'isSponsor', type: 'select', options: { ref: 'defaultRadio' } }, // 0=未发起 1=已发起
                                {
                                    title: '交易状态',
                                    checkerId: 'transactionStatus',
                                    type: 'select',
                                    options: { ref: 'newGemdaleTradeStatus' },
                                    required: false,
                                    sortOrder: 2
                                },
                                { title: '交易id', checkerId: 'mainFlowId', type: 'text', sortOrder: 1 }
                            ],
                            params: 1,
                            searchNumber: 16,
                            headNumber: 15,
                            headText: [
                                {
                                    label: '交易id', value: 'mainFlowId', type: 'mainFlowId'
                                },
                                {
                                    label: '交易状态', value: 'flowId', type: 'newGemdaleTradeStatus'
                                },
                                { label: '是否发起提单', value: 'isSponsor', type: 'text1' }, // 0=未发起 1=已发起
                                { label: '退单时间', value: 'returnTime', type: 'datetime' },// 退单时间
                                { label: '退回类型', value: 'returnType', type: 'text1' },// 退回类型
                                { label: '退回原因', value: 'returnReason', type: 'text1' },// 退回原因
                                ...ZsGemdaleDataDockingConfig.dataLockinglist.heads],
                        },
                    ],
                    post_url: '/sub_system/jd_system/jd_financing_list'
                },
            ] as TabListOutputModel[]
        }
    };
    static getConfig(name) {
        return this.config[name];
    }
}
