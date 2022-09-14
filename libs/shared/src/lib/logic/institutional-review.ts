import CommBase from '../public/component/comm-base';
import {XnService} from '../services/xn.service';

export default class InstitutionalReview {
    static readonly showName = '审核机构创建';

    static readonly showPage = true;

    static readonly apiUrlBase = '/record/record';

    static readonly apiUrlDetail = '/flow/main/detail';

    static readonly webUrlBase = '/console/manage/institutional-review/';

    static readonly keys = ['mainFlowId'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '标题', checkerId: 'title', memo: '',
            _inSearch: {
                number: 1
            },
            _inList: {
                sort: false,
                search: true
            },
            _inEdit: false
        },
        {
            title: '流程名', checkerId: 'create_auth', memo: '',
            _inList: false,
            _inSearch: false,
            _inNew: false
        },
        {
            title: '当前步骤', checkerId: 'recordSeq', memo: '',
            _inSearch: false,
            _inList: false,
            _inNew: false
        },
        {
            title: '状态', checkerId: 'status', memo: '', type: 'br',
            _inSearch: {
                number: 2,
                type: 'select'
            },
            _inList: {
                sort: true,
                search: true
            },
            _inNew: false
        },
        {
            title: '创建时间', checkerId: 'createTime', memo: '', type: 'date',
            _inSearch: {
                number: 3,
                type: 'quantum'
            },
            _inList: {
                sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '最后更新时间', checkerId: 'updateTime', memo: '', type: 'date',
            _inSearch: {
                number: 4,
                type: 'quantum1'
            },
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
