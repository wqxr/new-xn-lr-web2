import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';


/**
 *  保理商补充合同
 */
export default class DragonFactorSign {

    static readonly showPage = true;
    static readonly keys = ['mainFlowId']; // 根据这个数组来匹配

    static readonly fields = [
        {
            title: '交易ID',
            checkerId: 'mainFlowId',
            memo: '',
            type: 'text',
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
            title: '流程ID',
            checkerId: 'recordId',
            type: 'text',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '收款单位',
            checkerId: 'debtUnit',
            memo: '',
            type: 'text',
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
            title: '申请付款单位',
            checkerId: 'projectCompany',
            memo: '',
            type: 'text',
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
            title: '项目名称',
            checkerId: 'projectName',
            memo: '',
            type: 'text',
            _inSearch: {
                number: 6,
                type: 'text'
            },
            _inList: {
                sort: false,
                search: true
            }
        },

        {
            title: '应收账款金额',
            checkerId: 'receive',
            memo: '',
            type: 'money',
            _inSearch: {
                number: 4,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: true
            },
            _inNew: false
        },
        {
            title: '交易状态',
            checkerId: 'tradeStatus',
            memo: '',
            type: 'text',
            _inSearch: {
                number: 5,
                type: 'select',
                selectOptions: 'tradeStatus',
                base: 'number'
            },
            _inList: {
                sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '资产池',
            checkerId: 'capitalPoolName',
            memo: '',
            type: 'text',
            _inSearch: {
                number: 7,
                type: 'text'
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '保理商是否已签署原合同',
            checkerId: 'isFactoringSign',
            memo: '',
            type: 'text',
            _inSearch: {
                number: 8,
                type: 'select',
                selectOptions: 'IsbackMoney',
                base: 'number'
            },
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '应收账款转让通知之补充协议',
            checkerId: 'receiveNoticeAdd',
            type: 'contract',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '应收账款转让协议之补充协议',
            checkerId: 'receiveAgreeAdd',
            type: 'contract',
            memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
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
    };
}
