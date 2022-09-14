import CommBase from '../public/component/comm-base';
import { XnService } from '../services/xn.service';

export default class PayPlan {
    static readonly showName = '付款计划';

    static readonly showPage = true;

    static readonly canSearch = true;

    static readonly canDo = false;

    static readonly apiUrlBase = '/jd_pre';

    static readonly webUrlBase = '/console/jd-pre/';

    // static readonly keys = ['contractId', 'invoiceNum'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '基础交易合同编号', checkerId: 'contractId', memo: '',
            _inList: {
                sort: true,
                search: true
            },
            _inEdit: false
        },
        {
            title: '发票号码', checkerId: 'invoiceNum', memo: '',
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '发票总金额', checkerId: 'invoiceAmount', memo: '',
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '应付账款金额', checkerId: 'receivable', memo: '',
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '应收账款到期日', checkerId: 'expiryTime', memo: '', type: 'date',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '债权单位名称', checkerId: 'debtUnit', memo: '',
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '债权单位联系人', checkerId: 'debtUser', memo: '',
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '债权单位银行账户', checkerId: 'debtAccount', memo: '',
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '债权单位银行开户行', checkerId: 'debtBank', memo: '',
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '债务单位名称', checkerId: 'projectCompany', memo: '',
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '是否注册', checkerId: 'isInit', memo: '', type: 'isInit',
            _inSearch: {
                type: 'select',
                selectOptions: 'isInit',
                base: 'number'
            },
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '创建时间', checkerId: 'createTime', memo: '', type: 'date',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false,
            }
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

                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) =>  true,

                click: (base: CommBase, record) => {
                    console.log('test click', record);
                }
            }
        ],
    };

    // 只要存在detail配置就允许查看详情
    static readonly detail = false;

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
