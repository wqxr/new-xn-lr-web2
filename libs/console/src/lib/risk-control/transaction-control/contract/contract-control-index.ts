// 交易控制 合同控制
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

export default class ContractControlIndex {
    static readonly showName = '企业列表';

    static readonly showPage = true;
    static readonly canDo = true;
    static readonly apiUrlBase = '/yb/risk1/related_transaction/add_data';

    static readonly apiUrlDetail = '';

    static readonly webUrlBase = '';

    static readonly keys = ['orgName'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '企业名称', checkerId: 'orgName', memo: '',
            _inSearch: {
                number: 1
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '企业类型', checkerId: 'orgType', memo: '',
            _inSearch: {
                number: 2,
                type: 'select',
                selectOptions: 'orgNameType',
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '合同签署数量', checkerId: 'contractNumber', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
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
                type: 'a',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (base: CommBase, record) => {
                    console.log('test click', record);
                }
            }, {
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
