import CommBase from '../public/component/comm-base';
import { XnService } from '../services/xn.service';

export default class LimitList {
    static readonly showName = '额度管理';

    static readonly showPage = true;

    static readonly canSearch = true;

    static readonly canDo = true;

    static readonly apiUrlBase = '/quota/quotalist';

    static readonly webUrlBase = '/console/limit-list/';

    // static readonly keys = ['cardCode'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '核心企业', checkerId: 'enterpriseName', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            },
        },
        {
            title: '总额度', checkerId: 'amount', memo: '', type: 'money',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '放款额度', checkerId: 'loanAmount', memo: '', type: 'money',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '回款额度', checkerId: 'repaymentAmount', memo: '', type: 'money',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '预扣额度', checkerId: 'preAmount', memo: '', type: 'money',
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
                title: '额度变更申请',
                type: 'a',
                class: 'btn btn-danger',
                href: '/console/record/new/financing_enterprise_amount',
                link: true,
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
