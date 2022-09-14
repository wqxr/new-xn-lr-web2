import CommBase from '../public/component/comm-base';
import {XnService} from '../services/xn.service';

export default class SupplierUnsignedContract {

    static readonly showPage = true;
    static readonly keys = ['mainFlowId']; // 根据这个数组来匹配

    static readonly fields = [
        {
            title: '交易ID',
            checkerId: 'mainFlowId',
            memo: '',
            _inList: {
                sort: false,
                search: true
            },
            _inSearch: {
                number: 1,
                type: 'text'
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
                search: true
            }
        },
        {
            title: '申请付款单位',
            checkerId: 'projectCompany',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '基础合同名称',
            checkerId: 'contractName',
            memo: '',
            _inSearch: {
                number: 3,
                type: 'text'
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '基础合同编号',
            checkerId: 'contractId',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '发票号码',
            checkerId: 'realInvoiceNum',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '发票金额',
            checkerId: 'realInvoiceAmount',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '应收账款金额',
            checkerId: 'receivable',
            memo: '',
            type: 'money',
            _inSearch: {
                number: 2,
                type: 'text'
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '交易状态',
            checkerId: 'status',
            memo: '',
            type: 'additionalMaterials',
            _inSearch: {
                number: 4,
                type: 'select',
                selectOptions: 'additionalMaterials',
                base: 'number'
            },
            _inList: {
                sort: false,
                search: true
            },
            _inNew: false
        },
        {
            title: '创建时间',
            checkerId: 'createTime',
            memo: '',
            type: 'date',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false
            },
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
