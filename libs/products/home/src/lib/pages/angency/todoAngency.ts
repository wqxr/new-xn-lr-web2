
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import DragonCommBase from 'libs/shared/src/lib/public/component/comm-dragon-base';

/**
 *  首页代办
 */
export default class TodoAngency {
    static readonly flowId = '';
    static readonly showName = '地产业务';
    static readonly showPage = true;
    static readonly apiUrlBase = '/list/todo_record/list';
    static readonly webUrlBase = ``;
    static readonly canDo = true;
    static readonly tableText = 'text-left';
    static headquarters = '';
    // static readonly keys = ['originalSingleEencoding'];  // 根据这个数组来匹配
    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '记录ID', checkerId: 'flowName', memo: '', type: 'list-title',
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
            title: '标题', checkerId: 'title', memo: '', type: 'long-title',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '项目名称', checkerId: 'projectName', memo: '',
            _inSearch: {
                number: 8,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '履约证明', checkerId: 'isPerformance', memo: '', type: 'accountReceipts',
            _inSearch: {
                number: 3,
                type: 'select',
                selectOptions: 'accountReceipts',
                base: 'number', // 值为数
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '核心企业', checkerId: 'enterpriseOrgName', memo: '',
            _inSearch: {
                number: 4,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '交易金额', checkerId: 'receive', memo: '', type: 'money',
            // _inSearch: false,
            _inSearch: {
                number: 9,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '当前步骤', checkerId: 'nowProcedureId', memo: '',
            _inSearch: {
                number: 2,
                type: 'select',
                selectOptions: 'todoCurrentSteps',
            },
            _inList: {
                sort: false,
                search: false,
            },
            type: 'select',
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
            title: '创建时间', checkerId: 'createTime', memo: '', type: 'dateTime',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '最后更新时间', checkerId: 'updateTime', memo: '', type: 'dateTime',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '暂存人', checkerId: 'temporaryPerson', memo: '', type: 'people',
            _inSearch: {
                number: 6,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '收款单位', checkerId: 'debtUnit', memo: '', type: 'people',
            _inSearch: {
                number: 7,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '转让价款', checkerId: 'changePrice', memo: '', type: 'money',
            _inSearch: {
                number: 8,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
    ];

    static readonly list = {
        onList: (base: DragonCommBase, params) => {
            // params['where'] = {
            //     flowId: Vanke.flowId
            // };
            base.onDefaultList(params);
        },
        // 分页设置
        TodoAngency: {
            paging: 0,
            pageSize: 10,
            first: 0,
            arrObjs: {},

        },
        headButtons: [
            {
                title: '查询',
                type: 'a',
                class: 'btn btn-primary',
                search: true,
                // 如果can未定义，则默认是能显示的
                can: (base: DragonCommBase, record) => false,

                click: (base: DragonCommBase, record) => {
                    console.log('test click', record);
                }
            },
            {
                title: '重置',
                type: 'a',
                clearSearch: true,
                class: 'btn btn-danger',
                // 如果can未定义，则默认是能显示的
                can: (base: DragonCommBase, record) => false,

                click: (base: DragonCommBase, record) => {
                    console.log('test click', record);
                }
            },
        ],

        // 允许在行内根据不同条件增加行按钮
        rowButtons: [
            {
                title: '查看处理',
                type: 'a',
                // edit: 'true',
                // 如果can未定义，则默认是能显示的
                can: (base: DragonCommBase, record) => true,

                click: (base: DragonCommBase, record, xn, vcr) => {
                    console.log(base, record, xn, vcr);

                    XnUtils.doProcess(record, xn);
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
    };

    // 如果没有或没权限显示detail和edit，那就不用显示最后的操作列
    static readonly edit = {
        can: (xn: XnService, record: any) => {
            return false;
        }
    };

}
