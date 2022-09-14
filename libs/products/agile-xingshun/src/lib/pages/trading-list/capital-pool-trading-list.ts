
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class CapitalPoolTradingList {
    static readonly showName = '$资产池 - 交易';

    static readonly showPage = true;

    static readonly apiUrlBase = '/mdz/main/all';

    static readonly apiUrlDetail = '/flow/main/detail';

    static readonly webUrlBase = '/console/main-list/';

    static readonly keys = ['mainFlowId'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '交易ID', checkerId: 'mainFlowId', memo: '',
            _inSearch: {
                number: 1
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
            title: '收款单位', checkerId: 'supplierOrgName', memo: '',
            _inSearch: {
                number: 5,
                type: 'listing'
            },
            _inList: {
                // sort: true,
                search: true
            }
        },
        {
            title: '保理商', checkerId: 'factoringOrgName', memo: '',
            _inSearch: false,
            _inList: false,
            _inNew: false
        },
        {
            title: '申请付款单位', checkerId: 'enterpriseOrgName', memo: '', type: 'br',
            _inSearch: {
                number: 3,
                type: 'listing'
            },
            _inList: {
                // sort: true,
                search: true
            },
            _inNew: false
        },
        // {
        //     title: '总部公司', checkerId: 'headquarters', memo: '', type: 'headquarters',
        //     _inSearch: {
        //         number: 7,
        //         type: 'headquarters-select',
        //         // selectOptions: 'enterprise_dc',
        //     },
        //     _inList: {
        //         // sort: true,
        //         search: false,
        //     }
        // },
        {
            title: '付款确认书编号', checkerId: 'payConfirmId', memo: '',
            _inSearch: {
                number: 11,
                type: 'listing'
            },
            _inList: {
                // sort: true,
                search: false,
            }
        },
        {
            title: '交易金额', checkerId: 'contractAmount', memo: '', type: 'money',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false,
            }
        },
        {
            title: '利率', checkerId: 'price', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: true
            }
        },
        // {
        //     title: '交易模式', checkerId: 'isProxy', memo: '', type: 'xnProxyStatus',
        //     _inSearch: false,
        //     // _inSearch: {
        //     //     number: 5,
        //     //     type: 'select',
        //     //     selectOptions: 'proxyStatus',
        //     //     base: 'number'
        //     // },
        //     _inList: {
        //         // sort: false,
        //         search: false
        //     },
        //     _inNew: false
        // },
        {
            title: '合同签署时间', checkerId: 'signContractTime', memo: '', type: 'date',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '创建时间', checkerId: 'createTime', memo: '', type: 'date',
            _inSearch: {
                number: 2,
                type: 'quantum'
            },
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '放款时间', checkerId: 'payTime', memo: '', type: 'date',
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
            title: '交易状态', checkerId: 'status', memo: '', type: 'xnFlowStatus',
            _inSearch: {
                number: 9,
                type: 'select',
                selectOptions: 'additionalMaterialsNewAgile',
                base: 'number'
            },
            _inList: {
                // sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '《应收账款转让通知书（适用于保理商向雅居乐控股出具）》', checkerId: 'capitalPoolContract01', memo: '',
            _inSearch: {
                number: 6,
                type: 'select',
                selectOptions: 'accountReceipts',
                base: 'number'
            },
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《应收账款转让通知书（适用于保理商向雅居乐下属公司出具）》', checkerId: 'capitalPoolContract02', memo: '',
            _inSearch: {
                number: 8,
                type: 'select',
                selectOptions: 'accountReceipts',
                base: 'number'
            },
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《应收账款转让通知书回执（适用于雅居乐控股向保理商出具）》', checkerId: 'capitalPoolContract03', memo: '',
            _inSearch: {
                number: 10,
                type: 'select',
                selectOptions: 'accountReceipts',
                base: 'number'
            },
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《应收账款转让通知书回执（适用于雅居乐下属公司向保理商出具）》', checkerId: 'capitalPoolContract04', memo: '',
            _inSearch: {
                number: 12,
                type: 'select',
                selectOptions: 'accountReceipts',
                base: 'number'
            },
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《应收账款转让通知书回执（适用于雅居乐控股向供应商出具）》', checkerId: 'headquartersReceipt', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《应收账款转让通知书回执（适用于雅居乐下属公司向供应商出具）》', checkerId: 'projectReceipt', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },

        {
            title: '《付款确认书（总部致保理商）》', checkerId: 'pdfProjectFiles', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《付款确认书（适用于雅居乐下属公司向供应商出具）》', checkerId: 'projectQrs', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《付款确认书（雅居乐控股致券商）》', checkerId: 'tradersQrs', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '《确认函》', checkerId: 'confirmFile', memo: '',
            _inSearch: false,
            _inList: {
                // sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '是否已推送企业', checkerId: 'isSignContract', memo: '',
            type: 'isSignContract',
            _inSearch: {
                number: 13,
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
            title: '项目公司是否已回传全部文件', checkerId: 'isFileBack', memo: '',
            _inSearch: {
                number: 14,
                type: 'select',
                selectOptions: 'isExist',
            },
            _inList: false,
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
