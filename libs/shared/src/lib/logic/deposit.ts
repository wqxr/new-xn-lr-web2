import CommBase from '../public/component/comm-base';
import { XnService } from '../services/xn.service';

export default class Deposit {
    static readonly showName = '保证金比例管理';

    static readonly showPage = true;

    static readonly canSearch = true;

    static readonly canDo = false;

    static readonly apiUrlBase = '/yb/deposit/index/deposit_list';

    // static readonly webUrlBase = '/console/bank-card/';

    // static readonly keys = ['cardCode'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '核心企业', checkerId: 'enterpriseName', memo: '',
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '基础模式-保证金比例（%）', checkerId: 'depositBasic', memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '委托模式-保证金比例（%）', checkerId: 'depositEntrust', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '回购模式-保证金比例（%）', checkerId: 'depositRepurchase', memo: '',
            _inSearch: false,
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
            {
                title: '保证金比例变更申请',
                type: 'a',
                link: true,
                href: '/console/record/new/financing_enterprise_deposit',
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
