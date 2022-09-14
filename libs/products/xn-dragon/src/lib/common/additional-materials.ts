import { XnService } from 'libs/shared/src/lib/services/xn.service';
import CommBase from '../pages/comm-base';

/**
 *  龙光项目公司补充业务资料
 */
export default class DragonAdditionalMaterials {

    static readonly showPage = true;
    static readonly keys = ['mainFlowId']; // 根据这个数组来匹配

    static readonly fields = [
        {
            title: '交易ID',
            checkerId: 'mainFlowId',
            memo: '',
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
            title: '收款单位',
            checkerId: 'debtUnit',
            memo: '',
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
            title: '基础合同名称',
            checkerId: 'contractName',
            memo: '',
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
            title: '项目名称',
            checkerId: 'projectName',
            memo: '',
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
            title: '应收账款金额',
            checkerId: 'receive',
            memo: '',
            type: 'money',
            _inSearch: {
                number: 4,
                type: 'text'
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '转让价款',
            checkerId: 'changePrice',
            memo: '',
            type: 'money',
            _inSearch: {
                number: 5,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '交易状态',
            checkerId: 'tradeStatus',
            memo: '',
            type: 'tradeStatus',
            _inSearch: {
                number: 6,
                type: 'select',
                selectOptions: 'tradeStatus',
                base: 'number'
            },
            _inList: {
                sort: false,
                search: true
            },
            _inNew: false
        },
        {
            title: '创建时间',
            checkerId: 'createTime',
            memo: '',
            type: 'date',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false
            },
            _inNew: false
        },
        {
            title: '补充资料经办人',
            checkerId: 'performanceMan',
            memo: '',
            _inSearch: {
                number: 8,
                type: 'text'
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '项目公司补充文件',
            checkerId: 'performanceFile',
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
