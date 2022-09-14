import CommBase from '../comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';


export default class ReceiptList {
    static readonly showName = '待签署合同列表';

    static readonly showPage = true;

    static readonly apiUrlBase = '/project_add_file/signList';

    static readonly apiUrlDetail = '/flow/main/detail';

    static readonly webUrlBase = '/console/main-list/';

    static readonly keys = ['mainFlowId']; // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '交易ID',
            checkerId: 'mainFlowId',
            memo: '',
            _inSearch: {
                number: 1
            },
            _inList: {
                sort: false,
                search: true
            },
            _inEdit: {
                options: {
                    readonly: true
                }
            }
        },
        {
            title: '收款单位',
            checkerId: 'debtUnit',
            memo: '',
            _inSearch: {
                number: 5,
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '申请付款单位',
            checkerId: 'projectCompany',
            memo: '',
            type: 'br',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            },
            _inNew: false
        },
        {
            title: '应收账款金额', checkerId: 'receive', memo: '',
            _inSearch: {
                number: 2
            },
            _inList: false,
            _inEdit: {
                options: {
                    readonly: true
                }
            }
        },
        {
            title: '转让价款',
            checkerId: 'changePrice',
            memo: '',
            type: 'money',
            _inSearch: {
                number: 3,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '基础合同名称', checkerId: 'contractName', memo: '',
            _inSearch: {
                number: 3
            },
            _inList: false,
            _inEdit: {
                options: {
                    readonly: true
                }
            }
        },
        {
            title: '总部公司',
            checkerId: 'headquarters',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '资产编号',
            checkerId: 'poolTradeCode',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '付款确认书编号（总部致券商）',
            checkerId: 'codeBrokerPayConfirm',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '付款确认书编号（总部致保理商）',
            checkerId: 'codeFactoringPayConfirm',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '项目名称',
            checkerId: 'projectName',
            memo: '',
            _inSearch: {
                number: 6
            },
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '合同名称',
            checkerId: 'contractName',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '合同编号',
            checkerId: 'contractId',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '资产池名称',
            checkerId: 'capitalPoolName',
            memo: '',
            _inSearch: {
                number: 4
            },
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '审核经办人(一次签署)',
            checkerId: 'signCheckPerson',
            memo: '',
            _inSearch: {
                number: 7
            },
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '审核经办人(二次签署)',
            checkerId: 'signCheckPersonTwo',
            memo: '',
            _inSearch: {
                number: 8
            },
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '审核经办人(补充协议签署)',
            checkerId: 'signCheckPersonAdd',
            memo: '',
            _inSearch: {
                number: 8
            },
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '交易金额',
            checkerId: 'receive',
            memo: '',
            type: 'money',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '资产转让折扣率',
            checkerId: 'discountRate',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '交易状态',
            checkerId: 'tradeStatus',
            memo: '',
            type: 'xnMainFlowStatus',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '资金渠道',
            checkerId: 'moneyChannel',
            memo: '',
            type: 'xnMoneyChannel',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '《致项目公司通知书（二次转让）》',
            checkerId: 'projectNotice2',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '《项目公司回执（二次转让)》',
            checkerId: 'hasProjectReceipt2',
            memo: '',
            _inSearch: {
                number: 9,
                type: 'select',
                selectOptions: 'accountReceipts',
                base: 'number'
            },
            _inList: false,
            _inNew: false
        },
        {
            title: '《项目公司回执（二次转让)》',
            checkerId: 'projectReceipt2',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '《项目公司回执（一次转让)》',
            checkerId: 'hasProjectReceipt1',
            memo: '',
            _inSearch: {
                number: 8,
                type: 'select',
                selectOptions: 'accountReceipts',
                base: 'number'
            },
            _inList: false,
            _inNew: false
        },
        {
            title: '《项目公司回执(一次转让)》',
            checkerId: 'projectReceipt1',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '《债权转让及账户变更通知的补充说明》',
            checkerId: 'hasChangeNoticeAdd',
            memo: '',
            _inSearch: {
                number: 9,
                type: 'select',
                selectOptions: 'accountReceipts',
                base: 'number'
            },
            _inList: false,
            _inNew: false
        },
        {
            title: '《债权转让及账户变更通知的补充说明》',
            checkerId: 'changeNoticeAdd',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '推送企业次数',
            checkerId: 'pushCount',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
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
            }
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
            }
        ]
    };

    // 只要存在detail配置就允许查看详情
    static readonly detail = {
        onDetail: (base: CommBase, json) => {
            console.log('ondetail: ', json);
            base.onListDetail(json);
        }
    };

    // 如果没有或没权限显示add，那就不用显示新增按钮
    static readonly add = {
        can: (xn: XnService) => {
            return false;
        }

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitAdd();
        // }
    };

    // 如果没有或没权限显示detail和edit，那就不用显示最后的操作列
    static readonly edit = {
        can: (xn: XnService, record: any) => {
            return false;
        }

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitEdit();
        // }
    };
}
