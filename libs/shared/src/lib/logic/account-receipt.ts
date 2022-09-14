import {XnModalUtils} from './../common/xn-modal-utils';
import CommBase from '../public/component/comm-base';
import {XnService} from '../services/xn.service';
import {LoadwordEditModalComponent} from '../public/modal/loadword-edit-modal.component';

export default class AccountReceipt {
    static readonly showName = '生成应收账款回执';

    static readonly showPage = true;

    static readonly canDo = true;

    static readonly apiUrlBase = '/flow/main/all';

    static readonly webUrlBase = '/console/main-list/';

    static readonly apiUrlDetail = '/flow/main/detail';
    static readonly keys = ['mainFlowId'];
    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '交易ID', checkerId: 'mainFlowId', memo: '',
            _inSearch: {
                number: 2
            },
            _inList: {
                sort: true,
                search: true
            },
            _inEdit: {
                options: {
                    readonly: true
                }
            }
        },
        {
            title: '供应商', checkerId: 'supplierOrgName', memo: '',
            _inSearch: {
                number: 4,
                type: 'listing'
            },
            _inList: {
                sort: true,
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
            title: '核心企业', checkerId: 'enterpriseOrgName', memo: '', type: 'br',
            _inSearch: {
                number: 2,
                type: 'listing'
            },
            _inList: {
                sort: true,
                search: true
            },
            _inNew: false
        },
        {
            title: '交易金额', checkerId: 'contractAmount', memo: '', type: 'money',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '利率', checkerId: 'price', memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '交易状态', checkerId: 'status', memo: '', type: 'xnMainFlowStatus',
            _inSearch: {
                number: 3,
                type: 'select',
                selectOptions: 'mainFlowStatus',
                base: 'number'
            },
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '合同签署时间', checkerId: 'signContractTime', memo: '', type: 'date',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false
            },
            _inNew: false
        }, {
            title: '交易模式', checkerId: 'isProxy', memo: '', type: 'xnProxyStatus',
            _inSearch: false,
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '创建时间', checkerId: 'createTime', memo: '', type: 'date',
            _inSearch: {
                number: 1,
                type: 'quantum'
            },
            _inList: {
                sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '放款时间', checkerId: 'payTime', memo: '', type: 'date',
            _inSearch: {
                number: 6,
                type: 'quantum1'
            },
            _inList: {
                sort: true,
                search: false
            },
            _inNew: false
        }, {
            title: '应收账款回执', checkerId: 'isReceivable', memo: '',
            _inSearch: {
                number: 7,
                type: 'select',
                selectOptions: 'accountReceipts',
                base: 'number'
            },
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        }, {
            title: '应收账款回执', checkerId: 'receivableFile', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        }
    ];

    static readonly list = {
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
            //
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
