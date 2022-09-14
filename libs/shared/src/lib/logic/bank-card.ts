import CommBase from '../public/component/comm-base';
import { XnService } from '../services/xn.service';

export default class BankList {
    static readonly showName = '银行账号';

    static readonly showPage = true;

    static readonly canSearch = true;

    static readonly canDo = true;

    static readonly apiUrlBase = '/bank_card';

    static readonly webUrlBase = '/console/bank-card/';

    static readonly keys = ['cardCode'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '账号备注', checkerId: 'desc', memo: '',
            _inList: {
                sort: false,
                search: false
            },
            _inSearch: false
        },
        {
            title: '账号', checkerId: 'cardCode', memo: '',
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
            title: '开户行名称', checkerId: 'bankName', memo: '',
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '开户行行号', checkerId: 'bankCode', memo: '',
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '户名', checkerId: 'accountName', memo: '',
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '开户人', checkerId: 'accountHolder', memo: '',
            _inList: {
                sort: false,
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
                can: (base: CommBase, record) => true,

                click: (base: CommBase, record) => {
                    console.log('test click', record);
                }
            }
        ],
    };

    // 只要存在detail配置就允许查看详情
    static readonly detail = {
        // onDetail: (base: CommBase, json) => {
        //     base.onDefaultDetail(json);
        // },
    };

    // 如果没有或没权限显示add，那就不用显示新增按钮
    static readonly add = {
        can: (xn: XnService) => {
            return true;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitAdd();
        // }
    };

    // 如果没有或没权限显示detail和edit，那就不用显示最后的操作列
    static readonly edit = {
        can: (xn: XnService, record: any) => {
            return true;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitEdit();
        // }
    };
}
