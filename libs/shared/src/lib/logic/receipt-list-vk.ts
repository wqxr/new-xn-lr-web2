import CommBase from '../public/component/comm-base';
import {XnService} from '../services/xn.service';

export default class ReceiptListVK {

    static readonly showPage = true;

    static readonly keys = ['mainFlowId']; // 根据这个数组来匹配

    static readonly webUrlBase = '/console/main-list/';

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '交易ID',
            checkerId: 'mainFlowId',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
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
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '申请付款单位',
            checkerId: 'projectCompany',
            memo: '',
            type: 'br',
            _inSearch: false,
            _inList: {
                sort: true,
                search: true
            },
            _inNew: false
        },
        {
            title: '总部公司', checkerId: 'headquarters', memo: '', type: 'headquarters',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '付款确认书编号',
            checkerId: 'payConfirmId',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false
            }
        },
        {
            title: '交易金额',
            checkerId: 'contractAmount',
            memo: '',
            type: 'money',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false
            }
        },
        {
            title: '利率',
            checkerId: 'price',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '交易状态',
            checkerId: 'status',
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
            title: '资产池名称',
            checkerId: 'capitalPoolName',
            memo: '',
            _inSearch: {
                number: 1,
                type: 'text'
            },
            _inList: {
                sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《致项目公司通知书（二次转让）》',
            checkerId: 'capitalPoolContract02',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '《项目公司回执（二次转让）》',
            checkerId: 'capitalPoolContract04',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '《项目公司回执（一次转让）》',
            checkerId: 'projectReceipt',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '《付款确认书（项目公司致供应商）》', checkerId: 'projectQrs', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
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
