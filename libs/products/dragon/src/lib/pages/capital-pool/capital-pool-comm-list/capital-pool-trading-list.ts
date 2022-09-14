import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class CapitalPoolTradingList {
    static readonly showName = '$资产池 - 交易';

    static readonly showPage = true;

    static readonly apiUrlBase = '';

    static readonly apiUrlDetail = '';

    static readonly webUrlBase = '';

    static readonly keys = ['mainFlowId'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '交易ID', checkerId: 'mainFlowId', memo: '', width: '11%',
            _inSearch: {
                number: 1,
                type: 'text'
            },
            _inList: {
                // sort: true,
                search: true
            },
            _inEdit: {
                options: {
                    readonly: true
                }
            }
        },
        {
            title: '收款单位', checkerId: 'debtUnit', memo: '', width: '5%',
            _inSearch: {
                number: 3,
                type: 'text'
            },
            _inList: {
                // sort: true,
                search: true
            }
        },
        {
            title: '应收账款金额', checkerId: 'receive', memo: '', width: '8%',
            _inSearch: {
                number: 7,
                type: 'text'
            },
            _inList: false,
            _inEdit: {
                options: {
                    readonly: true
                }
            }
        },
        {
            title: '申请付款单位', checkerId: 'projectCompany', memo: '', type: 'text', width: '5%',
            _inSearch: {
                number: 2,
                type: 'text'
            },
            _inList: {
                // sort: true,
                search: true
            },
            _inNew: false
        },
        {
            title: '总部公司', checkerId: 'headquarters', memo: '', type: 'headquarters', width: '5%',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false,
            }
        },
        {
            title: '资产编号', checkerId: 'poolTradeCode', memo: '', width: '4%',
            _inSearch: {
                number: 6,
                type: 'text'
            },
            _inList: {
                // sort: true,
                search: false,
            }
        },
        {
            title: '交易金额', checkerId: 'receive', memo: '', type: 'money', width: '8%',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false,
            }
        },
        {
            title: '资产转让折扣率', checkerId: 'discountRate', memo: '', type: 'discountRate', width: '4%',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: true
            }
        },
        {
            title: '交易状态', checkerId: 'tradeStatus', memo: '', type: 'tradeStatus',
            _inSearch: {
                number: 8,
                type: 'select',
                selectOptions: 'capitalPoolTradeStatus',
                base: 'number'
            },
            _inList: {
                // sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '交易模式', checkerId: 'isProxy', memo: '', type: 'xnProxyStatus', width: '6%',
            _inSearch: false,
            // _inSearch: {
            //     number: 5,
            //     type: 'select',
            //     selectOptions: 'proxyStatus',
            //     base: 'number'
            // },
            _inList: {
                // sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '保理融资到期日', checkerId: 'factoringEndDate', memo: '', type: 'date', width: '3%',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '预计放款日期', checkerId: 'isPriorityLoanDate', memo: '', type: 'dragon-loandate', width: '3%',
            _inSearch: {
                number: 17,
                type: 'dragon-loandate',
            },
            _inList: false,
            _inNew: false
        },
        {
            title: '预计放款日期', checkerId: 'priorityLoanDate', memo: '', type: 'dragon-loandate', width: '3%',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '合同生成时间', checkerId: 'signContractDate', memo: '', type: 'date', width: '3%',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '创建时间', checkerId: 'createTime', memo: '', type: 'date', width: '3%',
            _inSearch: {
                number: 5,
                type: 'quantum1'
            },
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '放款时间', checkerId: 'realLoanDate', memo: '', type: 'date', width: '3%',
            _inSearch: {
                number: 4,
                type: 'quantum1'
            },
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《致总部公司通知书（二次转让）》', checkerId: 'notice2', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false,
            width: '8%'
        },
        {
            title: '《总部公司回执（二次转让）》', checkerId: 'receipt2', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false,
            width: '8%'
        },
        {
            title: '《致项目公司通知书（二次转让）》', checkerId: 'statusProjectNotice2', memo: '',
            _inSearch: {
                number: 10,
                type: 'select',
                selectOptions: 'accountReceipts2Dragon',
                base: 'number'
            },
            _inList: false,
            _inNew: false,

        },
        {
            title: '《致项目公司通知书（二次转让）》', checkerId: 'projectNotice2', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false,
            width: '8%'
        },
        {
            title: '《项目公司回执（二次转让）》', checkerId: 'statusProjectReceipt2', memo: '',
            _inSearch: {
                number: 12,
                type: 'select',
                selectOptions: 'accountReceipts2Dragon',
                base: 'number'
            },
            _inList: false,
            _inNew: false,

        },
        {
            title: '《项目公司回执（二次转让）》', checkerId: 'projectReceipt2', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false,
            width: '8%'
        },
        {
            title: '《项目公司回执（一次转让）》', checkerId: 'statusProjectReceipt1', memo: '',
            _inSearch: {
                number: 11,
                type: 'select',
                selectOptions: 'accountReceipts2Dragon',
                base: 'number'
            },
            _inList: false,
            _inNew: false
        },
        {
            title: '《项目公司回执（一次转让）》', checkerId: 'projectReceipt1', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false,
            width: '8%'
        },
        {
            title: '《付款确认书（总部致保理商）》', checkerId: 'statusFactoringPayConfirm', memo: '',
            _inSearch: {
                number: 14,
                type: 'select',
                selectOptions: 'accountReceiptsDragon',
                base: 'number'
            },
            _inList: false,
            _inNew: false
        },
        {
            title: '《付款确认书（总部致保理商）》', checkerId: 'factoringPayConfirm', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false,
            width: '8%'
        },
        {
            title: '《付款确认书（总部致券商）》', checkerId: 'statusBrokerPayConfirm', memo: '',
            _inSearch: {
                number: 13,
                type: 'select',
                selectOptions: 'accountReceiptsDragon',
                base: 'number'
            },
            _inList: false,
            _inNew: false
        },
        {
            title: '《付款确认书（总部致券商）》', checkerId: 'brokerPayConfirm', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false,
            width: '8%'
        },
        {
            title: '《债权转让及账户变更通知的补充说明》', checkerId: 'changeNoticeAdd', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false,
            width: '%'
        },
        {
            title: '推送企业次数', checkerId: 'pushCount', memo: '', type: 'number',
            _inSearch: {
                number: 9,
                type: 'select',
                selectOptions: 'pushCount',
            },
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '项目公司是否退回', checkerId: 'returnBack', memo: '', type: 'isExist',
            _inSearch: {
                number: 15,
                type: 'select',
                selectOptions: 'isExist',
            },
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '冻结三', checkerId: 'freezeThree', memo: '',
            _inSearch: false,
            _inList: {
                search: false
            },
            _inNew: false,
            width: '8%'
        },
        {
            title: '是否补充到期日', checkerId: 'isFactoringEndDate', memo: '',
            _inSearch: {
                number: 16,
                type: 'select',
                selectOptions: 'isExist',
            },
            _inList: false,
            _inNew: false
        }
    ];

    static readonly list = {
        pageSize: 10,

        // onList: (base: CommBase, params) => {
        //     base.onDefaultList(params);
        // },

        headButtons: [
            {
                title: '查询',
                type: 'a',
                class: 'btn btn-primary',
                search: true,
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (base: CommBase, record) => {
                    console.log('test click', record);
                }
            },
            {
                title: '重置',
                type: 'a',
                clearSearch: true,
                class: 'btn btn-danger',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (base: CommBase, record) => {
                    console.log('test click', record);
                }
            },
        ],

        // 允许在行内根据不同条件增加行按钮
        rowButtons: [
            {
                title: '测试',
                type: 'a',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (base: CommBase, record) => {
                    console.log('test click', record);
                }
            },

        ],
    };

    // 只要存在detail配置就允许查看详情
    static readonly detail = {
        onDetail: (base: CommBase, json) => {
            console.log('ondetail: ', json);
            base.onListDetail(json);
        },
    };

    // 如果没有或没权限显示add，那就不用显示新增按钮
    static readonly add = {
        can: (xn: XnService) => {
            return false;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitAdd();
        // }
    };

    // 如果没有或没权限显示detail和edit，那就不用显示最后的操作列
    static readonly edit = {
        can: (xn: XnService, record: any) => {
            return false;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitEdit();
        // }
    };

}
