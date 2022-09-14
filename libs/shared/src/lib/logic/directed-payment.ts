import CommBase from '../public/component/comm-base';
import { XnService } from '../services/xn.service';

export default class DirectedPayment {
    static readonly showName = '定向收款保理';

    static readonly showPage = true;

    static readonly canSearch = false;

    static readonly canDo = true;

    static readonly apiUrlBase = '/record/record';

    static readonly webUrlBase = '/console/record/record-directed/financing_pre13';
    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '标题', checkerId: 'title', memo: '', type: 'list-title',
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
            title: '流程名', checkerId: 'flowName', memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '当前步骤', checkerId: 'nowProcedureName', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '状态', checkerId: 'status', memo: '', type: 'xnRecordStatus',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '登记编码', checkerId: 'registerMa', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '修改码', checkerId: 'editMa', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '完成度', checkerId: 'wcd', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '创建时间', checkerId: 'createTime', memo: '', type: 'date',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '最后更新时间', checkerId: 'updateTime', memo: '', type: 'date',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        }
    ];

    static readonly list = {
        pageSize: 10,

        onList: (base: CommBase, params) => {
            params.where = {
                flowId: 'financing_pre13'
            };
            base.onDefaultList(params);
            // }
        },

        headButtons: [
            {
                title: '发起交易申请',
                type: 'a',
                customClick: true,
                class: 'btn btn-danger',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (xn: XnService, base: CommBase) => {
                    xn.router.navigate([`/console/record/new/financing_pre13`]);
                }
            }
        ],

        // 允许在行内根据不同条件增加行按钮
        rowButtons: [
            {
                title: '查看处理',
                type: 'a',
                // edit: 'true',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => true,

                click: (base: CommBase, record, xn, vcr) => {
                    if ((record.status !== 1 && record.status !== 0) || xn.user.roles.indexOf(record.nowRoleId) < 0) {
                        xn.router.navigate([`//console/record/financing_pre13/view/${record.recordId}`]);
                    } else {
                        xn.router.navigate([`/console/record/financing_pre13/edit/${record.recordId}`]);
                    }
                }
            },
            {
                title: '出让人信息表',
                type: 'edit',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => true,

                edit: (record, xn) => {
                    return (record.status === 2) && xn.user.roles.indexOf(record.nowRoleId) > -1;
                },

                click: (base: CommBase, record, xn, vcr) => {
                    xn.router.navigate(['console/record/new'],
                        {
                            queryParams: {
                                id: 'assignor_information_registration13',
                                relate: 'relatedRecordId', relateValue: record.recordId
                            }
                        });
                }
            },
            {
                title: '应收账款转让信息',
                type: 'edit',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => true,

                edit: (record, xn) => {
                    return (record.status === 2) && xn.user.roles.indexOf(record.nowRoleId) > -1;
                },

                click: (base: CommBase, record, xn, vcr) => {
                    xn.router.navigate(['console/record/new'],
                        { queryParams: { id: 'entry_registration_code13', relate: 'relatedRecordId', relateValue: record.recordId } });
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
