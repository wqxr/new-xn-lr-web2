import { XnService } from './../services/xn.service';
import CommBase from '../public/component/comm-base';

export default class HonourList {
    static readonly showName = '商票展示';

    static readonly showPage = true;

    static readonly canSearch = true;

    static readonly canDo = true;

    static readonly apiUrlBase = '/tool/money_order_get';

    static readonly apiUrlDetail = '/tool/money_order_detail';

    static readonly webUrlBase = '/console/honour-list/';

    static readonly keys = ['billNumber'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '商票号码', checkerId: 'billNumber', memo: '',
            _inSearch: {
                number: 2,
                type: 'listing'
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
            title: '出票人', checkerId: 'appName', memo: '',
            _inSearch: {
                number: 3,
                type: 'listing'
            },
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '承兑人', checkerId: 'acceptorName', memo: '',
            _inSearch: {
                number: 4,
                type: 'listing'
            },
            _inList: {
                sort: true,
                search: true
            },
            _inNew: false
        },
        {
            title: '商票金额', checkerId: 'billAmount', memo: '', type: 'money',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '是否可融资', checkerId: 'isUseQuota', memo: '',
            _inSearch: false,
            _inList: false,
            _inNew: false
        },
        {
            title: '商票出票日期', checkerId: 'issueDate', memo: '', type: 'date',
            _inSearch: false,
            _inList: false,
            _inNew: false
        },
        {
            title: '保理日期', checkerId: 'payTime', memo: '', type: 'date',
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
            title: '商票到期日', checkerId: 'dueDate', memo: '', type: 'stringToDate',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '交易状态', checkerId: 'mainFlowsStatus', memo: '', type: 'xnMainFlowStatus',
            _inSearch: {
                number: 6,
                type: 'select',
                selectOptions: 'isInit',
                base: 'number'
            },
            _inList: {
                sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '承兑人全称', checkerId: 'acceptorName', memo: '',
            _inSearch: false,
            _inList: false,
            _inNew: false
        },
        {
            title: '承兑人开户行行号', checkerId: 'acceptorBankNumber', memo: '',
            _inSearch: false,
            _inList: false,
            _inNew: false
        },
        {
            title: '主流程ID', checkerId: 'mainFlowId', memo: '',
            _inSearch: false,
            _inList: false,
            _inNew: false
        },
        {
            title: '质押状态', checkerId: 'status', memo: '', type: 'xnZhiya',
            _inSearch: {
                number: 5,
                type: 'select',
                selectOptions: 'pledge',
                base: 'number'
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
            {
                title: '质押',
                type: 'checkbox',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => true,

                click: (base: CommBase, record, event, xn: XnService) => {
                    const checkbox = event.target;
                    const checked = checkbox.checked;
                    const checkedNumber = checked ? 1 : 0;

                    xn.api.post('/tool/money_order_status', {
                        billNumber: record.billNumber,
                        status: checkedNumber
                    }).subscribe(json => {
                        record.status = checkedNumber;
                    });
                }
            }
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

    // 如果没有或没权限显示detail和edit，那就不用显示最后的操作列
    static readonly search = {
        can: (xn: XnService, record: any) => {
            return false;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitEdit();
        // }
    };

}
