import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class AvengerplatTable {
    static ownYaosu = { // 保后管理主界面页面配置
        heads: [
            { label: '供应商名称', value: 'supplierName', },
            { label: '业务金额', value: 'receive' },
            { label: '可用额度', value: 'availableCredit', },
            { label: '业务定价', value: 'comprehensiverate', },
            { label: '业务期限', value: 'term', },
            { label: '交易Id', value: 'mainFlowId', },
        ],
        searches: [
        ],
    };
    static historyBusiness = { // 平台资料初审-经办页面发票
        heads: [
            { label: '供应商名称', value: 'supplierName' },
            { label: '历史业务笔数', value: 'historyCounts' },
            { label: '历史业务总额', value: 'historyAmount' },
            { label: '历史笔均金额', value: 'historyAverageAmount', type: 'date' },
            { label: '还款异常笔数', value: 'backAbnormalCounts', type: 'money' },
        ],

    };
    static historyBusiness1 = {
        heads: [
            { label: '供应商名称', value: 'supplierName' },
            { label: '业务金额', value: 'receive', type: 'money' },
            { label: '放款日期', value: 'loanDate', type: 'date' },
            { label: '商票到期日', value: 'honourEndDate', type: 'date' },
            { label: '还款日', value: 'factoringEndDate', type: 'date' },
            { label: '业务定价', value: 'comprehensiverate', },
            { label: '还款异常', value: 'abnormal', type: 'payback' },
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
        ]

    };
    static yujingMsg = { // 平台资料初审经办页面 采购合同
        heads: [
            { label: '预警类型', value: 'name' },
            { label: '预警内容', value: 'resolvedContentExpression' },   // 平台
            { label: '预警状态', value: 'warnStatus' },   // 平台
        ],
        searches: []
    };
    static alertMsg = { // 保后管理主界面页面配置
        heads: [
            { label: '提示类型', value: 'name' },
            { label: '提示内容', value: 'resolvedContentExpression' },
        ],
        searches: [
        ],

    };
    static stockHolderMsg = {
        title: '万科供应商股东信息',
        heads: [
            { label: '股东', value: 'StockName' },
            { label: '股东类型', value: 'StockType' },
            { label: '认缴出资金额（万元）', value: 'ShouldCapi' },
            { label: '币种', value: 'moneytype', },
            { label: '出资比例', value: 'StockPercent' },
            { label: '认缴出资日期', value: 'ShoudDate' },
            { label: '备注', value: 'memo', },
        ]
    };
    static stockHolderMsg1 = {
        title: '上游客户股东出资信息',
        heads: [
            { label: '股东', value: 'StockName' },
            { label: '股东类型', value: 'StockType' },
            { label: '认缴出资金额（万元）', value: 'ShouldCapi' },
            { label: '币种', value: 'moneytype', },
            { label: '出资比例', value: 'StockPercent' },
            { label: '认缴出资日期', value: 'ShoudDate' },
            { label: '备注', value: 'memo', },
        ]
    };
    static accountsCheck = { // 财报关键科目关系检查
        heads: [
            { label: '项目', value: 'firstSendTime', },
            { label: '检查结果', value: 'counts' },
            { label: '财报周期', value: 'lvyueAmount' },
        ],
        searches: [
        ],
    };
    static lawsuitMsg1 = {
        heads: [
            { label: '案号', value: 'Anno', },
            { label: '执行法院', value: 'ExecuteGov' },
            { label: '执行标的', value: 'Biaodi' },
            { label: '立案时间', value: 'Liandate' },

        ],
    };
    static lawsuitMsg2 = {
        heads: [
            { label: '案件编号', value: 'Anno' },
            { label: '被执行人履行情况', value: 'Executestatus' },
            { label: '法律生效文书确定的义务', value: 'Yiwu' },
            { label: '执行法院', value: 'Executegov' },
            { label: '作出执行依据单位', value: 'Executeunite' },
            { label: '发布时间', value: 'Publicdate' },

        ],
    };
    static lawsuitMsg3 = {
        heads: [
            { label: '案件编号', value: 'CaseNo', },
            { label: '裁判文书名字', value: 'CaseName' },
            { label: '案由', value: 'CaseReason' },
            { label: '执行法院', value: 'Court' },
            { label: '发布时间', value: 'SubmitDate' },
        ],
    };
    static lawsuitMsg4 = {
        heads: [
            { label: '公告类型', value: 'Category', },
            { label: '公告人', value: 'Court' },
            { label: '当事人', value: 'Party' },
            { label: '刊登日期', value: 'PublishedDate' },
        ],
    };
    static lawsuitMsg5 = {
        heads: [
            { label: '案号', value: 'CaseNo' },
            { label: '案由', value: 'CaseReason', },
            { label: '上诉人', value: 'Prosecutorlist' },
            { label: '被上诉人', value: 'Defendantlist' },
            { label: '开庭日', value: 'LianDate' },
        ],
    };
    static lawsuitMsg6 = {
        heads: [
            { label: '名称', value: 'Name' },
            { label: '起拍价', value: 'YiWu' },
            { label: '拍卖时间', value: 'ActionRemark' },
            { label: '委托法院', value: 'Executegov' },
        ],
    };
    static lawsuitMsg7 = {
        heads: [
            { label: '被执行人', value: 'ExecutedBy' },
            { label: '股权数额', value: 'EquityAmount' },
            { label: '执行通知文号', value: 'ExecutionNoticeNum' },
            { label: '类型状态', value: 'Status' },
        ],
    };
    static tableFormlist = {
        title: 'table',
        tabList: [
            {
                label: 'ownYaosu', value: 'ownYaosu',
                headText: AvengerplatTable.ownYaosu.heads,
                get_url: '',
                pageConfig: {
                    pageSize: 10,
                    first: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'historyBusiness', value: 'historyBusiness',
                headText: AvengerplatTable.historyBusiness.heads,
                get_url: '',
                pageConfig: {
                    pageSize: 10,
                    first: 0,
                    total: 0,
                },
                data: [],
                alldata: [],
            },
            {
                label: 'historyBusiness1', value: 'historyBusiness1',
                headText: AvengerplatTable.historyBusiness1.heads,
                get_url: ''
            },
            {
                label: 'yujingMsg', value: 'yujingMsg',
                headText: AvengerplatTable.yujingMsg.heads,
                get_url: '',
                pageConfig: {
                    pageSize: 5,
                    first: 0,
                    total: 0,
                },
                data: [],
                alldata: [],
            },
            {
                label: 'alertMsg', value: 'alertMsg',
                headText: AvengerplatTable.alertMsg.heads,
                get_url: '',
                pageConfig: {
                    pageSize: 5,
                    first: 0,
                    total: 0,
                },
                data: [],
                alldata: [],
            },
            {
                label: 'stockHolderMsg', value: 'stockHolderMsg',
                headText: AvengerplatTable.stockHolderMsg.heads,
                get_url: '/sub_system/qichacha/getCompanyMaster',
                pageConfig: {
                    pageSize: 10,
                    first: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'stockHolderMsg1', value: 'stockHolderMsg1',
                headText: AvengerplatTable.stockHolderMsg1.heads,
                get_url: '/sub_system/qichacha/getCompanyMaster',
                pageConfig: {
                    pageSize: 10,
                    first: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'accountsCheck', value: 'accountsCheck',
                headText: AvengerplatTable.accountsCheck.heads,
                get_url: '',
                pageConfig: {
                    pageSize: 10,
                    first: 0,
                    total: 0,
                },
                data: [],
                alldata: [],
            },
            {
                label: 'lawsuitMsg1', value: 'lawsuitMsg1',
                headText: AvengerplatTable.lawsuitMsg1.heads,
                get_url: '/sub_system/qichacha/getSearchZhiXing',
                title: '法律诉讼',
                pageConfig: {
                    pageSize: 5,
                    pageIndex: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'lawsuitMsg2', value: 'lawsuitMsg2',
                headText: AvengerplatTable.lawsuitMsg2.heads,
                get_url: '/sub_system/qichacha/getSearchShiXin',
                title: '被执行人信息',
                pageConfig: {
                    pageSize: 5,
                    pageIndex: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'lawsuitMsg3', value: 'lawsuitMsg3',
                headText: AvengerplatTable.lawsuitMsg3.heads,
                get_url: '/sub_system/qichacha/getSearchJudgmentDoc',
                title: '裁判文书信息',
                pageConfig: {
                    pageSize: 5,
                    pageIndex: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'lawsuitMsg4', value: 'lawsuitMsg4',
                headText: AvengerplatTable.lawsuitMsg4.heads,
                get_url: '/sub_system/qichacha/getSearchCourtAnnouncement',
                title: '法院报告',
                pageConfig: {
                    pageSize: 5,
                    pageIndex: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'lawsuitMsg5', value: 'lawsuitMsg5',
                headText: AvengerplatTable.lawsuitMsg5.heads,
                get_url: '/sub_system/qichacha/getSearchCourtNotice',
                title: '开庭报告',
                pageConfig: {
                    pageSize: 5,
                    pageIndex: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'lawsuitMsg6', value: 'lawsuitMsg6',
                headText: AvengerplatTable.lawsuitMsg6.heads,
                get_url: '/sub_system/qichacha/getJudicialSaleList',
                title: '司法拍卖',
                pageConfig: {
                    pageSize: 5,
                    pageIndex: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'lawsuitMsg7', value: 'lawsuitMsg7',
                headText: AvengerplatTable.lawsuitMsg7.heads,
                get_url: '/sub_system/qichacha/getJudicialAssistance',
                title: '司法协助',
                pageConfig: {
                    pageSize: 5,
                    pageIndex: 0,
                    total: 0,
                },
                data: [],
            },

        ]
    };
    static readonly add = {
        can: (xn: XnService) => {
            return false;
        },
    };
}
