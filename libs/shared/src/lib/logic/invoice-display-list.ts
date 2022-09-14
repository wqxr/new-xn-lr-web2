import CommBase from '../public/component/comm-base';
import {XnService} from '../services/xn.service';

export default class InvoiceDisplayList {
    static readonly showName = '发票展示';

    static readonly showPage = true;

    static readonly canSearch = true;

    static readonly canDo = true;

    static readonly apiUrlBase = '/ljx/invoice_verify_log';
    static readonly apiUrlDetail = '/ljx/invoice/invoice_message';

    static readonly webUrlBase = '/console/invoice-display/';

    static readonly keys = ['invoiceNum'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     */
    static readonly fields = [
        {
            title: '主流程ID', checkerId: 'mainFlowId', memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: true
            },
            _inEdit: false
        },
        {
            title: '发票代码', checkerId: 'invoiceCode', memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: true
            },
            _inEdit: false
        },
        {
            title: '发票号码', checkerId: 'invoiceNum', memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: true
            }
        },
        {
            title: '发票日期', checkerId: 'invoiceDate', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '创建时间', checkerId: 'createTime', memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false,
            }
        }, {
            title: '最后时间', checkerId: 'updateTime', memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false,
            }
        },
        {
            title: '发票验证码', checkerId: 'checkCode', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '销方名称', checkerId: 'salerName', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '购方名称', checkerId: 'buyerName', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '税额合计', checkerId: 'taxAmount', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '价税合计(小写)', checkerId: 'totalAmount', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        }, {
            title: '金额合计', checkerId: 'amount', memo: '',
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
            console.log('invoiceList: ', params);
            params.where = {} as any;
            params.where = {
                type: 'jindie'
            };
            base.onDefaultList(params);
        },

        // headButtons: [
        //     {
        //         title: '查询',
        //         type: 'a',
        //         class: 'btn btn-primary',
        //         search: true,
        //         // 如果can未定义，则默认是能显示的
        //         can: (base: CommBase, record) => false,
        //
        //         click: (base: CommBase, record) => {
        //             console.log('test click', record);
        //         }
        //     },
        //     {
        //         title: '重置',
        //         type: 'a',
        //         clearSearch: true,
        //         class: 'btn btn-danger',
        //         // 如果can未定义，则默认是能显示的
        //         can: (base: CommBase, record) => false,
        //
        //         click: (base: CommBase, record) => {
        //             console.log('test click', record);
        //         }
        //     },
        // ],

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
        onDetail: (base: CommBase, json) => {
            base.onListDetailJson(json);
        },
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
            return false;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitEdit();
        // }
    };
}
