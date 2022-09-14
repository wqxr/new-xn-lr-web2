import { ListHeadsFieldOutputModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

// 上海银行直保 -台账列表
export default class ShangHaiAccountConfig {
    // 列表表头,搜索项配置
    static platAccountlist = {
        heads: [
            {
                label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '总部公司', value: 'headquarters', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '申请付款单位', value: 'projectCompany', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '收款单位', value: 'debtUnit', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '服务费率', value: 'serviceRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '服务费', value: 'serviceFee', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '融资利率', value: 'discountRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '付款确认书编号', value: 'payConfirmId', type: 'text', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '付款确认书文件', value: 'pdfProjectFiles', type: 'file', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '交易状态', value: 'tradeStatus', type: 'tradeStatus', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '收款单位注册时间', value: 'supplierRegisterDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '提单日期', value: 'tradeDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '起息日', value: 'factoringStartDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '市场部对接人', value: 'marketName', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '运营部对接人', value: 'operatorName', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '中登状态', value: 'zhongdengStatus', type: 'zhongdengStatus', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '中登登记编码', value: 'zhongdengRegisterId', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '备注', value: 'memo', type: 'memo', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '发票', value: 'invoiceNum', type: 'invoiceNum', _inList: {
                    sort: false,
                    search: true
                }
            },
            { label: '协助处理人', value: 'helpUserName', type: 'helpUserName' },
            {
                label: '是否需要后补资料', value: 'isBackUp', type: 'isBackUp', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '托管行', value: 'depositBank', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '备注状态', value: 'memoStatus', type: 'select', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '资金中心受理情况', value: 'acceptState', type: 'acceptState', _inList: {
                    sort: false,
                    search: true
                }
            },
            {
                label: '万科数据对接情况', value: 'vankeCallState', type: 'vankeCallState', _inList: {
                    sort: false,
                    search: true
                }
            },
            {
                label: '可放款批次号', value: 'payBatch', type: 'payBatch', _inList: {
                    sort: false,
                    search: true
                }
            },
            {
                label: '实际放款批次号', value: 'realyPayBatch', type: 'realyPayBatch', _inList: {
                    sort: false,
                    search: true
                }
            },
            {
                label: '审核暂停状态', value: 'pauseStatus', type: 'pauseStatus', _inList: {
                    sort: false,
                    search: true
                }
            },
            {
                label: '一线审核时间', value: 'ccsAduitDatetime', type: 'longdatetime', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '一线审批时间', value: 'ccsApproveTime', type: 'longdatetime', _inList: {
                    sort: true,
                    search: true
                }
            },
            {
                label: '资金中心审核时间', value: 'ccsZauditDate', type: 'longdatetime', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '供应商是否注册', value: 'isRegisterSupplier', type: 'isInit', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '对公在线业务账号', value: 'corporateAccount', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '业务数据源', value: 'vankeDataSource', type: 'vankeDataSource', _inList: {
                    sort: false,
                    search: true
                }
            },
            {
                label: '接口状态', value: 'shInterfaceStatus', type: 'shInterfaceStatus', _inList: {
                    sort: false,
                    search: true
                }
            },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易id', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '总部公司', checkerId: 'headquarters', type: 'text', required: false, sortOrder: 2 },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 3 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 4 },
            { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 5 },
            // { title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 6 },
            // { title: '服务费率', checkerId: 'serviceRate', type: 'text', required: false, sortOrder: 7 },
            { title: '融资利率', checkerId: 'discountRate', type: 'text', required: false, sortOrder: 8 },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 9 },
            // {
            //     title: '交易状态完成时间', checkerId: 'tradeTime', type: 'select-time', required: false, sortOrder: 7, options: { ref: 'vankeListTypesingle' }
            // },
            {
                title: '交易状态', checkerId: 'tradeStatus', type: 'select', options: {
                    ref: 'tradeStatus_sh'
                }, sortOrder: 10
            },
            { title: '企业Id', checkerId: 'debtUnitId', type: 'text', required: false, sortOrder: 6 },
            {
                title: '供应商是否注册', checkerId: 'isRegisterSupplier', type: 'select', required: false, sortOrder: 6,
                options: { ref: 'isInit' }
            },

            // { title: '收款单位注册时间', checkerId: 'supplierRegisterDate', type: 'quantum1', required: false, sortOrder: 11 },
            { title: '提单日期', checkerId: 'tradeDate', type: 'quantum1', required: false, sortOrder: 12 },
            { title: '起息日', checkerId: 'factoringStartDate', type: 'quantum1', required: false, sortOrder: 13 },
            { title: '保理融资到期日', checkerId: 'factoringEndDate', type: 'quantum1', sortOrder: 14 },
            { title: '运营部对接人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 15 },
            { title: '市场部对接人', checkerId: 'marketName', type: 'text', required: false, sortOrder: 16 },
            {
                title: '中登状态', checkerId: 'zhongdengStatus', type: 'select', base: 'number', options: {
                    ref: 'zhongdengStatus'
                }, required: false, sortOrder: 17
            },
            { title: '中登登记编码', checkerId: 'zhongdengRegisterId', type: 'text', required: false, sortOrder: 18 },
            // { title: '发票', checkerId: 'invoiceNum', type: 'text', required: false, sortOrder: 19 },
            { title: '协助处理人', checkerId: 'helpUserName', type: 'text', required: false, sortOrder: 20 },
            {
                title: '是否需要后补资料', checkerId: 'isBackUp', type: 'select', options: {
                    ref: 'isBackFile'
                }, required: false, base: 'number', sortOrder: 21
            },
            { title: '托管行', checkerId: 'depositBank', type: 'text', required: false, sortOrder: 22 },
            { title: '备注状态', checkerId: 'memoStatus', type: 'text', required: false, sortOrder: 23 },
            {
                title: '资金中心受理情况', checkerId: 'acceptState', type: 'select', options: {
                    ref: 'acceptState'
                }, required: false, base: 'number', sortOrder: 24
            },
            {
                title: '万科数据对接情况', checkerId: 'vankeCallState', type: 'select', options: {
                    ref: 'vankeCallState'
                }, required: false, base: 'number', sortOrder: 25
            },
            { title: '可放款批次号', checkerId: 'payBatch', type: 'text', required: false, sortOrder: 26 },
            { title: '实际放款批次号', checkerId: 'realyPayBatch', type: 'text', required: false, sortOrder: 27 },
            {
                title: '审核暂停状态', checkerId: 'pauseStatus', type: 'select', options: {
                    ref: 'pauseStatus'
                }, required: false, sortOrder: 28, base: 'number'
            },
            { title: '一线审核时间', checkerId: 'ccsAduitDatetime', type: 'quantum2', sortOrder: 29 },
            { title: '一线审批时间', checkerId: 'ccsApproveTime', type: 'quantum2', sortOrder: 30 },
            { title: '资金中心审核时间', checkerId: 'ccsZauditDate', type: 'quantum2', sortOrder: 31 },
            {
                title: '业务数据源', checkerId: 'wkType', type: 'select', options: {
                    ref: 'vankeDataSource', readonly: true
                }, required: false, sortOrder: 33, base: 'number', value: 1
            },
            {
                title: '接口状态', checkerId: 'shInterfaceStatus', type: 'select', options: {
                    ref: 'shIfStatus'
                }, required: false, sortOrder: 34, base: 'number'
            },
        ] as CheckersOutputModel[]
    };
    static supplierAccountlist = {
        heads: [
            {
                label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '提单日期', value: 'tradeDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '渠道', value: 'productType', type: 'productType', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '交易状态', value: 'tradeStatus', type: 'tradeStatus', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '总部公司', value: 'headquarters', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '申请付款单位', value: 'projectCompany', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '收款单位', value: 'debtUnit', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '融资利率', value: 'discountRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '服务费率', value: 'serviceRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '服务费', value: 'serviceFee', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '市场部对接人', value: 'marketName', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '运营部对接人', value: 'operatorName', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            { label: '协助处理人', value: 'helpUserName', type: 'helpUserName' },
            {
                label: '发票', value: 'invoiceNum', type: 'invoiceNum', _inList: {
                    sort: false,
                    search: true
                }
            },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易id', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '提单日期', checkerId: 'tradeDate', type: 'quantum1', required: false, sortOrder: 2 },
            // { title: '渠道', checkerId: 'productType', type: 'linkage-select', options: {
            //     ref: 'productType_sh' }, required: false, sortOrder: 4
            // },
            {
                title: '交易状态', checkerId: 'tradeStatus', type: 'select', options: {
                    ref: 'tradeStatus_sh'
                }, sortOrder: 5
            },
            { title: '总部公司', checkerId: 'headquarters', type: 'text', required: false, sortOrder: 6 },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 7 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 8 },
            { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 9 },
            { title: '融资利率', checkerId: 'discountRate', type: 'text', required: false, sortOrder: 10 },
            // { title: '服务费率', checkerId: 'serviceRate', type: 'text', required: false, sortOrder: 11 },
            { title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 12 },
            { title: '保理融资到期日', checkerId: 'factoringEndDate', type: 'quantum1', sortOrder: 14 },
            { title: '运营部对接人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 16 },
            { title: '市场部对接人', checkerId: 'marketName', type: 'text', required: false, sortOrder: 17 },
            { title: '协助处理人', checkerId: 'helpUserName', type: 'text', required: false, sortOrder: 18 },
        ] as CheckersOutputModel[]
    };
    static supplierAccountlist2 = {
        heads: [
            {
                label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '提单日期', value: 'tradeDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '渠道', value: 'productType', type: 'productType', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '交易状态', value: 'tradeStatus', type: 'tradeStatus', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '总部公司', value: 'headquarters', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '申请付款单位', value: 'projectCompany', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '收款单位', value: 'debtUnit', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '融资利率', value: 'discountRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '服务费率', value: 'serviceRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '服务费', value: 'serviceFee', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '市场部对接人', value: 'marketName', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '运营部对接人', value: 'operatorName', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            { label: '协助处理人', value: 'helpUserName', type: 'helpUserName' },
            {
                label: '发票', value: 'invoiceNum', type: 'invoiceNum', _inList: {
                    sort: false,
                    search: true
                }
            },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易id', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '提单日期', checkerId: 'tradeDate', type: 'quantum1', required: false, sortOrder: 2 },
            // { title: '渠道', checkerId: 'productType', type: 'linkage-select', options: {
            //     ref: 'productType_sh' }, required: false, sortOrder: 4
            // },
            {
                title: '交易状态', checkerId: 'tradeStatus', type: 'select', options: {
                    ref: 'tradeStatus_sh'
                }, sortOrder: 5
            },
            { title: '总部公司', checkerId: 'headquarters', type: 'text', required: false, sortOrder: 6 },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 7 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 8 },
            { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 9 },
            { title: '融资利率', checkerId: 'discountRate', type: 'text', required: false, sortOrder: 10 },
            // { title: '服务费率', checkerId: 'serviceRate', type: 'text', required: false, sortOrder: 11 },
            { title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 12 },
            { title: '保理融资到期日', checkerId: 'factoringEndDate', type: 'quantum1', sortOrder: 14 },
            { title: '运营部对接人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 16 },
            { title: '市场部对接人', checkerId: 'marketName', type: 'text', required: false, sortOrder: 17 },
            { title: '协助处理人', checkerId: 'helpUserName', type: 'text', required: false, sortOrder: 18 },
        ] as CheckersOutputModel[]
    };
    static readonly config = {
        platAccountlist: {
            title: '台账-上海银行',
            value: 'platAccountlist',
            tabList: [
                {
                    label: '台账-上海银行',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    { label: '自定义筛选条件', operate: 'custom_search', post_url: '', disabled: false, showButton: true, },
                                    { label: '自定义页面字段', operate: 'custom_field', post_url: '', disabled: false, showButton: true, },
                                ],
                                rightheadButtons: [
                                    { label: '中登登记', operate: 'sub_zhongdeng_register', post_url: '', disabled: false, },
                                    // { label: '执行下个流程', operate: 'execute_next_process', post_url: '', disabled: false, },
                                    { label: '批量补充信息', operate: 'batch_info', post_url: '', disabled: false, flag: 1, },
                                    { label: '下载附件', operate: 'download_file', post_url: '/sh_trade/down_file', disabled: false, flag: 1, },
                                    { label: '导出清单', operate: 'export_file', post_url: '/sh_trade/down_list', disabled: false, flag: 1, },
                                    { label: '签署合同', operate: 'sign_contract_plat_batch', post_url: '', disabled: false, flag: 1, },
                                    { label: '退单流程', operate: 'reject_program', post_url: '', disabled: false, flag: 1, },
                                    { label: '向万科推送清单', operate: 'pushList_vanke', post_url: '', disabled: false, },
                                    { label: '修改协助处理人', operate: 'edit_helpHandler', post_url: '', disabled: false, flag: 1, },
                                ],
                                rowButtons: [
                                    { label: '进入审核页面', operate: 'enter_verify', post_url: '' },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {
                                            // 拼接文件
                                            xn.router.navigate([`/bank-shanghai/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '签署合同', operate: 'sign_contract_plat', post_url: '' },
                                    { label: '后补资料', operate: 'addData', post_url: '' }
                                ]
                            },
                            searches: [...ShangHaiAccountConfig.platAccountlist.searches],
                            params: 99,
                            searchNumber: 57,
                            headNumber: 58,
                            headText: [...ShangHaiAccountConfig.platAccountlist.heads],
                        },
                    ] as SubTabListOutputModel[],
                    post_url: '/sh_trade/list'
                },
            ] as TabListOutputModel[]
        },
        supplierAccountlist: {
            title: '上海银行台账列表',
            value: 'supplierAccountlist',
            tabList: [
                {
                    label: '上海银行台账列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '审核中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    { label: '自定义筛选条件', operate: 'custom_search', post_url: '', disabled: false, showButton: true, },
                                    { label: '自定义页面字段', operate: 'custom_field', post_url: '', disabled: false, showButton: true, },
                                ],
                                rightheadButtons: [
                                    { label: '下载附件', operate: 'download_file', post_url: '/sh_trade/down_file', disabled: false, flag: 1, },
                                    { label: '导出清单', operate: 'export_file', post_url: '/sh_trade/down_list', disabled: false, flag: 1, },
                                ],
                                rowButtons: [
                                    { label: '修改备注信息', operate: 'modify_remarks', post_url: '/sh_trade/change_memo' }
                                ]
                            },
                            params: 1,
                            searchNumber: 59,
                            headNumber: 60,
                            headText: [...ShangHaiAccountConfig.supplierAccountlist.heads],
                            searches: [...ShangHaiAccountConfig.supplierAccountlist.searches],
                        },
                        {
                            label: '待签署',
                            value: 'WAITSIGN',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    { label: '自定义筛选条件', operate: 'custom_search', post_url: '', disabled: false, showButton: true, },
                                    { label: '自定义页面字段', operate: 'custom_field', post_url: '', disabled: false, showButton: true, },
                                ],
                                rightheadButtons: [
                                    { label: '下载附件', operate: 'download_file', post_url: '/sh_trade/down_file', disabled: false, flag: 1, },
                                    { label: '导出清单', operate: 'export_file', post_url: '/sh_trade/down_list', disabled: false, flag: 1, },
                                ],
                                rowButtons: [
                                    // { label: '签署合同', operate: 'sign_contract_supplier', post_url: '' }
                                ]
                            },
                            params: 2,
                            searchNumber: 61,
                            headNumber: 62,
                            headText: [
                                ...ShangHaiAccountConfig.supplierAccountlist.heads,
                                { label: '付款确认书编号', value: 'payConfirmId', type: 'text', _inList: { sort: true, search: true }, },
                                { label: '付款确认书文件', value: 'pdfProjectFiles', type: 'file', _inList: { sort: false, search: true }, },
                                { label: '是否需要后补资料', value: 'isBackUp', type: 'isBackUp', _inList: { sort: false, search: true }, },
                            ],
                            searches: [
                                ...ShangHaiAccountConfig.supplierAccountlist.searches,
                                { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 13 },
                                { title: '融资天数', checkerId: 'financingDays', type: 'text', sortOrder: 15 },
                            ],
                        },
                        {
                            label: '所有交易',
                            value: 'ALL',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    { label: '自定义筛选条件', operate: 'custom_search', post_url: '', disabled: false, showButton: true, },
                                    { label: '自定义页面字段', operate: 'custom_field', post_url: '', disabled: false, showButton: true, },
                                ],
                                rightheadButtons: [
                                    { label: '下载附件', operate: 'download_file', post_url: '/sh_trade/down_file', disabled: false, flag: 1, },
                                    { label: '导出清单', operate: 'export_file', post_url: '/sh_trade/down_list', disabled: false, flag: 1, },
                                ],
                                rowButtons: []
                            },
                            params: 99,
                            searchNumber: 67,
                            headNumber: 68,
                            headText: [
                                ...ShangHaiAccountConfig.supplierAccountlist.heads,
                                { label: '开票文件', value: 'nuonuoid', type: 'nuonuoFile', _inList: { sort: false, search: true } },
                                { label: '起息日', value: 'factoringStartDate', type: 'date', _inList: { sort: true, search: true }, },
                                { label: '付款确认书编号', value: 'payConfirmId', type: 'text', _inList: { sort: true, search: true }, },
                                { label: '付款确认书文件', value: 'pdfProjectFiles', type: 'file', _inList: { sort: false, search: true }, },
                                { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: { sort: true, search: true }, },
                                { label: '融资天数', value: 'financingDays', type: 'text', _inList: { sort: false, search: true }, },
                            ],
                            searches: [
                                ...ShangHaiAccountConfig.supplierAccountlist.searches,
                                { title: '起息日', checkerId: 'factoringStartDate', type: 'quantum1', required: false, sortOrder: 3 },
                                { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 13 },
                                { title: '融资天数', checkerId: 'financingDays', type: 'text', sortOrder: 15 },
                                {
                                    title: '是否需要后补资料', checkerId: 'isBackUp', type: 'select', options: {
                                        ref: 'isBackFile'
                                    }, required: false, sortOrder: 19
                                },
                            ],
                        },
                    ] as SubTabListOutputModel[],
                    post_url: '/sh_trade/list'
                },
            ] as TabListOutputModel[]
        },
        supplierAccountlist2: {
            title: '上海银行保理台账',
            value: 'platAccountlist',
            tabList: [
                {
                    label: '上海银行台账列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    { label: '自定义筛选条件', operate: 'custom_search', post_url: '', disabled: false, showButton: true, },
                                    { label: '自定义页面字段', operate: 'custom_field', post_url: '', disabled: false, showButton: true, },
                                ],
                                rightheadButtons: [
                                    { label: '中登登记', operate: 'sub_zhongdeng_register', post_url: '', disabled: false, },
                                    // { label: '执行下个流程', operate: 'execute_next_process', post_url: '', disabled: false, },
                                    { label: '批量补充信息', operate: 'batch_info', post_url: '', disabled: false, flag: 1, },
                                    { label: '下载附件', operate: 'download_file', post_url: '/sh_trade/down_file', disabled: false, flag: 1, },
                                    { label: '导出清单', operate: 'export_file', post_url: '/sh_trade/down_list', disabled: false, flag: 1, },
                                    { label: '签署合同', operate: 'sign_contract_plat_batch', post_url: '', disabled: false, flag: 1, },
                                    { label: '退单流程', operate: 'reject_program', post_url: '', disabled: false, flag: 1, },
                                    { label: '向万科推送清单', operate: 'pushList_vanke', post_url: '', disabled: false, },
                                    { label: '修改协助处理人', operate: 'edit_helpHandler', post_url: '', disabled: false, flag: 1, },
                                ],
                                rowButtons: [
                                    { label: '进入审核页面', operate: 'enter_verify', post_url: '' },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {
                                            // 拼接文件
                                            xn.router.navigate([`/bank-shanghai/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '签署合同', operate: 'sign_contract_plat', post_url: '' },
                                    { label: '后补资料', operate: 'addData', post_url: '' }
                                ]
                            },
                            searches: [...ShangHaiAccountConfig.platAccountlist.searches],
                            params: 99,
                            searchNumber: 57,
                            headNumber: 58,
                            headText: [...ShangHaiAccountConfig.platAccountlist.heads],
                        },
                    ] as SubTabListOutputModel[],
                    post_url: '/sh_trade/list'
                },
            ] as TabListOutputModel[]
        },
    };

    static getConfig(name) {
        return this.config[name];
    }
}
